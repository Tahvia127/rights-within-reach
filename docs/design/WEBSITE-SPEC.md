# Rights Within Reach — full website specification (for Figma)

Everything on the site: pages, sections, components, flows, states, and content, so
you can lay it out or annotate it in Figma. Pair this with `DESIGN.md` (import methods)
and `rights-within-reach.tokens.json` (colors/type/spacing). Source of truth is the
live app — this describes what's actually built.

---

## 1. Product overview
- **What:** a free, mobile-first web app giving plain-language **legal information** (never
  legal advice) to Illinois residents about **housing & rent, money & debt, home repairs,
  and public benefits**.
- **Who:** working-class families, immigrants, older homeowners — often on a phone, stressed,
  low-literacy, or non-English-speaking.
- **Voice:** calm, respectful, 6th-grade reading level, short sentences.
- **Languages:** English, Spanish, Chinese, Tagalog, Vietnamese (auto-detected from browser;
  switchable; whole site + answers translate). A banner notes translations are machine-assisted.
- **Trust spine:** every answer cites sources, shows a confidence rating, is bracketed by
  disclaimers, and points to a real, verified organization. Out-of-scope questions are refused.

## 2. Site map (routes)
| Route | Page |
|---|---|
| `/` | Home |
| `/chat` | Ask a question (triage → structured answer) |
| `/housing` `/money` `/repairs` `/benefits` | Topic pages (shared template) |
| `/resources` | Resource directory (~44 orgs) |
| `/deadline` | Deadline helper (date calculator) |

---

## 3. Global chrome (on every page)

### 3a. Language bar (top, burgundy `#6B1F2E`)
- `LANGUAGE` label + 5 language buttons: **ENGLISH · ESPAÑOL · 中文 · TAGALOG · TIẾNG VIỆT**
  (each shows its own name; active one underlined/bold).
- Right side: **speech settings** control (▾) — popover with playback **speed** (slider 0.5×–2×)
  and **voice** picker (grouped: recommended-for-language, then all voices).
- Below the bar (non-English only): **machine-assisted translation notice** (cream strip).

### 3b. Header
- **Site header** (all pages except Chat): brand wordmark (links home) · nav links **Home ·
  Topics · Resources** · **A+** (larger-text toggle) · **◐** (high-contrast toggle) ·
  **Ask a question →** CTA (clover green).
- **Chat header** (Chat only): **← Back** · compact bubble logo · **A+** · **◐** · read-aloud.
- Mobile (≤720px): the three page links hide (covered by the bottom nav) and the CTA hides;
  brand wordmark shrinks. A+ and ◐ stay.

### 3c. Footer
- Brand bubble + tagline; three link columns:
  - **Topics:** Housing & Rent · Money & Debt · Home Repairs · Public Benefits
  - **Help:** Ask a question · Find legal help · **Deadline helper** · How to use this site
  - **About:** Who we are · Our partners · Contact
- Bottom: disclaimer line ("general legal information, not legal advice… Built in Chicago").

### 3d. Bottom moving-nav (fixed bottom bar, all pages except Chat)
- Icon+label items: **Housing · Money · Repairs · Benefits · Resources · Ask** (Ask is the
  green primary). Labels wrap on small screens.

---

## 4. Home (`/`)
1. **Hero** — eyebrow ("For Illinois residents"), serif **title**, subtitle, two buttons
   (**Start** / **How it works**). Decorative burgundy ellipse with a stylized sample question
   ("Can my landlord do that?") + 3 floating stickers (free / cited / languages).
2. **Ticker** — auto-scrolling badges with pause/play: Free to use · Plain language ·
   Multilingual · Cited sources · No login needed · Built in Chicago.
3. **About** section (bone) — eyebrow, title, read-aloud, subtitle, 4 lead+body paragraphs,
   and a column of 4 **fact cards** (sources · languages · categories · cost).
4. **How it works** (cream) — 4 numbered **step cards** (icons: chat, book, check, phone).
5. **Walkthrough** (bone) — 5-step ordered list (question → answer → help).
6. **Topics** (cream) — 4 **topic cards** in a grid: Housing (badge "most asked"), Money,
   Repairs, Benefits (badge "new"). Each: icon, title, description, "read more".
7. **Partners** (midnight, dark) — eyebrow, title, body, partner name pills.

## 5. Ask a question (`/chat`)
**Layout:** Chat header → status line → conversation area → input bar. No footer nav overlap.
- **Status line:** "Live conversation" pill · "N questions so far" · "All answers cite the law".
- **Welcome empty-state:** friendly translated intro.
- **Triage funnel** (skippable at each step, "Skip and just ask →"):
  1. **Area** — Chicago · Suburban Cook County · Collar county (DuPage, Lake, Will…) · Elsewhere in Illinois
  2. **ZIP** (optional) — text field + Next
  3. **Subject** — Housing · Money · Repairs · Benefits
