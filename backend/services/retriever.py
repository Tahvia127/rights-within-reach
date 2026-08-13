# retriever.py
# Shared vector search over the Chroma "rwr_docs" collection.
# Model and collection load once at startup and reuse across all requests.

from __future__ import annotations

import os
import re
from functools import lru_cache

import chromadb
from sentence_transformers import SentenceTransformer

CHROMA_PATH = "data/chroma"
COLLECTION = "rwr_docs"
EMBED_MODEL = "all-MiniLM-L6-v2"  # must match the model used in load_to_chroma.py
MAX_PER_SOURCE = 1  # max chunks per document to keep source diversity
OVERFETCH = 6       # fetch k*OVERFETCH candidates before applying the cap
LOCALITY_BOOST = 0.05  # nudge a matching-locality chunk above a statewide one

# --- Optional cross-encoder reranking (Phase 2 retrieval quality) -----------
# Off by default so nothing changes until you enable + measure it. When on, we
# over-fetch a bigger dense pool and reorder it by a cross-encoder relevance
# score (the standard fix for "the right chunk was in the top 20 but not the top
# 3"). The reported `score` stays the dense similarity, so the /ask MIN_SCORE
# gate is unaffected — reranking only changes WHICH chunks reach the top k.
RERANK_ENABLED = os.getenv("RERANK_ENABLED", "0").lower() not in ("0", "false", "no", "off", "")
RERANK_MODEL = os.getenv("RERANK_MODEL", "cross-encoder/ms-marco-MiniLM-L-6-v2")
RERANK_OVERFETCH = int(os.getenv("RERANK_OVERFETCH", "8"))  # k*this candidates to rerank
LOCALITY_RERANK_BONUS = float(os.getenv("LOCALITY_RERANK_BONUS", "0.5"))  # in cross-encoder score space

# --- Optional hybrid dense + BM25 retrieval (Phase 2) -----------------------
# Off by default. Legal queries carry exact terms of art ("summary possession",
# "garnishment", "notice to quit") that embeddings smear together; BM25 catches
# them, and reciprocal rank fusion (RRF) blends the two rankings. Safety: BM25
# only affects ORDERING — every fused candidate still reports its real dense
# cosine similarity as `score` (computed on demand for BM25-only hits), so the
# /ask MIN_SCORE gate keeps its meaning. Compose with reranking: hybrid builds
# the candidate pool (recall), the reranker orders it (precision).
HYBRID_ENABLED = os.getenv("HYBRID_SEARCH", "0").lower() not in ("0", "false", "no", "off", "")
HYBRID_POOL = int(os.getenv("HYBRID_POOL", "50"))  # candidates pulled from each of dense / BM25
RRF_K = int(os.getenv("RRF_K", "60"))              # reciprocal-rank-fusion constant
HYBRID_LOCALITY_BONUS = float(os.getenv("HYBRID_LOCALITY_BONUS", "0.02"))  # in RRF-score space

_TOKEN = re.compile(r"[a-z0-9]+")


def _tok(text: str) -> list[str]:
    return _TOKEN.findall((text or "").lower())


@lru_cache(maxsize=1)
def _model() -> SentenceTransformer:
    return SentenceTransformer(EMBED_MODEL)


@lru_cache(maxsize=1)
def _reranker():
    """Cross-encoder for reranking. Imported lazily and only built when
    RERANK_ENABLED, so the dependency and the model load cost are never paid
    otherwise. CrossEncoder ships with sentence-transformers (already a dep)."""
    from sentence_transformers import CrossEncoder
    return CrossEncoder(RERANK_MODEL)


@lru_cache(maxsize=1)
def _corpus() -> tuple[list[str], list[str], list[dict]]:
    """All (ids, documents, metadatas), loaded once for the BM25 index. Order is
    stable, so a corpus index lines up with the BM25 index built from it."""
    got = _collection().get(include=["documents", "metadatas"])
    return got["ids"], got["documents"], got["metadatas"]


@lru_cache(maxsize=1)
def _bm25():
    """Lexical BM25 index over the corpus. rank_bm25 is imported lazily and only
    built when HYBRID_ENABLED, so it is never required for the default dense path."""
    from rank_bm25 import BM25Okapi
    _, docs, _ = _corpus()
    return BM25Okapi([_tok(d) for d in docs])


