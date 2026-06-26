# download_new_sources.py
# Downloads HTML for money_debt and housing_repair rows from data/rights_sources.csv
# and writes .meta.json sidecars alongside each file.
#
# Run from project root:
#   python scripts/download_new_sources.py

import csv
import json
import re
from datetime import date
from pathlib import Path

import requests

SOURCES_CSV = Path("data/rights_sources.csv")
RAW_DIR = Path("data/raw")
NEW_TOPICS = {"money_debt", "housing_repair"}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}


def slugify(name: str) -> str:
    name = re.sub(r"[^a-z0-9\s-]", "", name.lower())
    return re.sub(r"\s+", "-", name).strip("-")[:60]


def download(row: dict) -> bool:
    topic, name, url = row["topic"], row["source_name"], row["url"]
    folder = RAW_DIR / topic
    folder.mkdir(parents=True, exist_ok=True)

    slug = slugify(name)
    html_path = folder / f"{slug}.html"
    meta_path = folder / f"{slug}.meta.json"

    if html_path.exists():
        print(f"  skip (exists): {slug}")
        return False

    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
    except Exception as e:
        print(f"  FAILED: {name} ({url}) -> {e}")
        return False

    html_path.write_text(r.text, encoding="utf-8")
    meta_path.write_text(json.dumps({
        "source_name": name,
        "url": url,
        "topic": topic,
        "jurisdiction": row["jurisdiction"],
        "priority": row["priority"],
        "access_date": date.today().isoformat(),
        "date_reviewed": date.today().isoformat(),
        "notes": row.get("notes", ""),
    }, indent=2))

    print(f"  ok: {slug} ({len(r.text):,} chars)")
    return True


def main():
    if not SOURCES_CSV.exists():
        print(f"sources csv not found at {SOURCES_CSV}")
        return

    with open(SOURCES_CSV) as f:
        rows = [r for r in csv.DictReader(f) if r["topic"] in NEW_TOPICS]

    print(f"found {len(rows)} rows to download\n")

    by_topic: dict[str, list] = {}
    for row in rows:
        by_topic.setdefault(row["topic"], []).append(row)

    total_ok = 0
    for topic, group in by_topic.items():
        print(f"--- {topic} ({len(group)} sources) ---")
        for row in group:
            if download(row):
                total_ok += 1
        print()

    print(f"=== done. {total_ok} new files downloaded ===")
    print("next: add the new folders to RAW_DIRS in load_to_chroma.py, then run:")
    print("      python -m backend.ingest.load_to_chroma")


if __name__ == "__main__":
    main()