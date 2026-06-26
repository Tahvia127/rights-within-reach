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
   | `ANTHROPIC_API_KEY` | your real key (`sk-ant-…`) |
   | `ALLOWED_ORIGINS` | your Vercel URL, e.g. `https://rights-within-reach.vercel.app` (comma-separated for several) |
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

## Smoke test after deploy

```bash
curl https://<railway-domain>/health
curl "https://<railway-domain>/api/search?q=eviction%20notice&k=2"
```

Then open the Vercel URL, ask a question, and confirm an answer with source cards comes
back (check the browser Network tab if not — a CORS or `VITE_API_URL` mistake shows here).