def _cos(a, b) -> float:
    import numpy as np
    va, vb = np.asarray(a, dtype=float), np.asarray(b, dtype=float)
    denom = float(np.linalg.norm(va) * np.linalg.norm(vb)) or 1.0
    return float(va.dot(vb) / denom)


def _match(md: dict, topic: str | None, state: str | None) -> bool:
    """Python-side mirror of _where(), for filtering BM25 hits by metadata."""
    if topic and md.get("topic") != topic:
        return False
    if state and _has_state_field() and md.get("state") not in ("federal", state):
        return False
    return True


@lru_cache(maxsize=1)
def _collection():
    return chromadb.PersistentClient(path=CHROMA_PATH).get_collection(COLLECTION)


@lru_cache(maxsize=1)
def _has_state_field() -> bool:
    """True once the corpus has been re-ingested with the jurisdiction layer.

    Guards against a partial deploy: if the backend ships state filtering before
    the corpus is rebuilt, no chunk has a `state` key and a state `where` clause
    would match nothing — turning every answer into a refusal. Sampling one chunk
    lets us silently skip the filter until the re-ingest lands. Order the deploy
    corpus-first and this always returns True in production.
    """
    try:
        sample = _collection().get(limit=1, include=["metadatas"])
        metas = sample.get("metadatas") or []
        return bool(metas) and "state" in (metas[0] or {})
    except Exception:
        return False


def warmup() -> None:
    """Load the model and collection at app startup."""
    _model()
    _collection()
    if RERANK_ENABLED:
        _reranker()  # pay the model load at startup, not on the first query
    if HYBRID_ENABLED:
        _bm25()       # build the BM25 index up front, not on the first query


def _where(topic: str | None, state: str | None) -> dict | None:
    """Build the Chroma metadata filter. Topic narrows the screen; state keeps a
    query inside `federal` + the user's own state, never a sibling state's law."""
    conditions: list[dict] = []
    if topic:
        conditions.append({"topic": topic})
    if state and _has_state_field():
        # Federal content is shared across states; the user's state is additive.
        conditions.append({"$or": [{"state": "federal"}, {"state": state}]})
    if not conditions:
        return None
    return conditions[0] if len(conditions) == 1 else {"$and": conditions}


def _cand(md: dict, doc: str, sim: float, rank: float) -> dict:
    """Build one result dict. `sim` is always the dense cosine similarity (the
    reported `score`); `rank` is whatever ordering strategy is in play."""
    return {
        "source_name": md.get("source_name", ""),
        "url": md.get("url", ""),
        "topic": md.get("topic", ""),
        "jurisdiction": md.get("jurisdiction", ""),
        "state": md.get("state", ""),
        "locality": md.get("locality") or "",
        "list_code": md.get("list_code", ""),
        "text": doc,
        "score": round(max(0.0, sim), 4),
        "_rank": rank,
    }


def _dense_candidates(q_emb, k, topic, state, locality) -> list[dict]:
    """The default path: pure dense vector search, ranked by similarity with the
    locality nudge. Unchanged from before hybrid/rerank existed."""
    collection = _collection()
    overfetch = RERANK_OVERFETCH if RERANK_ENABLED else OVERFETCH
    fetch_n = min(k * overfetch, collection.count())
    res = collection.query(
        query_embeddings=q_emb, n_results=fetch_n, where=_where(topic, state),
        include=["documents", "metadatas", "distances"],
    )
    out = []
    for doc, md, dist in zip(res["documents"][0], res["metadatas"][0], res["distances"][0]):
        sim = max(0.0, 1.0 - dist)
        loc = md.get("locality") or ""
        rank = sim + (LOCALITY_BOOST if locality and loc == locality else 0.0)
        out.append(_cand(md, doc, sim, rank))
    return out


