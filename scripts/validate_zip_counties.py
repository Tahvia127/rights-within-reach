# validate_zip_counties.py
# Validates the curated ZIP->region table in routing.py against the U.S. Census
# ZCTA->County file (2020). Checks:
#   - Chicago ZIP range resolves to Cook County
#   - Collar ZIPs are in the 6 collar counties (not Cook, not other)
#   - Chicago range and collar set don't overlap
#
# Downloads ~10 MB from census.gov. Exits non-zero on any mismatch.
# Usage: python scripts/validate_zip_counties.py

from __future__ import annotations

import importlib.util
from pathlib import Path

import requests

CENSUS_URL = ("https://www2.census.gov/geo/docs/maps-data/data/rel2020/"
              "zcta520/tab20_zcta520_county20_natl.txt")
COOK   = "17031"
COLLAR = {"17043": "DuPage", "17097": "Lake", "17197": "Will",
          "17089": "Kane",   "17111": "McHenry", "17093": "Kendall"}


def load_zip_to_county() -> dict[str, tuple[str, str]]:
    """Return ZCTA5 -> (county_geoid, county_name) using the largest land-area overlap."""
    lines = requests.get(CENSUS_URL, timeout=90).text.splitlines()
    best: dict[str, tuple[int, str, str]] = {}
    for line in lines[1:]:
        f = line.split("|")
        zcta, cgeoid, cname = f[1], f[9], f[10]
        if not zcta or not cgeoid.startswith("17"):
            continue
        try:
            area = int(f[16] or 0)
        except ValueError:
            area = 0
        if zcta not in best or area > best[zcta][0]:
            best[zcta] = (area, cgeoid, cname)
    return {z: (v[1], v[2]) for z, v in best.items()}


def load_routing():
    spec = importlib.util.spec_from_file_location(
        "routing", Path(__file__).resolve().parents[1] / "backend/services/routing.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main() -> None:
    z2c = load_zip_to_county()
    R = load_routing()
    problems = 0

    chicago_range = [str(n) for n in range(60601, 60662)] + ["60666", "60707"]
    chi_bad = [(z, z2c[z][1]) for z in chicago_range if z in z2c and z2c[z][0] != COOK]
    checked = sum(1 for z in chicago_range if z in z2c)
    print(f"Chicago range: {checked}/{len(chicago_range)} have ZCTA data; "
          f"not Cook -> {chi_bad or 'none OK'}")
    problems += len(chi_bad)

    cook      = [(z, z2c[z][1]) for z in sorted(R._COLLAR_ZIPS) if z in z2c and z2c[z][0] == COOK]
    noncollar = [(z, z2c[z][1]) for z in sorted(R._COLLAR_ZIPS)
                 if z in z2c and z2c[z][0] != COOK and z2c[z][0] not in COLLAR]
    missing   = [z for z in sorted(R._COLLAR_ZIPS) if z not in z2c]
    print(f"Collar set ({len(R._COLLAR_ZIPS)} ZIPs):")
    print(f"  actually Cook       -> {cook or 'none OK'}")
    print(f"  actually non-collar -> {noncollar or 'none OK'}")
    print(f"  no ZCTA data        -> {missing or 'none'}")
    problems += len(cook) + len(noncollar)

    overlap = [z for z in chicago_range if z in R._COLLAR_ZIPS]
    print(f"Chicago/collar overlap: {overlap or 'none OK'}")
    problems += len(overlap)

    print(f"\n{'ZIP->region table validated, no mismatches' if not problems else f'{problems} mismatch(es) -- fix routing.py'}")
    raise SystemExit(0 if not problems else 1)


if __name__ == "__main__":
    main()