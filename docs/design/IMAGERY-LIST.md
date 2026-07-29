# Imagery to create — replacing the accessory graphics

You asked to strip the scattered "accessory images" and get one clean, even, informational
visual system (like the examples: plm. / September Sun / the charity sites). This doc lists
**what I removed** and the **consistent set of images to create** so the site reads sleek and
easy to understand for all ages and languages.

---

## 1. What I removed (old ad-hoc decorations)
| Where | Removed |
|---|---|
| Home hero | 2 sparkle "stars", the burgundy **ellipse quote-bubble** ("Can my landlord do that?"), and the 3 tilted floating **stickers** (Free / Cited / 5 Languages) |
| Answer card + topic referral | Kept the "✓ Answered" and "★ Start here" labels but **removed the tilt** so they sit even |
| Menu | Made `A+` / `◐` equal squares; unified everything in the midnight bar |

The hero is now a clean centered layout (eyebrow → title → subtitle → 2 buttons), evenly
spaced. The "Free / Cited / Multilingual / No login" messaging still lives in the **ticker**
strip, so no information was lost.

Note: the translation keys `home.sticker.*` and `home.hero.svg1–3` are now unused (left in
place, harmless). Say the word and I'll delete them.

---

## 2. The one style rule (so imagery comes out "even")
**Pick ONE visual language and use it everywhere.** Mixing photos + clip-art + stickers is
what made it feel busy. Two good options — choose one:

- **A. Warm authentic photography** *(recommended — matches September Sun / the charity refs
  and reads as trustworthy for all ages/languages):* real, diverse Illinois people in real
  settings (someone on a phone at home, a family at a kitchen table, a community worker).
  Natural light, no stock-cliché handshakes. Lightly graded toward the palette (warm bone
  highlights, midnight shadows).
- **B. Flat illustration:** one consistent style — **1–2 brand colors only**, even stroke
  weight, rounded, flat (no gradients, no drop shadows), friendly and simple.

Then apply the same rules to **every** image:
- **Same aspect ratios per role** (below), **same corner radius** (14px on cards, 18px on
  large blocks), centered, same padding.
- **No flags** (use language *names*, already done), no tilted/rotated elements, no confetti.
- Every image needs **alt text** (translatable); purely decorative ones get `aria-hidden`.
- Export **SVG** for icons/illustrations, **WebP or optimized JP/PNG** for photos, into
  `frontend/public/img/` (photos) or `frontend/src/assets/` (vector).

---

## 3. The list — create these

| # | Asset | Where it goes | Aspect / size | Format | Notes |
|---|---|---|---|---|---|
| 1 | **Home hero image** | Home hero (I'll rebuild it 2-column when you deliver this — text left, image right) | 4:3 or 1:1, ≥ 1200×1200 | WebP/JPG (or SVG if illustration) | The one hero moment. A real person/family, or a single clean illustration. Warm, calm. |
| 2 | **Topic hero images ×4** | `/housing` `/money` `/repairs` `/benefits` heroes | 3:2, ≥ 1200×800 | WebP/JPG or SVG | One per topic, **same treatment/crop** so the 4 pages feel like a set. Housing = a home/keys; Money = bills/mail; Repairs = a fix-it moment; Benefits = a family/community. |
| 3 | **About / "How it works" support image** | Home About or How-it-works section (optional) | 3:2, ≥ 1000×667 | WebP/JPG or SVG | Warms the explainer without clutter. Same style as #1. |
| 4 | **Open Graph / share image** | Social preview when someone shares a link/answer | 1200×630 | PNG | Brand-colored (midnight or bone) with the wordmark + tagline "Know your rights. In your language." Ties into the shareable-answer-link feature. |
| 5 | **PWA app icons** | Install / home-screen icon | 192×192 **and** 512×512 (plus a maskable 512 with safe padding) | PNG | You have `favicon.svg`; these two PNGs are what "Add to Home Screen" needs. Solid bone or midnight background, centered mark. |
| 6 | **Apple touch icon** | iOS home screen | 180×180 | PNG | Same mark as #5, no transparency. |
| 7 | *(optional)* **4 "How it works" step icons** | The 4 numbered step cards | 48×48 viewBox | SVG, `currentColor` | ONLY if you want art on the steps. Keep them in the **same Streamline line style** already used elsewhere — don't introduce a second icon style. |

**Do NOT recreate** (already consistent, keep as-is): the Streamline **line icons**
(`frontend/src/assets/icons/`), the **wordmark** logos (`wordmark-midnight/bone.svg`), the
**bubble** mark (`bubble-midnight.svg`).

**Still open from the menu work:** a **`bubble-bone.svg`** (bone version of the chat bubble
mark) if you want the Chat screen's header to go midnight to match the main menu.

---

## 4. Deliver back to me
Drop the files in and tell me which you made. For #1–3 I'll wire them into balanced,
even layouts (fixed aspect ratios, consistent radius, proper alt text in all 5 languages).
For #4–6 I'll add the `<meta>`/manifest links. Then we verify in the preview and move on.
