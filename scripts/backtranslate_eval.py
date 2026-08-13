"""
Back-translation eval — the floor check for a non-English language.

The roadmap's warning: you cannot evaluate what you cannot read, and a
plausible-sounding wrong translation is undetectable. So for each benchmark
question we ask /ask twice — once in English, once in the target language — then
translate the target-language answer *back* to English and check the facts
survived. This catches gross failures (dropped dollar amounts, lost statute
citations, nonsense, English advice phrases leaking through). It is a floor, not
a ceiling: it will not catch subtle wrongness, so pair it with native review.

Needs a running server and ANTHROPIC_API_KEY (read from backend/.env).

Usage:
    uvicorn backend.main:app --reload            # terminal 1
    python scripts/backtranslate_eval.py --lang pl               # terminal 2
    python scripts/backtranslate_eval.py --lang es --judge       # + LLM fidelity judge
    python scripts/backtranslate_eval.py --lang pl --limit 8
"""

from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path

import requests
from dotenv import load_dotenv

BENCHMARK = Path("data/eval/benchmark.json")
OUT_DIR = Path("data/eval")

TRANSLATE_MODEL = "claude-haiku-4-5"
JUDGE_MODEL = "claude-sonnet-4-6"

LANG_NAMES = {
    "es": "Spanish", "zh": "Simplified Chinese", "tl": "Tagalog",
    "vi": "Vietnamese", "pl": "Polish",
}

# Same advice phrases the main eval forbids; here we check they didn't slip into
# the (back-translated) non-English answer.
FORBIDDEN_PHRASES = [
    "you may be eligible", "you should apply", "you qualify", "you are entitled",
    "this applies to you", "you may qualify", "you should call",
]

# Tokens that must be preserved verbatim across languages: money, percentages,
# "30 days"-style deadlines, and statute-ish citations (e.g. 535.300, 235-b, 1946.2).
_NUM = re.compile(r"\$?\d[\d,]*(?:\.\d+)?%?|\b\d+[a-z]?(?:[.\-]\d+[a-z]?)+\b", re.I)


def _numbers(text: str) -> set[str]:
    return {m.group(0).lower().rstrip(".") for m in _NUM.finditer(text or "")}


def _client():
    import anthropic
    return anthropic.Anthropic()


def _ask(url: str, q: dict, language: str) -> dict:
    body = {"question": q["question"], "language": language, "state": q.get("state", "IL")}
    if q.get("subject"):
        body["subject"] = q["subject"]
    r = requests.post(f"{url}/api/ask", json=body, timeout=120)
    r.raise_for_status()
    return r.json()


def _translate_to_english(client, text: str, lang_name: str) -> str:
    resp = client.messages.create(
        model=TRANSLATE_MODEL,
        max_tokens=1000,
        system=f"Translate the following {lang_name} text into English. Output ONLY the "
               "English translation, faithfully — do not fix, summarize, or add anything.",
        messages=[{"role": "user", "content": text}],
    )
    return "".join(b.text for b in resp.content if b.type == "text").strip()


def _judge(client, english: str, back: str) -> dict:
    """Optional LLM fidelity check: does the back-translation carry the same key
    facts as the English answer? Returns {score 0-1, issues[]}."""
    resp = client.messages.create(
        model=JUDGE_MODEL,
        max_tokens=400,
        system="You compare two English texts: a REFERENCE legal-information answer and a "
               "BACK-TRANSLATION of the same answer that was written in another language. "
               "Judge whether the back-translation preserves the reference's key facts "
               "(numbers, deadlines, statute names, who-must-do-what). Reply with a JSON "
               'object: {"score": 0.0-1.0, "issues": ["short note", ...]}. score 1.0 = all '
               "key facts preserved; lower for each dropped or changed fact. Output only JSON.",
        messages=[{"role": "user", "content": f"REFERENCE:\n{english}\n\nBACK-TRANSLATION:\n{back}"}],
    )
    raw = "".join(b.text for b in resp.content if b.type == "text").strip()
    try:
        return json.loads(raw[raw.index("{"):raw.rindex("}") + 1])
    except Exception:
        return {"score": None, "issues": ["judge output unparseable"]}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", required=True, choices=sorted(LANG_NAMES))
    ap.add_argument("--url", default="http://localhost:8000")
    ap.add_argument("--limit", type=int, default=0, help="cap number of questions")
    ap.add_argument("--judge", action="store_true", help="add an LLM fidelity score (costs more)")
    args = ap.parse_args()

    load_dotenv(os.path.join("backend", ".env"))
    lang_name = LANG_NAMES[args.lang]
    client = _client()

    cases = json.loads(BENCHMARK.read_text())["questions"]
    # Only answerable questions carry a translation to check.
    cases = [c for c in cases if not c.get("expect_refusal")]
    if args.limit:
        cases = cases[:args.limit]
    print(f"back-translating {len(cases)} answers, {lang_name} -> English, via {args.url}\n")

    rows, passed = [], 0
    for c in cases:
        try:
            en = _ask(args.url, c, "en")
            loc = _ask(args.url, c, args.lang)
        except Exception as e:
            print(f"  {c['id']}: REQUEST FAILED -> {e}")
            rows.append({"id": c["id"], "ok": False, "error": str(e)})
            continue

        en_ans = en.get("answer") or ""
        loc_ans = loc.get("answer") or ""
        back = _translate_to_english(client, loc_ans, lang_name) if loc_ans else ""
        back_low = back.lower()

        # Floor checks.
        non_empty = bool(back.strip())
        forbidden = [p for p in FORBIDDEN_PHRASES if p in back_low]
        en_nums = _numbers(en_ans)
        kept = {n for n in en_nums if n in back_low}
        num_ratio = 1.0 if not en_nums else round(len(kept) / len(en_nums), 2)
        en_src = {s.get("title") for s in (en.get("sources") or [])}
        loc_src = {s.get("title") for s in (loc.get("sources") or [])}
        same_sources = en_src == loc_src

        floor_ok = non_empty and not forbidden and num_ratio >= 0.8

        row = {
            "id": c["id"], "question": c["question"],
            "answer_en": en_ans, "answer_lang": loc_ans, "back_translation": back,
            "non_empty": non_empty, "forbidden_in_backtranslation": forbidden,
            "numbers_preserved": num_ratio, "missing_numbers": sorted(en_nums - kept),
            "same_sources": same_sources, "floor_ok": floor_ok,
        }
        if args.judge and back:
            row["judge"] = _judge(client, en_ans, back)
        rows.append(row)
        passed += int(floor_ok)

        flags = []
        if not non_empty: flags.append("empty")
        if forbidden: flags.append(f"forbidden={forbidden}")
        if num_ratio < 0.8: flags.append(f"numbers={num_ratio} missing={sorted(en_nums - kept)}")
        if not same_sources: flags.append("sources-differ")
        if args.judge and isinstance(row.get("judge"), dict) and row["judge"].get("score") is not None:
            flags.append(f"judge={row['judge']['score']}")
        print(f"  {'PASS' if floor_ok else 'FAIL'}  {c['id']:<24} {' '.join(flags)}")

    out = OUT_DIR / f"backtranslation-{args.lang}.json"
    out.write_text(json.dumps({"lang": args.lang, "passed": passed, "total": len(rows),
                               "rows": rows}, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n=== floor: {passed}/{len(rows)} passed ===")
    print(f"review artifact (read the back_translation fields) -> {out}")
    print("Floor checks catch gross failures only. A native speaker must still review.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
