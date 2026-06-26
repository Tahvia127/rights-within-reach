# retriever.py
# Shared vector search over the Chroma "rwr_docs" collection.
# Model and collection load once at startup and reuse across all requests.

from __future__ import annotations

from functools import lru_cache

import chromadb
from sentence_transformers import SentenceTransformer

CHROMA_PATH = "data/chroma"
COLLECTION = "rwr_docs"
EMBED_MODEL = "all-MiniLM-L6-v2"  # must match the model used in load_to_chroma.py
MAX_PER_SOURCE = 1  # max chunks per document to keep source diversity
OVERFETCH = 6       # fetch k*OVERFETCH candidates before applying the cap


@lru_cache(maxsize=1)
def _model() -> SentenceTransformer:
    return SentenceTransformer(EMBED_MODEL)


@lru_cache(maxsize=1)
def _collection():
    return chromadb.PersistentClient(path=CHROMA_PATH).get_collection(COLLECTION)


def warmup() -> None:
    """Load the model and collection at app startup."""
    _model()
    _collection()


def search(query: str, k: int = 5, topic: str | None = None) -> list[dict]:
    """Return top-k chunks for a query, optionally filtered by topic.

    Each result has: source_name, url, topic, jurisdiction, text, score (0-1).
    """
    query = (query or "").strip()
    if not query:
        return []

    collection = _collection()
    fetch_n = min(k * OVERFETCH, collection.count())
    res = collection.query(
        query_embeddings=_model().encode([query]).tolist(),
        n_results=fetch_n,
        where={"topic": topic} if topic else None,
        include=["documents", "metadatas", "distances"],
    )

    results: list[dict] = []
    per_source: dict[str, int] = {}
    for doc, md, dist in zip(res["documents"][0], res["metadatas"][0], res["distances"][0]):
        key = md.get("url") or md.get("source_name", "")
        if per_source.get(key, 0) >= MAX_PER_SOURCE:
            continue
        per_source[key] = per_source.get(key, 0) + 1
        results.append({
            "source_name": md.get("source_name", ""),
            "url": md.get("url", ""),
            "topic": md.get("topic", ""),
            "jurisdiction": md.get("jurisdiction", ""),
            "text": doc,
            "score": round(max(0.0, 1.0 - dist), 4),  # cosine distance -> similarity
        })
        if len(results) >= k:
            break
    return results