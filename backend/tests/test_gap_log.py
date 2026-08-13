"""
Tests for the anonymous question-gap log and its PII scrubber. Imports only
backend.analytics (no app, no ML deps), so it runs fast and pins the privacy
rules: scrubbing, opt-in default, and the DV/immigration exclusion.
"""

import json

from backend.analytics import log_question_gap, scrub_pii


def _read(p):
    return [json.loads(ln) for ln in p.read_text(encoding="utf-8").splitlines() if ln.strip()]


# --- scrub_pii -------------------------------------------------------------

def test_scrub_pii_redacts_contact_details():
    assert "[email]" in scrub_pii("reach me at jane.doe@example.com")
    assert "[phone]" in scrub_pii("call 312-555-1234 please")
    assert "[ssn]" in scrub_pii("my ssn is 123-45-6789")
    assert "[number]" in scrub_pii("account number 12345678")


def test_scrub_pii_keeps_zip_and_plain_words():
    out = scrub_pii("my rent in 60649 went up 400 dollars")
    assert "60649" in out           # a 5-digit ZIP is not redacted
    assert "[number]" not in out    # nor is a short amount
    assert "rent" in out and "went up" in out


# --- log_question_gap ------------------------------------------------------

def test_gap_log_is_off_by_default(tmp_path, monkeypatch):
    monkeypatch.delenv("QUESTION_GAP_LOG", raising=False)
    p = tmp_path / "gaps.jsonl"
    monkeypatch.setenv("QUESTION_GAP_PATH", str(p))
    log_question_gap("no heat in my apartment", reason="no_results", state="IL")
    assert not p.exists()


def test_gap_log_writes_no_results_when_enabled(tmp_path, monkeypatch):
    monkeypatch.setenv("QUESTION_GAP_LOG", "1")
    p = tmp_path / "gaps.jsonl"
    monkeypatch.setenv("QUESTION_GAP_PATH", str(p))
    log_question_gap("email me at x@y.com about my eviction",
                     reason="no_results", topic="housing", state="IL")
    rows = _read(p)
    assert len(rows) == 1
    assert rows[0]["gap"] == "no_results"
    assert rows[0]["state"] == "IL"
    assert "[email]" in rows[0]["question"]  # PII scrubbed before writing


def test_gap_log_captures_low_confidence(tmp_path, monkeypatch):
    monkeypatch.setenv("QUESTION_GAP_LOG", "1")
    p = tmp_path / "gaps.jsonl"
    monkeypatch.setenv("QUESTION_GAP_PATH", str(p))
    log_question_gap("some unusual question", reason=None, confidence="low", state="CA")
    rows = _read(p)
    assert len(rows) == 1 and rows[0]["gap"] == "low_confidence"


def test_gap_log_excludes_immigration_and_danger(tmp_path, monkeypatch):
    monkeypatch.setenv("QUESTION_GAP_LOG", "1")
    p = tmp_path / "gaps.jsonl"
    monkeypatch.setenv("QUESTION_GAP_PATH", str(p))
    log_question_gap("how do I get a green card", reason="immigration", state="IL")
    log_question_gap("he hits me", reason="danger", state="IL")
    assert not p.exists()  # out-of-scope refusals are never logged as gaps


def test_gap_log_skips_confident_answers(tmp_path, monkeypatch):
    monkeypatch.setenv("QUESTION_GAP_LOG", "1")
    p = tmp_path / "gaps.jsonl"
    monkeypatch.setenv("QUESTION_GAP_PATH", str(p))
    log_question_gap("a well-answered question", reason=None, confidence="high", state="IL")
    assert not p.exists()
