# test_analytics.py
# Tests request logging: timing, refusals, privacy defaults, and log rotation.
# Only hits deterministic routes (/health, /api/ask refusal) -- no Claude calls.

import json

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def _read_log(path):
    with open(path, encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


def test_request_is_logged_with_timing(tmp_path, monkeypatch):
    log = tmp_path / "requests.jsonl"
    monkeypatch.setenv("ANALYTICS_LOG_PATH", str(log))

    client.get("/health")

    rec = [r for r in _read_log(log) if r["path"] == "/health"][-1]
    assert rec["method"] == "GET"
    assert rec["status"] == 200
    assert isinstance(rec["ms"], (int, float))
    assert "ts" in rec


def test_ask_refusal_records_outcome_without_question(tmp_path, monkeypatch):
    log = tmp_path / "requests.jsonl"
    monkeypatch.setenv("ANALYTICS_LOG_PATH", str(log))

    client.post("/api/ask", json={"question": "Can I get full custody of my kids?"})

    rec = [r for r in _read_log(log) if r["path"] == "/api/ask"][-1]
    assert rec["kind"] == "ask"
    assert rec["refused"] is True
    assert rec["reason"] == "family"
    assert rec["query_chars"] > 0
    assert "question" not in rec  # raw text never logged by default


def test_question_logged_only_when_opted_in(tmp_path, monkeypatch):
    log = tmp_path / "requests.jsonl"
    monkeypatch.setenv("ANALYTICS_LOG_PATH", str(log))
    monkeypatch.setenv("ANALYTICS_LOG_QUESTIONS", "1")

    client.post("/api/ask", json={"question": "How do I renew my green card?"})

    rec = [r for r in _read_log(log) if r["path"] == "/api/ask"][-1]
    assert rec["question"] == "How do I renew my green card?"


def test_logging_can_be_disabled(tmp_path, monkeypatch):
    log = tmp_path / "requests.jsonl"
    monkeypatch.setenv("ANALYTICS_LOG_PATH", str(log))
    monkeypatch.setenv("ANALYTICS_ENABLED", "0")

    client.get("/health")

    assert not log.exists()  # nothing written when disabled


def test_no_client_hash_by_default(tmp_path, monkeypatch):
    log = tmp_path / "requests.jsonl"
    monkeypatch.setenv("ANALYTICS_LOG_PATH", str(log))

    client.get("/health")

    rec = [r for r in _read_log(log) if r["path"] == "/health"][-1]
    assert "client" not in rec  # IP hashing is opt-in


def test_no_client_hash_without_salt(tmp_path, monkeypatch):
    log = tmp_path / "requests.jsonl"
    monkeypatch.setenv("ANALYTICS_LOG_PATH", str(log))
    monkeypatch.setenv("ANALYTICS_HASH_IP", "1")
    monkeypatch.delenv("ANALYTICS_SALT", raising=False)

    client.get("/health")

    rec = [r for r in _read_log(log) if r["path"] == "/health"][-1]
    assert "client" not in rec  # never emit an unsalted hash


def test_client_hash_when_enabled_with_salt(tmp_path, monkeypatch):
    log = tmp_path / "requests.jsonl"
    monkeypatch.setenv("ANALYTICS_LOG_PATH", str(log))
    monkeypatch.setenv("ANALYTICS_HASH_IP", "1")
    monkeypatch.setenv("ANALYTICS_SALT", "test-salt")

    client.get("/health")

    rec = [r for r in _read_log(log) if r["path"] == "/health"][-1]
    assert len(rec["client"]) == 12
    int(rec["client"], 16)  # raises if not valid hex


def test_log_rotation_keeps_backups(tmp_path, monkeypatch):
    log = tmp_path / "requests.jsonl"
    monkeypatch.setenv("ANALYTICS_LOG_PATH", str(log))
    monkeypatch.setenv("ANALYTICS_MAX_BYTES", "300")  # rotate quickly
    monkeypatch.setenv("ANALYTICS_BACKUPS", "2")

    for _ in range(40):
        client.get("/health")

    assert (tmp_path / "requests.jsonl.1").exists()
    assert not (tmp_path / "requests.jsonl.3").exists()