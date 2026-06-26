# fetch_congress.py
# fetches immigration and housing bills from Congress.gov API and saves to JSON.

import os
import json
import requests
from dotenv import load_dotenv
from pathlib import Path
from datetime import date

load_dotenv('backend/.env')

OUTPUT_DIR = Path("data/raw/api/congress")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

API_KEY = os.environ.get("CONGRESS_API_KEY")
BASE_URL = "https://api.congress.gov/v3"
TODAY = str(date.today())

QUERIES = [
    {"query": "immigration asylum", "topic": "immigration"},
    {"query": "tenant rights housing", "topic": "housing"},
    {"query": "SNAP food assistance immigrants", "topic": "benefits"},
]


def fetch_bills(query: str, topic: str, limit: int = 10) -> list:
    if not API_KEY:
        raise ValueError("CONGRESS_API_KEY not set in environment")

    params = {
        "api_key": API_KEY,
        "query": query,
        "limit": limit,
        "sort": "updateDate+desc",
    }

    resp = requests.get(f"{BASE_URL}/bill", params=params, timeout=30)
    resp.raise_for_status()

    bills = []
    for bill in resp.json().get("bills", []):
        title = bill.get("title", "Untitled")
        action = bill.get("latestAction", {}).get("text", "")
        bills.append({
            "source_name": f"Congress.gov: {title}",
            "url": bill.get("url", ""),
            "topic": topic,
            "jurisdiction": "federal",
            "text": f"{title} {action}".strip(),
            "fetched_at": TODAY,
        })

    return bills


def run():
    all_results = []
    for q in QUERIES:
        print(f"fetching: {q['query']}")
        results = fetch_bills(q["query"], q["topic"])
        all_results.extend(results)
        print(f"  got {len(results)} bills")

    out_path = OUTPUT_DIR / f"bills_{TODAY}.json"
    with open(out_path, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"saved {len(all_results)} bills to {out_path}")


if __name__ == "__main__":
    run()