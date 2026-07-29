# Rights Within Reach — To-Do

Status snapshot (2026-06-28): app is **live** at rightswithinreach.org. Backend
(Railway) + frontend (Vercel) deployed; CORS + Anthropic key fixed. Eval 21/21.
Structured triage answers, 5-language UI, per-section read-aloud with speed/voice
controls, region routing, and a 941-chunk corpus are all working.

Legend: `[ ]` to do · `[~]` in progress · `[x]` done

---

## 1. Launch-blocking — do before showing the public

### Release the latest work
- [~] Commit this session's changes (eval fix, ZIP routing, chat localization, speech controls) — *Tahvia committing*
- [ ] Merge `feature/multilingual-read-aloud` → `main`
- [ ] Confirm Railway redeploys and **Phase 3 (follow-up chips + triage analytics)** goes live (still only on the local branch)
- [ ] Confirm Vercel redeploys the frontend
- [ ] Re-smoke-test production after deploy:
  - [ ] structured answer returns (answer / next steps / contact)
  - [ ] follow-up chips appear
  - [ ] speech speed slider + voice picker show in top bar
  - [ ] chat welcome + UI translate on language switch (all 5 langs)
  - [ ] ZIP routing returns correct org (Chicago vs collar vs downstate)
  - [ ] CORS header present from the live domain

### Translation quality (the #1 gate)
- [x] Generate EN↔translation side-by-side export for reviewers — `scripts/export_translations.mjs` → `docs/review/translations/<lang>.csv` (re-runnable)
- [x] Reviewer guide for language reviewers — `docs/review/REVIEW-language.md`
- [x] **Complete missing UI translations** — filled all gaps; exporter now reports 220 keys, 0 missing in every language (machine-drafted, still need native review below)
- [ ] Native-speaker review: Spanish
- [ ] Native-speaker review: Chinese
- [ ] Native-speaker review: Tagalog
- [ ] Native-speaker review: Vietnamese
- [ ] Review topic-page legal content + resource cards in-context per language (Part B of the guide)
- [ ] Apply reviewer corrections
- [ ] Add a visible "translations are machine-assisted, under review" note until reviewed (optional but honest)

### Legal / disclaimer sign-off
- [ ] Final review of disclaimer wording (per meeting notes) with project lead / clinic
- [ ] Confirm refusal behavior + referral language is acceptable for out-of-scope topics
- [ ] Confirm no content reads as legal *advice* anywhere (topic pages + chat)

---

## 2. Should-do — quality & correctness

### Routing & content accuracy
- [x] Validated the ZIP→region table against the U.S. Census 2020 ZCTA→County file
  (`scripts/validate_zip_counties.py`): Chicago range = 100% Cook, no overlap; removed
  2 boundary ZIPs that were mislabeled (60010 Barrington→Cook, 60548 Sandwich→DeKalb).
  114 collar ZIPs now all verified in genuine collar counties.
- [x] Verify the 9 routing + 3 refusal orgs the chatbot hands out — all phone numbers
  correct (CARPLS, CCLAHD, Legal Aid Chicago, Eviction Help IL, CEDA, IHDA, Chicago
  DOH, NIJC, National DV Hotline) as of 2026-06-28
- [x] **Chicago Home Repair Program 2026 closure** — fixed: Resources DOH card now
  notes registration isn't open in 2026 and points to IHDA / Rebuilding Together
  (EN + 4 translations). Topic page (Repairs.tsx) was already accurate.
- [x] Audited the phone-bearing Resources org cards — fixed 4: LCBH renamed to
  "Law Center for Better Housing" + phone 312-347-7600; Catholic Charities → 312-655-7700;
  IDVA → 312-814-2460; Veterans Assistance Commission phone added (312-433-6010).
  ~20 others confirmed correct.
- [ ] FYI to confirm someday: Rebuilding Together also lists 312-201-1188 (we use
  312-733-3640 — both valid). URL-only cards (Lambda Legal, ABE, etc.) not phone-checked.
- [ ] Confirm collar-county / suburban-Cook orgs are correct (not just Chicago)
- [ ] Spot-check citations in answers point to real, current statutes/ordinances

### QA across the matrix
- [ ] Manual pass of every page in all 5 languages (home, 4 topics, resources, chat)
- [ ] Mobile / small-screen layout check on each page
- [ ] Cross-browser check (Chrome, Safari, Firefox; iOS Safari, Android Chrome)
- [ ] Read-aloud check per language (voice present? graceful fallback for Tagalog/Vietnamese?)
- [ ] Keyboard-only navigation + visible focus states
- [ ] Color-contrast / screen-reader spot check

### Analytics & ops
- [ ] Confirm privacy-first request logging works in production (no raw question/IP)
- [ ] Decide on `ANALYTICS_HASH_IP` + `ANALYTICS_SALT` for unique-visitor counts
- [ ] Decide where logs live on Railway + how to review them (no volume = logs are ephemeral on redeploy)
- [ ] Basic usage review: top topics, languages, triage adoption, refusal rate

---

## 2b. Trust & freshness — NEW, needs design sign-off before building

