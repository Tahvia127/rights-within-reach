# Rights Within Reach — 5-minute demo script

A tight walkthrough for the UChicago Tech Showcase. Goal: show the four pillars —
**guided triage → structured, cited answer → read-aloud → any language** — plus the
safety guardrails. Site: **https://www.rightswithinreach.org**

Tip: have the site open on `/` in English before you start. Keep a phone handy to
show the mobile layout.

---

## 0. The hook (15 sec)
> "If you're facing eviction or a debt collector in Illinois and you don't speak
> English or can't afford a lawyer, where do you turn? Rights Within Reach gives
> free, plain-language legal *information* — in five languages, out loud, and it
> always points you to a real human who can help."

---

## 1. Guided triage → structured answer (90 sec)
1. Click **Ask a question**.
2. Walk the funnel: **Chicago → (skip ZIP) → Housing**.
3. Type: **"How much notice does my landlord need to give before raising my rent?"**
4. When the answer lands, point out the structure:
   - **Confidence badge** (High/Medium/Low) at the top.
   - **Answer** in plain language, then **Next steps**, then **Who to contact & how**
     (a real, verified org with a working phone number).
   - **Disclaimer** top and bottom — "information, not legal advice."
   - **Cited sources** — every claim is grounded; some tagged **Web** (a live,
     allow-listed check of IL gov / legal-aid sites).

## 2. Read-aloud, per section (45 sec)
1. Tap **"Read this answer aloud"** on the Answer section.
2. Note it reads *just that section* — someone can listen to the part they need.
3. Open the **speed/voice control** in the top bar; nudge the speed slider.

## 3. Any language, instantly (60 sec)
1. Switch to **Español** (top bar). The whole page — including that answer — is now
   Spanish.
2. Tap read-aloud again: it now speaks in a **Spanish voice**.
3. Mention: five languages (English, Spanish, Chinese, Tagalog, Vietnamese), and the
   honest **"machine-assisted, under review"** banner while native speakers verify.

## 4. The safety guardrails (45 sec)
1. Back in the chat, ask something **out of scope**: **"My landlord and I are getting
   divorced, who gets the house?"**
2. Show that it **declines politely** (family law is out of scope) and still routes to
   a real referral org — it never guesses at law it doesn't cover.
3. One line on trust: **"Every answer is grounded in cited sources, checked against
   authoritative sites when coverage is thin, and re-ingested every morning so the
   information stays current."**

---

## If asked "how does it work?" (30 sec)
- **RAG**: ~940 chunks from 130+ tracked IL legal-aid + statute sources (Chroma +
  sentence-transformers), retrieved and answered by Claude with a strict
  information-not-advice system prompt and forced structured output.
- **Adaptive web-grounding**: strong corpus coverage answers fast; thin coverage
  triggers a live, allow-listed web check and lowers the confidence rating.
- **Freshness**: a daily 8 AM CT job safely re-fetches sources and flags changed
  legal text for review.
- **Privacy**: no login, no raw questions or IPs logged by default.

## Backup questions that demo well
- "Can a debt collector call me at work?" (strong corpus, fast, High confidence)
- "My landlord shut off my heat in winter — is that legal?" (housing repair)
- "How do I apply for SNAP?" (benefits)

## If the live demo fails
Have a screen recording of the four steps above as a fallback, and mention the
architecture points from "how does it work?".
