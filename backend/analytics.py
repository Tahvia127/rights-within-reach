# analytics.py
# Privacy-first request logging middleware. Writes one JSONL line per request
# with timing, status, and route fields (topic, language, refused, cached).
#
# Raw question text is never logged unless ANALYTICS_LOG_QUESTIONS=1.
# Client IP is never logged; an opt-in salted hash is available instead.
#
# Config (all optional):
#   ANALYTICS_ENABLED        "0" to disable (default: on)
#   ANALYTICS_LOG_PATH       JSONL output path (default: data/analytics/requests.jsonl)
#   ANALYTICS_LOG_QUESTIONS  "1" to log raw question text (default: off)
#   ANALYTICS_MAX_BYTES      rotate at this size in bytes (default: 10 MB; 0 = never)
#   ANALYTICS_BACKUPS        rotated files to keep (default: 5)
#   ANALYTICS_HASH_IP        "1" to log a salted client hash (default: off)
#   ANALYTICS_SALT           secret salt required for ANALYTICS_HASH_IP
#   QUESTION_GAP_LOG         "1" to log PII-scrubbed unanswered questions (default: off)
#   QUESTION_GAP_PATH        gap-log path (default: data/analytics/question_gaps.jsonl)

import hashlib
import json
import logging
import os
import re
import threading
import time
from datetime import datetime, timezone
from logging.handlers import RotatingFileHandler

from starlette.middleware.base import BaseHTTPMiddleware

_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DEFAULT_PATH = os.path.join(_REPO_ROOT, "data", "analytics", "requests.jsonl")
_DEFAULT_GAP_PATH = os.path.join(_REPO_ROOT, "data", "analytics", "question_gaps.jsonl")
_DEFAULT_MAX_BYTES = 10 * 1024 * 1024  # 10 MB
_DEFAULT_BACKUPS = 5
_CLIENT_HASH_LEN = 12  # 48 bits -- enough to distinguish visitors, not reverse

