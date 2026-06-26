# remove_immigration.py
# One-time script to remove all immigration content from the project:
#   1. Deletes immigration docs from Chroma
#   2. Removes data/raw/immigration/
#   3. Rewrites the sources CSV without immigration rows
#
# Run from project root:
#   python scripts/remove_immigration.py

import csv
import shutil
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions

CHROMA_PATH = Path("data/chroma")
IMMIGRATION_DIR = Path("data/raw/immigration")
SOURCES_CSV = Path("data/rights_sources.csv")
SOURCES_CSV_BACKUP = Path("data/rights_sources.backup.csv")


def remove_from_chroma() -> int:
    if not CHROMA_PATH.exists():
        print("no chroma store found, skipping")
        return 0

    embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))
    collection = client.get_or_create_collection(name="rwr_docs", embedding_function=embed_fn)

    ids = collection.get(where={"topic": "immigration"}).get("ids", [])
    if not ids:
        print("no immigration documents found in chroma")
        return 0

    collection.delete(ids=ids)
    print(f"deleted {len(ids)} immigration documents from chroma")
    return len(ids)


def remove_raw_files() -> int:
    if not IMMIGRATION_DIR.exists():
        print("no immigration raw folder, skipping")
        return 0

    count = sum(1 for f in IMMIGRATION_DIR.rglob("*") if f.is_file())
    shutil.rmtree(IMMIGRATION_DIR)
    print(f"removed {count} files from data/raw/immigration/")
    return count


def rewrite_sources_csv() -> int:
    if not SOURCES_CSV.exists():
        print("no sources csv found, skipping")
        return 0

    shutil.copy(SOURCES_CSV, SOURCES_CSV_BACKUP)
    print(f"backed up original csv to {SOURCES_CSV_BACKUP}")

    with open(SOURCES_CSV) as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = [r for r in reader if r.get("topic", "").lower() != "immigration"]

    removed = sum(1 for _ in open(SOURCES_CSV)) - len(rows) - 1
    with open(SOURCES_CSV, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"removed {removed} immigration rows from sources csv")
    return removed


def main():
    print("=== removing immigration content from rights within reach ===\n")
    chroma_count = remove_from_chroma()
    file_count = remove_raw_files()
    csv_count = rewrite_sources_csv()
    print(f"\n=== summary ===")
    print(f"chroma docs deleted:  {chroma_count}")
    print(f"raw files removed:    {file_count}")
    print(f"csv rows removed:     {csv_count}")
    print("\ndone.")


if __name__ == "__main__":
    main()