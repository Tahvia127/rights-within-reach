"""
Coverage report over the built Chroma corpus (Phase 0 of the expansion roadmap).

Answers "where are we thin?" honestly instead of hiding it behind a single
accuracy number: chunks per state, per LIST top-level parent, per topic, and the
state x topic grid that shows which jurisdictions still have no content for a
screen. Use this to decide what to add next.

Usage:
    python scripts/coverage_report.py
"""

from __future__ import annotations

import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import chromadb  # noqa: E402

from backend.services.taxonomy import LIST_PARENTS, parent_of  # noqa: E402

CHROMA_PATH = "data/chroma"
COLLECTION = "rwr_docs"


def _bar(n: int, total: int, width: int = 24) -> str:
    fill = 0 if not total else round(width * n / total)
    return "#" * fill + "." * (width - fill)


def main() -> int:
    try:
        coll = chromadb.PersistentClient(path=CHROMA_PATH).get_collection(COLLECTION)
    except Exception:
        print(f"no collection at {CHROMA_PATH!r}. Build it first:\n"
              "  python -m backend.ingest.load_to_chroma")
        return 1

    got = coll.get(include=["metadatas"])
    metas = got.get("metadatas") or []
    total = len(metas)
    if not total:
        print("collection is empty.")
        return 1

    by_state = Counter(m.get("state") or "(none)" for m in metas)
    by_parent = Counter(parent_of(m.get("list_code") or "") or "(none)" for m in metas)
    by_topic = Counter(m.get("topic") or "(none)" for m in metas)
    grid = Counter((m.get("state") or "(none)", m.get("topic") or "(none)") for m in metas)

    print(f"\n{total} chunks in '{COLLECTION}'\n")

    print("by jurisdiction (state):")
    for state, n in by_state.most_common():
        print(f"  {state:<10} {n:>4}  {_bar(n, total)}")

    print("\nby LIST top-level parent:")
    for code, n in by_parent.most_common():
        label = LIST_PARENTS.get(code, code)
        print(f"  {code:<4} {label:<34} {n:>4}  {_bar(n, total)}")

    print("\nby topic (content screen):")
    for topic, n in by_topic.most_common():
        print(f"  {topic:<16} {n:>4}  {_bar(n, total)}")

    states = sorted({m.get("state") or "(none)" for m in metas})
    topics = sorted({m.get("topic") or "(none)" for m in metas})
    print("\nstate x topic (chunks; blank = a gap to fill):")
    header = "  " + " " * 16 + "".join(f"{s:>10}" for s in states)
    print(header)
    for topic in topics:
        cells = "".join(f"{grid.get((s, topic), '') or '':>10}" for s in states)
        print(f"  {topic:<16}{cells}")

    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
