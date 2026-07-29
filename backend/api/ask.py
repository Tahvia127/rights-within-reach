"""
ask.py
POST /ask — answers Illinois legal questions from our own sources, with guardrails.

Pipeline: translate to English -> block out-of-scope and dangerous questions ->
retrieve chunks from Chroma -> refuse politely if nothing relevant -> ask Claude
for a structured answer grounded only in what we retrieved.

Every answer is source-grounded, avoids individualized advice, and ships with the
disclaimer. All fixed text (prompts, translations, org cards) lives in content.py.
"""

import os
import re
import time
from collections import Counter

import anthropic
from dotenv import load_dotenv
from fastapi import APIRouter, Request

from backend.analytics import record
from backend.api.content import (
    ALLOWED_DOMAINS, ANSWER_PROMPT, ANSWER_TOOL, LANGUAGE_RULE, LANGUAGES,
    REFERRAL_ORGS, RESEARCH_PROMPT, text, title,
)
from backend.api.schemas import AskRequest, AskResponse, FeedbackRequest
from backend.limiter import limiter
from backend.services.retriever import search as retrieve
from backend.services.routing import SUBJECT_TO_TOPIC, contact_for, resolve_region

# Load backend/.env so ANTHROPIC_API_KEY is available when run via uvicorn.
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

router = APIRouter()

MODEL = "claude-sonnet-4-6"           # switch to "claude-opus-4-8" for max accuracy
TRANSLATE_MODEL = "claude-haiku-4-5"  # fast and cheap, only used for translation
TOP_K = 5
MIN_SCORE = 0.20                      # below this, retrieval is too weak to answer from

# Live web check. We only pay the extra latency when our corpus looks thin, so a
# strong top match with enough chunks answers from the corpus alone. Set
# WEB_STRONG_SCORE=0 to web-check every answer. 0.60 fits all-MiniLM's score
# spread: ~0.6+ answers fast, ~0.45-0.60 gets a web check.
WEB_SEARCH_ENABLED = os.getenv("WEB_SEARCH_ENABLED", "1").lower() not in ("0", "false", "no", "off", "")
WEB_STRONG_SCORE = float(os.getenv("WEB_STRONG_SCORE", "0.60"))
WEB_STRONG_MIN_CHUNKS = int(os.getenv("WEB_STRONG_MIN_CHUNKS", "3"))
WEB_SOURCES_SHOWN = int(os.getenv("WEB_SOURCES_SHOWN", "4"))  # cap web cards in the UI
WEB_SEARCH_TOOL = {
    "type": "web_search_20250305",
    "name": "web_search",
    "max_uses": int(os.getenv("WEB_SEARCH_MAX_USES", "2")),
    "allowed_domains": ALLOWED_DOMAINS,
}

# Keyword pre-filter for questions we don't cover. The system prompt is the
# backstop for anything these miss. Checked in order, so danger wins.
REFUSAL_PATTERNS = {
    "danger": r"\b(kill myself|suicide|hurt myself|end my life|being (beaten|hit|abused)|he hits me|she hits me)\b",
    "immigration": r"\b(immigration|immigrant|green ?card|visa|deport|deportation|asylum|uscis|undocumented|daca|citizenship|naturaliz)\b",
    "criminal": r"\b(arrest|arrested|criminal charge|criminal case|bail|bond hearing|felony|misdemeanor|expunge|jail|prison|parole|probation)\b",
    "family": r"\b(divorce|custody|child support|alimony|spousal support|guardianship|paternity|visitation|restraining order)\b",
}

# Answer cache. Identical (question, language, triage) pairs are common on a
# public tool, so serving repeats from memory saves a Claude call.
# Single process, time-limited, size-capped.
_CACHE: dict[tuple, tuple[float, dict]] = {}
_CACHE_TTL = 3600   # seconds
_CACHE_MAX = 500    # entries

_client = None


def _claude() -> anthropic.Anthropic:
    """One shared client, built on first use so imports work without a key set."""
    global _client
    if _client is None:
        _client = anthropic.Anthropic()
    return _client


# --------------------------------------------------------------------- routes

@router.post("/feedback")
@limiter.limit("30/minute")
def feedback(request: Request, req: FeedbackRequest):
    """Record one privacy-safe 'was this helpful?' vote (no raw question)."""
    lang = req.language if req.language in LANGUAGES else "en"
    record(request, kind="feedback", helpful=bool(req.helpful),
           language=lang, topic=(req.topic or "")[:32] or None)
    return {"ok": True}


@router.post("/ask", response_model=AskResponse)
@limiter.limit("20/minute")
def ask(request: Request, req: AskRequest):
    question = (req.question or "").strip()
    language = req.language if req.language in LANGUAGES else "en"
    if not question:
        # Not a refusal, just a nudge, so no org card.
        record(request, kind="ask", language=language, reason="empty", query_chars=0)
        return {"refused": False, "reason": "empty",
                "answer": "Please type a question.", "sources": [], "topic": ""}

    # Triage inputs change the answer, so they belong in the cache key.
    key = (question.lower(), language, req.area or "", (req.zip or "")[:5], req.subject or "")
    result = _cache_get(key)
    cached = result is not None
    if not cached:
        result = _handle(question, language, req.area, req.zip, req.subject)
        if result.get("reason") != "error":  # never cache a transient failure
            _cache_put(key, result)
    _record_ask(request, req, language, result, cached)
    return result


