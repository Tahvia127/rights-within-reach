# State expansion — jurisdiction layer runbook

This adds the **jurisdiction layer** the roadmap calls the one dependency you can't
route around, and wires in expansion along three axes:

- **States** (end to end): California + San Francisco, Missouri + St. Louis,
  Texas + Houston, New York + NYC — on top of the original Illinois.
- **Categories** (new topics): Veterans & Military (`VE`, federal — serves every state at
  once) and Work & Employment / wage theft (`WO`, federal + state labor agencies).
- **Language**: Polish (`pl`) as a 6th UI language, with a pinned legal-term glossary.

Every code/data change is backward-compatible: with the corpus as it is today (Illinois
only), behavior is unchanged until you re-ingest.

Adding a state is now a repeatable recipe (see **Adding a state** at the bottom): the
backend jurisdiction filter, prompts, retriever, and resource finder are all state-generic,
so a new state is a verified source CSV + referral orgs + frontend selector entries + an
adversarial eval set — no changes to the core pipeline.

## What changed

**New fields on every chunk:** `state` (`IL` / `CA` / `federal`), `locality`
(`chicago`, `cook_county`, `san_francisco`, or empty), and `list_code` (LIST /
taxonomy.legal). Derived at ingest time from each source's sidecar, so the 100+
existing Illinois `.meta.json` files needed **no edits**.

**Retrieval is now jurisdiction-filtered.** `retriever.search(..., state=, locality=)`
keeps results to `federal` + the user's state, so a California user can no longer get
a fluent, confident Illinois answer. A locality match (e.g. a Chicago ordinance) gets
a small rank boost over a statewide statute — which also fixes the latent Chicago-vs-
downstate bug we already had. The filter is **self-healing**: if the backend ships
before the corpus is rebuilt, it detects that no chunk has a `state` field yet and
skips the filter rather than refusing every answer (`_has_state_field`).

**Prompts are jurisdiction-aware.** The research and answer prompts are parameterized
by jurisdiction; the Illinois render is byte-identical to before (no eval regression),
and a California question is framed as California law, told never to adapt another
state's law.

**Frontend funnel** now starts with a **state** step (Illinois / California), persisted
in `localStorage` like language. California shows San Francisco / elsewhere-in-CA;
Illinois keeps its existing area + ZIP flow. `state`/`locality` are threaded to `/ask`
and into shareable deep links.

**Immigration is deliberately excluded** from the answerable corpus. The SF immigration
sources are verified and kept in `data/ca_sources_verified.csv`, but `fetch_ca_sources.py`
skips `IM-*` because `/ask` still refuses immigration. Per the roadmap, immigration
needs its own freshness cadence and refusal rules before it ships.

### Files
- `backend/services/taxonomy.py` — new. State/locality normalization, LIST maps, cache loader.
- `backend/services/retriever.py` — `state`/`locality` filter + locality boost + self-heal guard.
- `backend/ingest/load_to_chroma.py` — emits `state`/`locality`/`list_code`; reads `data/raw/ca/`.
- `backend/api/{ask,search,schemas}.py` — thread `state`/`locality`; jurisdiction-aware prompts.
- `backend/services/routing.py` — state-aware referral orgs (CA + national fallback).
- `backend/api/content.py` — jurisdiction placeholders in prompts; CA/federal web allow-list.
- `backend/services/orgs.py` + `backend/api/orgs.py` — new. `GET /orgs` resource finder over `data/orgs.csv`.
- `backend/tests/{test_taxonomy,test_orgs}.py` — new. Pure-function tests for the safety-critical logic.
- `frontend/src/{lib/api.ts,pages/Chat.tsx,lib/translations.tsx}` — state step + threading.
- `data/ca_sources_verified.csv`, `data/orgs.csv`, `data/taxonomy/list.json` — data.
- `scripts/{fetch_ca_sources,coverage_report,refresh_taxonomy}.py` — new tooling.
- `scripts/eval.py` + `data/eval/benchmark.json` — diagnostic sets (by-jurisdiction, adversarial, staleness).

## Activate it locally (the steps that need Python/Node)

I could not run these here — no Python or Node on this machine. Run from the repo root.

