# routing.py
# Maps user area/ZIP to a region and picks the right referral org by (topic, region).
# Unknown region falls back to Cook County defaults -- routing never blocks an answer.

from __future__ import annotations

# frontend subject -> corpus topic for retrieval filter
SUBJECT_TO_TOPIC = {
    "housing":  "housing",
    "money":    "money_debt",
    "repairs":  "housing_repair",
    "benefits": "benefits",
}

# --- region resolution ---

_AREA_TO_REGION = {
    "chicago":       "chicago",
    "suburban_cook": "suburban_cook",
    "collar":        "collar",
    "elsewhere":     "illinois",
}

# Chicago-metro ZIP→region. Area choice overrides this; unlisted ZIPs return ""
# so routing falls back to Area or Cook County defaults -- never a guess.
# Validate after edits: python scripts/validate_zip_counties.py
_COLLAR_ZIPS = frozenset({
    # DuPage
    "60101", "60103", "60106", "60108", "60126", "60133", "60137", "60139", "60143",
    "60148", "60181", "60187", "60188", "60189", "60191", "60515", "60516", "60517",
    "60521", "60523", "60527", "60532", "60540", "60555", "60559", "60561", "60563",
    "60564", "60565",
    # Lake (60010 Barrington omitted -- dominant county is Cook)
    "60002", "60015", "60020", "60030", "60031", "60035", "60044", "60045",
    "60046", "60047", "60048", "60060", "60061", "60064", "60069", "60073", "60083",
    "60084", "60085", "60087", "60088", "60089", "60096", "60099",
    # Will
    "60401", "60403", "60404", "60410", "60417", "60423", "60431", "60432", "60433",
    "60435", "60436", "60441", "60446", "60448", "60451", "60481", "60490", "60544",
    "60585", "60586",
    # Kane
    "60110", "60118", "60119", "60123", "60124", "60134", "60140", "60144", "60151",
    "60174", "60175", "60177", "60183", "60185", "60505", "60506", "60510", "60511",
    "60542", "60554",
    # McHenry
    "60012", "60013", "60014", "60021", "60033", "60034", "60042", "60050", "60051",
    "60071", "60072", "60097", "60098", "60142", "60152", "60156", "60180",
    # Kendall (60548 Sandwich omitted -- dominant county is DeKalb)
    "60536", "60541", "60545", "60560",
})

# Full Census-derived IL ZIP→region table. Regenerate with scripts/gen_zip_regions.py.
try:
    from backend.services.zip_regions_data import ZIP_REGION
except Exception:  # pragma: no cover
    ZIP_REGION = {}


def _region_from_zip(zip_code: str | None) -> str:
    """Return region from ZIP using the Census table, or coarse fallback. Unknown ZIPs return ''."""
    z = (zip_code or "").strip()[:5]
    if not (len(z) == 5 and z.isdigit()):
        return ""
    r = ZIP_REGION.get(z)
    if r:
        return r
    n = int(z)
    if 60601 <= n <= 60661 or n in (60666, 60707):
        return "chicago"
    if z in _COLLAR_ZIPS:
        return "collar"
    if 61000 <= n <= 62999:
        return "illinois"
    return ""


def resolve_region(area: str | None, zip_code: str | None) -> str:
    """Return region from Area choice, falling back to ZIP, then ''."""
    return _AREA_TO_REGION.get((area or "").strip(), "") or _region_from_zip(zip_code)


# --- referral orgs ---

_CARPLS          = {"name": "CARPLS Legal Aid Hotline",                  "sub": "Free legal help · Cook County",          "phone": "312-738-9200", "hours": "Mon–Fri, 9–4:30", "url": ""}
_CCLAHD          = {"name": "Cook County Legal Aid for Housing & Debt",  "sub": "Free · all Cook County, any status",     "phone": "855-956-5763", "hours": "Mon–Fri, 9–4:30", "url": ""}
_LEGAL_AID_CHICAGO = {"name": "Legal Aid Chicago",                       "sub": "Public benefits, appeals & more",        "phone": "312-341-1070", "hours": "Mon–Fri, 9–5",    "url": ""}
_EVICTION_HELP_IL  = {"name": "Eviction Help Illinois",                  "sub": "Free eviction help statewide",           "phone": "855-631-0811", "hours": 'Text "eviction" to 85622', "url": ""}
_ILAO            = {"name": "Illinois Legal Aid Online",                  "sub": "Find free legal help statewide",         "phone": "",             "hours": "",                "url": "illinoislegalaid.org"}
_CEDA            = {"name": "CEDA of Cook County",                        "sub": "Utility & repair help · suburban Cook",  "phone": "800-571-2332", "hours": "",                "url": "cedaorg.net"}
_CHICAGO_DOH     = {"name": "City of Chicago — Department of Housing",   "sub": "Home repair programs",                   "phone": "312-744-3653", "hours": "Mon–Fri",         "url": "chicago.gov/doh"}
_IHDA            = {"name": "Illinois Housing Development Authority",     "sub": "Statewide home-repair grants",           "phone": "312-836-5200", "hours": "Mon–Fri",         "url": "ihda.org"}

# Unknown region treated as Cook County (most traffic) so routing never regresses.
_COOK = {"chicago", "suburban_cook", ""}


def contact_for(topic: str, region: str) -> dict:
    """Return the referral org for a given topic and region."""
    cook = region in _COOK

    if topic == "benefits":
        return _LEGAL_AID_CHICAGO if cook else _ILAO
    if topic == "housing_repair":
        if region == "suburban_cook": return _CEDA
        if region in ("collar", "illinois"): return _IHDA
        return _CHICAGO_DOH
    if topic == "housing":
        return _CCLAHD if cook else _EVICTION_HELP_IL
    return _CARPLS if cook else _ILAO  # money_debt, resources, etc.