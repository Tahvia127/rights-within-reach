# load_to_chroma.py
# Reads .html/.pdf sources + .meta.json sidecars, chunks the text, embeds with
# sentence-transformers, and writes to a persistent Chroma collection ("rwr_docs").
# Rebuilds from scratch on every run so the count always matches what's on disk.

from __future__ import annotations

import json
import re
from pathlib import Path

import chromadb
import pdfplumber
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer

from backend.services.taxonomy import list_code_for, normalize_jurisdiction

# --- config ---

CHROMA_PATH = "data/chroma"
COLLECTION = "rwr_docs"
EMBED_MODEL = "all-MiniLM-L6-v2"  # 384-dim, fast, good for short legal text

CHUNK_WORDS = 220         # default target chunk size in words
CHUNK_OVERLAP_WORDS = 40  # words carried over between chunks for context

# Chunk size by document type. Statutory text has long enumerated provisions that
# lose meaning when split mid-section, so it wants larger chunks; plain-language
# guides answer best in smaller focused chunks. Keyed by the source's `kind`
# (statute, ordinance, agency_guide, court_guide, kyr_guide, org, directory,
# portal). A source with no `kind` — every legacy Illinois sidecar — uses the
# default, so the existing corpus chunks exactly as before.
CHUNK_PROFILES = {
    "statute": (340, 60),
    "ordinance": (340, 60),
}


def chunk_params_for(meta: dict) -> tuple[int, int]:
    """(target_words, overlap) for a source, by its document kind."""
    return CHUNK_PROFILES.get((meta.get("kind") or "").strip().lower(),
                              (CHUNK_WORDS, CHUNK_OVERLAP_WORDS))

# Missing folders are skipped silently.
RAW_DIRS = [
    Path("data/raw/api/congress"),
    Path("data/raw/api/federal_register"),
    Path("data/raw/api/benefits"),
    Path("data/raw/housing"),
    Path("data/raw/benefits"),
    Path("data/raw/money_debt"),
    Path("data/raw/housing_repair"),
    Path("data/raw/resources"),
    Path("data/raw/ca"),  # California + San Francisco sources (jurisdiction layer)
    Path("data/raw/mo"),  # Missouri + St. Louis sources (jurisdiction layer)
    Path("data/raw/tx"),  # Texas + Houston sources (jurisdiction layer)
    Path("data/raw/ny"),  # New York + NYC sources (jurisdiction layer)
    Path("data/raw/ve"),  # Veterans & Military (federal category)
    Path("data/raw/wo"),  # Work & Employment (federal + state labor)
]

# Tags stripped before extracting text from HTML.
DROP_TAGS = ["script", "style", "nav", "header", "footer", "noscript",
             "form", "aside", "svg", "button"]


# --- text extraction ---

def html_to_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(DROP_TAGS):
        tag.decompose()
    # Drop Google-Translate widgets and Bootstrap modals (nav/dialog chrome that
    # otherwise pollutes gov pages like ILGA's).
    for tag in soup.select('#google_translate_element, .skiptranslate, .modal, [class*="goog-te"]'):
        tag.decompose()
    # Prefer <main>, but fall back to the full body when <main> is only a thin
    # wrapper (e.g., ILGA's restructured site renders statute text outside <main>).
    main = soup.find("main")
    body = soup.body or soup
    main_txt = main.get_text(separator="\n") if main else ""
    body_txt = body.get_text(separator="\n")
    root_txt = body_txt if len(main_txt) < 0.6 * len(body_txt) else main_txt
    lines = [re.sub(r"[ \t]+", " ", ln).strip() for ln in root_txt.splitlines()]
    return "\n".join(ln for ln in lines if ln)


def pdf_to_text(path: Path) -> str:
    with pdfplumber.open(path) as pdf:
        raw = "\n".join(page.extract_text() or "" for page in pdf.pages)
    lines = [re.sub(r"[ \t]+", " ", ln).strip() for ln in raw.splitlines()]
    return "\n".join(ln for ln in lines if ln)


def chunk_text(text: str, chunk_words: int = CHUNK_WORDS,
               overlap_words: int = CHUNK_OVERLAP_WORDS) -> list[str]:
    words = text.split()
    if not words:
        return []
    step = max(1, chunk_words - overlap_words)
    chunks = []
    for start in range(0, len(words), step):
        chunk = " ".join(words[start:start + chunk_words])
        if chunk.strip():
            chunks.append(chunk)
        if start + chunk_words >= len(words):
            break
    return chunks


# --- discovery ---

def discover_pages() -> list[tuple[Path, dict]]:
    """Return (path, meta) for every .html/.pdf that has a .meta.json sidecar."""
    pages = []
    for folder in RAW_DIRS:
        if not folder.exists():
            continue
        for src in sorted(folder.glob("*.html")) + sorted(folder.glob("*.pdf")):
            if src.name.startswith("._"):  # skip macOS AppleDouble files
                continue
            meta_path = src.with_suffix(".meta.json")
            if not meta_path.exists():
                print(f"  WARN no sidecar for {src}, skipping")
                continue
            pages.append((src, json.loads(meta_path.read_text(encoding="utf-8"))))
    return pages


# --- main ---

def build() -> int:
    pages = discover_pages()
    print(f"found {len(pages)} source pages across {len(RAW_DIRS)} candidate folders\n")
    if not pages:
        print("nothing to ingest -- no html/meta pairs found.")
        return 0

    ids, documents, metadatas = [], [], []

    for src_path, meta in pages:
        slug = src_path.stem
        text = pdf_to_text(src_path) if src_path.suffix == ".pdf" \
               else html_to_text(src_path.read_text(encoding="utf-8", errors="replace"))
        cw, ov = chunk_params_for(meta)
        chunks = chunk_text(text, cw, ov)
        print(f"  {meta.get('topic', '?')}/{slug}: {len(chunks)} chunks "
              f"({len(text):,} chars, {cw}w)")
        # Jurisdiction layer: a clean (state, locality) pair and a LIST code,
        # derived from the sidecar so legacy Illinois files need no re-editing.
        state, locality = normalize_jurisdiction(meta)
        list_code = list_code_for(meta)
        for i, chunk in enumerate(chunks):
            ids.append(f"{slug}::{i}")
            documents.append(chunk)
            metadatas.append({
                "source_name": meta.get("source_name", slug),
                "url": meta.get("url", ""),
                "topic": meta.get("topic", ""),
                "jurisdiction": meta.get("jurisdiction", ""),
                "state": state,
                "locality": locality or "",
                "list_code": list_code,
                "priority": meta.get("priority", ""),
                "access_date": meta.get("access_date", ""),
                "chunk_index": i,
            })

    print(f"\nembedding {len(documents)} chunks with {EMBED_MODEL} ...")
    model = SentenceTransformer(EMBED_MODEL)
    embeddings = model.encode(
        documents, batch_size=64, show_progress_bar=True, convert_to_numpy=True
    ).tolist()

    # Rebuild collection from scratch.
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    try:
        client.delete_collection(COLLECTION)
    except Exception:
        pass
    collection = client.create_collection(COLLECTION, metadata={"hnsw:space": "cosine"})

    # Insert in batches of 500 (Chroma has a batch size cap).
    for s in range(0, len(ids), 500):
        collection.add(
            ids=ids[s:s + 500],
            embeddings=embeddings[s:s + 500],
            documents=documents[s:s + 500],
            metadatas=metadatas[s:s + 500],
        )

    total = collection.count()
    print(f"\n=== done. collection '{COLLECTION}' now has {total} chunks ===")
    return total


if __name__ == "__main__":
    build()