"""
Verify candidate Work & Employment (WO) sources — federal wage-and-hour law plus
each state's wage-claim agency. Wage theft is the roadmap's Tier 1 target: high
demand, low ambiguity.

Federal rows (jurisdiction=federal) transfer to every state; the state-labor rows
carry their own jurisdiction so retrieval keeps them in-state.

Writes data/wo_sources_verified.csv; fetch with:
    python scripts/fetch_state_sources.py --state wo
"""

from __future__ import annotations

import csv
import re
import urllib.error
import urllib.request
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (compatible; RightsWithinReach/1.0)"}
OUT = Path("data/wo_sources_verified.csv")

# name, url, jurisdiction, locality, list_code, kind
CANDIDATES = [
    # --- Federal (US DOL / EEOC) ---
    ("US DOL Wage and Hour Division (FLSA)",
     "https://www.dol.gov/agencies/whd", "federal", "", "WO-00", "agency_guide"),
    ("US DOL: how to file a wage complaint",
     "https://www.dol.gov/agencies/whd/contact/complaints", "federal", "", "WO-00", "agency_guide"),
    ("US DOL: minimum wage",
     "https://www.dol.gov/general/topic/wages/minimumwage", "federal", "", "WO-00", "agency_guide"),
    ("EEOC: how to file a charge of employment discrimination",
     "https://www.eeoc.gov/how-file-charge-employment-discrimination", "federal", "", "WO-00", "agency_guide"),

    # --- State wage-claim agencies ---
    ("Illinois Dept of Labor: wage claim",
     "https://labor.illinois.gov/about/faqs/wage-claim.html", "IL", "", "WO-00", "agency_guide"),
    ("California Labor Commissioner: how to file a wage claim",
     "https://www.dir.ca.gov/dlse/howtofilewageclaim.htm", "CA", "", "WO-00", "agency_guide"),
    ("Texas Workforce Commission: wage claim program",
     "https://www.twc.texas.gov/programs/wage-claim-program-overview", "TX", "", "WO-00", "agency_guide"),
    ("Missouri Dept of Labor: wages, hours & dismissal rights",
     "https://labor.mo.gov/DLS/MinimumWage", "MO", "", "WO-00", "agency_guide"),
    ("New York Dept of Labor: file a labor complaint",
     "https://dol.ny.gov/file-labor-complaint", "NY", "", "WO-00", "agency_guide"),
]


def check(url: str) -> tuple[int, int, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            body = r.read().decode("utf-8", "ignore")
            final = r.geturl()
            text = re.sub(r"<script.*?</script>|<style.*?</style>", " ", body, flags=re.S | re.I)
            text = re.sub(r"<[^>]+>", " ", text)
            text = re.sub(r"\s+", " ", text).strip()
            note = "" if final.rstrip("/") == url.rstrip("/") else f"-> {final}"
            return r.status, len(text), note
    except urllib.error.HTTPError as e:
        return e.code, 0, ""
    except Exception as e:
        return 0, 0, type(e).__name__


def main() -> int:
    passed, failed = [], []
    print(f"{'status':>6} {'chars':>7}  name")
    print("-" * 78)
    for name, url, juris, loc, code, kind in CANDIDATES:
        status, n, note = check(url)
        ok = status == 200 and n > 1000
        print(f"{status:>6} {n:>7}  {'OK ' if ok else 'BAD'} {name[:50]} {note[:28]}")
        row = {"source_name": name, "url": url, "jurisdiction": juris,
               "locality": loc, "list_code": code, "kind": kind,
               "http_status": status, "text_chars": n}
        (passed if ok else failed).append(row)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(passed[0].keys()) if passed
                           else ["source_name", "url", "jurisdiction", "locality",
                                 "list_code", "kind", "http_status", "text_chars"])
        w.writeheader()
        w.writerows(passed)

    print("-" * 78)
    print(f"passed {len(passed)} / {len(CANDIDATES)}, wrote {OUT}")
    if failed:
        print("\nfailed, needs a replacement URL:")
        for r in failed:
            print(f"  [{r['http_status']}] {r['source_name']}")
    print("\nnext: python scripts/fetch_state_sources.py --state wo")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
