# eval.py
# Runs the accuracy benchmark against a live /ask server.
# Per question: citation_match, wrong-jurisdiction leakage, forbidden advice
# language, required answer text, disclaimer, confidence.
#
# The single aggregate number can't tell you what to fix, so results are broken
# out by topic, by jurisdiction, and by set (core / adversarial_jurisdiction /
# refusal / staleness), plus refusal precision & recall.
#
# Usage (server must be running):
#   uvicorn backend.main:app --reload   # terminal 1
#   python scripts/eval.py              # terminal 2
#   python scripts/eval.py --url http://localhost:8000
#   python scripts/eval.py --set adversarial_jurisdiction   # run one set

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import requests

BENCHMARK = Path("data/eval/benchmark.json")
RESULTS = Path("data/eval/results.json")

FORBIDDEN_PHRASES = [
    "you may be eligible",
    "you should apply",
    "you qualify",
    "you are entitled",
    "this applies to you",
    "you may qualify",
    "you should call",
]


def _norm(s: str) -> str:
    """Normalize to lowercase words so 'fair debt' matches '.../fair-debt-collection-practices-act'."""
    return re.sub(r"[^a-z0-9]+", " ", s.lower())


def check(q: dict, resp: dict) -> dict:
    refused = bool(resp.get("refused"))
    citations = resp.get("sources") or []
    expect_refusal = bool(q.get("expect_refusal"))

    # Haystack of every citation's title, url, AND section (which now carries the
    # jurisdiction, e.g. "California · San Francisco"), for both the positive and
    # the forbidden-source checks.
    hay = _norm(" ".join(
        f"{c.get('title','')} {c.get('url','')} {c.get('section','')}" for c in citations))

    if expect_refusal:
        citation_match = refused
    else:
        citation_match = any(_norm(s) in hay for s in q.get("expected_sources", []))

    # Wrong-jurisdiction leakage: none of these substrings may appear in any
    # citation. This is the core safety check once the state filter ships — a
    # California question must never cite Illinois law, and vice versa.
    forbidden_sources = q.get("forbidden_sources", [])
    jurisdiction_ok = not any(_norm(s) in hay for s in forbidden_sources)

    # Staleness / content: substrings that MUST appear in the answer text (e.g. a
    # 2026 figure), so we catch the model serving pre-2026 law.
    answer_text = (resp.get("answer") or "").lower()
    must_include = q.get("answer_must_include", [])
    answer_include_ok = all(m.lower() in answer_text for m in must_include)

    # Scan the full structured answer for forbidden advice phrases.
    contact = resp.get("contact") or {}
    scan = " ".join([
        resp.get("answer") or "",
        " ".join(resp.get("next_steps") or []),
        contact.get("why", ""), contact.get("how", ""),
    ]).lower()
    forbidden_found = [p for p in FORBIDDEN_PHRASES if p in scan]

    disclaimer_present = bool((resp.get("disclaimer") or "").strip())
    disclaimer_ok = disclaimer_present or refused

    # Refusals don't carry a confidence rating; answered questions must.
    confidence = (resp.get("confidence") or "").strip().lower()
    confidence_ok = refused or confidence in ("high", "medium", "low")

    passed = (citation_match and jurisdiction_ok and answer_include_ok
              and not forbidden_found and disclaimer_ok and confidence_ok)
    return {
        "id": q["id"],
        "topic": q.get("topic", ""),
        "set": q.get("set", "core"),
        "jurisdiction": q.get("state", "IL"),
        "passed": passed,
        "citation_match": citation_match,
        "jurisdiction_ok": jurisdiction_ok,
        "answer_include_ok": answer_include_ok,
        "forbidden_phrases_found": forbidden_found,
        "disclaimer_present": disclaimer_present,
        "confidence": confidence or None,
        "confidence_ok": confidence_ok,
        "refused": refused,
    }


