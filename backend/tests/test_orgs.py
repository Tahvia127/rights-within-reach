"""
Tests for the resource-finder data layer (backend/services/orgs.py).

Runs against the real data/orgs.csv, so assertions avoid exact counts (which
change as the harvest is re-run) and pin behavior instead: state/topic are hard
filters, language ranks, results dedupe and carry a usable shape.
"""

from backend.services.orgs import find_orgs


def test_state_is_a_hard_filter():
    il = find_orgs(state="IL", limit=50)
    assert il, "expected Illinois orgs in the seed"
    assert all(o["state"] == "IL" for o in il)

    ca = find_orgs(state="CA", limit=50)
    assert ca, "expected California orgs in the seed"
    assert all(o["state"] == "CA" for o in ca)
    # No Illinois org leaks into a California request.
    assert not (set(o["name"] for o in il) & set(o["name"] for o in ca))


def test_topic_filters_to_matching_list_code_parent():
    housing = find_orgs(state="IL", topic="housing", limit=50)
    assert housing
    # Every returned org must carry at least one Housing (HO-*) code.
    assert all(any(c.startswith("HO") for c in o["list_codes"]) for o in housing)


def test_language_ranks_a_speaker_first_when_available():
    es = find_orgs(state="IL", topic="housing", language="es", limit=1)
    assert es
    # The top result for a Spanish request should speak Spanish, given the seed
    # has Spanish-speaking Chicago housing orgs.
    assert "es" in es[0]["languages"]


def test_results_are_deduped_by_name():
    orgs = find_orgs(state="IL", limit=50)
    names = [o["name"] for o in orgs]
    assert len(names) == len(set(names))


def test_limit_is_respected():
    assert len(find_orgs(state="IL", limit=3)) <= 3


def test_cards_have_clean_shape_no_na_placeholders():
    for o in find_orgs(state="IL", limit=50):
        assert o["name"]
        # "N/A" placeholders from HUD must be cleaned to empty strings.
        assert o["phone"].upper() != "N/A"
        assert o["url"].upper() != "N/A"
        assert isinstance(o["list_codes"], list)


def test_unknown_state_returns_nothing():
    assert find_orgs(state="ZZ") == []