These are the two big features Tahvia requested. Both are substantial; each gets a
short design proposal here, then build once approved. They are **not** quick edits.

### A. Web-grounded answers with a confidence/accuracy gate — ✅ BUILT (needs tuning)
*Goal: before answering, check the question against our corpus AND the live
internet, then answer based on confidence — and say so when unsure.*

**Status:** Implemented as a two-pass pipeline in `backend/api/ask.py`:
- Pass 1 researches the corpus + an **allow-listed web search** (Anthropic
  `web_search` tool, `ALLOWED_DOMAINS` = IL gov / legal-aid / federal consumer
  sites only) → research brief with a confidence line.
- Pass 2 forces the structured `answer` tool, returns a **`confidence`**
  (high/medium/low). Frontend shows a confidence badge + tags web sources.
- Safe fallback to corpus-only if web is off or the call fails.
- Env: `WEB_SEARCH_ENABLED` (default on), `WEB_SEARCH_MAX_USES` (2),
  `WEB_SOURCES_SHOWN` (4). **Web search is billed by Anthropic.**

- [x] **Adaptive mode** (Tahvia chose this): web check fires only when corpus is
  thin/uncertain; strong corpus answers fast. Verified: strong match ~13s, 0 web,
  high confidence; moderate match ~52s, web sources, medium confidence. Gate:
  `WEB_STRONG_SCORE` (0.60), `WEB_STRONG_MIN_CHUNKS` (3). Set `WEB_STRONG_SCORE=0`
  to web-check *every* answer.

**Open tuning items:**
- [ ] Calibrate `WEB_STRONG_SCORE` against real usage (0.60 is an initial guess for
  the all-MiniLM score distribution) — needs prod traffic.
- [x] Confidence calibration: eval now asserts every answered question returns a valid
  high/medium/low confidence (`scripts/eval.py`). *(Re-run the live eval once the
  backend Python env is available to reconfirm 21/21.)*
- [x] Extended `ALLOWED_DOMAINS` (added evictionhelpillinois.org, dhs.state.il.us,
  medicaid.gov, irs.gov, usda.gov, hhs.gov).
- [ ] Watch Anthropic web-search billing once live.

Original design notes:
- Pipeline becomes: translate → retrieve (corpus) → **live web search (allow-listed
  authoritative domains only)** → Claude synthesizes from both → **self-rated
  confidence** → gate.
- **Source allow-list** (e.g., illinoislegalaid.org, *.illinois.gov, *.cityofchicago.org,
  cookcountyil.gov, consumerfinance.gov, hud.gov, courts) — never answer from
  arbitrary web pages. Reduces the risk of confidently wrong legal info.
- **Confidence levels** returned in the answer schema:
  - *High* — corpus + web agree → answer normally.
  - *Medium* — partial/!uncertain → answer + "double-check with an org" emphasis.
  - *Low* — sources conflict or thin → don't assert; route to a human/org.
- Show a confidence indicator + which sources backed the answer.
- Trade-offs to decide: added **latency** (extra search + LLM pass), **cost**, which
  **search API** (Brave/Bing/Tavily/Anthropic web tool), and caching strategy.
- Add eval cases that check confidence calibration + that low-confidence refuses.

### B. Continuous content review & auto-update — ✅ BUILT
*Goal: keep corpus + org cards current; detect when a source changes.*

**Status:** Implemented — runs **daily at 8:00 AM Central**.
- `scripts/daily_ingest.py` — safely re-fetches every source and **refreshes only the
  healthy changed ones** (which re-bake into Chroma on the next deploy). Guards against
  replacing good legal text: a fetch that is thin or <25% similar (a moved/restructured
  URL) **keeps the last-good copy** and is flagged; material changes (25–90%) are
  refreshed AND flagged for legal review. Quiet days write nothing → no redeploy.
- `scripts/monitor_sources.py` — read-only freshness scanner (helpers reused by
  daily_ingest); handy for manual `--dry-run`-style checks.
- `.github/workflows/daily-ingest.yml` — fires at 13:00 & 14:00 UTC and proceeds only
  when it's actually 08:xx America/Chicago (DST-correct), re-ingests, commits + pushes
  (→ Railway rebuilds the corpus), and **opens a GitHub issue** listing material/broken
  changes for review.
- Verified: correctly protects the moved ILGA statute pages (2%/6% → kept last-good),
  refreshes real content changes, and ignores unchanged low-text pages.
- ⚠️ Requires **Railway auto-deploy on push to the default branch** (or a
  `RAILWAY_DEPLOY_HOOK` secret — a commented step is ready in the workflow).

**Open follow-ups:**
- [x] Org website-link liveness checker (`scripts/check_org_links.py`, `make check-links`):
  classifies live/blocked/dead; found + fixed 2 dead links (il.freelegalanswers.org,
  rebuildingtogether-chi.com). Phones/hours still need the manual audit —
  the periodic manual audit (done once this session) still covers those.
- [ ] Optionally add an LLM summary of *what* changed on a flagged page.

Original design notes:
- **Scheduled job** (cron / GitHub Action / Railway cron) that re-fetches each
  tracked source, hashes content, and **diffs vs last seen**.
