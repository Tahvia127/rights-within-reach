# Language Reviewer Guide — Rights Within Reach

Thank you for reviewing! Every non-English translation on this site was
**machine-drafted** and needs a native speaker to confirm it's accurate, natural,
and appropriate before we show it to the public. You are that safeguard.

You do **not** need to be a lawyer or a developer. You need to be a fluent/native
speaker who can tell us: *does this say the right thing, in a way a real person
would understand?*

---

## What you're reviewing

There are **two parts**. Please do both.

### Part A — UI strings (spreadsheet)
Short interface text: buttons, labels, prompts, the chat welcome, etc.
Your language's file:

| Language | File |
|---|---|
| Spanish | `docs/review/translations/es.csv` |
| Chinese | `docs/review/translations/zh.csv` |
| Tagalog | `docs/review/translations/tl.csv` |
| Vietnamese | `docs/review/translations/vi.csv` |

Open the CSV in Excel / Google Sheets / Numbers. Columns:

- **key** — internal name, ignore it.
- **English (source)** — the original. This is the source of truth for *meaning*.
- **[Your language]** — the draft to review.
- **status (OK / FIX)** — type `OK` if it's fine, `FIX` if it needs changing.
- **suggested correction** — if `FIX`, write your better version here.
- **notes** — anything we should know (ambiguous, too formal, etc.).

Rows marked **`MISSING`** have no translation yet (the site currently shows
English there) — please supply one in the "suggested correction" column.

### Part B — Page content (on the live site)
The legal explanations, FAQs, and the resource/organization cards are longer and
are best read **in context**. Go to the live site, switch to your language using
the bar at the top, and read these pages end to end:

1. Home
2. Housing & Rent
3. Money & Debt
4. Home Repairs
5. Public Benefits
6. Resources (the list of help organizations)
7. Ask a question (chat) — ask 1–2 real questions and read the answer

Log any problems in **`docs/review/REVIEW-language-notes.md`** (or just email them)
with the page name + the text that's wrong + your suggested fix.

---

## What to check (both parts)

✅ **Meaning is correct** — it says the same thing as the English, not something
subtly different. This matters most.

✅ **Legal terms are right** — words like *eviction, lease, garnishment, benefits,
notice, deposit* should use the term real speakers and local agencies use, not a
literal dictionary translation.

✅ **Tone is respectful and calm** — our readers may be stressed (facing eviction,
debt, etc.). Avoid wording that sounds cold, bureaucratic, or alarming. Use the
politeness level (formal/informal "you") that fits a public help service.

✅ **Plain and simple** — aim for everyday language a busy person can understand
quickly. Simpler is better than fancier.

✅ **Numbers, dates, dollar amounts, and law citations are UNCHANGED** — e.g.
"$1,000", "30 days", "5-12-130", "225 ILCS 425" must match the English exactly.
If a number differs from the English, flag it.

✅ **Symbols and arrows are kept** — things like `→`, `—`, `·`, and phone numbers
should stay as-is.

✅ **Nothing is left in English** by accident (except brand name "Rights Within
Reach" and proper org names, which can stay).

❓ If you're unsure whether something is a real legal term, just leave a note —
we'll check it.

---

## How to send it back
- Save the CSV with your `OK`/`FIX` marks and corrections, and send it back.
- For page content, send your notes file or email.
- If a word repeats many times (e.g., a wrong term for "landlord"), tell us once
  and we'll fix every occurrence.

Questions? Contact the project team. Thank you — your review is what makes this
safe to publish.
