"""
Summarize the question-gap log — the questions the corpus could not answer well.

Reads the PII-scrubbed, opt-in gap log (data/analytics/question_gaps.jsonl, written
when QUESTION_GAP_LOG=1) and reports where the tool is thin: gap type, topic,
state, the most-repeated questions, and the most common content words. Use it to
decide what sources to add next — "what people actually ask, which will not match
what you assumed."

Usage:
    python scripts/question_gaps.py
    python scripts/question_gaps.py --path data/analytics/question_gaps.jsonl --top 25
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path

DEFAULT_PATH = Path("data/analytics/question_gaps.jsonl")

_WORD = re.compile(r"[a-z]{3,}")
_STOP = {
    "the", "and", "for", "you", "your", "can", "what", "how", "does", "did", "are",
    "was", "were", "have", "has", "had", "get", "got", "not", "but", "with", "from",
    "this", "that", "they", "them", "there", "here", "will", "would", "should", "could",
    "about", "into", "out", "off", "over", "under", "than", "then", "when", "where",
    "who", "why", "which", "any", "all", "some", "one", "two", "his", "her", "she",
    "him", "our", "their", "its", "been", "being", "just", "like", "need", "want",
    "know", "tell", "help", "please", "legal", "law", "rights",
}


def _rows(path: Path) -> list[dict]:
    if not path.exists():
        return []
    out = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return out


def _bar(n: int, total: int, width: int = 22) -> str:
    fill = 0 if not total else round(width * n / total)
    return "#" * fill + "." * (width - fill)


def _counts(rows: list[dict], key: str, label: str) -> None:
    c = Counter((r.get(key) or "(none)") for r in rows)
    print(f"\nby {label}:")
    for name, n in c.most_common():
        print(f"  {str(name):<16} {n:>4}  {_bar(n, len(rows))}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", default=str(DEFAULT_PATH))
    ap.add_argument("--top", type=int, default=20)
    args = ap.parse_args()

    path = Path(args.path)
    rows = _rows(path)
    if not rows:
        print(f"no gap log at {path} (set QUESTION_GAP_LOG=1 to collect one).")
        return 1

    print(f"{len(rows)} logged gap questions in {path}")
    _counts(rows, "gap", "gap type")
    _counts(rows, "topic", "topic")
    _counts(rows, "state", "state")
    _counts(rows, "language", "language")

    print(f"\ntop {args.top} most-repeated questions:")
    for q, n in Counter(r.get("question", "") for r in rows).most_common(args.top):
        print(f"  {n:>3}x  {q}")

    words = Counter()
    for r in rows:
        words.update(w for w in _WORD.findall((r.get("question") or "").lower()) if w not in _STOP)
    print(f"\ntop {args.top} content words (themes to consider adding):")
    for w, n in words.most_common(args.top):
        print(f"  {n:>4}  {w}")

    print("\nRemember: free-text names can't be fully scrubbed — keep this log internal.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
