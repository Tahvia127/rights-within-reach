"""
parse_pdf.py
Extracts clean text from a saved PDF file.
Returns a dict with text and metadata loaded from the sidecar .meta.json.
"""

import json
import re
from pathlib import Path
from pypdf import PdfReader


def parse_pdf(pdf_path: str) -> dict:
    # turn the string path into a Path object so we can swap extensions easily
    path = Path(pdf_path)
    meta_path = path.with_suffix(".meta.json")

    # bail early if either required file is missing
    if not path.exists():
        raise FileNotFoundError(f"PDF file not found: {path}")
    if not meta_path.exists():
        raise FileNotFoundError(f"Meta file not found: {meta_path}")

    # load the metadata sidecar (source name, url, topic, jurisdiction)
    with open(meta_path) as f:
        meta = json.load(f)

    # open the pdf and extract text from each page into a list
    reader = PdfReader(str(path))
    pages = []
    for page in reader.pages:
        # extract_text() can return None on blank or image-only pages, so default to ""
        page_text = page.extract_text() or ""
        pages.append(page_text)

    # join all pages into one string
    text = " ".join(pages)
    # collapse runs of whitespace into one space
    text = re.sub(r"\s+", " ", text).strip()

    # return the clean text alongside the metadata fields we care about
    return {
        "text": text,
        "source_name": meta["source_name"],
        "url": meta["url"],
        "topic": meta["topic"],
        "jurisdiction": meta["jurisdiction"],
        "file_type": "pdf",
    }


if __name__ == "__main__":
    import sys
    # take the pdf file path from the command line and print a quick summary
    result = parse_pdf(sys.argv[1])
    print(f"source: {result['source_name']}")
    print(f"chars:  {len(result['text'])}")
    print(f"preview: {result['text'][:300]}")