# fetch_federal_register.py
# Fetches rules and notices from the Federal Register API and saves to JSON.

import json
import requests
from pathlib import Path
from datetime import date

OUTPUT_DIR = Path("data/raw/api/federal_register")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BASE_URL = "https://www.federalregister.gov/api/v1/documents.json"
TODAY = str(date.today())

QUERIES = [
    {"query": "asylum immigration", "topic": "immigration"},
    {"query": "tenant housing assistance", "topic": "housing"},
    {"query": "SNAP benefits eligibility", "topic": "benefits"},
]


def fetch_documents(query: str, topic: str, per_page: int = 10) -> list:
    params = {
        "query": query,
        "per_page": per_page,
        "order": "newest",
        "fields[]": ["title", "abstract", "html_url", "publication_date", "document_number"],
    }

    resp = requests.get(BASE_URL, params=params, timeout=30)
    resp.raise_for_status()

    docs = []
    for item in resp.json().get("results", []):
        title = item.get("title", "Untitled")
        abstract = item.get("abstract", "")
        docs.append({
            "source_name": f"Federal Register: {title}",
            "url": item.get("html_url", ""),
            "topic": topic,
            "jurisdiction": "federal",
            "text": f"{title} {abstract}".strip(),
            "fetched_at": TODAY,
        })

    return docs


def run():
    all_results = []
    for q in QUERIES:
        print(f"fetching: {q['query']}")
        results = fetch_documents(q["query"], q["topic"])
        all_results.extend(results)
        print(f"  got {len(results)} documents")

    out_path = OUTPUT_DIR / f"documents_{TODAY}.json"
    with open(out_path, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"saved {len(all_results)} documents to {out_path}")


if __name__ == "__main__":
    run()