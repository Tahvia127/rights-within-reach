# Menu / Header — design handoff (Section 1 of the section-by-section pass)

Decisions locked in for this section:
- **All 5 languages stay visible** (not a dropdown) — we just fix the legibility.
- **Header unifies into one midnight system** — links, toggles, and CTA all read as one
  color family, with a single tiny accent (like the pink dot on the *plm.* button).

Everything here maps 1:1 to what I'll build in CSS, so if your Figma frame uses these exact
numbers the implementation will match your design pixel-for-pixel. Tokens come from
`docs/design/rights-within-reach.tokens.json`.

> **TL;DR on assets:** the menu is *mostly type + color + spacing*, so there are very few
> real image files to create. Most of this doc is "design these states in Figma so I match
> them." The actual **files to export and send me** are in §6 — it's a short list.

---

## 1. Structure — two bands, full-width

```
┌───────────────────────────────────────────────────────────────────────────┐
│  BAND A · Language bar (burgundy)                                          │
│  🌐 Language   English  Español  中文  Tagalog  Tiếng Việt      🔊 Voice ▾ │
├───────────────────────────────────────────────────────────────────────────┤
│  (only when a non-English language is active)                              │
│  Cream strip: "Translations are machine-assisted — verify anything important" │
├───────────────────────────────────────────────────────────────────────────┤
│  BAND B · Header (bone)                                                    │
│  plm.-wordmark            Home  Topics  Resources   A+  ◐   ● Ask a question │
└───────────────────────────────────────────────────────────────────────────┘
```

- Band A is always visible. Band B is the main nav.
- On the **Chat** page, Band B is replaced by a compact chat header (← Back · bubble logo ·
  A+ · ◐ · read-aloud) — same visual language, spec at the end of §5.

---

## 2. Tokens to use (do not invent new hexes)

| Token | Value | Used for |
|---|---|---|
| burgundy | `#6B1F2E` | Band A background |
| midnight | `#15233E` | All header text, toggles, CTA fill |
| midnight-hover | `#0E1A30` | CTA hover |
| bone | `#F3EBE0` | Band B background, active-language text-on-burgundy |
| cream | `#FBF8F2` | MT-notice strip |
| ink | `#1F1A14` | (body — not used in menu) |
| focus | `#B8451F` | focus-visible ring (3px) |
| border-strong | `rgba(21,35,62,.25)` | toggle outlines, header bottom border |

Fonts: **Inter** for all menu text (no serif in the menu). Weights: 600 links/languages,
700 CTA. **Radius:** pills `50`, toggles `10`.

---

## 3. Band A — Language bar (burgundy), redlined

Full-width burgundy. Height **48px** (12px vertical padding, 24px horizontal). Flex row,
`gap 8px`, wraps on mobile.

### 3a. "Language" label (left)
- Optional 🌐 globe icon (16px, `bone` @ 70%) + word **"Language"** — **sentence case, not
  ALL CAPS.** Inter 14px, `bone` @ 70%. It's a quiet cue; the names below are the real
  affordance.

### 3b. The 5 language buttons — **the most important control on the page**
Native names, **natural case** (drop the current ALL-CAPS + heavy letter-spacing — it hurts
readability, especially for low-literacy readers). Labels: `English · Español · 中文 ·
Tagalog · Tiếng Việt`. Inter **15px / weight 600**. Min tap target 44px tall.

Design **4 states** as a Figma component with variants:
| State | Look |
|---|---|
| **Default** | `bone` text @ 80%, transparent bg |
| **Hover** | `bone` text @ 100%, 2px `bone` underline |
| **Active** (current language) | **filled pill**: `bone` background, `burgundy` text, radius 50, padding 4×14 — "you are here" must be obvious |
| **Focus-visible** | 3px `focus` ring, 1px offset |

Remove the `·` dot separators — spacing + the active pill carry it, cleaner.

### 3c. Voice control (right, `margin-left:auto`)
- 🔊 icon (existing `volume.svg`) + word **"Voice"** + `▾`. Opens the speech-settings popover
  (speed slider + voice picker — unchanged, just make the trigger match: `bone` @ 80%,
  hover 100%). Design the popover's open state if you want, but it can reuse the current one.

---

## 4. MT-notice strip (only when language ≠ English)
Full-width `cream` (`#FBF8F2`) strip under Band A. Text centered, Inter 14px, color
`#6b4e13`. Copy stays: *"Translations are machine-assisted…"*. Just a legible strip — no
asset.

---

## 5. Band B — Header (bone), unified midnight, redlined

