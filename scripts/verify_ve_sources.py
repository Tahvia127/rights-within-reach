"""
Verify candidate Veterans & Military (VE) sources — all federal, so the content
serves every state at once (highest coverage-per-hour in the roadmap).

Writes data/ve_sources_verified.csv; fetch with:
    python scripts/fetch_state_sources.py --state ve
(the "--state" arg is just the source-set name here; each row's real jurisdiction
comes from its `jurisdiction` column, which is `federal` for all VA content).
"""

from __future__ import annotations

import csv
import re
import urllib.error
import urllib.request
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (compatible; RightsWithinReach/1.0)"}
OUT = Path("data/ve_sources_verified.csv")

# name, url, jurisdiction, locality, list_code, kind
CANDIDATES = [
    ("VA Disability Compensation",
     "https://www.va.gov/disability/", "federal", "", "VE-00", "agency_guide"),
    ("VA Disability: how to file a claim",
     "https://www.va.gov/disability/how-to-file-claim/", "federal", "", "VE-00", "agency_guide"),
    ("VA Pension (wartime veterans, low income)",
     "https://www.va.gov/pension/", "federal", "", "VE-00", "agency_guide"),
    ("VA Health Care eligibility",
     "https://www.va.gov/health-care/", "federal", "", "VE-00", "agency_guide"),
    ("VA Decision Reviews & Appeals",
     "https://www.va.gov/decision-reviews/", "federal", "", "VE-00", "agency_guide"),
    ("VA Housing Assistance (home loans, SAH grants)",
     "https://www.va.gov/housing-assistance/", "federal", "", "VE-00", "agency_guide"),
    ("VA Education & GI Bill benefits",
     "https://www.va.gov/education/", "federal", "", "VE-00", "agency_guide"),
    ("VA: records and discharge upgrades",
     "https://www.va.gov/discharge-upgrade-instructions/", "federal", "", "VE-00", "agency_guide"),
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
    print("\nnext: python scripts/fetch_state_sources.py --state ve")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
