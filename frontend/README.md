# Rights Within Reach — Frontend

Free, plain-language legal information for Illinois residents. Built in Chicago at the University of Chicago Tech Showcase, in partnership with Illinois Legal Aid Online, the Lawyers' Committee for Better Housing, and the Stanford Legal Design Lab.

## Stack

- **React 18** with **TypeScript**
- **Vite** for the dev server and bundling
- **React Router** for the seven pages
- **vite-plugin-svgr** so SVG icons import as React components

## Getting started

```bash
# Install
npm install

# Dev server on http://localhost:5173
npm run dev

# Production build
npm run build

# Preview the production build
npm run preview
```

## Environment

Copy `.env.example` to `.env.local` and set the API URL:

```
VITE_API_URL=http://localhost:8000
```

If unset, the client defaults to `http://localhost:8000`.

## Project structure

```
src/
├── main.tsx              React entry, providers, router setup
├── App.tsx               Routes + logo CSS variable injection + page title effects
├── assets/
│   ├── icons/            24 Streamline Core Line icons (stroke=currentColor)
│   └── logos/            Wordmark + bubble logos in midnight and bone variants
├── components/
│   ├── BigTextProvider.tsx   A+ toggle state, scales rems via html.big-text class
│   ├── ChatHeader.tsx        Compact header for the Chat page
│   ├── LanguageStrip.tsx     Top bar with 5 language switcher buttons
│   ├── SiteHeader.tsx        Full header with logo, nav, A+, and Ask CTA
│   ├── SiteFooter.tsx        4-column footer, sitemap, bone wordmark, disclaimer
│   ├── SkipLink.tsx          W3C 2.4.1 keyboard skip-to-main-content
│   ├── Ticker.tsx            Scrolling banner with pause/play (W3C 2.2.2)
│   └── TopicPage.tsx         Shared layout for the 4 topic pages
├── lib/
│   ├── api.ts            POST /ask client + AskResponse types
│   ├── icons.tsx         Icon component with name-based registry
│   └── translations.tsx  Language context + i18n provider (en filled in, others stubs)
├── pages/
│   ├── Home.tsx          Hero, ticker, about, how it works, walkthrough, topics, partners
│   ├── Chat.tsx          3 demo Q&A exchanges + live input bar (calls /ask)
│   ├── Housing.tsx       Topic content for Housing & Rent
│   ├── Money.tsx         Topic content for Money & Debt
│   ├── Repairs.tsx       Topic content for Home Repairs
│   ├── Benefits.tsx      Topic content for Public Benefits
│   └── Resources.tsx     Directory of orgs + 5 things to do today + what to bring
└── styles/
    └── global.css        Design tokens, components, responsive breakpoints
```

## Design tokens

All in `src/styles/global.css` as CSS variables under `:root`:

| Token | Hex | Role |
|---|---|---|
| `--burgundy` | `#6B1F2E` | Identity, headlines, source citations |
| `--midnight` | `#15233E` | Structure, buttons, footer |
| `--clover` | `#3D6B3A` | Action, success, "Start here" callouts |
| `--bone` | `#F3EBE0` | Canvas background |
| `--cream` | `#FBF8F2` | Card backgrounds |
| `--ink` | `#1F1A14` | Body text |
| `--mute` | `#5F5950` | Secondary text |
| `--focus` | `#B8451F` | Focus rings (high-contrast over bone) |

Typography:
- **Recoleta-style display:** Fraunces (Google Fonts) with `font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1`
- **Body:** Inter

## Accessibility

This site is built to W3C Older Users guidance (see `https://www.w3.org/WAI/older-users/developing/`). Specific success criteria implemented:

| Criterion | How |
|---|---|
| 1.4.4 Resize Text (AA) | All sizes in rem, base 22px → 32px with A+ |
| 1.4.6 Contrast Enhanced (AAA) | 7:1 burgundy/midnight on bone/cream |
| 2.2.2 Pause Stop Hide (A) | Ticker has pause/play button |
| 2.4.1 Bypass Blocks (A) | Skip-to-content link on every page |
| 2.4.2 Page Titled (A) | Unique `<title>` per route via `App.tsx` |
| 2.4.7 Focus Visible (AA) | 4px high-contrast outline on all focusable elements |
| 3.1.4 Abbreviations (AAA) | `<abbr>` tooltips for RLTO, SNAP, HAFHR, etc. |
| prefers-reduced-motion | Ticker animation disabled for users who opt out |

## API integration

The Chat page calls `POST /ask` on the FastAPI backend. The response shape is in `src/lib/api.ts`:

```ts
interface AskResponse {
  answer: string
  key_points?: Array<{ label: string; text: string }>
  note?: string
  sources: Source[]
  topic: string
  refused?: boolean
  refusal_org?: { name, sub, description, phone, hours }
}
```

The Chat page seeds with three demo exchanges (housing, debt, refusal) so the demo can render without a live backend. Live questions submit to `/ask` and append to the conversation.

## Notes for translators

`src/lib/translations.tsx` has the English strings filled in and stubs for Spanish, Chinese, Tagalog, and Vietnamese. The `t()` function falls back to English when a key is missing. To add a translation, populate the appropriate language object with the same keys.

## Production deploy

The site is a static build (no SSR), suitable for Vercel, Netlify, or Cloudflare Pages. After `npm run build`, the contents of `dist/` are ready to deploy. Make sure to configure SPA fallback so React Router routes resolve client-side.