```bash
# 1. Fetch verified pages into data/raw/<state>/ with sidecars (skips immigration).
#    California CSV already ships; Missouri: run its verify pass first to produce the CSV.
# States (each verify script link-checks and writes data/<st>_sources_verified.csv):
python scripts/verify_mo_sources.py
python scripts/verify_tx_sources.py
python scripts/verify_ny_sources.py
# Categories (VE = federal veterans; WO = federal + state labor):
python scripts/verify_ve_sources.py
python scripts/verify_wo_sources.py
# Fetch every source set into data/raw/<name>/ (ca CSV already ships):
for s in ca mo tx ny ve wo; do python scripts/fetch_state_sources.py --state $s; done

# 2. Rebuild the vector store (now CA + MO + TX + NY + veterans + work).
python -m backend.ingest.load_to_chroma

# 3. See where you're thin — chunks per state / LIST parent / topic, and the gaps.
python scripts/coverage_report.py

# 4. Run the pure-function tests (no ML deps needed).
python -m pytest backend/tests/test_taxonomy.py backend/tests/test_orgs.py -q

# 4b. Resource finder (reads data/orgs.csv, no re-ingest needed):
#   /api/orgs?state=IL&topic=housing&language=es   -> Spanish-speaking Chicago housing orgs
#   /api/orgs?state=CA&topic=housing               -> California housing orgs

# 4c. (optional) Pull the full LIST taxonomy over the seeded subset:
python scripts/refresh_taxonomy.py

# 5. Sanity-check retrieval is actually partitioned:
uvicorn backend.main:app --reload
#   /api/search?q=eviction%20notice%20period&state=CA   -> California sources only
#   /api/search?q=eviction%20notice%20period&state=IL   -> Illinois sources only

# 6. Run the safety/quality benchmark (expect Illinois numbers unchanged).
python scripts/eval.py
python scripts/eval.py --set adversarial_jurisdiction   # CA + MO must never cite each other or IL

# 7. Frontend.
cd frontend && npm install && npm run dev          # pick California or Missouri in the funnel
```

**Commit `data/raw/ca/`, `data/raw/mo/`, and `data/raw/tx/` too** — the deploy builds Chroma
from `data/raw/` at build time (`data/chroma/` is gitignored), so the fetched HTML must be in
git for Railway to see it.

**Deploy order matters: corpus first.** Ship the re-ingested corpus (or deploy backend +
rebuilt Chroma together). The self-heal guard makes a backend-first deploy safe (it just
won't filter until the corpus has the field), but you don't get the safety benefit until
the corpus carries `state`.

## Follow-ups this does NOT do

- **Org phone numbers — verified.** The CA/MO/TX referral orgs in `routing.py` that have a single
  intake line (Housing Rights Committee of SF 415-703-8644, Legal Services of Eastern Missouri
  314-534-4200, Legal Aid of Western Missouri 816-474-6750, Lone Star Legal Aid 713-652-0077) now
  carry numbers confirmed against each org's official site (2026-08-06). Web directories (LawHelpCA,
  MOLawHelp, TexasLawHelp, CA Courts Self-Help) and the BenefitsCal portal stay URL-only by design —
  no single phone line. Hours were left blank rather than guessed.
- **Diagnostic eval sets.** `scripts/eval.py` now reports accuracy by set, by jurisdiction, and by
  topic, plus refusal precision/recall. `data/eval/benchmark.json` has an `adversarial_jurisdiction`
  set (CA and MO questions that must cite their own state and never a sibling state or Illinois, and
  vice-versa) and a `staleness` case. **The `adv-ca-*` / `adv-mo-*` cases only pass once that state's
  corpus is ingested** — before that they correctly fail as "no-citation" because there is no content
  yet. Run just this set with `python scripts/eval.py --set adversarial_jurisdiction`. Still to grow:
  more staleness cases with confirmed 2026 figures.
