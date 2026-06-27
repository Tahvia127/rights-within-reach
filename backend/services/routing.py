"""
routing.py
Phase-2 triage routing: map the user's area/ZIP to a region, and pick the right
"who to contact" organization by (topic, region).

Region is taken primarily from the explicit Area choice; ZIP is a coarse fallback
(only Chicago is reliably detectable from ZIP prefix). Routing only *refines* the
referral — it never blocks an answer, and an unknown region falls back to safe
Cook County / statewide defaults. All contacts are verified orgs.
"""

from __future__ import annotations

# Frontend subject value -> corpus topic (for the retrieval filter).
SUBJECT_TO_TOPIC = {
    "housing": "housing",
    "money": "money_debt",
    "repairs": "housing_repair",
    "benefits": "benefits",
}

# --- region resolution ------------------------------------------------------

_AREA_TO_REGION = {
    "chicago": "chicago",
    "suburban_cook": "suburban_cook",
    "collar": "collar",
    "elsewhere": "illinois",
}


def _region_from_zip(zip_code: str | None) -> str:
    """Coarse ZIP→region. Only Chicago is reliably detectable from the prefix;
    everything else returns '' so the explicit Area choice is used instead."""
    z = (zip_code or "").strip()[:5]
    if len(z) == 5 and z.isdigit() and 60601 <= int(z) <= 60661:
        return "chicago"
    return ""


def resolve_region(area: str | None, zip_code: str | None) -> str:
    """Region from the Area choice, falling back to a ZIP-derived guess, else ''."""
    return _AREA_TO_REGION.get((area or "").strip(), "") or _region_from_zip(zip_code)


# --- referral orgs (verified) ----------------------------------------------

_CARPLS = {"name": "CARPLS Legal Aid Hotline", "sub": "Free legal help · Cook County",
           "phone": "312-738-9200", "hours": "Mon–Fri, 9–4:30", "url": ""}
_CCLAHD = {"name": "Cook County Legal Aid for Housing & Debt", "sub": "Free · all Cook County, any status",
           "phone": "855-956-5763", "hours": "Mon–Fri, 9–4:30", "url": ""}
_LEGAL_AID_CHICAGO = {"name": "Legal Aid Chicago", "sub": "Public benefits, appeals & more",
                      "phone": "312-341-1070", "hours": "Mon–Fri, 9–5", "url": ""}
_EVICTION_HELP_IL = {"name": "Eviction Help Illinois", "sub": "Free eviction help statewide",
                     "phone": "855-631-0811", "hours": "Text “eviction” to 85622", "url": ""}
_ILAO = {"name": "Illinois Legal Aid Online", "sub": "Find free legal help statewide",
         "phone": "", "hours": "", "url": "illinoislegalaid.org"}
_CEDA = {"name": "CEDA of Cook County", "sub": "Utility & repair help · suburban Cook",
         "phone": "800-571-2332", "hours": "", "url": "cedaorg.net"}
_CHICAGO_DOH = {"name": "City of Chicago — Department of Housing", "sub": "Home repair programs",
                "phone": "312-744-3653", "hours": "Mon–Fri", "url": "chicago.gov/doh"}
_IHDA = {"name": "Illinois Housing Development Authority", "sub": "Statewide home-repair grants",
         "phone": "312-836-5200", "hours": "Mon–Fri", "url": "ihda.org"}

# Treat unknown region as Cook County (most traffic) so routing never regresses.
_COOK = {"chicago", "suburban_cook", ""}


def contact_for(topic: str, region: str) -> dict:
    """Pick the referral org for a normal answer, given topic and region."""
    cook = region in _COOK

    if topic == "benefits":
        return _LEGAL_AID_CHICAGO if cook else _ILAO

    if topic == "housing_repair":
        if region == "suburban_cook":
            return _CEDA
        if region in ("collar", "illinois"):
            return _IHDA
        return _CHICAGO_DOH  # chicago or unknown

    if topic == "housing":
        return _CCLAHD if cook else _EVICTION_HELP_IL

    # money_debt, resources, and anything else
    return _CARPLS if cook else _ILAO
