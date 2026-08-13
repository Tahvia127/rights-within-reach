# Rights Within Reach — Growth Review & Roadmap

A prioritized plan across four dimensions — **UI/UX, accessibility (ADA / WCAG 2.1 AA),
state expansion, and languages** — from a full pass over the current codebase plus current
external data. Organized by effort: **Quick wins → Medium bets → Larger investments**, with
the two confirmed lead moves called out. File references are `path:line` where load-bearing.

## The one theme that connects everything

**The backend went multi-state; the content didn't.** The triage funnel lets users pick
CA/MO/TX/NY and `/api/orgs` returns real per-state orgs — but almost everything a user
*reads* is still Illinois/Chicago-only: the homepage org pills, the ticker, every topic
page ("…in Illinois", RLTO, "call 311"), and the ~40-org Resources page. **A Texas user
selects "TX" and is then shown Chicago eviction law.** For a legal tool, a silent
jurisdiction mismatch is worse than no answer.

The strategic consequence: **make the content jurisdiction-aware (or honestly gate it)
before adding Florida** — otherwise each new state multiplies the mismatch. This one
insight links the UI audit and the expansion plan.

Two things to know going in: the app is **already accessibility-conscious** (skip link,
route focus management, `:focus-visible` rings, broad `prefers-reduced-motion`, large touch
targets, strong text contrast) — the gaps are targeted, not systemic. And the two easiest
high-impact growth moves are **Florida** (next state) and **finishing Polish** (next language).

---

## Quick wins — this week (cheap, high trust/impact)

Several of these serve usability *and* accessibility at once — done together.

1. **Fix dead links & no-op buttons.** The footer's entire "About" column links to `/`
   (`SiteFooter.tsx:28,34,35`); the refusal card's "More options" (`Chat.tsx:765`) and every
   topic page's "See other orgs" (`Housing.tsx:278` via `TopicPage`) buttons do nothing. On a
   tool whose homepage sells "Why you can trust this," inert controls read as broken — and
   they confuse keyboard/screen-reader users. Wire "See other orgs" to `/resources`; remove or
   route the rest. *(UI + a11y, near-zero effort, highest trust ROI.)*

