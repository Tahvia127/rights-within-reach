# Rights Within Reach

Free, plain-language legal **information** (never legal advice) for Illinois residents —
in five languages, read aloud, always pointing to a real organization that can help.
Covers **housing & rent, money & debt, home repairs, and public benefits**.

Built for the University of Chicago Tech Showcase. Live: **https://www.rightswithinreach.org**

> Not a law firm and not legal advice. Every answer cites its sources and ends with a
> disclaimer directing users to a lawyer or legal-aid organization.

---

## What it does

- **Guided triage → structured answer.** A short funnel (area → ZIP → subject → question)
  leads to a structured card: plain-language answer, concrete next steps, and a verified
  "who to contact & how", bracketed by disclaimers.
- **Grounded + web-checked.** Retrieval-augmented over ~940 chunks from 130+ tracked
  Illinois legal-aid and statute sources. When corpus coverage is thin, it does a live
  web check restricted to an allow-list of gov / legal-aid domains, and reports a
  **confidence** rating (high / medium / low).
- **Five languages.** English, Spanish, Chinese, Tagalog, Vietnamese — the entire UI and
  content, with an honest "machine-assisted, under review" banner until native speakers verify.
- **Read aloud, per section.** Browser text-to-speech in the selected language, with
  speed and voice controls.
- **Safety guardrails.** Out-of-scope questions (immigration, criminal, family law,
  danger) are declined politely and routed to the right referral org — never guessed.
- **Fresh.** A daily 8 AM CT job re-fetches sources and flags changed legal text for review.
- **Private.** No login; no raw questions or IPs logged by default.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Vite (Vercel) |
| Backend | FastAPI + Uvicorn (Railway) |
| Retrieval | Chroma + `sentence-transformers` (`all-MiniLM-L6-v2`) |
| LLM | Anthropic Claude (structured tool-use + allow-listed web search) |

## Repo layout

```
backend/     FastAPI app, /ask pipeline, ingestion, retriever, routing, analytics
frontend/    React app (pages, i18n, speech, components)
data/        raw sources, Chroma store, eval benchmark, analytics + monitor output
scripts/     eval, source fetch/monitor, daily ingest, usage report, translation export
docs/        DEPLOY, TODO, DEMO script, reviewer packets
```

## Local development

**Backend** (needs Python 3.11+ and an Anthropic API key):

```bash
pip install -r requirements.txt
echo "ANTHROPIC_API_KEY=sk-ant-..." > backend/.env
python -m backend.ingest.load_to_chroma        # build the vector store from data/raw
uvicorn backend.main:app --reload              # http://localhost:8000  (/health, /api/ask)
```

**Frontend:**

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env.local
npm run dev                                     # http://localhost:5173
```

## Common tasks

```bash
python scripts/eval.py                 # run the safety/quality benchmark (21 cases)
python scripts/daily_ingest.py --dry-run   # preview a source refresh (no writes)
python scripts/usage_report.py         # summarize analytics (languages, topics, refusals)
node   scripts/export_translations.mjs # regenerate reviewer CSVs from the UI strings
```

## Deployment

See **[docs/DEPLOY.md](docs/DEPLOY.md)** — Railway (backend, bakes Chroma at build) +
Vercel (frontend). Key gotchas: Vercel **Root Directory = `frontend`** (the root
`requirements.txt` is Railway-only), set `ANTHROPIC_API_KEY` + `ALLOWED_ORIGINS` on
Railway, and enable Railway auto-deploy on push for the daily re-ingest to reach prod.

## Status & roadmap

Pre-launch checklist and remaining work live in **[docs/TODO.md](docs/TODO.md)**. The main
gate before a public launch is **native-speaker review** of the machine-drafted
translations (reviewer packets in `docs/review/`).
