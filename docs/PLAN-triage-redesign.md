# Plan: Triage flow + structured answer

_From the 2026-06-27 design sketch. Planning doc only — no app code yet._

## Goal
Replace the single free-text chat with a **guided triage funnel**, and return a
**structured answer** (Answer · Next Steps · Who to contact & How) bracketed by
disclaimers, each section read-aloud, all in the user's language.

```
Triage cycle:   Area → ZIP code → Subject → Question → Detail questions → Answer
Answer pipeline: filter info → find answer → plain language → translate →
                 { answer · disclaimer · next steps · who to contact (+ why/how) }
```

## Baseline (what exists today)
- **`POST /ask`** takes `{question, language}` and returns
  `{refused, reason, answer: string, sources[], topic, refusal_org?}`.
  One Claude call; `answer` is a single plain-text blob (disclaimer is *inside* it).
  There are no `next_steps` / `contact` fields (the frontend's key_points/note are demo-only).
- **Retriever** does vector search with an optional `topic` filter. Each chunk's
  metadata already carries `jurisdiction` (`illinois`, `chicago-il`,
  `cook-county-il`, `federal`) — but it is **not** filtered/used yet.
- **Chat UI** is one textarea → `ask()` → one answer card. Per-answer read-aloud exists.
- **i18n + read-aloud infrastructure** is done and reusable.

## The two pieces to build

### A. Structured answer (backend shape + prompt + rendering)
**New `AskResponse` fields** (additive; refusal path unchanged):
- `answer: str` — the direct answer, plain language (unchanged).
- `disclaimer: str` — promoted out of the answer text so it can render top **and**
  bottom and be read aloud. Store as **5 fixed translated constants** (don't
  re-translate per request — guarantees consistency, saves tokens).
- `next_steps: list[str]` — concrete actions ("Take photos", "Call X within 10 days").
- `contact: { name, sub, why, how, phone, hours, url }` — "Who to contact & How",
  including **why** this org and **how** to use them.

**Pipeline** (mirrors the sketch):
1. **Filter** — existing danger/out-of-scope keyword pre-filter + retrieve top-k
   chunks (topic-aware now, jurisdiction-aware in Phase 2).
2. **Find answer** — Claude reads the retrieved chunks.
3. **Plain language** — existing system prompt (6th-grade, no markdown headings).
4. **Structured output** — switch the Claude call to **tool-use / JSON output** so
   `next_steps` reliably comes back as an array, with a **fallback to today's
   plain answer** if structured parsing fails.
5. **Translate** — instruct Claude to write `answer`, `next_steps`, and the
   contact `why`/`how` in `language`; org name/phone/hours stay literal.
6. **Output** — assemble answer + disclaimer + next_steps + contact.

**"Who to contact" routing** — a deterministic `function(topic, jurisdiction)` →
org pulled from the Resources directory (e.g. Chicago/Cook housing → MTO/CCLAHD;
suburban Cook utilities → CEDA; benefits → Legal Aid Chicago). Claude writes the
why/how text; the org/phone come from our verified data, not the model.

### B. Triage funnel (frontend state machine + request enrichment)
A stepwise "chat cycle" — each step is its own bubble with read-aloud:
1. **Area** — Chicago / suburban Cook / collar county / elsewhere in IL.
2. **ZIP** — 5-digit → maps to jurisdiction (routing + retrieval filter + correct local org).
3. **Subject** — Housing / Money / Repairs / Benefits → sets the `topic` filter.
4. **Question** — free-text "what's going on."
5. **Detail questions** — 0–2 short follow-ups to disambiguate (start fixed/none).
6. **Answer** — run the pipeline with all of the above.

`/ask` gains optional fields: `area`, `zip`, `subject`, `details`. These refine
retrieval (jurisdiction + topic filter) and org routing.

**ZIP → jurisdiction** needs a small static table (Chicago 606xx ranges, suburban
Cook, collar counties DuPage/Kane/Lake/McHenry/Will/Kendall, rest of IL).
⚠️ Accuracy matters — wrong routing sends people to the wrong org; verify ranges.

### C. Read-aloud
Trivial once sections exist: drop `<ReadAloud>` on each of Answer, Next Steps,
Who to contact, and the top/bottom disclaimer. Infra already built.

## i18n impact
- Triage prompts/option labels/buttons → ~20 new keys × 5 languages (static).
- Disclaimer → 5 fixed translated constants (translate the current DISCLAIMER once).
- `answer` / `next_steps` / contact `why`/`how` are model-generated in-language (no static keys).

## Proposed build order
- **Phase 1 — Structured answer** (no triage yet). Extend `AskResponse`, switch to
  JSON/tool-use output, promote the disclaimer, deterministic org routing by topic,
  render Answer / Next Steps / Who-to-contact + top/bottom disclaimer with read-aloud.
  _Lowest risk, immediately visible, reuses the current chat._
- **Phase 2 — Triage funnel + ZIP routing.** ZIP→jurisdiction table; pass
  area/zip/subject/details; jurisdiction-aware retrieval + org routing; the
  stepwise triage UI (i18n + read-aloud + a "skip to just asking" escape).
- **Phase 3 — Polish.** Model-suggested detail questions, triage drop-off analytics
  (the analytics middleware is already in place to measure it).

## Decisions to confirm before coding
1. **Triage required or skippable?** (recommend: default guided, with a "just ask" escape.)
2. **ZIP precision now, or area dropdown first?** (recommend: area dropdown in Phase 1,
   ZIP precision in Phase 2.)
3. **Structured output mechanism:** Anthropic tool-use/JSON (recommend) vs parse free-text.
4. **Detail questions:** fixed per subject vs model-generated. (recommend: start with none/fixed.)
5. **Does area/ZIP gate the answer** (block until given) **or just refine it?** (recommend: refine, never block.)

## Files this will touch (Phase 1 → 2)
- `backend/api/schemas.py` — new `AskResponse` fields
- `backend/api/ask.py` — structured prompt/output, disclaimer field, org routing
- `backend/services/routing.py` *(new)* — zip→jurisdiction + org selection
- `backend/services/retriever.py` — optional jurisdiction filter
- `frontend/src/lib/api.ts` — response type + request fields
- `frontend/src/pages/Chat.tsx` — structured rendering, then the triage state machine
- `frontend/src/lib/translations.tsx` — triage prompts + disclaimer constants
- `data/` — zip→region table

## Risks
- Structured JSON adds a parse failure mode → mitigate with tool-use + plain-answer fallback.
- ZIP routing data accuracy (city/suburb boundaries) → verify; wrong org is worse than generic.
- Cache key must include area/zip/subject/details (today it's just question+language).
- More surface to translate and to native-review.