2. **Make the answer render accessible & visible — one fix, three wins.** After submit the
   chat never scrolls (`Chat.tsx:239-252`), so on a phone the answer appears below the fold and
   stressed users think it failed; a screen reader hears "Searching…" then silence (the
   `AnswerCard` has no live region and focus stays in the empty textarea — **WCAG 4.1.3
   blocker**). Fix once: after `setMessages`, move focus to the new answer container
   (`tabindex={-1}` + `.focus()` keyed on message count), add a polite live region announcing
   `chat.answerReady`, and `scrollIntoView` the answer heading. *(UI #3 + a11y blocker.)*

3. **Answer-card hierarchy.** The disclaimer renders **twice** — top *and* bottom of every
   answer (`Chat.tsx:589-594` & `:651`) — pushing the answer down; and a green "Answered ✓"
   sticker (`Chat.tsx:584`) shows even on **low-confidence** answers, over-reassuring the most
   vulnerable users. Show the disclaimer once (bottom); suppress/restyle the sticker when
   `confidence === 'low'` and lead with the warm-handoff CTA instead.

4. **Focus-ring contrast on dark bars [AA blocker].** The orange focus ring
   (`--focus:#B8451F`, `global.css:61-65`) is only ≈2.9:1 on the navy bars
   (`--midnight #15233E`) behind the language strip, header nav, and back button — under the
   3:1 required by 1.4.11. Add a light ring on dark surfaces:
   `.lang-strip *:focus-visible,.site-header *:focus-visible,.chat-header *:focus-visible{outline-color:var(--bone)}`.

5. **Enter-to-send.** The composer is a `<textarea>` with no key handler (`Chat.tsx:281-307`),
   so on desktop Enter inserts a newline and nothing sends — reads as broken to anyone trained
   on chat apps. Add `onKeyDown` (Enter submits, Shift+Enter newline).

6. **Landmark & heading fixes [a11y].** Remove the duplicate `role="banner"` on hero headers
   (`TopicPage.tsx:66`, `Deadline.tsx:46` — `SiteHeader` already is the banner); fix the Chat
   heading skip (h1 → h4) by promoting `SectionHead` to `<h2>`/`<h3>` (`Chat.tsx:543`).

7. **`lang` on the language switcher [a11y].** The native labels ("Español / 中文 / Tiếng
   Việt / Polski") have no `lang` attribute (`LanguageStrip.tsx:10-20`), so a screen reader
   mispronounces them. Add `lang={code}` per button (zh→`zh`, tl→`fil`, …).

8. **Generic ZIP hint.** The translated `findhelp.zipHint` strings literally say "a Chicago
   ZIP picks Chicago" for *every* state (zh/tl/vi). Replace with one generic string ("We'll
   show organizations closest to your ZIP first").

---

## Medium bets — this month

9. **"You're seeing Illinois information" banner.** The full state-aware-content fix is a
   larger investment (below), but a persistent banner on Illinois-only pages when
   `rwr.state !== 'IL'` is cheap and immediately stops the silent mismatch. Same for the
   **skip path**, which currently keeps the default IL state silently (`Chat.tsx:368-374`) — a
   Missouri user who skips gets IL law as authoritative; at minimum surface the assumed state
   in the summary bar with a one-tap change.

10. **Funnel: progress + Back + editable chips.** The funnel shows one prompt at a time with
    only a "Skip" escape (`Chat.tsx:402-473`); no "Step 2 of 4", no Back, and "Edit" restarts
    at the first step. Add a step indicator, a Back button (the `triageStep` state machine
    already exists), and make the summary chips (`Chat.tsx:259-267`) individually re-editable.

11. **Honest loading & error states.** Add a visible animated indicator (respecting
    reduced-motion) anchored in view. Critically, a real outage currently **silently serves a
    demo answer as if real** — both the soft-fail and `catch` fall back to `matchDemoAnswer`
    (`Chat.tsx:176,180`), so `ErrorMessage` is dead code. Distinguish "offline/example info"
    from a live answer with a small banner — a content-integrity issue for legal guidance.

12. **Bottom nav legibility.** 6 items with ~10px wrapping labels (`global.css:1046`),
    horizontal-scroll hides items, and "Home" is only reachable via the logo. Cut to 4-5 items
    (fold topics behind one "Topics", add explicit Home), raise labels to ≥0.72rem, drop
    `overflow-x:auto`, and let BigText scale them.

13. **Language switcher prominence & Resources scannability.** The switcher is the right
    place but under-weighted for the people who most need it (`LanguageStrip.tsx`) — increase
    size/weight, add a globe affordance. Resources is an overwhelming ~50-card single scroll
    (`Resources.tsx:505-581`) — add the sticky jump-links the `TopicPage` `quick-nav` already
    implements, and lead with the personalized finder result.

14. **Finish Polish (language).** Lowest-effort language win — the `pl` scaffolding + org
    block already exist; just complete the ~250 keys and have the legal glossary reviewed. It's
    Chicago's top city-*mandated* LEP language.

15. **RTL groundwork [a11y, unlocks Arabic/Urdu later].** No `dir` management exists and the
    CSS is almost entirely physical (`text-align:left`, `padding-left`, `left:`…). Start now:
    set `document.documentElement.dir` in `setLanguage` (`translations.tsx:1810`), and migrate
    to logical properties (`text-align:start`, `padding-inline-start`, `inset-inline-start`,
    `border-start-start-radius`). Also add `color-scheme: dark` in `.dark` for native controls,
    and dark-mode variants for `.conf-high`/`.conf-low` badges.

16. **SpeechSettings dialog semantics [a11y].** The popover claims `role="dialog"`
    (`SpeechSettings.tsx:41`) with no focus trap, Escape-to-close, or focus return. Either drop
    to a disclosure (the `aria-expanded` button already implies it) + add Esc/outside-click, or
    implement full modal semantics; add `aria-controls`.

---

## Larger investments — this quarter

17. **State-aware content (the deep fix).** Make the topic pages, Resources, homepage org
    pills, and ticker follow the persisted `rwr.state` the triage already stores. This is the
    prerequisite for honest multi-state and the biggest single trust improvement. Structure the
    topic content by state the way the backend corpus already is.

18. **Add Florida end-to-end (next state).** Follow the `docs/STATE_EXPANSION.md` recipe:
    verify FL primary law (clean free **Online Sunshine** portal), `_contact_fl` routing +
    FloridaLawHelp, `ALLOWED_DOMAINS`, frontend selector, adversarial eval. FL is the rare
    easiest-*and*-highest-impact state (see table) — and its 400k+ Haitian Creole population
    makes **Haitian Creole** the natural paired language. Do #17 first, or Florida deepens the
    mismatch.

19. **Add Korean, then Russian (languages).** Both left-to-right, both with dense monolingual
    demand in metros you already serve (Korean: LA/NYC/Chicago; Russian: NYC's 3rd-largest LEP
    group). Same lift as any locale block + glossary + back-translation eval.

20. **Full RTL CSS pass → unlock Arabic + Urdu + Farsi.** After the groundwork (#15),
    invest once in the RTL layout pass; it unlocks all three high-impact, Chicago-*mandated*
    (Arabic/Urdu) languages together.

---

## Reference: expansion rankings (verified externally)

### Next states — ease × impact
| Rank | State | Ease (statutes portal / LawHelp) | Impact | Verdict |
|---|---|---|---|---|
| 1 | **Florida** | HIGH — Online Sunshine portal; FloridaLawHelp; *simple* landlord-tenant law | HIGH — ~23M, huge renter base, 400k+ Haitian Creole | **Easiest high-impact — do next** |
| 2 | Michigan | HIGH — clean MCL portal; **Michigan Legal Help** (best self-help site in the US) | MED-HIGH | Best content source |
| 3 | Ohio | HIGH — `codes.ohio.gov`; OhioLegalHelp | MED-HIGH | Very easy add |
| 4 | Washington | HIGH — clean RCW portal; WashingtonLawHelp | MED-HIGH | Tenant-protective but well-documented |
| 5 | Georgia | MED — code on session-based LexisNexis (fetch tax); GeorgiaLegalAid | **HIGH** — Atlanta #1 eviction rate (~25%) | Highest need, statute friction |
| 6-8 | Massachusetts / New Jersey / Pennsylvania | portals fine; complex LT law or split statutes | MED-HIGH | Solid mid-tier |

*Note: `data/orgs.csv` only covers metros inside the 5 live states, so no new state gets a
"free orgs" pass — but routing degrades gracefully to the statewide LawHelp finder + 211.*

### Next languages — ease × impact
| Rank | Language | LEP signal (covered metros) | RTL? | Verdict |
|---|---|---|---|---|
| 1 | **Polish** (partial) | Chicago's top *mandated* LEP language | No | **Finish first — cheapest** |
| 2 | **Korean** | ~49% LEP; LA Koreatown + NYC + Chicago | No | Top new language |
| 3 | **Russian** | NYC 3rd-largest LEP; Chicago, SF | No | Strong #2 new |
| 4 | **Haitian Creole** | NYC + 400k+ Florida | No | Pairs with a Florida add |
| — | Arabic / Urdu / Farsi | Chicago-mandated (ar/ur); LA (fa) | **Yes** | High impact, gated on one RTL pass (#20) |

---

## Suggested sequence

1. **This week:** Quick wins 1-8 (dead buttons, the answer render/announce fix, disclaimer +
   sticker, focus ring, Enter-to-send, landmarks/headings, `lang` labels, ZIP hint). Cheap,
   high daily impact, and they fix the two WCAG AA blockers.
2. **This month:** the IL-information banner + skip-state fix (9), funnel progress/back (10),
   honest loading/error (11), nav legibility (12), **finish Polish** (14), RTL groundwork (15).
3. **This quarter:** state-aware content (17) → **Florida** (18) → **Korean/Russian** (19);
   then the RTL pass (20) to unlock Arabic/Urdu/Farsi. Ship Florida and Haitian Creole together.

**Bottom line:** the app is well-built and already accessibility-conscious; the highest-value
work is closing the content-vs-triage gap (so multi-state is honest) and picking off a dense
cluster of cheap trust/accessibility fixes — then growing deliberately, **Florida + Polish**
first.
