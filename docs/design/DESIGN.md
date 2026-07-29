# Rights Within Reach — Figma & design system

There's no code→Figma export, but two plugins get you there fast: one imports the
**actual screens** as editable layers, the other imports the **design system** (colors,
type, spacing) as Figma variables/styles.

## A. Import the real screens → editable Figma layers
Use the **[html.to.design](https://www.figma.com/community/plugin/1159123024924461424)**
Figma plugin (free tier). It converts a live web page into editable Figma frames.

1. Deploy the site (or run `npm run dev` and use html.to.design's browser extension for
   localhost).
2. In Figma: Plugins → **html.to.design** → paste the URL → import.
3. Import each screen you want:
   - `/` (Home) · `/chat` (ask + answer) · `/housing` `/money` `/repairs` `/benefits`
     (topic pages) · `/resources` · `/deadline`
   - Import in **each language** and at **mobile (375px)** + **desktop** widths if you
     want the responsive/localized variants.
4. Tip: it imports as pixel-accurate frames — regroup into components afterward.

## B. Import the design system → Figma variables/styles
Use **[Tokens Studio for Figma](https://www.figma.com/community/plugin/843461159747178978)**.

1. Plugins → Tokens Studio → **Load** → import `rights-within-reach.tokens.json`
   (this folder).
2. It creates the color / font / radius / spacing tokens. Apply "Create styles" /
   "Create variables" to publish them as a Figma library.

---

## Design system reference (source of truth: `frontend/src/styles/global.css`)

### Color
| Token | Hex | Use |
|---|---|---|
| burgundy | `#6B1F2E` | Top language bar, primary brand |
| midnight | `#15233E` | Headings, primary buttons |
| clover | `#3D6B3A` | CTA / success accent |
| bone | `#F3EBE0` | Page background |
| cream | `#FBF8F2` | Card / surface background |
| ink | `#1F1A14` | Body text |
| mute | `#5F5950` | Secondary text |
| focus | `#B8451F` | Focus ring |
| border / border-strong | `rgba(31,26,20,.12)` / `rgba(21,35,62,.25)` | Dividers, card edges |

### Typography
- **Fraunces** (serif, Google Fonts, `opsz 144, SOFT 100, WONK 1`) — display & headings.
- **Inter** (sans, Google Fonts, 400–700) — body & UI.
- Scale (px): 13 · 15 · 16 · 17 · 20 · 26 (section title) · 34 · 48 (hero).

### Radius & shape
- Buttons/inputs `12`, cards `14`, larger cards `18`, tags/chips `pill (50)`.

### Key components
- **Language bar** (burgundy) with 5 language buttons + speech settings + "machine-assisted" notice.
- **Header**: wordmark, nav links, `A+` (bigger text) and `◐` (high-contrast) toggles, "Ask" CTA.
- **Structured answer card** (cream, `14` radius): confidence badge, disclaimer (top+bottom),
  Answer / Next steps / Who-to-contact sections, per-section read-aloud, copy/print, feedback.
- **Topic/resource/program cards**, **contact card**, **triage funnel**, **bottom moving-nav** (mobile).
- Icons: Streamline Core Line style (see `frontend/src/lib/icons.tsx`).

### States to design
Default · hover · focus-visible (3px outline) · **high-contrast mode** · **larger-text mode** ·
mobile (≤720px: top page-links collapse to the bottom nav) · RTL is not used (all LTR).
