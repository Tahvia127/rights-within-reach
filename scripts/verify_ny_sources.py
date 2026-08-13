"""
Verify a candidate list of New York and New York City primary-law sources.

Same contract as the CA/MO/TX verify passes. Writes only the passing rows to
data/ny_sources_verified.csv, which scripts/fetch_state_sources.py --state ny
then downloads.

URLs confirmed against the live sites (nysenate.gov Open Legislation for the
statutes, otda.ny.gov / access.nyc.gov for benefits, and the NYC legal-aid orgs).
Anything that fails here needs a replacement URL before it ships.
"""

from __future__ import annotations

import csv
import re
import urllib.error
import urllib.request
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (compatible; RightsWithinReach/1.0)"}
OUT = Path("data/ny_sources_verified.csv")

LAW = "https://www.nysenate.gov/legislation/laws"


def law(code: str, section: str) -> str:
    return f"{LAW}/{code}/{section}"


# name, url, jurisdiction, locality, list_code, kind
CANDIDATES = [
    # --- New York statute, primary law (nysenate.gov Open Legislation) ---
    ("NY Real Property Law 235-b (warranty of habitability)",
     law("RPP", "235-B"), "NY", "", "HO-05", "statute"),
    ("NY General Obligations Law 7-108 (security deposits, one-month cap)",
     law("GOB", "7-108"), "NY", "", "HO-06", "statute"),
    ("NY Real Property Law 226-c (notice of rent increase or non-renewal)",
     law("RPP", "226-C"), "NY", "", "HO-06", "statute"),
    ("NY RPAPL 711 (grounds for eviction proceedings)",
     law("RPA", "711"), "NY", "", "HO-02", "statute"),
    ("NY RPAPL 733 (nonpayment petition, notice)",
     law("RPA", "733"), "NY", "", "HO-02", "statute"),

    # --- New York agency and court guidance ---
    ("NYC HPD: Tenants' Rights & Legal Assistance",
     "https://www.nyc.gov/site/hpd/services-and-information/tenants-rights-legal-assistance.page",
     "NY", "new_york_city", "HO-06", "agency_guide"),
    ("NYS Homes & Community Renewal (rent regulation / DHCR)",
     "https://hcr.ny.gov/", "NY", "", "HO-06", "agency_guide"),
    ("NYC Rent Guidelines Board: legal assistance",
     "https://rentguidelinesboard.cityofnewyork.us/resources/legal-assistance/",
     "NY", "new_york_city", "HO-06", "agency_guide"),

    # --- New York benefits ---
    ("NY SNAP (OTDA)",
     "https://otda.ny.gov/programs/snap/", "NY", "", "BE-00", "agency_guide"),
    ("NY Temporary Assistance (OTDA)",
     "https://otda.ny.gov/programs/temporary-assistance/", "NY", "", "BE-00", "agency_guide"),
    ("ACCESS NYC (benefits screening)",
     "https://access.nyc.gov/", "NY", "new_york_city", "BE-00", "portal"),

    # --- Nonprofit / legal-aid content ---
    ("LawHelpNY (New York legal-aid directory)",
     "https://www.lawhelpny.org/", "NY", "", "CO-02", "directory"),
    ("The Legal Aid Society: housing help",
     "https://legalaidnyc.org/get-help/housing-problems/", "NY", "new_york_city", "HO-06", "org"),
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
    print("\nnext: python scripts/fetch_state_sources.py --state ny")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