def _ask_payload(q: dict) -> dict:
    """Body for /ask. Default state to Illinois (the incumbent corpus) so legacy
    cases exercise the state filter; adversarial cases set their own state."""
    payload = {"question": q["question"], "state": q.get("state", "IL")}
    if q.get("locality"):
        payload["locality"] = q["locality"]
    if q.get("subject"):
        payload["subject"] = q["subject"]
    return payload


def _rate(rows: list, pred) -> str:
    """Format count/total (pct) for a predicate over rows; '-' if no rows."""
    if not rows:
        return "  -  "
    n = sum(1 for r in rows if pred(r))
    return f"{n}/{len(rows)} ({round(100 * n / len(rows))}%)"


def _group(results: list, key: str) -> dict:
    out: dict[str, list] = {}
    for r in results:
        out.setdefault(r.get(key, ""), []).append(r)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://localhost:8000")
    ap.add_argument("--set", dest="only_set", default=None,
                    help="run only one set, e.g. adversarial_jurisdiction")
    args = ap.parse_args()

    questions = json.loads(BENCHMARK.read_text())["questions"]
    if args.only_set:
        questions = [q for q in questions if q.get("set", "core") == args.only_set]
    by_id = {q["id"]: q for q in questions}
    print(f"running {len(questions)} questions against {args.url}\n")

    results = []
    for q in questions:
        try:
            r = requests.post(f"{args.url}/api/ask", json=_ask_payload(q), timeout=120)
            r.raise_for_status()
            resp = r.json()
        except Exception as e:
            print(f"  {q['id']}: REQUEST FAILED -> {e}")
            results.append({"id": q["id"], "topic": q.get("topic", ""),
                            "set": q.get("set", "core"), "jurisdiction": q.get("state", "IL"),
                            "passed": False, "error": str(e)})
            continue

        res = check(q, resp)
        results.append(res)
        mark = "PASS" if res["passed"] else "FAIL"
        bits = []
        if not res["citation_match"]:        bits.append("no-citation")
        if not res.get("jurisdiction_ok", True): bits.append("WRONG-JURISDICTION")
        if not res.get("answer_include_ok", True): bits.append("missing-answer-text")
        if res["forbidden_phrases_found"]:   bits.append(f"forbidden={res['forbidden_phrases_found']}")
        if not res["disclaimer_present"] and not res["refused"]: bits.append("no-disclaimer")
        if not res["confidence_ok"]:         bits.append("no-confidence")
        print(f"  {mark}  {q['id']:<24} {' '.join(bits)}")

    passed = sum(1 for r in results if r.get("passed"))
    total = len(results)

    # Refusal precision & recall over the whole run.
    expected_refusals = [r for r in results if by_id[r["id"]].get("expect_refusal")]
    refused_rows = [r for r in results if r.get("refused")]
    refusal_recall = _rate(expected_refusals, lambda r: r.get("refused"))
    refusal_precision = _rate(refused_rows, lambda r: by_id[r["id"]].get("expect_refusal"))

    def _grid(group_key: str) -> dict:
        return {k: {"passed": sum(1 for r in rs if r.get("passed")), "total": len(rs)}
                for k, rs in _group(results, group_key).items()}

    summary = {
        "passed": passed,
        "total": total,
        "pct": round(100 * passed / total, 1) if total else 0.0,
        "by_topic": _grid("topic"),
        "by_jurisdiction": _grid("jurisdiction"),
        "by_set": _grid("set"),
        "refusal_precision": refusal_precision,
        "refusal_recall": refusal_recall,
        "results": results,
    }
    RESULTS.write_text(json.dumps(summary, indent=2))

    print(f"\n=== {passed}/{total} passed ({summary['pct']}%) ===")
    for label, key in (("by set", "by_set"), ("by jurisdiction", "by_jurisdiction"),
                       ("by topic", "by_topic")):
        print(f"\n{label}:")
        for name, c in summary[key].items():
            print(f"  {name:<26} {c['passed']}/{c['total']}")
    print(f"\nrefusal recall (caught the out-of-scope):   {refusal_recall}")
    print(f"refusal precision (refused only when it should): {refusal_precision}")
    print(f"\nfull results -> {RESULTS}")


if __name__ == "__main__":
    main()
