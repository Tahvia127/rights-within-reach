# taxonomy.py
# The jurisdiction + LIST layer. One place that knows how to turn a source's
# free-text `jurisdiction` into a clean (state, locality) pair, and how our four
# topic screens map onto LIST codes (taxonomy.legal). Imported by the ingest,
# the retriever, and routing so all three agree on the same vocabulary.
#
# Why this exists: "Illinois" used to be an assumption baked into which files we
# downloaded, never a field. The moment a second state (California) enters the
# corpus, an unfiltered search can hand a California user a fluent, confident
# Illinois answer with no error. `state` makes that filterable; `locality` lets a
# Chicago ordinance outrank a statewide statute where it is more protective.

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

# --- jurisdiction normalization -------------------------------------------

# Legacy sidecars wrote a single `jurisdiction` string that mixed state and
# locality ("chicago-il", "cook-county-il", "illinois", "federal"). New sources
# carry explicit `state` + `locality`. Map the legacy strings so we never have to
# re-edit 100+ existing .meta.json files.
_JURIS_TO_STATE = {
    "federal": "federal",
    "illinois": "IL", "il": "IL",
    "chicago-il": "IL", "cook-county-il": "IL",
    "california": "CA", "ca": "CA",
    "missouri": "MO", "mo": "MO",
    "texas": "TX", "tx": "TX",
    "new york": "NY", "ny": "NY",
}

_JURIS_TO_LOCALITY = {
    "chicago-il": "chicago",
    "cook-county-il": "cook_county",
}

# Two-letter USPS codes we recognize as a state (plus the shared "federal").
KNOWN_STATES = {"federal", "IL", "CA", "MO", "TX", "NY"}


def normalize_jurisdiction(meta: dict) -> tuple[str, str | None]:
    """Return (state, locality) for a source's metadata dict.

    Precedence: an explicit `state`/`locality` field wins; otherwise derive both
    from the legacy `jurisdiction` string. Unknown values fall back to the raw
    string uppercased for state and None for locality, so a typo degrades to a
    harmless extra filter value rather than silently becoming Illinois.
    """
    raw_state = (meta.get("state") or "").strip()
    raw_locality = (meta.get("locality") or "").strip()
    juris = (meta.get("jurisdiction") or "").strip().lower()

    if raw_state:
        state = "federal" if raw_state.lower() == "federal" else raw_state.upper()
    else:
        state = _JURIS_TO_STATE.get(juris, juris.upper() if juris else "")

    if raw_locality:
        locality = raw_locality
    else:
        locality = _JURIS_TO_LOCALITY.get(juris)

    return state, (locality or None)


# --- LIST (taxonomy.legal) mapping ----------------------------------------

# The 20 top-level LIST parents, for the coverage report and out-of-scope routing.
LIST_PARENTS = {
    "BE": "Public Benefits", "SM": "Small Business and IP", "CO": "Courts and Lawyers",
    "CR": "Crime and Prisons", "DR": "Disaster Relief", "ED": "Education",
    "EN": "Environmental Justice", "ES": "Estates, Wills, and Guardianships",
    "FA": "Family", "GO": "Government Services", "HE": "Health", "HO": "Housing",
    "IM": "Immigration", "MO": "Money, Debt, and Consumer",
    "NA": "Native American Issues and Tribal Law", "RI": "Civil and Human Rights",
    "AT": "Accidents and Torts", "TR": "Traffic and Cars", "VE": "Veterans and Military",
    "WO": "Work and Employment Law",
}

# Our four content screens -> the LIST parent they live under. Used to stamp a
# `list_code` on legacy chunks that predate the field.
TOPIC_TO_LIST_PARENT = {
    "housing": "HO",
    "housing_repair": "HO",
    "benefits": "BE",
    "money_debt": "MO",
    "immigration": "IM",
    "resources": "CO",
    "veterans": "VE",
    "work": "WO",
}

# Second-level LIST codes -> our topic, so a source tagged only with a `list_code`
# (the California sources) still routes into the existing topic filter and org
# picker. HO splits: living-conditions/repair codes are our "housing_repair"
# screen, everything else under Housing is "housing".
_LIST_CODE_TO_TOPIC = {
    "HO-05": "housing_repair",  # problems with living conditions
    "HO-07": "housing",         # utilities / lockouts
}
_LIST_PARENT_TO_TOPIC = {
    "HO": "housing", "BE": "benefits", "MO": "money_debt",
    "CO": "resources", "IM": "immigration",
    "VE": "veterans", "WO": "work",
}


def parent_of(list_code: str) -> str:
    """'HO-06' -> 'HO'. Tolerates a bare parent or an empty string."""
    return (list_code or "").split("-", 1)[0].upper()


def list_code_to_topic(list_code: str) -> str | None:
    """Map a LIST code to our corpus topic, or None if it is outside our screens."""
    code = (list_code or "").upper()
    if code in _LIST_CODE_TO_TOPIC:
        return _LIST_CODE_TO_TOPIC[code]
    return _LIST_PARENT_TO_TOPIC.get(parent_of(code))


def list_code_for(meta: dict) -> str:
    """Best-effort `list_code` for a source: an explicit value wins, else derive a
    parent code from the topic. Returns '' when we cannot place it."""
    explicit = (meta.get("list_code") or "").strip().upper()
    if explicit:
        return explicit
    return TOPIC_TO_LIST_PARENT.get((meta.get("topic") or "").strip(), "")


# --- cached taxonomy snapshot ---------------------------------------------

_LIST_JSON = Path("data/taxonomy/list.json")


@lru_cache(maxsize=1)
def list_snapshot() -> dict:
    """Load the cached taxonomy.legal snapshot (parents + the subcodes we use).

    We never hit the live API at query time. Regenerate the cache with
    scripts/refresh_taxonomy.py. Falls back to the built-in parents if the file
    is missing so nothing crashes before the first refresh.
    """
    try:
        return json.loads(_LIST_JSON.read_text(encoding="utf-8"))
    except Exception:
        return {"as_of": None, "parents": LIST_PARENTS, "terms": {}}
