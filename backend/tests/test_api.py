# test_api.py
# Regression tests for deterministic API paths only (refusals, validation, /search).
# No Claude calls -- no cost, no network, fast.

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def _ask(question, **kw):
    return client.post("/api/ask", json={"question": question, **kw})


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_family_refusal_routes_to_org():
    d = _ask("Can I get full custody of my kids?").json()
    assert d["refused"] is True
    assert d["reason"] == "family"
    assert d["refusal_org"]["phone"]
    assert d["sources"] == []


def test_immigration_refusal():
    d = _ask("How do I renew my green card?").json()
    assert d["refused"] is True
    assert d["reason"] == "immigration"


def test_danger_refusal():
    d = _ask("I want to hurt myself").json()
    assert d["refused"] is True
    assert d["reason"] == "danger"


def test_empty_question_is_not_a_refusal():
    d = _ask("   ").json()
    assert d["refused"] is False
    assert d["reason"] == "empty"


def test_question_too_long_is_rejected():
    r = _ask("a" * 2500)
    assert r.status_code == 422  # blocked by validation before any model call


def test_search_response_shape():
    r = client.get("/api/search", params={"q": "eviction notice", "k": 2})
    assert r.status_code == 200
    d = r.json()
    assert set(d.keys()) == {"query", "count", "results"}
    assert d["count"] <= 2
    if d["results"]:
        assert {"source_name", "url", "topic", "score"} <= set(d["results"][0].keys())