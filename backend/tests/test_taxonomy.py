"""
Unit tests for the jurisdiction + LIST layer and state-aware referral routing.

These are pure functions (no Chroma, no ML deps), so they run fast and are the
right place to pin the safety-critical behavior: a source's jurisdiction is
normalized correctly, LIST codes map to the right screen, and a referral never
sends an out-of-state user to an Illinois-only hotline.
"""

from backend.services.routing import contact_for
from backend.services.taxonomy import (
    list_code_for, list_code_to_topic, normalize_jurisdiction, parent_of,
)


# --- normalize_jurisdiction ------------------------------------------------

def test_legacy_illinois_strings_map_to_state_and_locality():
    assert normalize_jurisdiction({"jurisdiction": "illinois"}) == ("IL", None)
    assert normalize_jurisdiction({"jurisdiction": "federal"}) == ("federal", None)
    assert normalize_jurisdiction({"jurisdiction": "chicago-il"}) == ("IL", "chicago")
    assert normalize_jurisdiction({"jurisdiction": "cook-county-il"}) == ("IL", "cook_county")


def test_explicit_state_and_locality_win_over_jurisdiction():
    meta = {"jurisdiction": "california", "state": "CA", "locality": "san_francisco"}
    assert normalize_jurisdiction(meta) == ("CA", "san_francisco")


def test_california_and_federal_from_csv_shape():
    assert normalize_jurisdiction({"state": "CA"}) == ("CA", None)
    assert normalize_jurisdiction({"state": "federal"}) == ("federal", None)


def test_unknown_jurisdiction_degrades_without_becoming_illinois():
    # A typo should not silently resolve to Illinois; it becomes its own filter value.
    state, locality = normalize_jurisdiction({"jurisdiction": "ohio"})
    assert state == "OHIO"
    assert locality is None


# --- LIST code mapping -----------------------------------------------------

def test_parent_of():
    assert parent_of("HO-06") == "HO"
    assert parent_of("HO") == "HO"
    assert parent_of("") == ""


def test_list_code_to_topic_splits_housing_repair():
    assert list_code_to_topic("HO-05") == "housing_repair"   # living conditions
    assert list_code_to_topic("HO-02") == "housing"          # eviction
    assert list_code_to_topic("HO-06") == "housing"          # renting
    assert list_code_to_topic("BE-00") == "benefits"
    assert list_code_to_topic("MO-00") == "money_debt"
    assert list_code_to_topic("CO-03") == "resources"
    assert list_code_to_topic("IM-00") == "immigration"


def test_list_code_to_topic_unknown_parent_is_none():
    # Family and Education are real LIST parents but not covered screens.
    assert list_code_to_topic("FA-04") is None
    assert list_code_to_topic("ED-01") is None
    assert list_code_to_topic("") is None


def test_list_code_for_prefers_explicit_then_derives_from_topic():
    assert list_code_for({"list_code": "ho-06"}) == "HO-06"          # uppercased
    assert list_code_for({"topic": "benefits"}) == "BE"             # derived parent
    assert list_code_for({"topic": "housing_repair"}) == "HO"
    assert list_code_for({}) == ""


# --- state-aware referral routing ------------------------------------------

def test_illinois_routing_unchanged_by_default():
    # Cook County housing still routes to CCLAHD; None state == Illinois default.
    il = contact_for("housing", "chicago", "IL")
    assert "Cook County Legal Aid" in il["name"]
    assert contact_for("housing", "chicago") == il  # state omitted == IL


def test_california_housing_prefers_san_francisco_org():
    sf = contact_for("housing", "san_francisco", "CA")
    assert "SF" in sf["name"] or "San Francisco" in sf["name"]
    statewide = contact_for("housing", None, "CA")
    assert statewide["name"] == "LawHelpCA"


def test_california_benefits_routes_to_ca_org_not_illinois():
    org = contact_for("benefits", None, "CA")
    assert "Illinois" not in org["name"]
    assert org["name"] == "BenefitsCal"


def test_unsupported_state_falls_back_to_national_not_illinois():
    # A state we don't cover (no routing branch) must not get an Illinois hotline.
    org = contact_for("housing", "", "WA")
    assert org["name"] == "211"
