"""
Refresh data/taxonomy/list.json from the live LIST taxonomy (taxonomy.legal).

Replaces the hand-seeded subset with the full ~1,301-term set, keeping the same
shape the app reads (backend/services/taxonomy.py::list_snapshot). We cache to
disk and never hit the API at query time.

The upstream field names are not pinned here, so the extractor is deliberately
tolerant: it looks for a code-like, name-like, and parent-like key on each term.
If the response shape has drifted, it prints what it saw and writes nothing —
fix the key heuristics below rather than shipping a half-parsed file.

Usage:
    python scripts/refresh_taxonomy.py
    python scripts/refresh_taxonomy.py --url https://www.taxonomy.legal/api/terms
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.request
from pathlib import Path

OUT = Path("data/taxonomy/list.json")
API = "https://www.taxonomy.legal/api/terms"
UA = {"User-Agent": "RightsWithinReach/1.0 (+https://rightswithinreach.org)"}

# Candidate keys, in priority order. Adjust if the API shape differs.
CODE_KEYS = ("code", "id", "term_code", "slug")
NAME_KEYS = ("name", "label", "title", "term", "display_name")
PARENT_KEYS = ("parent", "parent_code", "parent_id", "top_parent")


def _first(d: dict, keys) -> str:
    for k in keys:
        v = d.get(k)
        if isinstance(v, str) and v.strip():
            return v.strip()
    return ""


def _terms(payload) -> list[dict]:
    """Find the list of term objects whether the API returns a bare list or wraps
    it in {"terms": [...]} / {"data": [...]} / {"results": [...]}."""
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        for key in ("terms", "data", "results", "items"):
            if isinstance(payload.get(key), list):
                return payload[key]
    return []


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default=API)
    ap.add_argument("--as-of", default=None, help="override as_of date (YYYY-MM-DD)")
    args = ap.parse_args()

    req = urllib.request.Request(args.url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            payload = json.loads(r.read().decode("utf-8", "ignore"))
    except Exception as e:
        print(f"fetch failed: {type(e).__name__}: {e}")
        return 1

    terms = _terms(payload)
    if not terms:
        print("no term list found in the response. Top-level shape was:")
        print("  ", type(payload).__name__,
              list(payload)[:8] if isinstance(payload, dict) else f"[{len(payload)} items]")
        return 1

    parents: dict[str, str] = {}
    all_terms: dict[str, str] = {}
    for t in terms:
        if not isinstance(t, dict):
            continue
        code = _first(t, CODE_KEYS).upper()
        name = _first(t, NAME_KEYS)
        if not code or not name:
            continue
        all_terms[code] = name
        if "-" not in code:  # a top-level parent like "HO", "BE"
            parents[code] = name

    if not all_terms:
        sample = terms[0] if terms else {}
        print("found terms but could not extract code/name. First item keys:")
        print("  ", list(sample) if isinstance(sample, dict) else sample)
        print("Adjust CODE_KEYS / NAME_KEYS at the top of this script.")
        return 1

    out = {
        "as_of": args.as_of,  # pass --as-of; Date.now() is intentionally not used here
        "source": args.url,
        "note": "Full LIST snapshot from taxonomy.legal. Regenerate with scripts/refresh_taxonomy.py.",
        "term_count_upstream": len(all_terms),
        "parents": dict(sorted(parents.items())),
        "terms": dict(sorted(all_terms.items())),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {OUT}: {len(parents)} parents, {len(all_terms)} terms")
    if len(parents) != 20:
        print(f"  note: expected 20 top-level parents, got {len(parents)} — check the source")
    return 0


if __name__ == "__main__":
    sys.exit(main())
