"""
remove_immigration.py
One-time cleanup script to remove all immigration content from the project.

Run from project root:
    python scripts/remove_immigration.py

This will:
1. Delete immigration documents from the Chroma collection
2. Remove the data/raw/immigration/ folder
3. Rewrite the sources CSV without immigration rows
4. Print a summary of what was removed
"""

import csv
import shutil
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions

# config
CHROMA_PATH = Path("data/chroma")
IMMIGRATION_DIR = Path("data/raw/immigration")
SOURCES_CSV = Path("data/rights_sources.csv")
SOURCES_CSV_BACKUP = Path("data/rights_sources.backup.csv")


def remove_from_chroma() -> int:
    # delete all documents tagged with topic == immigration
    if not CHROMA_PATH.exists():
        print("no chroma store found, skipping")
        return 0

    embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))
    collection = client.get_or_create_collection(
        name="rwr_docs",
        embedding_function=embed_fn,
    )

    # find every doc with immigration topic
    matches = collection.get(where={"topic": "immigration"})
    ids_to_delete = matches.get("ids", [])

    if not ids_to_delete:
        print("no immigration documents found in chroma")
        return 0

    collection.delete(ids=ids_to_delete)
    print(f"deleted {len(ids_to_delete)} immigration documents from chroma")
    return len(ids_to_delete)


def remove_raw_files() -> int:
    # delete the entire immigration raw data folder
    if not IMMIGRATION_DIR.exists():
        print("no immigration raw folder, skipping")
        return 0

    file_count = sum(1 for _ in IMMIGRATION_DIR.rglob("*") if _.is_file())
    shutil.rmtree(IMMIGRATION_DIR)
    print(f"removed {file_count} files from data/raw/immigration/")
    return file_count


def rewrite_sources_csv() -> int:
    # back up the original and write a new csv without immigration rows
    if not SOURCES_CSV.exists():
        print("no sources csv found, skipping")
        return 0

    shutil.copy(SOURCES_CSV, SOURCES_CSV_BACKUP)
    print(f"backed up original csv to {SOURCES_CSV_BACKUP}")

    with open(SOURCES_CSV) as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = [r for r in reader if r.get("topic", "").lower() != "immigration"]

    removed_count = sum(1 for _ in open(SOURCES_CSV)) - len(rows) - 1
    with open(SOURCES_CSV, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"removed {removed_count} immigration rows from sources csv")
    return removed_count


def main():
    print("=== removing immigration content from rights within reach ===\n")
    chroma_count = remove_from_chroma()
    file_count = remove_raw_files()
    csv_count = rewrite_sources_csv()
    print("\n=== summary ===")
    print(f"chroma docs deleted:  {chroma_count}")
    print(f"raw files removed:    {file_count}")
    print(f"csv rows removed:     {csv_count}")
    print("\ndone. immigration content has been removed.")


if __name__ == "__main__":
    main()
