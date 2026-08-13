# routing.py
# Maps user area/ZIP to a region and picks the right referral org by (topic, region).
# Unknown region falls back to Cook County defaults -- routing never blocks an answer.

from __future__ import annotations

# frontend subject -> corpus topic for retrieval filter
SUBJECT_TO_TOPIC = {
    "housing":   "housing",
    "money":     "money_debt",
    "repairs":   "housing_repair",
    "benefits":  "benefits",
    "veterans":  "veterans",
    "work":      "work",
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

# --- California referral orgs ---
# Phones verified against each org's official site (2026-08-06). Web directories
# and the BenefitsCal portal are URL-only by design — they have no single intake
# line — so a blank phone there is correct, not a missing value.
_LAWHELP_CA      = {"name": "LawHelpCA",                                 "sub": "Find free legal help across California",      "phone": "", "hours": "", "url": "lawhelpca.org"}
_CA_COURTS_SELF  = {"name": "California Courts Self-Help",               "sub": "Free step-by-step court guides",               "phone": "", "hours": "", "url": "selfhelp.courts.ca.gov"}
_HRCSF           = {"name": "Housing Rights Committee of SF",            "sub": "Free tenant counseling · San Francisco",       "phone": "415-703-8644", "hours": "", "url": "hrcsf.org"}
_BENEFITS_CAL    = {"name": "BenefitsCal",                               "sub": "Apply for CalFresh, Medi-Cal & CalWORKs",      "phone": "", "hours": "", "url": "benefitscal.com"}

# --- Missouri referral orgs ---
# Phones verified against each org's official site (2026-08-06); the LSC-funded
# programs use their St. Louis / Kansas City intake lines. MOLawHelp is a web
# directory (URL-only).
_MOLAWHELP       = {"name": "MOLawHelp",                                 "sub": "Find free legal help across Missouri",         "phone": "", "hours": "", "url": "molawhelp.org"}
_LSEM            = {"name": "Legal Services of Eastern Missouri",        "sub": "Free civil legal aid · St. Louis area",        "phone": "314-534-4200", "hours": "", "url": "lsem.org"}
_LAWMO           = {"name": "Legal Aid of Western Missouri",             "sub": "Free civil legal aid · Kansas City area",      "phone": "816-474-6750", "hours": "", "url": "lawmo.org"}

# --- Texas referral orgs ---
_TEXASLAWHELP    = {"name": "TexasLawHelp",                              "sub": "Free legal help & forms across Texas",         "phone": "", "hours": "", "url": "texaslawhelp.org"}
_LONE_STAR       = {"name": "Lone Star Legal Aid",                       "sub": "Free civil legal aid · Houston & East Texas",  "phone": "713-652-0077", "hours": "", "url": "lonestarlegal.org"}

# --- New York referral orgs ---
# NYC hotline phones + hours verified against the orgs' sites (2026-08-06).
_LAWHELP_NY      = {"name": "LawHelpNY",                                 "sub": "Find free legal help across New York",         "phone": "",             "hours": "",                       "url": "lawhelpny.org"}
_MET_COUNCIL     = {"name": "Met Council on Housing — Tenants' Hotline", "sub": "Free tenant-rights advice · NYC",              "phone": "212-979-0611", "hours": "Mon & Wed 1:30–8, Fri 1–5", "url": "metcouncilonhousing.org"}
_LAS_BENEFITS    = {"name": "Legal Aid Society — Access to Benefits",    "sub": "Public benefits help · NYC",                   "phone": "888-663-6880", "hours": "Tue–Thu 9:30–12:30",     "url": "legalaidnyc.org"}

# --- Federal category orgs (same referral in every state) ---
# Veterans benefits are federal, so one national resource serves all states. The
# VA National Call Center is the long-standing official benefits line.
_VA_BENEFITS = {"name": "VA — Veterans Benefits Hotline", "sub": "Federal benefits, claims & appeals", "phone": "800-827-1000", "hours": "Mon–Fri 8–9 ET", "url": "va.gov"}

# National fallback front door — routes to local help anywhere by ZIP.
_TWO_ONE_ONE = {"name": "211", "sub": "Free 24/7, routed to local help", "phone": "211", "hours": "24/7 · free", "url": "211.org"}

# --- Warm handoff ---------------------------------------------------------
# The "don't dead-end" front door: a guided legal-aid intake per state. Shown
# when we refuse or answer with low confidence, so the user always has a real
# next step. Illinois routes to ILAO's Get Legal Help (a guided intake); the
# other states route to their statewide legal-aid finder.
_HANDOFF = {
    "IL": {"name": "Illinois Legal Aid Online — Get Legal Help", "url": "illinoislegalaid.org/get-legal-help"},
    "CA": {"name": "LawHelpCA — Find Legal Help",                 "url": "lawhelpca.org"},
    "MO": {"name": "MOLawHelp — Find Legal Help",                 "url": "molawhelp.org"},
    "TX": {"name": "TexasLawHelp — Find Legal Help",              "url": "texaslawhelp.org"},
    "NY": {"name": "LawHelpNY — Find Legal Help",                 "url": "lawhelpny.org"},
}
_HANDOFF_NATIONAL = {"name": "LawHelp.org — Find Free Legal Aid", "url": "lawhelp.org"}


def handoff_for(state: str | None) -> dict:
    """The warm-handoff intake for a state. Defaults to Illinois (the incumbent)
    when unset, and to a national finder for an out-of-list state."""
    st = (state or "").upper()
    if not st or st == "IL":
        return _HANDOFF["IL"]
    return _HANDOFF.get(st, _HANDOFF_NATIONAL)


def _contact_ca(topic: str, locality: str) -> dict:
    """California referral org by topic, preferring a San Francisco org there."""
    sf = locality == "san_francisco"
    if topic in ("housing", "housing_repair"):
        return _HRCSF if sf else _LAWHELP_CA
    if topic == "benefits":
        return _BENEFITS_CAL
    if topic == "money_debt":
        return _CA_COURTS_SELF
    return _LAWHELP_CA  # resources and anything else


def _contact_mo(locality: str) -> dict:
    """Missouri referral org by region. The state splits cleanly between two
    LSC-funded programs; elsewhere routes to the statewide directory."""
    if locality == "st_louis_city":
        return _LSEM
    if locality == "kansas_city":
        return _LAWMO
    return _MOLAWHELP


def _contact_tx(locality: str) -> dict:
    """Texas referral org by region. Lone Star Legal Aid covers the Houston metro
    and East Texas; elsewhere routes to the statewide TexasLawHelp directory."""
    if locality == "houston":
        return _LONE_STAR
    return _TEXASLAWHELP


def _contact_ny(topic: str, locality: str) -> dict:
    """New York referral org. In NYC, route housing to Met Council's tenant
    hotline and benefits to Legal Aid's Access-to-Benefits line; elsewhere (and
    for other topics) route to the statewide LawHelpNY directory."""
    if locality == "new_york_city":
        if topic in ("housing", "housing_repair"):
            return _MET_COUNCIL
        if topic == "benefits":
            return _LAS_BENEFITS
    return _LAWHELP_NY


def contact_for(topic: str, region: str, state: str | None = None) -> dict:
    """Return the referral org for a (topic, region, state).

    Illinois is the default and keeps its existing region logic. California
    routes to California orgs. Any other/unknown state falls back to 211, the
    national front door, so routing never dead-ends and never sends an Illinois
    hotline to an out-of-state user."""
    # Veterans benefits are federal — one national referral, regardless of state.
    # (Work/employment falls through to each state's general legal aid below.)
    if topic == "veterans":
        return _VA_BENEFITS

    st = (state or "").upper()
    if st == "CA":
        return _contact_ca(topic, region)
    if st == "MO":
        return _contact_mo(region)
    if st == "TX":
        return _contact_tx(region)
    if st == "NY":
        return _contact_ny(topic, region)
    if st and st not in ("IL", "FEDERAL"):
        return _TWO_ONE_ONE

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