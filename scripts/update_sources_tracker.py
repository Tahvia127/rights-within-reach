# update_sources_tracker.py
# Refreshes data/rights_sources.csv from the real state of the corpus.
# Sets status (live/thin/empty/dead), chunk_count, and last_checked for each row.
# Also adds rows for any source on disk not yet in the CSV.
#
# Run from project root:
#   python scripts/update_sources_tracker.py

from __future__ import annotations

import csv
import json
import re
from collections import Counter
from datetime import date
from pathlib import Path

import chromadb

CSV = Path("data/rights_sources.csv")
RAW = Path("data/raw")
TODAY = date.today().isoformat()
THIN_CHARS = 400

COLUMNS = ["source_name", "url", "topic", "jurisdiction", "priority", "status",
           "date_ingested", "chunk_count", "last_checked", "permission_status", "notes"]


def slugify(name: str) -> str:
    name = re.sub(r"[^a-z0-9\s-]", "", name.lower())
    return re.sub(r"\s+", "-", name).strip("-")[:60]


def corpus_stats() -> dict[str, dict]:
    """Return chunk count and total chars per source_name from Chroma."""
    col = chromadb.PersistentClient(path="data/chroma").get_collection("rwr_docs")
    got = col.get(include=["metadatas", "documents"])
    stats: dict[str, dict] = {}
    for md, doc in zip(got["metadatas"], got["documents"]):
        s = stats.setdefault(md.get("source_name", ""), {"chunks": 0, "chars": 0})
        s["chunks"] += 1
        s["chars"] += len(doc or "")
    return stats


def file_for(topic: str, slug: str) -> Path | None:
    for ext in (".html", ".pdf"):
        p = RAW / topic / f"{slug}{ext}"
        if p.exists():
            return p
    return None


def status_for(has_file: bool, chunks: int, chars: int) -> str:
    if not has_file: return "dead"
    if chunks == 0:  return "empty"
    if chars < THIN_CHARS: return "thin"
    return "live"


def disk_sources() -> set[str]:
    """Return source_names that have a downloaded file on disk."""
    names = set()
    for meta_path in RAW.glob("*/*.meta.json"):
        if meta_path.name.startswith("._"):
            continue
        slug = meta_path.name[:-len(".meta.json")]
        if file_for(meta_path.parent.name, slug) is None:
            continue
        try:
            names.add(json.loads(meta_path.read_text(encoding="utf-8")).get("source_name", ""))
        except Exception:
            continue
    return names


def main() -> None:
    stats = corpus_stats()
    on_disk = disk_sources()
    rows = list(csv.DictReader(open(CSV)))
    seen_names = {r["source_name"] for r in rows}

    # refresh existing rows
    for r in rows:
        st = stats.get(r["source_name"], {"chunks": 0, "chars": 0})
        r["chunk_count"] = st["chunks"]
        r["status"] = status_for(r["source_name"] in on_disk, st["chunks"], st["chars"])
        r["last_checked"] = TODAY
        if r["status"] == "live":
            r["date_ingested"] = TODAY
        r.setdefault("permission_status", "")

    # add rows for sources on disk not yet in the CSV
    for meta_path in sorted(RAW.glob("*/*.meta.json")):
        if meta_path.name.startswith("._"):
            continue
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        name = meta.get("source_name", "")
        if not name or name in seen_names:
            continue
        seen_names.add(name)
        slug = meta_path.name[:-len(".meta.json")]
        topic = meta.get("topic", meta_path.parent.name)
        st = stats.get(name, {"chunks": 0, "chars": 0})
        rows.append({
            "source_name": name,
            "url": meta.get("url", ""),
            "topic": topic,
            "jurisdiction": meta.get("jurisdiction", ""),
            "priority": meta.get("priority", ""),
            "status": status_for(file_for(topic, slug) is not None, st["chunks"], st["chars"]),
            "date_ingested": TODAY if st["chunks"] else "",
            "chunk_count": st["chunks"],
            "last_checked": TODAY,
            "permission_status": "",
            "notes": meta.get("notes", ""),
        })

    # write back
    with open(CSV, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow({c: r.get(c, "") for c in COLUMNS})

    by_status = Counter(r["status"] for r in rows)
    print(f"wrote {len(rows)} sources to {CSV}")
    for s in ("live", "thin", "empty", "dead"):
        if by_status.get(s):
            print(f"  {s:<6} {by_status[s]}")


if __name__ == "__main__":
    main()