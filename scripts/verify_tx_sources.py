"""
Verify a candidate list of Texas and Houston primary-law sources.

Same contract as the CA/MO verify passes: nothing goes into the fetch pipeline
until it returns a real page with real text. Writes only the passing rows to
data/tx_sources_verified.csv, which scripts/fetch_state_sources.py --state tx
then downloads.

URLs confirmed against the live sites (statutes.capitol.texas.gov chapter pages
+ GetStatute sections, texaslawhelp.org, hhs.texas.gov, Lone Star Legal Aid).
Anything that fails here needs a replacement URL before it ships.
"""

from __future__ import annotations

import csv
import re
import urllib.error
import urllib.request
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (compatible; RightsWithinReach/1.0)"}
OUT = Path("data/tx_sources_verified.csv")

CAP = "https://statutes.capitol.texas.gov"


def chapter(code: str, num: str) -> str:
    return f"{CAP}/Docs/{code}/htm/{code}.{num}.htm"


def section(code: str, value: str) -> str:
    return f"{CAP}/GetStatute.aspx?Code={code}&Value={value}"


# name, url, jurisdiction, locality, list_code, kind
CANDIDATES = [
    # --- Texas statute, primary law (Property Code) ---
    ("Texas Property Code Chapter 92 (residential tenancies)",
     chapter("PR", "92"), "TX", "", "HO-06", "statute"),
    ("Texas Property Code Chapter 24 (forcible entry and detainer / eviction)",
     chapter("PR", "24"), "TX", "", "HO-02", "statute"),
    ("Texas Property Code 92.102-92.109 (security deposit)",
     section("PR", "92.103"), "TX", "", "HO-06", "statute"),
    ("Texas Property Code 92.056 (landlord duty to repair)",
     section("PR", "92.056"), "TX", "", "HO-05", "statute"),
    ("Texas Property Code 92.0081 (lockouts, utility interruption)",
     section("PR", "92.0081"), "TX", "", "HO-07", "statute"),
    ("Texas Property Code 24.005 (notice to vacate before eviction)",
     section("PR", "24.005"), "TX", "", "HO-02", "statute"),

    # --- Texas agency, court, and legal-aid guidance ---
    ("Texas Attorney General: Tenant Rights",
     "https://www.texasattorneygeneral.gov/consumer-protection/home-real-estate-and-travel/tenant-rights",
     "TX", "", "HO-06", "agency_guide"),
    ("TexasLawHelp: Tenant Rights",
     "https://texaslawhelp.org/article/tenant-rights", "TX", "", "HO-06", "kyr_guide"),
    ("TexasLawHelp: Eviction Referral (rent help & protections)",
     "https://texaslawhelp.org/eviction-referral", "TX", "", "HO-02", "court_guide"),
    ("Texas State Law Library: Landlord/Tenant Law",
     "https://guides.sll.texas.gov/landlord-tenant", "TX", "", "HO-06", "court_guide"),

    # --- Texas benefits ---
    ("Texas SNAP Food Benefits (Texas HHS)",
     "https://www.hhs.texas.gov/services/food/snap-food-benefits", "TX", "", "BE-00", "agency_guide"),
    ("Texas Medicaid & CHIP (Texas HHS)",
     "https://www.hhs.texas.gov/services/health/medicaid-chip", "TX", "", "BE-00", "agency_guide"),
    ("Your Texas Benefits (application portal)",
     "https://www.yourtexasbenefits.com/Learn/Home", "TX", "", "BE-00", "portal"),

    # --- Houston local / legal aid ---
    ("Lone Star Legal Aid",
     "https://www.lonestarlegal.org/", "TX", "houston", "HO-06", "org"),
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
    print("\nnext: python scripts/fetch_state_sources.py --state tx")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
