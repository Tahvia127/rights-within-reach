# orgs.py
# The resource finder's data layer: load the harvested referral orgs
# (data/orgs.csv, produced by harvest_orgs.py) and return the ones that serve a
# given place, topic, and language. Pure CSV + filtering — no ML, no Chroma — so
# it is cheap and independently testable.
#
# Orgs carry LIST codes (list_codes) and spoken languages, so "a housing question
# in 60649, answered in Spanish" can surface the few orgs that actually fit,
# instead of one generic hotline.

from __future__ import annotations

import csv
from functools import lru_cache
from pathlib import Path

from backend.services.taxonomy import TOPIC_TO_LIST_PARENT, parent_of

ORGS_CSV = Path("data/orgs.csv")

# url_status values we treat as a usable link. "unchecked" covers rows harvested
# with --skip-check; "none"/"dead" are demoted, not dropped (phone still helps).
_USABLE_LINK = {"live", "redirect", "unchecked"}
_NA = {"", "N/A", "NA"}


def _clean(value: str | None) -> str:
    v = (value or "").strip()
    return "" if v.upper() in {n.upper() for n in _NA} else v


@lru_cache(maxsize=1)
def _load() -> list[dict]:
    """Parse orgs.csv once, precomputing the list-code parents and language list
    used for filtering. csv.DictReader handles the quoted commas in org names."""
    if not ORGS_CSV.exists():
        return []
    rows: list[dict] = []
    with ORGS_CSV.open(encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            r["_codes"] = [c for c in (r.get("list_codes") or "").split(";") if c]
            r["_parents"] = {parent_of(c) for c in r["_codes"]}
            r["_langs"] = [x for x in (r.get("languages") or "").split(";") if x]
            rows.append(r)
    return rows


def _target_parents(topic: str | None, list_code: str | None) -> set[str]:
    parents: set[str] = set()
    if list_code:
        parents.add(parent_of(list_code))
    if topic:
        p = TOPIC_TO_LIST_PARENT.get(topic.strip())
        if p:
            parents.add(p)
    return parents


def _card(o: dict) -> dict:
    """The public shape: cleaned contact fields, no internal helpers."""
    return {
        "name": o.get("name", ""),
        "city": _clean(o.get("city")),
        "state": (o.get("state") or "").upper(),
        "zip": (_clean(o.get("zip")))[:5],
        "address": _clean(o.get("address")),
        "phone": _clean(o.get("phone")),
        "url": _clean(o.get("url_final")) or _clean(o.get("url")),
        "list_codes": o["_codes"],
        "languages": o["_langs"],
        "source": o.get("source", ""),
    }


def find_orgs(state: str | None = None, topic: str | None = None,
              list_code: str | None = None, language: str | None = None,
              zip_code: str | None = None, limit: int = 6) -> list[dict]:
    """Referral orgs for a (state, topic/list_code) request, best matches first.

    Ranking (all ties broken toward a usable contact): speaks the requested
    language > same ZIP > has a working link > has a phone. State and topic are
    hard filters; language and ZIP only rank, so a request never returns nothing
    just because no org lists the language.
    """
    orgs = _load()
    st = (state or "").strip().upper()
    if st:
        orgs = [o for o in orgs if (o.get("state") or "").upper() == st]

    parents = _target_parents(topic, list_code)
    if parents:
        orgs = [o for o in orgs if o["_parents"] & parents]

    lang = (language or "").strip().lower()
    z5 = (zip_code or "").strip()[:5]

    def rank(o: dict) -> tuple:
        return (
            1 if lang and lang in o["_langs"] else 0,
            1 if z5 and (o.get("zip") or "").startswith(z5) else 0,
            1 if o.get("url_status") in _USABLE_LINK and _clean(o.get("url")) else 0,
            1 if _clean(o.get("phone")) else 0,
        )

    orgs = sorted(orgs, key=rank, reverse=True)

    seen: set[str] = set()
    out: list[dict] = []
    for o in orgs:
        name = (o.get("name") or "").strip()
        if not name or name in seen:
            continue
        seen.add(name)
        out.append(_card(o))
        if len(out) >= limit:
            break
    return out