- **Suggested starter chips** (e.g., "What if the notice was late?", "How do I apply for SNAP?").
- **Answer card** (cream, radius 14), top→bottom:
  - "✓ Answered" sticker · **confidence badge** (High = green / Medium = amber / Low = red) ·
    **share actions** (⧉ Copy · ⎙ Print)
  - **Disclaimer** (top) with read-aloud
  - **Answer** section (heading + read-aloud + body)
  - **Next steps** (numbered list)
  - **Who to contact & how** → **Contact card**: org name, sub, why, how, **Phone / Hours**,
    "Call now" button
  - **Disclaimer** (bottom)
- **Sources block:** grid of source cards (title + section); web-checked sources get a **"Web"** tag.
- **Feedback row:** "Was this helpful?" 👍 / 👎 → "Thanks for your feedback!"
- **Follow-up chips:** model-suggested next questions.
- **Refusal card** (out-of-scope: immigration/criminal/family/danger): title, body, **referral
  org card** (name, description, phone, hours), "Call now" + "More options".
- **States:** loading (bot typing), error ("having trouble… try again").
- **Input bar:** textarea (placeholder "Type your question here…") · **mic button** (voice
  input, pulses while listening) · **send** button.

## 6. Topic pages (`/housing` `/money` `/repairs` `/benefits`) — shared template
- **Hero:** breadcrumb (Home · Topic), topic icon, eyebrow, serif title, subtitle.
- **Quick-nav** chips (jump to sections).
- **Content** (per language):
  - **Summary** — "what you need to know" intro
  - **FAQs** — question + plain-language answer (each cites a source)
  - **Programs** — cards with name, **amount**, meta (region/eligibility), body, CTA
  - **Steps** — numbered how-to
  - **Referral** — where to get help
- Per-section **read-aloud** buttons throughout.

## 7. Resources (`/resources`)
- **Hero.**
- **~44 organization cards** grouped into sections: Housing · Money · Repairs · Benefits ·
  Court & self-help · Safety / domestic violence · Veterans · LGBTQ+.
- **Card:** org **name**, **tag** (Chicago / Statewide / Federal / Nonprofit…), **description**,
  and two **meta chips** (★ phone or website · ✦ hours or descriptor).
- **"What to bring" cards** — checklists for common situations.

## 8. Deadline helper (`/deadline`)
- **Hero:** calendar icon, title "Deadline helper", subtitle ("a date calculator, not legal advice").
- **Form card:** Start date (date picker) · Number of days · "Count business days only (skip
  weekends)" checkbox · **Calculate deadline** button.
- **Result card** (cream, clover border): "Your deadline is:" + the computed date (localized,
  e.g. "Saturday, January 31, 2026").
- **Disclaimer** paragraph.

---

## 9. Design system (see tokens file)
- **Color:** burgundy `#6B1F2E` (brand bar), midnight `#15233E` (headings/buttons), clover
  `#3D6B3A` (CTA), bone `#F3EBE0` (page bg), cream `#FBF8F2` (cards), ink `#1F1A14` (text),
  mute `#5F5950` (secondary), focus `#B8451F`.
- **Type:** Fraunces (serif display) + Inter (sans body); scale 13/15/16/17/20/26/34/48 px.
- **Radius:** buttons/inputs 12, cards 14, big cards 18, tags/chips pill (50).
- **Icons:** Streamline Core Line style.

## 10. Cross-cutting components (for a Figma library)
Language bar · header (site + chat) · footer · bottom nav · button (midnight / outline /
clover / pill) · topic card · resource card · program card · fact card · step card · contact
card · answer card (with confidence badge, share, feedback, sources) · refusal card · triage
panel · chip (suggestion / follow-up / tag) · source card · read-aloud button · mic button ·
speech-settings popover · A+ / ◐ toggles · MT-notice banner · disclaimer block · deadline form.

## 11. States & accessibility (design these variants)
- **Interaction:** default · hover · active · **focus-visible** (3px outline).
- **Accessibility modes:** **high-contrast** (darker text, black borders, underlined links) ·
  **larger text** (A+ scales rem-based type) — design both.
- **Read-aloud:** idle vs playing (per section).
- **Voice input:** idle vs listening (pulsing mic).
- **Confidence:** High / Medium / Low badge variants.
- **Empty / loading / error / refusal** states in Chat.

## 12. Responsive
- **Desktop:** multi-column grids, full top nav.
- **Mobile (≤720px):** single-column; top page-links + CTA collapse into the fixed **bottom
  nav**; brand shrinks; card meta + nav labels wrap; **no horizontal scroll** in any language.
- All layouts LTR (no RTL languages).

## 13. Platform notes
- **PWA:** installable ("Add to Home Screen"), opens standalone, works **offline** for all
  static content (chat needs the network). Theme color = burgundy.
- **Privacy:** no login; no raw questions or IPs logged.
- **Freshness:** legal sources re-checked and re-ingested daily.
