# Chicago-Area Resources — research log

_Compiled 2026-06-26 from the 2026-06-26 meeting action items. Two buckets:_
_**(A) help orgs** people can be routed to, and **(B) content sources** we can ingest._
_Contacts were web-verified on 2026-06-26 — re-check phone/hours before relying on them._

Meeting distinctions to preserve:
- **Court resources ≠ legal resources.** Court help explains *how the process works*; legal aid gives *advice/representation*.
- **Prevention assistance ≠ rental assistance.** Prevention stops a crisis *before* eviction court; rental assistance pays arrears, often *during* a case.

---

## A. Help orgs — human routing (by category)

### Start here / non-emergency routing
| Org | Contact | Hours | Notes |
|---|---|---|---|
| **211 Metro Chicago (United Way)** | Call/text **2-1-1** (or 773-362-4401) | 24/7, free | Routes to local rent/utility/eviction-prevention, food, shelter. **Meeting priority.** Added to Resources page (featured). |
| **Chicago 311** | **311** (or 312-744-5000) | 24/7 | Report no heat/water/pests; request city services. Already on site. |
| Salvation Army (N. & Central IL) | 773-205-3520 / 1-800-725-2769 | — | Rent/mortgage, utility, food assistance. |
| Catholic Charities (Archdiocese of Chicago) | 312-655-7500 | — | Emergency rent/utility, shelter, crisis help; any faith. **Added to site.** |

### Tenant / housing
| Org | Contact | Hours | Notes |
|---|---|---|---|
| **Metropolitan Tenants Organization (MTO)** | **773-292-4988** | Mon–Fri 1–5pm (VM 24/7) | Bilingual tenants'-rights hotline. **Meeting priority. Added to site** (replaced the out-of-state "Tenants Together"). |
| Lawyers' Committee for Better Housing (LCBH) | 312-784-3507 | — | Tenant defense, voucher protection. On site. |
| Legal Aid Chicago — Housing | 312-341-1070 | Mon–Fri | Eviction/foreclosure defense. On site. |
| HOPE Fair Housing Center | 630-690-6500 | — | Housing **discrimination** (race, disability, source-of-income/voucher). **Added to site.** |
| Open Communities | 847-501-5760 | — | Fair housing, N. Cook/Lake/Boone/McHenry. |

### Court (self-representation) — distinct from legal aid
| Org | Contact | Hours | Notes |
|---|---|---|---|
| **Illinois Court Help** | call/text **833-411-1121**; forms at ilcourts.info/forms | Mon–Fri 9–2 | Explains the court process, e-filing, fee waivers. **Not legal advice.** **Added to site.** |
| Cook County Mortgage Foreclosure Mediation | 855-452-2637 | — | Free help reaching a loan-modification agreement. |

### Money / utilities
| Org | Contact | Hours | Notes |
|---|---|---|---|
| **Citizens Utility Board (CUB)** | 1-800-669-5556 | Mon–Fri 9–4 | Free bill review + shut-off-protection guidance (advice only). **Added to site.** |
| Illinois Attorney General — Consumer | 800-386-5438 | — | Consumer complaints. On site. |

### Benefits / seniors / disability
| Org | Contact | Hours | Notes |
|---|---|---|---|
| **Center for Disability & Elder Law (CDEL)** | 312-376-1880 | Mon–Fri 9–12 | Free legal help for low-income **seniors & people with disabilities**, Cook County. **Added to site** (serves the "elders" theme). |
| Greater Chicago Food Depository | 773-247-3663 | — | SNAP outreach + application help. On site. |
| Chicago Urban League — Housing & Financial Empowerment | HUD-approved | — | Free rental/foreclosure counseling. |

### Legal hotlines (referral backbone)
| Org | Contact | Hours |
|---|---|---|
| **CARPLS** | 312-738-9200 | Mon–Fri (to 7:30 Mon/Wed) — _hours corrected on site_ |
| Illinois Legal Aid Online (ILAO) | illinoislegalaid.org | self-serve, Spanish |

---

## B. Candidate content sources to ingest (gaps vs the current 99)

Flagged because they are **not yet in `data/rights_sources.csv`** and fill a real gap. Add via
`scripts/download_new_sources.py` (then re-run the Chroma loader).

### Court process (new category — distinct from legal info)
- Illinois Courts — **standardized eviction forms**: `illinoiscourts.gov/.../circuit-court-standardized-forms-suites/eviction/`
- Illinois Courts — **approved statewide forms** index + **fee-waiver application**
- Illinois Court Help — self-help overview: `ilcourts.info`

### Housing
- IDHS **Homeless Prevention Program** (310 ILCS 70) — prevention assistance page
- Cook County **Mortgage Foreclosure Mediation Program**
- Chicago **Heat Ordinance** (landlord heat requirements, Sep 15–Jun 1)
- Chicago Housing Authority — **Housing Choice Voucher** basics

### Money / debt / utilities
- Illinois **Homeowner Assistance Fund** (if still open) / foreclosure relief
- CUB consumer fact sheets (shut-off protections, winter moratorium) — supplements existing ICC 83 IAC 280

### Benefits (gaps)
- **Child Care Assistance Program (CCAP)** — IDHS
- **Aid to the Aged, Blind, or Disabled (AABD)** — IDHS
- **ABE** application portal walkthrough

---

## C. To research / follow up (from the meeting, not yet done)
- **Stanford Legal Design Lab** — partner follow-up (design reference).
- **Lamb Bot** — reference chatbot to evaluate.
- **211 HPCC** intake flow — confirm how warm-handoff works for routing.
- Confirm **CARPLS** Cook County attorney-referral escalation (paralegal → pro bono attorney).
