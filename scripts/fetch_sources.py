# fetch_sources.py
# Downloads URLs from a sources CSV to data/raw/<topic>/<slug>.html
# with a .meta.json sidecar. Works for any topic.
#
# Usage:
#   python scripts/fetch_sources.py [path/to/sources.csv]

from __future__ import annotations

import csv
import json
import re
import sys
from datetime import date
from pathlib import Path

import requests
from bs4 import BeautifulSoup

RAW = Path("data/raw")
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
DROP = ["script", "style", "nav", "header", "footer", "noscript", "aside"]


def slugify(name: str) -> str:
    name = re.sub(r"[^a-z0-9\s-]", "", name.lower())
    return re.sub(r"\s+", "-", name).strip("-")[:60]


def text_chars(html: str) -> int:
    soup = BeautifulSoup(html, "html.parser")
    for t in soup(DROP):
        t.decompose()
    for t in soup.select('#google_translate_element, .skiptranslate, .modal, [class*="goog-te"]'):
        t.decompose()
    main = soup.find("main")
    body = soup.body or soup
    main_txt = main.get_text(" ") if main else ""
    body_txt = body.get_text(" ")
    root_txt = body_txt if len(main_txt) < 0.6 * len(body_txt) else main_txt
    return len(re.sub(r"\s+", " ", root_txt).strip())


def main() -> None:
    csv_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("data/new_sources.csv")
    rows = list(csv.DictReader(open(csv_path)))
    print(f"fetching {len(rows)} sources from {csv_path}\n")

    for r in rows:
        topic, name, url = r["topic"], r["source_name"], r["url"]
        folder = RAW / topic
        folder.mkdir(parents=True, exist_ok=True)
        slug = slugify(name)

        try:
            resp = requests.get(url, headers=HEADERS, timeout=25)
            resp.raise_for_status()
        except Exception as e:
            print(f"  DEAD   {topic}/{slug}: {str(e)[:60]}")
            continue

        (folder / f"{slug}.html").write_text(resp.text, encoding="utf-8")
        (folder / f"{slug}.meta.json").write_text(json.dumps({
            "source_name": name,
            "url": url,
            "topic": topic,
            "jurisdiction": r.get("jurisdiction", ""),
            "priority": r.get("priority", ""),
            "downloaded_at": date.today().isoformat(),
            "file_type": "html",
            "notes": r.get("notes", ""),
        }, indent=2))

        chars = text_chars(resp.text)
        print(f"  {'THIN' if chars < 400 else 'live':<6} {topic}/{slug}: {chars:,} chars")


if __name__ == "__main__":
    main()