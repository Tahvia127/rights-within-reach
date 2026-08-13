"""
Fetch a state's verified primary-law sources into data/raw/<state>/ as .html
files with .meta.json sidecars, so the normal ingest (load_to_chroma.py) picks
them up with the right state / locality / list_code metadata.

Works for any state that has a verified source CSV in the same shape as
data/ca_sources_verified.csv (columns: source_name, url, jurisdiction, locality,
list_code, kind, ...). Produce that CSV with the matching verify script, e.g.
scripts/verify_mo_sources.py.

    Input:  data/<state>_sources_verified.csv
    Output: data/raw/<state>/<slug>.html + <slug>.meta.json

Immigration (IM-*) sources are skipped: immigration is still a refusal category
in /ask, so ingesting it would add corpus the tool never serves. Re-enable with
--include-immigration once that work lands.

Usage:
    python scripts/fetch_state_sources.py --state ca
    python scripts/fetch_state_sources.py --state mo --dry-run
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import time
import urllib.request
from datetime import date
from pathlib import Path

# Make `backend` importable when run as a plain script from the repo root.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from backend.services.taxonomy import list_code_to_topic, parent_of  # noqa: E402

UA = {"User-Agent": "RightsWithinReach/1.0 (+https://rightswithinreach.org)"}
MIN_CHARS = 1000  # a 200 with less text than this is usually a JS shell / soft 404


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s[:80] or "source"


def fetch(url: str) -> tuple[int, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "ignore")
    except Exception as e:
        print(f"  fetch failed: {type(e).__name__}: {e}")
        return 0, ""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--state", required=True,
                    help="state code whose CSV to fetch, e.g. ca, mo")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--include-immigration", action="store_true",
                    help="also fetch IM-* sources (off by default; immigration is refused)")
    args = ap.parse_args()

    state = args.state.lower()
    src_csv = Path(f"data/{state}_sources_verified.csv")
    out_dir = Path(f"data/raw/{state}")
    if not src_csv.exists():
        print(f"missing {src_csv} -- run the verify script for {state.upper()} first")
        return 1

    rows = list(csv.DictReader(src_csv.open(encoding="utf-8")))
    out_dir.mkdir(parents=True, exist_ok=True)

    kept, skipped, failed = 0, 0, 0
    for row in rows:
        name = row["source_name"]
        url = row["url"]
        code = (row.get("list_code") or "").upper()
        st = (row.get("jurisdiction") or "").strip()   # "CA"/"MO" or "federal"
        locality = (row.get("locality") or "").strip() or None
        topic = list_code_to_topic(code)

        if parent_of(code) == "IM" and not args.include_immigration:
            print(f"  skip (immigration, refused category): {name}")
            skipped += 1
            continue
        if topic is None:
            print(f"  skip (list_code {code} maps to no screen): {name}")
            skipped += 1
            continue

        slug = slugify(name)
        if args.dry_run:
            print(f"  would fetch [{st}/{locality or '-'}/{code}->{topic}] {slug}")
            kept += 1
            continue

        status, html = fetch(url)
        if status != 200 or len(html) < MIN_CHARS:
            print(f"  FAILED [{status}] {name}")
            failed += 1
            continue

        (out_dir / f"{slug}.html").write_text(html, encoding="utf-8")
        meta = {
            "source_name": name,
            "url": url,
            "topic": topic,
            "jurisdiction": st.lower(),   # legacy display field
            "state": st,                  # authoritative: "CA" / "MO" / "federal"
            "locality": locality,         # e.g. "san_francisco", "st_louis_city", or null
            "list_code": code,
            "priority": "High",
            "downloaded_at": date.today().isoformat(),
            "file_type": "html",
            "kind": row.get("kind", ""),
            "notes": f"{state.upper()} jurisdiction expansion ({row.get('kind', 'source')})",
        }
        (out_dir / f"{slug}.meta.json").write_text(
            json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  wrote [{st}/{locality or '-'}/{code}->{topic}] {slug} ({len(html):,} chars)")
        kept += 1
        time.sleep(0.4)

    verb = "would fetch" if args.dry_run else "wrote"
    print(f"\n{verb} {kept} · skipped {skipped} · failed {failed}")
    if not args.dry_run and kept:
        print("next: python -m backend.ingest.load_to_chroma  # rebuild the vector store")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
