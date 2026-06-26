# parse_html.py
# Extracts clean text from a saved HTML file and its .meta.json sidecar.

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

# tags with no useful content
NOISE_TAGS = ["script", "style", "nav", "footer", "header", "aside", "noscript"]


def parse_html(html_path: str) -> dict:
    path = Path(html_path)
    meta_path = path.with_suffix(".meta.json")

    if not path.exists():
        raise FileNotFoundError(f"HTML file not found: {path}")
    if not meta_path.exists():
        raise FileNotFoundError(f"Meta file not found: {meta_path}")

    with open(meta_path) as f:
        meta = json.load(f)

    with open(path, encoding="utf-8", errors="replace") as f:
        soup = BeautifulSoup(f, "lxml")

    for tag in soup(NOISE_TAGS):
        tag.decompose()

    # collapse all whitespace into single spaces
    text = re.sub(r"\s+", " ", soup.get_text(separator=" ")).strip()

    return {
        "text": text,
        "source_name": meta["source_name"],
        "url": meta["url"],
        "topic": meta["topic"],
        "jurisdiction": meta["jurisdiction"],
        "file_type": "html",
    }


if __name__ == "__main__":
    import sys
    result = parse_html(sys.argv[1])
    print(f"source: {result['source_name']}")
    print(f"chars:  {len(result['text'])}")
    print(f"preview: {result['text'][:300]}")