# -------------------------------------------------------------------- helpers

def _cache_get(key: tuple) -> dict | None:
    item = _CACHE.get(key)
    if not item:
        return None
    ts, value = item
    if time.time() - ts > _CACHE_TTL:
        _CACHE.pop(key, None)
        return None
    return value


def _cache_put(key: tuple, value: dict) -> None:
    if len(_CACHE) >= _CACHE_MAX and key not in _CACHE:
        _CACHE.pop(min(_CACHE, key=lambda k: _CACHE[k][0]), None)
    _CACHE[key] = (time.time(), value)


def _record_ask(request, req, language: str, result: dict, cached: bool) -> None:
    """Log one /ask outcome. Privacy-safe fields only; the raw question is gated
    behind ANALYTICS_LOG_QUESTIONS and dropped by the middleware when that's off.
    Triage fields show how often the guided funnel is used; ZIP is a boolean."""
    record(
        request,
        kind="ask",
        language=language,
        query_chars=len(req.question or ""),
        cached=cached,
        refused=bool(result.get("refused")),
        reason=result.get("reason"),
        topic=result.get("topic") or None,
        n_sources=len(result.get("sources") or []),
        triaged=bool(req.area or req.subject),
        area=req.area or None,
        subject=req.subject or None,
        zip_given=bool(req.zip),
        question=req.question,
    )


def _category(question: str) -> str | None:
    """Return the refusal category a question falls into, or None."""
    q = question.lower()
    for cat, pattern in REFUSAL_PATTERNS.items():
        if re.search(pattern, q):
            return cat
    return None


def _refuse(category: str, language: str) -> dict:
    """Refusal payload: translated headline plus the org card the frontend shows.
    Org contact details are language-neutral and stay as-is."""
    return {
        "refused": True,
        "reason": category,
        "answer": title(language, category),
        "disclaimer": text(language, "disclaimer"),
        "sources": [],
        "topic": category,
        "refusal_org": REFERRAL_ORGS[category],
    }


def _to_english(question: str, language: str) -> str:
    """Our corpus, embeddings, and keyword filter are all English, so translate
    first. The answer is still written back in the user's language."""
    if language == "en":
        return question
    try:
        resp = _claude().messages.create(
            model=TRANSLATE_MODEL,
            max_tokens=300,
            system="Translate the user's message into English. Output ONLY the "
                   "English translation — no quotes, no explanation.",
            messages=[{"role": "user", "content": question}],
        )
        return "".join(b.text for b in resp.content if b.type == "text").strip() or question
    except Exception:
        return question


def _research_with_web(q_en: str, context: str) -> tuple[str, list[dict]]:
    """Pass 1: research the question against our corpus plus the allow-listed web.
    Returns (brief, web_sources). Raises anthropic.APIError if the call fails."""
    resp = _claude().messages.create(
        model=MODEL,
        max_tokens=1500,
        system=RESEARCH_PROMPT,
        messages=[{"role": "user", "content":
                   f"Our library excerpts:\n\n{context}\n\nQuestion: {q_en}\n\n"
                   "Research and write the brief."}],
        tools=[WEB_SEARCH_TOOL],
    )
    brief = "".join(b.text for b in resp.content
                    if getattr(b, "type", None) == "text").strip()

    web_sources, seen = [], set()
    for block in resp.content:
        if getattr(block, "type", None) != "web_search_tool_result":
            continue
        for r in (block.content if isinstance(block.content, list) else []):
            url = getattr(r, "url", None)
            if url and url not in seen:
                seen.add(url)
                web_sources.append({"title": getattr(r, "title", None) or url, "url": url})
    return brief, web_sources


def _structure(system: str, user_content: str) -> dict:
    """Pass 2: force the `answer` tool and read the fields off it. Falls back to
    plain text if the tool call is malformed. Raises anthropic.APIError."""
    resp = _claude().messages.create(
        model=MODEL,
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": user_content}],
        tools=[ANSWER_TOOL],
        tool_choice={"type": "tool", "name": "answer"},
    )
    tool = next((b for b in resp.content
                 if b.type == "tool_use" and b.name == "answer"), None)

    if not tool or not isinstance(tool.input, dict):
        plain = "".join(b.text for b in resp.content if b.type == "text").strip()
        return {"answer": plain, "next_steps": [], "contact_why": "",
                "contact_how": "", "follow_ups": [], "confidence": None}

    d = tool.input
    conf = (d.get("confidence") or "").strip().lower()
    return {
        "answer": (d.get("answer") or "").strip(),
        "next_steps": _clean_list(d.get("next_steps")),
        "contact_why": (d.get("contact_why") or "").strip(),
        "contact_how": (d.get("contact_how") or "").strip(),
        "follow_ups": _clean_list(d.get("follow_ups"))[:3],
        "confidence": conf if conf in ("high", "medium", "low") else None,
    }


