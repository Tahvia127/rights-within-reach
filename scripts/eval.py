# eval.py
# Runs the accuracy benchmark against a live /ask server.
# Scores three things per question:
#   citation_match     -- expected source in citations, or correct refusal
#   forbidden_language -- none of CLINIC's individualized-advice phrases present
#   disclaimer_present -- required disclaimer appears in the answer
#
# Usage (server must be running):
#   uvicorn backend.main:app --reload   # terminal 1
#   python scripts/eval.py              # terminal 2
#   python scripts/eval.py --url http://localhost:8000

from __future__ import annotations

import argparse
import json
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

DISCLAIMER_MARKER = "legal information, not legal advice"


def check(q: dict, resp: dict) -> dict:
    answer = (resp.get("answer") or "").lower()
    refused = bool(resp.get("refused"))
    citations = resp.get("sources") or []
    expect_refusal = bool(q.get("expect_refusal"))

    if expect_refusal:
        citation_match = refused
    else:
        hay = " ".join(
            f"{c.get('title','')} {c.get('url','')}" for c in citations
        ).lower()
        citation_match = any(s.lower() in hay for s in q.get("expected_sources", []))

    forbidden_found = [p for p in FORBIDDEN_PHRASES if p in answer]
    disclaimer_present = DISCLAIMER_MARKER in answer
    # refusals don't carry a disclaimer since no legal info is given
    disclaimer_ok = disclaimer_present or refused

    passed = citation_match and not forbidden_found and disclaimer_ok
    return {
        "id": q["id"],
        "topic": q.get("topic", ""),
        "passed": passed,
        "citation_match": citation_match,
        "forbidden_phrases_found": forbidden_found,
        "disclaimer_present": disclaimer_present,
        "refused": refused,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://localhost:8000")
    args = ap.parse_args()

    questions = json.loads(BENCHMARK.read_text())["questions"]
    print(f"running {len(questions)} questions against {args.url}\n")

    results = []
    for q in questions:
        try:
            r = requests.post(
                f"{args.url}/api/ask",
                json={"question": q["question"]},
                timeout=120,
            )
            r.raise_for_status()
            resp = r.json()
        except Exception as e:
            print(f"  {q['id']}: REQUEST FAILED -> {e}")
            results.append({"id": q["id"], "topic": q.get("topic", ""),
                            "passed": False, "error": str(e)})
            continue

        res = check(q, resp)
        results.append(res)
        mark = "PASS" if res["passed"] else "FAIL"
        bits = []
        if not res["citation_match"]:       bits.append("no-citation")
        if res["forbidden_phrases_found"]:  bits.append(f"forbidden={res['forbidden_phrases_found']}")
        if not res["disclaimer_present"]:   bits.append("no-disclaimer")
        print(f"  {mark}  {q['id']:<18} {' '.join(bits)}")

    passed = sum(1 for r in results if r.get("passed"))
    total = len(results)

    topics: dict[str, list] = {}
    for r in results:
        topics.setdefault(r.get("topic", ""), []).append(r)

    summary = {
        "passed": passed,
        "total": total,
        "pct": round(100 * passed / total, 1) if total else 0.0,
        "by_topic": {
            t: {"passed": sum(1 for r in rs if r.get("passed")), "total": len(rs)}
            for t, rs in topics.items()
        },
        "results": results,
    }
    RESULTS.write_text(json.dumps(summary, indent=2))

    print(f"\n=== {passed}/{total} passed ({summary['pct']}%) ===")
    for t, c in summary["by_topic"].items():
        print(f"  {t:<14} {c['passed']}/{c['total']}")
    print(f"\nfull results -> {RESULTS}")


if __name__ == "__main__":
    main()