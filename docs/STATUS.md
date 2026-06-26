# Rights Within Reach — Actual Project Status

_Snapshot: 2026-06-23. This reflects what is **actually in this repo on disk**, not what the
web-chat narrative implied. Reconciled against `RWR_Master_Checklist.md`._

## TL;DR

The web chat said *"Chroma has 68 docs, /search works, /ask working."*
**That code is not in this repo.** Those files were generated as downloadable artifacts and were
never saved here. What actually exists is: immigration removed, the sources CSV, and a partial
download of new HTML. Everything from the Chroma loader onward still needs to be written.

The real blocker: **`backend/ingest/load_to_chroma.py` does not exist.** Checklist Step 4 assumes
you just "add two lines to `RAW_DIRS`" — but there is no loader file to edit. It must be written
from scratch before anything can be ingested or searched.

## What is actually done

-  **Immigration removed** — committed (`07e7554`); `scripts/remove_immigration.py` present.
-  **Sources CSV** — `data/rights_sources.csv` exists (~5 KB).
-  **Backend skeleton** — `backend/main.py` has a `/health` endpoint only.
-  **Frontend skeleton** — default Vite + React + TS app builds; placeholder home.
-  **Env config** — `backend/.env.example` template + `backend/tests/test_env.py`.
-  **Repo hygiene** — root `.gitignore` added; ~73 tracked `._`/cache files removed from git
  (2026-06-23 cleanup). Note: the OS keeps regenerating `._` files on this external drive.

## What is missing (despite the checklist implying otherwise)

| Thing | Checklist ref | Reality |
|---|---|---|
| Chroma loader `load_to_chroma.py` | Step 4 | **Does not exist** — `backend/ingest/` is empty (`.gitkeep` only) |
| Chroma DB `data/chroma/` | Step 4 | **Does not exist** — no vector store, no "68 docs" |
| `/search` endpoint | Step 5 | **Does not exist** — `main.py` has only `/health` |
| `/ask` endpoint `backend/api/ask.py` | Steps 6–8 | **Does not exist** — `backend/api/` is empty (`.gitkeep` only) |
| Benchmark `benchmark.json` + `scripts/eval.py` | Steps 9–10 | **Do not exist** |
| Translation layer `backend/lib/translate.py` | Step 11 | **Does not exist** — no `backend/lib/` |
| Frontend `Home.tsx`/`Chat.tsx`/`api.ts`/`translations.ts` | Step 13 | **Do not exist** — no `src/components/`, no `src/lib/` |

## Data status

- **Downloaded (real HTML + `.meta.json` sidecars):**
  - `data/raw/money_debt/` — 8 pairs _(checklist expected 12 — partial download)_
  - `data/raw/housing_repair/` — 10 pairs _(checklist expected 17 — partial download)_
- **Empty (`.gitkeep` only):** `data/raw/housing/`, `data/raw/benefits/`, `data/raw/api/`,
  `data/raw/immigration/`, `data/eval/`. So the only ingestable content you have is the
  money_debt + housing_repair HTML just downloaded.

## Corrected next steps (real order)

1. **(Optional) Re-run the download** — `python scripts/download_new_sources.py` — to recover the
   missing money_debt/housing_repair pages, and spot-check a file is real HTML not an error page.
2. **Write the Chroma loader from scratch** — `backend/ingest/load_to_chroma.py`. It must:
   read `.html` files + their `.meta.json` sidecars from the `RAW_DIRS`, chunk the text, embed
   with `sentence-transformers`, and write to a `PersistentClient(path="data/chroma")` collection
   `rwr_docs`. (Checklist Step 4's "add two lines" only applies *after* this file exists.)
3. **Build `/search`** — wire a retrieval endpoint into `main.py` (or `backend/api/search.py`).
4. **Build `/ask`** — `backend/api/ask.py` with CLINIC's guardrails (no individualized advice,
   citations required, disclaimer, refuse immigration/criminal/family-law with hotline). Needs
   `ANTHROPIC_API_KEY` in `backend/.env`.
5. **Benchmark** — `data/eval/benchmark.json` (30 Q&A) + `scripts/eval.py`.
6. **Frontend** — components/lib files, then visual identity (font + palette via Canva — owner's
   own task).

## Housekeeping notes

- **AppleDouble junk regenerates** on this exFAT/external drive (`._*` files). Re-sweep before each
  commit: `find . -path ./.git -prune -o -name '._*' -delete`.
- **`backend/.env`** exists locally and is gitignored — keep real keys out of commits.
- **`requirements.txt`** lists the intended stack (fastapi, chromadb deps, sentence-transformers,
  anthropic, deepl, etc.) but those packages drive code that isn't written yet.