# Question-gap log (opt-in). Captures the questions the corpus could NOT answer
# well, so we can see what people actually ask and fill the gaps. PII-scrubbed,
# date-only (no session linkage), and out-of-scope categories — including the DV
# and immigration ones the roadmap says to exclude — are never written.
_EMAIL_RE = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b")
_SSN_RE = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")
_PHONE_RE = re.compile(r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
_LONGNUM_RE = re.compile(r"\b\d{7,}\b")  # account/card/case numbers; 5-digit ZIPs survive
_GAP_EXCLUDE_REASONS = {"danger", "immigration", "criminal", "family", "empty", "error"}

# Cache one RotatingFileHandler per (path, size, backups) config.
_loggers: dict[tuple, logging.Logger] = {}
_loggers_lock = threading.Lock()


def _truthy(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() not in ("0", "false", "no", "off", "")


def _int_env(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, ""))
    except (TypeError, ValueError):
        return default


def is_enabled() -> bool:
    return _truthy(os.getenv("ANALYTICS_ENABLED"), default=True)


def log_questions() -> bool:
    return _truthy(os.getenv("ANALYTICS_LOG_QUESTIONS"), default=False)


def hash_ip_enabled() -> bool:
    return _truthy(os.getenv("ANALYTICS_HASH_IP"), default=False)


def gap_log_enabled() -> bool:
    """Off by default, matching the product's 'no raw questions logged' promise."""
    return _truthy(os.getenv("QUESTION_GAP_LOG"), default=False)


def _log_path() -> str:
    return os.getenv("ANALYTICS_LOG_PATH", _DEFAULT_PATH)


def _gap_path() -> str:
    return os.getenv("QUESTION_GAP_PATH", _DEFAULT_GAP_PATH)


def scrub_pii(text: str) -> str:
    """Redact the obvious PII from a free-text question. Emails, SSNs, phone and
    long account/card numbers go; 5-digit ZIPs survive (useful, not identifying).
    Free-text names cannot be reliably removed, so treat the gap log as internal."""
    t = _EMAIL_RE.sub("[email]", text or "")
    t = _SSN_RE.sub("[ssn]", t)
    t = _PHONE_RE.sub("[phone]", t)
    t = _LONGNUM_RE.sub("[number]", t)
    return t


def _get_logger(path: str) -> logging.Logger:
    """Return a cached logger with a rotating file handler for the given path."""
    max_bytes = _int_env("ANALYTICS_MAX_BYTES", _DEFAULT_MAX_BYTES)
    backups = _int_env("ANALYTICS_BACKUPS", _DEFAULT_BACKUPS)
    key = (path, max_bytes, backups)
    logger = _loggers.get(key)
    if logger is not None:
        return logger
    with _loggers_lock:
        logger = _loggers.get(key)
        if logger is None:
            os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
            logger = logging.getLogger(f"rwr.analytics:{path}:{max_bytes}:{backups}")
            logger.setLevel(logging.INFO)
            logger.propagate = False
            handler = RotatingFileHandler(
                path, maxBytes=max_bytes, backupCount=backups, encoding="utf-8"
            )
            handler.setFormatter(logging.Formatter("%(message)s"))
            logger.handlers = [handler]
            _loggers[key] = logger
    return logger


def log_event(record: dict) -> None:
    """Append one record to the JSONL log. Never raises."""
    if not is_enabled():
        return
    try:
        _get_logger(_log_path()).info(
            json.dumps(record, ensure_ascii=False, separators=(",", ":"))
        )
    except Exception:
        pass  # analytics must never break a request


def log_question_gap(question: str, *, reason: str | None = None,
                     confidence: str | None = None, topic: str | None = None,
                     state: str | None = None, language: str | None = None) -> None:
    """Record a question the corpus could not answer well, for gap analysis.

    A "gap" is retrieval finding nothing (`reason == "no_results"`) or a
    low-confidence answer. Intentional out-of-scope refusals — DV/danger,
    immigration, criminal, family — are never logged (per the roadmap). The
    stored line is PII-scrubbed, date-only, and carries no IP/session, so it
    cannot be tied back to a person. No-ops unless QUESTION_GAP_LOG is set.
    """
    if not (gap_log_enabled() and is_enabled()):
        return
    reason = (reason or "").strip() or None
    conf = (confidence or "").strip().lower()
    is_gap = reason == "no_results" or (reason is None and conf == "low")
    if not is_gap or reason in _GAP_EXCLUDE_REASONS:
        return
    scrubbed = scrub_pii((question or "").strip())[:300]
    if not scrubbed:
        return
    try:
        _get_logger(_gap_path()).info(json.dumps({
            "date": datetime.now(timezone.utc).date().isoformat(),  # date only: no session linkage
            "gap": reason or "low_confidence",
            "topic": topic or None,
            "state": state or None,
            "language": language or None,
            "chars": len(question or ""),
            "question": scrubbed,
        }, ensure_ascii=False, separators=(",", ":")))
    except Exception:
        pass  # analytics must never break a request


def record(request, **fields) -> None:
    """Stash analytics fields from inside a route handler.

    The middleware seeds request.state.analytics before the route runs and
    flushes it after. No-ops if the middleware is not active.
    """
    bucket = getattr(request.state, "analytics", None)
    if bucket is not None:
        bucket.update(fields)


def _client_ip(request) -> str:
    # Prefer the left-most X-Forwarded-For hop (real IP behind a proxy).
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    client = request.client
    return client.host if client else ""


def client_id(request) -> str | None:
    """Return a short salted hash of the client IP, or None.

    Never emits a hash without a salt (would be re-identifiable).
    """
    if not hash_ip_enabled():
        return None
    salt = os.getenv("ANALYTICS_SALT", "")
    ip = _client_ip(request)
    if not salt or not ip:
        return None
    digest = hashlib.sha256(f"{salt}:{ip}".encode("utf-8")).hexdigest()
    return digest[:_CLIENT_HASH_LEN]


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Times every request and emits one JSONL record merged with route fields."""

    async def dispatch(self, request, call_next):
        if not is_enabled():
            return await call_next(request)

        request.state.analytics = {}
        start = time.perf_counter()
        status = 500
        try:
            response = await call_next(request)
            status = response.status_code
            return response
        finally:
            event = {
                "ts": datetime.now(timezone.utc).isoformat(timespec="milliseconds"),
                "method": request.method,
                "path": request.url.path,
                "status": status,
                "ms": round((time.perf_counter() - start) * 1000, 1),
            }
            cid = client_id(request)
            if cid:
                event["client"] = cid
            extra = dict(request.state.analytics)
            if not log_questions():
                extra.pop("question", None)  # never let opted-out question text through
            event.update(extra)
            log_event(event)