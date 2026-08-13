"""
Verify a candidate list of Missouri and St. Louis primary-law sources.

Same contract as the California verify pass: nothing goes into the fetch pipeline
until it returns a real page with real text. Prints a pass/fail table and writes
only the passing rows to data/mo_sources_verified.csv, which
scripts/fetch_state_sources.py --state mo then downloads.

URLs below were confirmed against the live sites (revisor.mo.gov OneSection
format, the AG landlord-tenant page, mydss.mo.gov, and the Missouri Courts
self-help pages) but sites move — anything that fails here needs a replacement
URL before it ships.
"""

from __future__ import annotations

import csv
import re
import urllib.error
import urllib.request
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (compatible; RightsWithinReach/1.0)"}
OUT = Path("data/mo_sources_verified.csv")

RSMO = "https://revisor.mo.gov/main/OneSection.aspx?section="


def rsmo(section: str) -> str:
    return f"{RSMO}{section}"


# name, url, jurisdiction, locality, list_code, kind
CANDIDATES = [
    # --- Missouri statute, primary law (revisor.mo.gov) ---
    ("Mo. Rev. Stat. 535.300 (security deposits)",
     rsmo("535.300"), "MO", "", "HO-06", "statute"),
    ("Mo. Rev. Stat. 441.060 (termination of tenancy, notice)",
     rsmo("441.060"), "MO", "", "HO-06", "statute"),
    ("Mo. Rev. Stat. 441.233 (unlawful ouster, lockout, utility shutoff)",
     rsmo("441.233"), "MO", "", "HO-07", "statute"),
    ("Mo. Rev. Stat. 441.500 (rent abatement for uninhabitable dwelling)",
     rsmo("441.500"), "MO", "", "HO-05", "statute"),
    ("Mo. Rev. Stat. 535.020 (rent and possession action)",
     rsmo("535.020"), "MO", "", "HO-02", "statute"),
    ("Mo. Rev. Stat. 534.030 (unlawful detainer)",
     rsmo("534.030"), "MO", "", "HO-02", "statute"),

    # --- Missouri agency and court guidance ---
    ("Missouri Attorney General: Landlord-Tenant Law",
     "https://ago.mo.gov/get-help/programs-services-from-a-z/landlord-tenant-law/",
     "MO", "", "HO-06", "agency_guide"),
    ("Missouri Courts Self-Help",
     "https://www.courts.mo.gov/page.jsp?id=6896", "MO", "", "CO-03", "court_guide"),
    ("Missouri Courts civil forms (rent and possession, unlawful detainer)",
     "https://www.courts.mo.gov/page.jsp?id=650", "MO", "", "CO-03", "court_guide"),

    # --- Missouri benefits (mydss.mo.gov) ---
    ("Missouri Food Assistance / SNAP (myDSS)",
     "https://mydss.mo.gov/food-assistance", "MO", "", "BE-00", "agency_guide"),
    ("Apply for SNAP (myDSS)",
     "https://mydss.mo.gov/food-assistance/apply-for-snap", "MO", "", "BE-00", "agency_guide"),
    ("Missouri benefit programs (myDSS)",
     "https://mydss.mo.gov/services", "MO", "", "BE-00", "agency_guide"),

    # --- Nonprofit / legal-aid content ---
    ("Missouri's Landlord-Tenant Law (Missouri Legal Services)",
     "https://www.lsmo.org/node/676/missouris-landlord-tenant-law",
     "MO", "", "HO-06", "kyr_guide"),
    ("MOLawHelp (Missouri legal-aid directory)",
     "https://molawhelp.org/", "MO", "", "CO-02", "directory"),
    ("Legal Services of Eastern Missouri",
     "https://lsem.org/", "MO", "st_louis_city", "HO-06", "org"),
]


def check(url: str) -> tuple[int, int, str]:
    """GET the page. Return (status, chars_of_text, note)."""
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
        row = {
            "source_name": name, "url": url, "jurisdiction": juris,
            "locality": loc, "list_code": code, "kind": kind,
            "http_status": status, "text_chars": n,
        }
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
    print("\nnext: python scripts/fetch_state_sources.py --state mo")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