- On change: re-ingest that source, and **flag it for human review** (don't silently
  trust changed legal text) — open an issue / write to a changelog.
- **Org-card freshness**: periodic check of phone/hours/URL liveness; flag stale.
- Surface a "last verified" date per source/org in the UI.
- Decide: cadence (weekly?), where alerts go, auto-merge vs review-required.

> Open questions for Tahvia: search provider + budget for (A); cadence + where
> change alerts should land for (B). See the question at the end of this session.

## 3. Nice-to-have / future

- [ ] Chase remaining retrieval depth (more sources per topic; broaden corpus)
- [x] Expanded eval benchmark: +6 adversarial-safety cases (danger, criminal, prompt-injection) — now 27 cases, 9 refusals. *(Validate on next live eval run.)*
- [x] Remember last-used voice **per language** (verified: es→Eddy, en→Samantha, recalled on switch).
- [x] Full IL ZIP→region table (1,397 ZIPs) generated from Census data
  (`scripts/gen_zip_regions.py` → `backend/services/zip_regions_data.py`); ZIP alone now
  routes precisely incl. **suburban Cook**. Verified: Arlington Heights→suburban_cook→CEDA.
- [x] Print / share an answer: Copy-to-clipboard (formatted text) + Print→PDF with print CSS.
- [x] Feedback button ("was this helpful?") → `/api/feedback` → analytics + usage report.
- [ ] Paid translation/voice API (DeepL / cloud TTS) for higher-quality Tagalog/Vietnamese — noted as Phase 4 in requirements

---

## 4. Tech Showcase prep
- [ ] Demo script / walkthrough (pick 2–3 example questions that show triage + structured answer + read-aloud + language switch)
- [ ] Poster / slides
- [ ] Update Project Guide + Project Journal docs
- [ ] README polish (what it is, stack, how to run, deploy)
- [ ] Tighten `docs/DEPLOY.md` (Vercel: Root Directory = `frontend`, Framework = Vite; root `requirements.txt` is Railway-only)

---

## Recently done (this session)
- [x] Full i18n completeness sweep: every page translates in all 5 languages (contact
  card labels+org data, Home ticker/hero/aria, Resources meta chips, nav aria) — 237
  UI keys, 0 missing, + ORG_I18N/META_I18N lookups.
- [x] Mobile layout fixed: eliminated horizontal scroll in every language (collapsing
  top nav, smaller mobile brand, wrapping cards + bottom-nav labels); desktop intact.
- [x] Read-aloud verified: speaks translated content in the correct-language voice;
  fixed block-mashing so sentences have natural pauses.
- [x] Machine-translation notice banner (shown for non-English until reviewed).
- [x] Legal-advice audit: fixed one advice phrase in Repairs ("if you qualify, they
  should be your first applications") across all 5 languages; broader scan clean.
- [x] Usage-review script (`scripts/usage_report.py`): languages, topics, triage
  adoption, refusal/cache rates.
- [x] Demo script for the showcase (`docs/DEMO-script.md`).
- [x] Accessibility pass: `html lang` updates per language, all controls named, images/
  inputs labeled, single h1, landmarks + focus-visible present, new elements pass WCAG
  AA contrast; fixed the footer heading-level skip (h4→h3).
- [x] README rewritten; DEPLOY.md extended (web-search env vars, daily-ingest + Railway
  auto-deploy note, Vercel root=frontend / requirements.txt-is-Railway-only callout).
- [x] Citation spot-check: found 4 dead source URLs; the only cited one (City of Chicago
  Home Repair Program — slug changed `home_repair_program`→`home-repair-program`) fixed
  + re-fetched. The other 3 were already `dead`/not-ingested (not cited).
- [x] Fixed the moved ILGA statute sources (Landlord & Tenant Act, Security Deposit
  Return Act): corrected URLs to the `&Print=True` full-text pages, re-fetched clean
  text (239 → 22.5k / 7k chars), and taught the extractors to drop Google-Translate/
  modal widgets + fall back off a thin `<main>` (normal pages unaffected). Guard
  refined so always-thin pages aren't mislabeled "broken".
- [x] Investigated the two thin ILAO pages: both were **login-gated** (anonymous fetch
  got a "Log in" / nav shell, 0 chunks ingested). Swapped for fetchable equivalents —
  "Keeping a Section 8 Housing Voucher" (8.1k ch) and "Paying Public Utilities Through
  My Landlord" (6.4k ch); removed the dead files. Housing scan now 0 broken.
- [x] Reviewer materials: language-reviewer guide + per-language CSV export; general site-reviewer guide (`docs/review/`)
- [x] Production smoke test + fixed CORS (`ALLOWED_ORIGINS`) and Anthropic key on Railway
- [x] Eval debt-03 / debt-07 → **21/21** (hyphen-insensitive citation match + broadened expectation)
- [x] Curated Chicago-metro ZIP→region routing table (Chicago / collar / downstate; unlisted defers to Area)
- [x] Chat page fully localized (removed English demo seed; translated welcome empty-state)
- [x] Read-aloud speed slider (0.5×–2×) + voice picker (recommended + all voices), persisted
- [x] Voice-availability note + localized chat `aria-label`s
