# Retrieval quality (Phase 2)

The corpus now spans five states plus federal veterans/work content, which makes
semantic search *dilute* more — the right chunk is often in the top 20 but not the
top 3. The roadmap's standard fix is **cross-encoder reranking**, now implemented
and **off by default** so nothing changes until you enable and measure it.

## Cross-encoder reranking

When `RERANK_ENABLED` is set, `retriever.search()` over-fetches a larger dense pool
(`k × RERANK_OVERFETCH`, default 8) and reorders it with a cross-encoder that scores
each `(query, chunk)` pair directly, then applies the per-source cap and takes the
top `k`. Safe by construction:

- The reported `score` stays the **dense cosine similarity**, so the `/ask`
  `MIN_SCORE` gate and the "corpus looks thin → web-check" logic keep their meaning.
  Reranking only changes *which* chunks reach the top `k`, not the numbers downstream
  reads.
- The cross-encoder ships with `sentence-transformers` (already a dependency); the
  model (`cross-encoder/ms-marco-MiniLM-L-6-v2` by default) downloads on first use.
  It's imported lazily and only built when enabled, so a deploy that leaves it off
  pays nothing.
- Locality still nudges: a matching-locality chunk gets `LOCALITY_RERANK_BONUS`
  (default 0.5, in cross-encoder-score space) added to its rerank score.

### Env knobs
| Var | Default | Meaning |
|---|---|---|
| `RERANK_ENABLED` | `0` (off) | turn reranking on |
| `RERANK_MODEL` | `cross-encoder/ms-marco-MiniLM-L-6-v2` | any `sentence-transformers` CrossEncoder; the roadmap suggests `bge-reranker-base` |
| `RERANK_OVERFETCH` | `8` | dense candidates to rerank = `k × this` |
| `LOCALITY_RERANK_BONUS` | `0.5` | locality nudge in rerank-score space |

### Measure it, don't assume it
The roadmap is explicit: measure after each retrieval change separately. Run the
benchmark both ways and compare — especially the adversarial-jurisdiction set,
which should not regress:

```bash
python scripts/eval.py                                   # baseline (dense only)
RERANK_ENABLED=1 python scripts/eval.py                  # with reranking
RERANK_ENABLED=1 python scripts/eval.py --set adversarial_jurisdiction
```

Keep it on only if the numbers move the right way. Tune `RERANK_OVERFETCH` and
`LOCALITY_RERANK_BONUS` against the eval, not intuition.

## Hybrid dense + BM25 (reciprocal rank fusion)

When `HYBRID_SEARCH` is set, `search()` retrieves two pools — dense (vector) and BM25
(lexical) — and fuses their rankings with reciprocal rank fusion. Legal queries carry
exact terms of art ("summary possession", "garnishment", "notice to quit") that
embeddings smear together; BM25 matches them literally. This is the roadmap's "usually
the single biggest jump for legal corpora."

The `MIN_SCORE` safety concern is handled by construction: **BM25 only affects ordering
(`_rank`); every fused candidate still reports its real dense cosine similarity as
`score`.** For a BM25-only hit (not in the dense pool), its embedding is fetched and the
cosine is computed on demand, so no candidate ever carries a fake score — the `/ask`
`MIN_SCORE` gate and the web-check thresholds keep their exact meaning. One honest
consequence: a BM25 hit whose semantic similarity is below `MIN_SCORE` (0.20) is still
filtered by `/ask` — hybrid rescues exact-term matches *within* the answerable band and
reorders them up, rather than forcing genuinely low-similarity chunks through. Lower
`MIN_SCORE` in `ask.py` if you want more lexical matches to survive.

It composes with reranking: hybrid supplies the candidate pool (recall), the reranker
orders it (precision). BM25 uses `rank-bm25` (added to `backend/requirements.txt`),
imported lazily so the default dense path never needs it.

### Env knobs
| Var | Default | Meaning |
|---|---|---|
| `HYBRID_SEARCH` | `0` (off) | turn hybrid dense+BM25 on |
| `HYBRID_POOL` | `50` | candidates pulled from each of dense / BM25 before fusion |
| `RRF_K` | `60` | reciprocal-rank-fusion constant |
| `HYBRID_LOCALITY_BONUS` | `0.02` | locality nudge in RRF-score space |

Measure it the same way (`HYBRID_SEARCH=1 python scripts/eval.py`, and the adversarial
set), and stack it with reranking (`HYBRID_SEARCH=1 RERANK_ENABLED=1 …`) once each is
independently confirmed to help.

## Chunk size by document type

`load_to_chroma.py` now sizes chunks by the source's `kind`: statutes and ordinances
get larger chunks (340 words / 60 overlap) so long enumerated provisions aren't split
mid-section, while plain-language guides keep the smaller default (220 / 40) that answers
focused questions best (`CHUNK_PROFILES` / `chunk_params_for`). A source with no `kind` —
every legacy Illinois sidecar — uses the default, so the existing corpus chunks exactly
as before; only the new statute sources (which carry `kind` from their verify CSVs) change.

## Not done yet (the next lever)
- **Back-translation eval** for the six languages is now built —
  `scripts/backtranslate_eval.py --lang pl` asks each question in English and in the
  target language, translates the answer back, and floor-checks that numbers, statute
  citations, and sources survived (with an optional `--judge` LLM fidelity score). It's a
  floor, not a ceiling — native review is still required.