def _clean_list(values) -> list[str]:
    return [s.strip() for s in (values or []) if isinstance(s, str) and s.strip()]


def _source_cards(chunks: list[dict], web_sources: list[dict]) -> list[dict]:
    """One card per distinct corpus source, then any web pages we actually used."""
    cards, seen = [], set()
    for c in chunks:
        if c["source_name"] in seen:
            continue
        seen.add(c["source_name"])
        cards.append({
            "title": c["source_name"],
            "section": (c.get("jurisdiction") or "").title(),
            "url": c["url"],
            "topic": c["topic"],
            "score": c["score"],
        })
    for w in web_sources[:WEB_SOURCES_SHOWN]:
        cards.append({"title": w["title"], "section": "Web", "url": w["url"],
                      "topic": "", "web": True, "score": None})
    return cards


# ------------------------------------------------------------------- pipeline

def _handle(question: str, language: str, area: str | None,
            zip_code: str | None, subject: str | None) -> dict:
    """Translate -> filter -> retrieve -> answer. The optional triage inputs
    (area/zip/subject) narrow retrieval and pick the referral org."""
    q_en = _to_english(question, language)

    # 1. Out-of-scope and danger pre-filter.
    cat = _category(q_en)
    if cat:
        return _refuse(cat, language)

    # 2. Retrieve. A triage subject narrows the search; if that finds nothing,
    # retry across all topics before giving up.
    subject_topic = SUBJECT_TO_TOPIC.get((subject or "").strip())
    chunks = [c for c in retrieve(q_en, k=TOP_K, topic=subject_topic) if c["score"] >= MIN_SCORE]
    if not chunks and subject_topic:
        chunks = [c for c in retrieve(q_en, k=TOP_K) if c["score"] >= MIN_SCORE]
    if not chunks:
        return _refuse("no_results", language)

    # 3. Pick the "who to contact" org by topic and region.
    top_topic = subject_topic or Counter(c["topic"] for c in chunks).most_common(1)[0][0]
    org = contact_for(top_topic, resolve_region(area, zip_code))
    contact_line = (f"Referral organization (for contact_why / contact_how): "
                    f"{org['name']} — {org['sub']}, phone {org['phone']}.")

    # 4. Build the context blocks the model reads.
    context = "\n\n".join(
        f"[{i}] {c['source_name']} ({c['url']})\n{c['text']}"
        for i, c in enumerate(chunks, start=1)
    )

    # 5. Web check only when our corpus looks thin or uncertain. If it fails or
    # is turned off, we fall back to corpus-only.
    top_score = max((c["score"] for c in chunks), default=0.0)
    corpus_strong = top_score >= WEB_STRONG_SCORE and len(chunks) >= WEB_STRONG_MIN_CHUNKS
    brief, web_sources = "", []
    if WEB_SEARCH_ENABLED and not corpus_strong:
        try:
            brief, web_sources = _research_with_web(q_en, context)
        except anthropic.APIError as e:
            print(f"[ask] web research failed, falling back to corpus-only: {e}")

    # 6. Write the answer, from the brief if we have one, otherwise the corpus.
    system = ANSWER_PROMPT
    if language != "en":
        system += LANGUAGE_RULE.format(language=LANGUAGES[language])

    if brief:
        user_content = (
            f"Research brief (already grounded in our library and checked against "
            f"authoritative sites):\n\n{brief}\n\nQuestion: {q_en}\n\n{contact_line}\n\n"
            "Use the `answer` tool. Base the answer only on the brief above. Set "
            "`confidence` to match the brief's confidence line."
        )
    else:
        user_content = (
            f"Sources:\n\n{context}\n\nQuestion: {q_en}\n\n{contact_line}\n\n"
            "Use the `answer` tool. Ground everything only in the sources above. Set "
            "`confidence` from how well the sources cover and agree on the answer."
        )

    try:
        fields = _structure(system, user_content)
    except anthropic.APIError as e:
        # Don't 500 on the user. Show a friendly message in their language.
        print(f"[ask] Anthropic API error: {e}")
        return {"refused": False, "reason": "error", "topic": "",
                "answer": text(language, "error"),
                "disclaimer": text(language, "disclaimer")}

    return {
        "refused": False,
        "reason": None,
        "answer": fields["answer"],
        "disclaimer": text(language, "disclaimer"),
        "next_steps": fields["next_steps"],
        "contact": {**org, "why": fields["contact_why"], "how": fields["contact_how"]},
        "follow_ups": fields["follow_ups"],
        "sources": _source_cards(chunks, web_sources),
        "topic": top_topic,
        "confidence": fields["confidence"],
    }