- **Resource finder — done, end to end.** `GET /api/orgs` serves ranked orgs from `data/orgs.csv`
  (state/topic hard filters; language + ZIP rank), and the homepage/Resources `FindHelpNearMe`
  component now calls it live (state + topic + ZIP selector, language from context, with
  loading/empty/error states). It replaced the old hardcoded Illinois org list that duplicated
  `routing.py`, so the endpoint is the single source of truth and the finder works for every state
  in the corpus. `/ask` also returns a `local_orgs` list (computed server-side from the answer's
  state + topic, ranked to the user's language), which the chat answer card renders as
  "Organizations near you" beneath the model-written "who to contact" — so every answer ends with
  the real local orgs that serve and speak to the user, read-aloud and share/print included.
- **Full LIST pull.** `scripts/refresh_taxonomy.py` replaces the hand-seeded `data/taxonomy/list.json`
  with the full ~1,301-term set. Confirm the upstream field names on first run (the script prints
  and aborts if it can't extract code/name, rather than writing a half-parsed file).
- **Other languages / RTL** remain later phases. Further states are each the "Adding a state"
  recipe below (Illinois, California, Missouri, and Texas are all done).

## Adding a state (the repeatable recipe)

Missouri is the worked example; every state after it is the same six touch points. The core
pipeline (retriever filter, jurisdiction-aware prompts, `/ask`, resource finder) is state-generic
and needs **no changes**.

1. **Sources** — write `scripts/verify_<st>_sources.py` (candidate primary-law URLs + link check)
   → produces `data/<st>_sources_verified.csv`. Then `python scripts/fetch_state_sources.py --state <st>`.
2. **Ingest dir** — add `data/raw/<st>` to `RAW_DIRS` in `backend/ingest/load_to_chroma.py`.
3. **Referral orgs** — add a `_contact_<st>(...)` branch in `backend/services/routing.py` and the
   state's domains to `ALLOWED_DOMAINS` in `backend/api/content.py`. Leave phones blank until verified.
4. **State code** — confirm the two-letter code is in `KNOWN_STATES` (`backend/services/taxonomy.py`)
   and `_STATE_LABEL` (`backend/api/ask.py`).
5. **Frontend** — add the code to `SUPPORTED_STATES` + `STATE_LABEL` + `STATE_AREAS` in
   `frontend/src/pages/Chat.tsx` (and `SUPPORTED_STATES`/`STATE_LABEL`/`DIRECTORY` in
   `FindHelpNearMe.tsx`), extend `deriveLocality`, and add the `triage.state.*` / `triage.area.*`
   i18n keys.
6. **Eval** — add an `adversarial_jurisdiction` case or two: the state's questions must cite its own
   law and never a sibling state's.

Missouri, Texas, and New York already have all six done. Their orgs are also in `data/orgs.csv`
already (the HUD harvest covered St. Louis, Houston, and NYC), so the resource finder and
`local_orgs` work for them the moment the corpus is ingested.

## Adding a category (Veterans, Work — and the next one)

A new legal category is a different, smaller recipe than a state (the roadmap's Tier 1
"just ingest" work). Veterans and Work are the worked examples:

1. **Topic maps** — add `topic → LIST parent` to `TOPIC_TO_LIST_PARENT` and the reverse to
   `_LIST_PARENT_TO_TOPIC` in `backend/services/taxonomy.py`.
2. **Subject routing** — add `subject → topic` to `SUBJECT_TO_TOPIC` in `routing.py`, and a
   referral (a federal category like Veterans gets one national org handled at the top of
   `contact_for`; a mixed one like Work falls through to each state's general legal aid).
3. **Prompt scope** — add the category to the scope sentence in `ANSWER_PROMPT` /
   `RESEARCH_PROMPT` (`content.py`) so it isn't refused as out-of-scope, plus its domains
   to `ALLOWED_DOMAINS`.
4. **Sources** — `scripts/verify_<cat>_sources.py` → `data/<cat>_sources_verified.csv`
   (rows carry `jurisdiction=federal` or a state per source), then
   `fetch_state_sources.py --state <cat>` into `data/raw/<cat>`; add that dir to `RAW_DIRS`.
5. **Frontend** — add the subject to `SUBJECT_LABEL` (Chat funnel) and `TOPICS`
   (`FindHelpNearMe`), with `subject.*` / `findhelp.topic.*` i18n.
6. **Eval** — a `category`-set case or two that must retrieve the new corpus.

## Adding a language (Polish — and the next one)

1. **Backend** — add the code to `content.LANGUAGES` (this alone makes `/ask` generate answers
   in that language via `LANGUAGE_RULE`). Add a pinned legal-term block to
   `backend/api/glossary.py::GLOSSARIES` — this is the roadmap's key safeguard against a
   plausible-but-wrong translation of a term of art; it's injected into the answer prompt.
2. **Frontend** — add the code to the `Language` union, `LANGUAGES`, `VALID_LANGS`, the deep-link
   `VALID` list, `detectBrowserLanguage`, and the speech locale maps. Add a `STRINGS` block
   (a curated subset is fine — missing keys fall back to English under the `mt.notice`
   "machine-assisted, under review" banner) and a `pl: {}` in `ORG_I18N`. Per-topic page
   content (`Housing/Benefits/Money/Repairs` CONTENT, `Resources` maps) is typed
   `Record<'en', X> & Partial<Record<Language, X>>`, so a new language falls back to English
   there without needing a full translation.
3. **RTL** (Arabic/Urdu only) would need a CSS pass — not required for Polish.
4. **Native review** — every non-English string, and the glossary, is machine-drafted until a
   native speaker signs off. Run `python scripts/backtranslate_eval.py --lang <code>` as a
   floor check (it back-translates each answer and verifies numbers/citations/sources
   survived); it catches gross failures but not subtle wrongness, so it doesn't replace review.