Full-width `bone`, 1px bottom border `border-strong`. Height **72px** (18×24 padding).
Space-between: brand left, nav cluster right.

### 5a. Brand (left)
- `wordmark-midnight.svg` (existing). Height **40px** on desktop, **34px** mobile. Links home.

### 5b. Nav cluster (right) — order: `Home · Topics · Resources` → `A+ ◐` → CTA
**Page links** — Inter **17px / 600**, color `midnight`. Design these states:
| State | Look |
|---|---|
| Default | `midnight` text, no background |
| Hover | `midnight` text + background tint `rgba(21,35,62,.06)`, radius 10 |
| **Active** (current page) | `midnight` text + **2px `midnight` underline** (NOT a filled box — leave the one filled shape to the CTA) |
| Focus-visible | 3px `focus` ring |

**A+ toggle** (larger text) and **◐ toggle** (high-contrast) — make them blend into the
midnight system (today they're mismatched gray outlines):
| State | Look |
|---|---|
| Default | `midnight` text/glyph, 2px `border-strong` outline, 44×44, radius 10 |
| Pressed / on | **solid `midnight` fill, `bone` glyph** |
| Focus-visible | 3px `focus` ring |

**CTA — "Ask a question"** = the ONE solid anchor of the header:
- Solid **`midnight` fill**, `bone` text, Inter **700 / 17px**, radius **50** (pill),
  padding 12×22.
- **One tiny accent:** a **6px `burgundy` dot** before the label (echoes Band A, the plm.
  dot move). This is the single spot of accent color in the whole menu.
- Hover: `midnight-hover` fill.

### 5c. Chat-page header variant (same language, compact)
`← Back` (midnight text link) · bubble logo (`bubble-midnight.svg`, 34px) · `A+` · `◐` ·
read-aloud button. Same token/state rules as above.

---

## 6. 📦 Assets to EXPORT and send me (the short list)

Most of the menu is type/color (no files needed). These are the only real assets:

| # | File | Format | Size / viewBox | Color | Notes |
|---|---|---|---|---|---|
| 1 | `wordmark-midnight.svg` | SVG | ~ratio 15:3.6 | `midnight` fill, transparent bg | **Already exists** — reuse, OR send a refreshed version at the same ratio |
| 2 | `wordmark-bone.svg` | SVG | same | `bone` fill | **Already exists** — for dark surfaces/footer |
| 3 | `bubble-midnight.svg` | SVG | square | `midnight` | **Already exists** — chat header mark |
| 4 | `icon-contrast.svg` | SVG | 24×24 | `currentColor` (stroke), transparent | **New (optional):** a crisp half-filled circle to replace the raw `◐` glyph. Skip if you're fine keeping the glyph. |
| 5 | `icon-voice.svg` | SVG | 24×24 | `currentColor` | **Optional:** or I'll reuse the existing `volume.svg`. Tell me which. |
| 6 | `icon-globe.svg` | SVG | 24×24 | `currentColor` | **Optional:** the little cue before "Language". Existing `language.svg` works too. |
| 7 | `header-grid.svg` | SVG (tileable) | 24px grid | ink lines @ ~2% | **Optional decorative:** if you want the *plm.* graph-paper texture behind the header. Leave out for a flat clean look. |

**Export settings for any SVG you send:** transparent background, use `currentColor` for
single-color icons (so I can recolor via CSS for hover/pressed states), no baked-in width/
height (keep the `viewBox`), and drop them in `frontend/src/assets/` (icons → `icons/`,
logos → `logos/`).

**What you do NOT need to create** (I do these in CSS — but design them in Figma if you want
to sign off on the look): the language pills, nav links, A+/◐ button chrome, the CTA pill +
dot, hover/active/focus states, the MT-notice strip, mobile wrapping.

---

## 7. Mobile (≤720px) — design these too
- **Band A:** the 5 language pills wrap to 2 rows; the active pill keeps orientation clear.
  "Language" label + Voice control stay on the first line.
- **Band B:** wordmark shrinks to 34px; page links + CTA **hide** (the fixed bottom nav
  already carries Housing/Money/Repairs/Benefits/Resources/Ask). `A+` and `◐` stay.
- No horizontal scroll in any language — test Band A with `Tiếng Việt` active (longest).

---

## 8. Deliver back to me
1. The asset files from §6 (only the ones you choose to make/refresh).
2. A Figma frame (or screenshot) of Band A + Band B in **default** and with a **non-English
   language active**, desktop + mobile — so I match your spacing and states.

Then I implement it and we verify in the live preview together, and move to the next section.
