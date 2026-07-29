# Deploying Rights Within Reach

Two services:

| Part | Host | What it serves | Config file |
|---|---|---|---|
| Backend API (FastAPI + Chroma) | **Railway** | `/health`, `/api/search`, `/api/ask` | `railway.toml`, `nixpacks.toml`, root `requirements.txt` |
| Frontend (Vite + React) | **Vercel** | the static web app | `frontend/vercel.json` |

The frontend calls the backend over HTTPS, so deploy the **backend first**, copy its
URL into the frontend, then point the backend's CORS back at the frontend.

---

## 1. Backend → Railway

1. **New Project → Deploy from GitHub repo**, pick this repo.
2. Railway detects Python from the root `requirements.txt` and uses `nixpacks.toml`.
   The build runs `python -m backend.ingest.load_to_chroma`, which **bakes the Chroma
   vector store into the image** from the committed `data/raw/**` sources. No volume
   needed; the store is rebuilt on every deploy.
3. **Variables** (Settings → Variables):

   | Variable | Required | Value |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | **yes** | your real key (`sk-ant-…`) |
   | `ALLOWED_ORIGINS` | **yes** | your Vercel URL, e.g. `https://rights-within-reach.vercel.app` (comma-separated for several) |
   | `WEB_SEARCH_ENABLED` | optional | `1` (default). Live web-grounding — **billed by Anthropic per search**. Set `0` to answer from corpus only |
   | `WEB_STRONG_SCORE` | optional | `0.60` (default). Lower = web-check more often; `0` = check the web on every answer |
   | `WEB_SEARCH_MAX_USES` | optional | `2` (default) max searches per answer |
   | `ANALYTICS_HASH_IP` | optional | `1` to count unique visitors |
   | `ANALYTICS_SALT` | if hashing | long random string, kept private |
   | `ANALYTICS_LOG_QUESTIONS` | optional | leave `0` (default) — keeps raw questions out of logs |

4. **Networking → Generate Domain** to get a public URL (e.g. `https://rwr-api.up.railway.app`).
5. Confirm `GET /health` returns `{"status":"ok"}`. The deploy healthcheck already hits `/health`.

> **First build is slow** (downloads PyTorch + the embedding model, then embeds ~180
> pages). If the build runs out of memory on a small plan, the alternative is to attach
> a Railway **Volume** mounted at `/app/data/chroma`, drop the build step from
> `nixpacks.toml`, and run `python -m backend.ingest.load_to_chroma` once via
> `railway run`. The current setup avoids that for simplicity.

> **Analytics logs are ephemeral on Railway.** `data/analytics/` lives in the container
> filesystem and is wiped on redeploy. For durable analytics, mount a volume at
> `/app/data/analytics` (set `ANALYTICS_LOG_PATH=/app/data/analytics/requests.jsonl`)
> or ship logs to an external sink later.

### Recommended analytics setup (decision)

1. **Unique visitors, privacy-first:** set `ANALYTICS_HASH_IP=1` and a long, secret,
   **stable** `ANALYTICS_SALT` (rotating it resets the count). This counts uniques
   without ever storing a raw IP.
2. **Retention — do this:** the daily re-ingest redeploys the backend whenever a
   source changes, so without a volume your logs reset almost daily. Mount a Railway
   **Volume** at `/app/data/analytics` and set
   `ANALYTICS_LOG_PATH=/app/data/analytics/requests.jsonl`.
3. Leave `ANALYTICS_LOG_QUESTIONS=0` (default) so raw questions are never logged.

Then review anytime with `make usage` (points it at the volume path locally, or copy
the JSONL down first). For a shareable visual, `make dashboard` writes a self-contained,
brand-styled HTML report to `data/analytics/dashboard.html` — no server, no external
requests, still aggregate-only (open it in any browser or hand it to a stakeholder).

---

## 2. Frontend → Vercel

1. **Add New → Project**, import this repo.
2. Set **Root Directory = `frontend`**. Framework preset **Vite** is auto-detected;
   `frontend/vercel.json` sets the build command, output dir, and the SPA rewrite that
   makes React Router deep links work.
3. **Environment Variables:**

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | the Railway backend URL from step 1.4, e.g. `https://rwr-api.up.railway.app` |

   (Vite inlines this at build time, so redeploy after changing it.)
4. Deploy. Note the production URL (e.g. `https://rights-within-reach.vercel.app`).

---

## 3. Wire CORS back

Return to Railway and set `ALLOWED_ORIGINS` to the exact Vercel production URL (and any
preview/custom domains you use), then redeploy the backend. Without this the browser
blocks the API calls with a CORS error.

---

## 4. Custom domain (`rightswithinreach.org`)

- **Frontend:** add `rightswithinreach.org` (and `www`) to the Vercel project; update DNS
  at Namecheap per Vercel's instructions.
- **Backend:** add `api.rightswithinreach.org` as a Railway custom domain; then update
  `VITE_API_URL` (Vercel) and `ALLOWED_ORIGINS` (Railway) to the final hostnames and
  redeploy both.

---

## 5. Daily re-ingest (GitHub Actions)

`.github/workflows/daily-ingest.yml` re-fetches sources every morning at 8 AM Central,
commits any changed `data/raw/**`, and pushes. **For that to reach production, Railway
must auto-deploy on push to the default branch** (Railway → service → Settings → check
the GitHub trigger). If you'd rather not auto-deploy on every push, add a
`RAILWAY_DEPLOY_HOOK` repository secret and uncomment the deploy step in the workflow.
The workflow opens a GitHub issue when a source changed materially or looks broken.

> Note: the **root `requirements.txt` is for Railway only** (it's how Nixpacks detects
> Python). Vercel must use **Root Directory = `frontend`** so it builds the Vite app and
> ignores that file — otherwise Vercel misdetects the project as Python.

---

## Smoke test after deploy

```bash
curl https://<railway-domain>/health
curl "https://<railway-domain>/api/search?q=eviction%20notice&k=2"
```

Then open the Vercel URL, ask a question, and confirm an answer with source cards comes
back (check the browser Network tab if not — a CORS or `VITE_API_URL` mistake shows here).