def _hybrid_candidates(query, q_emb, k, topic, state, locality) -> list[dict]:
    """Dense + BM25 fused with reciprocal rank fusion. BM25 only affects ordering
    (`_rank`); every candidate still reports its real dense cosine similarity as
    `score`, computed on demand for BM25-only hits."""
    collection = _collection()
    n = min(HYBRID_POOL, collection.count())

    # Dense pool.
    res = collection.query(
        query_embeddings=q_emb, n_results=n, where=_where(topic, state),
        include=["documents", "metadatas", "distances"],
    )
    info: dict[str, tuple] = {}          # id -> (doc, md, dense_similarity)
    dense_rank: dict[str, int] = {}
    for r, (id_, doc, md, dist) in enumerate(
            zip(res["ids"][0], res["documents"][0], res["metadatas"][0], res["distances"][0])):
        info[id_] = (doc, md, max(0.0, 1.0 - dist))
        dense_rank[id_] = r

    # BM25 pool, filtered to the same jurisdiction/topic in Python.
    ids_all, _, metas_all = _corpus()
    scores = _bm25().get_scores(_tok(query))
    order = sorted(range(len(ids_all)), key=lambda i: scores[i], reverse=True)
    q_vec = q_emb[0]
    bm25_rank: dict[str, int] = {}
    missing: list[int] = []
    for i in order:
        if not _match(metas_all[i], topic, state):
            continue
        id_ = ids_all[i]
        if id_ in bm25_rank:
            continue
        bm25_rank[id_] = len(bm25_rank)
        if id_ not in info:
            missing.append(i)
        if len(bm25_rank) >= n:
            break

    # A BM25-only hit has no dense score yet — fetch its embedding and compute one,
    # so `score` stays a real similarity and the MIN_SCORE gate still applies.
    if missing:
        got = collection.get(ids=[ids_all[i] for i in missing],
                             include=["documents", "metadatas", "embeddings"])
        for id_, doc, md, emb in zip(got["ids"], got["documents"], got["metadatas"], got["embeddings"]):
            info[id_] = (doc, md, _cos(q_vec, emb))

    out = []
    for id_, (doc, md, sim) in info.items():
        rrf = 0.0
        if id_ in dense_rank:
            rrf += 1.0 / (RRF_K + dense_rank[id_] + 1)
        if id_ in bm25_rank:
            rrf += 1.0 / (RRF_K + bm25_rank[id_] + 1)
        loc = md.get("locality") or ""
        rank = rrf + (HYBRID_LOCALITY_BONUS if locality and loc == locality else 0.0)
        out.append(_cand(md, doc, sim, rank))
    return out


def search(query: str, k: int = 5, topic: str | None = None,
           state: str | None = None, locality: str | None = None) -> list[dict]:
    """Return top-k chunks for a query.

    topic    -- optional corpus topic filter (housing, benefits, ...).
    state    -- optional jurisdiction filter; keeps results to `federal` + this
                state. Applied only once the corpus carries the field (see
                _has_state_field), so it is safe to pass before a re-ingest.
    locality -- optional locality (e.g. "chicago", "san_francisco"); does not
                filter, but boosts a matching-locality chunk so a local ordinance
                can outrank a statewide statute where it is more protective.

    Each result has: source_name, url, topic, jurisdiction, state, locality,
    list_code, text, score (0-1).
    """
    query = (query or "").strip()
    if not query:
        return []

    q_emb = _model().encode([query]).tolist()  # [[...]] — one embedding
    if HYBRID_ENABLED:
        candidates = _hybrid_candidates(query, q_emb, k, topic, state, locality)
    else:
        candidates = _dense_candidates(q_emb, k, topic, state, locality)

    # Optional rerank: replace the ordering with a cross-encoder relevance score
    # (plus a locality nudge in that score's space). `score` is left as the dense
    # similarity, so downstream MIN_SCORE thresholds keep their meaning. Composes
    # with hybrid: hybrid supplies the pool, the reranker orders it.
    if RERANK_ENABLED and candidates:
        ce_scores = _reranker().predict([(query, c["text"]) for c in candidates])
        for c, s in zip(candidates, ce_scores):
            bonus = LOCALITY_RERANK_BONUS if locality and c["locality"] == locality else 0.0
            c["_rank"] = float(s) + bonus

    # Locality boost / RRF / rerank can reorder neighbors, so rank before the cap.
    candidates.sort(key=lambda c: c["_rank"], reverse=True)

    results: list[dict] = []
    per_source: dict[str, int] = {}
    for c in candidates:
        key = c["url"] or c["source_name"]
        if per_source.get(key, 0) >= MAX_PER_SOURCE:
            continue
        per_source[key] = per_source.get(key, 0) + 1
        c.pop("_rank", None)
        results.append(c)
        if len(results) >= k:
            break
    return results
