"""
parse_html.py
Extracts clean text from a saved HTML file.
Returns a dict with text and metadata loaded from the sidecar .meta.json.
"""

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup


# tags we don't want text from (navigation, ads, boilerplate, etc.)
NOISE_TAGS = ["script", "style", "nav", "footer", "header", "aside", "noscript"]


def parse_html(html_path: str) -> dict:
    # turn the string path into a Path object so we can swap extensions easily
    path = Path(html_path)
    meta_path = path.with_suffix(".meta.json")

    # bail early if either required file is missing
    if not path.exists():
        raise FileNotFoundError(f"HTML file not found: {path}")
    if not meta_path.exists():
        raise FileNotFoundError(f"Meta file not found: {meta_path}")

    # load the metadata sidecar (source name, url, topic, jurisdiction)
    with open(meta_path) as f:
        meta = json.load(f)

    # parse the html, replacing any unreadable bytes instead of crashing
    with open(path, encoding="utf-8", errors="replace") as f:
        soup = BeautifulSoup(f, "lxml")

    # remove all noise tags so their text doesn't end up in our output
    for tag in soup(NOISE_TAGS):
        tag.decompose()

    # pull all remaining text out of the page, joined by spaces
    text = soup.get_text(separator=" ")
    # collapse runs of whitespace (newlines, tabs, double spaces) into one space
    text = re.sub(r"\s+", " ", text).strip()

    # return the clean text alongside the metadata fields we care about
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
    # take the html file path from the command line and print a quick summary
    result = parse_html(sys.argv[1])
    print(f"source: {result['source_name']}")
    print(f"chars:  {len(result['text'])}")
    print(f"preview: {result['text'][:300]}")