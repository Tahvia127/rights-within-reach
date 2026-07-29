# Deploy Rights Within Reach — step by step

Everything you need to get a **public link** for the showcase, in order. Written to be
followed top to bottom. (For deep technical details, see `docs/DEPLOY.md`.)

---

## The big picture

Your project has two parts:

| Part | Folder | Where it goes | What it does |
|---|---|---|---|
| **Frontend** (the website) | `frontend/` | **Vercel** (free) | Everything you see and click |
| **Backend** (the answer engine) | `backend/` | **Railway** (free tier) | Generates live AI answers |

**Important shortcut:** the chat has a **built-in demo fallback**. If the backend isn't
running (or is out of API credits), the chat still shows real, correct, pre-written answers
in all 5 languages. So **the frontend alone is enough for a working demo.** That makes
**Path A** below the fastest, safest route for the showcase.

Pick one:
- **Path A — Frontend only (recommended for the showcase).** ~10 minutes. Chat runs on the
  demo answers. Nothing can break on stage.
- **Path B — Full deploy (frontend + backend).** ~30 minutes. Real, live AI answers. Needs
  Anthropic credits.

---

## Before you start (both paths)

- [ ] **Push your code to GitHub.** Vercel and Railway deploy from a GitHub repo.
  - In the project folder: `git add -A && git commit -m "prep for deploy" && git push`
  - If you don't have a repo yet: create one at github.com, then follow its "push an existing
    repository" instructions.
- [ ] **Create free accounts** (sign in with GitHub for both):
  - Vercel: https://vercel.com
  - Railway (only if doing Path B): https://railway.app
- [ ] **Do NOT commit secrets.** Your `backend/.env` (with the Anthropic key) is gitignored —
  keep it that way. You'll paste the key into the host's dashboard instead.

---

## Path A — Frontend only (recommended)

This gives you a live link where the whole site works and the chat shows the demo answers.

1. [ ] Go to **vercel.com → Add New… → Project**, and import your GitHub repo.
2. [ ] In the setup screen, set **Root Directory = `frontend`** (click "Edit" next to Root
   Directory and choose the `frontend` folder). Framework preset should auto-detect **Vite**.
3. [ ] Leave the build settings as detected (`frontend/vercel.json` already sets the build
   command, output folder, and the routing rule that makes deep links work).
4. [ ] Click **Deploy**. Wait ~1–2 minutes.
5. [ ] You'll get a link like `https://rights-within-reach.vercel.app`. **Open it and test:**
   - Switch languages, open a topic page, try the Deadline calculator.
   - Go to **Ask a question**, click **Skip and just ask**, and ask one of these (they map to
     the demo answers): *"How much notice before raising my rent?"*, *"How do I apply for
     SNAP?"*, *"Are there grants to fix my roof?"*
6. [ ] Done. Submit this link to the showcase folder.

> You can stop here for the showcase. When you're ready for live AI answers later, do Path B.

---

## Path B — Full deploy (real AI answers)

Do this **only if** you want the chat to generate live answers instead of the demo ones.
Deploy the **backend first**, then the frontend.

### B1. Add credits to Anthropic (required for real answers)
- [ ] Go to https://console.anthropic.com → **Billing** → add credits. **Without credits the
  answer engine returns nothing** (the app then falls back to the demo answers). This is the
  single most common reason "the chat doesn't work."

### B2. Deploy the backend to Railway
1. [ ] **railway.app → New Project → Deploy from GitHub repo**, pick your repo.
2. [ ] Railway auto-detects Python and builds it (it bakes the legal-source search index into
   the image automatically — no extra setup).
3. [ ] Open **Settings → Variables** and add:
   - [ ] `ANTHROPIC_API_KEY` = your real key (`sk-ant-…`)
   - [ ] `ALLOWED_ORIGINS` = your Vercel URL (you'll get this in B3; you can paste it after,
     then redeploy). Example: `https://rights-within-reach.vercel.app`
4. [ ] Under **Settings → Networking**, click **Generate Domain**. Copy the URL
   (e.g. `https://rights-within-reach-production.up.railway.app`).
5. [ ] Test it: open `<that URL>/health` in your browser — it should say `{"status":"ok"}`.

### B3. Deploy the frontend to Vercel
1. [ ] Do steps 1–3 of **Path A** (import repo, Root Directory = `frontend`).
2. [ ] Before deploying, open **Environment Variables** and add:
   - [ ] `VITE_API_URL` = your Railway backend URL from B2 (no trailing slash).
3. [ ] Click **Deploy**. Copy your Vercel URL.

### B4. Connect the two
1. [ ] Go back to **Railway → Variables** and set `ALLOWED_ORIGINS` to your Vercel URL.
   Railway redeploys automatically.
2. [ ] Reopen your Vercel link and ask a real question. If the answer comes back with cited
   sources, it's live. If you see the demo-style answers, the backend is unreachable or out
   of credits (check B1 and the Railway logs).

---

## Final checklist before the showcase

- [ ] The live link opens and looks right on a phone and a laptop.
- [ ] Language switching works; a topic page and the Deadline calculator work.
- [ ] The chat returns an answer (real if Path B with credits; demo answers otherwise).
- [ ] Upload the link (and your slides) to the showcase folder when it's shared.
- [ ] Have the link ready in a browser tab, and know your 2–3 demo questions.

---

## Quick troubleshooting

- **Vercel build failed** → make sure **Root Directory is `frontend`**, not the repo root.
- **Chat shows the same demo answers even in Path B** → backend is down or out of credits.
  Check `console.anthropic.com` billing, and Railway's deploy logs.
- **Chat request blocked (CORS error in the browser console)** → `ALLOWED_ORIGINS` on Railway
  must exactly match your Vercel URL (https, no trailing slash).
- **Deep links 404 on refresh** → already handled by `frontend/vercel.json`; if it happens,
  confirm that file deployed.

## Cost notes
- Vercel and Railway free tiers are enough for a demo.
- Real AI answers cost a few cents each on Anthropic (only in Path B). The demo answers are
  free. Live web-grounding (`WEB_SEARCH_ENABLED`) is billed per search — leave it off to keep
  costs near zero, or see `docs/DEPLOY.md` to tune it.
