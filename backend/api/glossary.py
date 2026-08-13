"""
glossary.py
Per-language pinned translations of legal terms of art.

The roadmap's warning: "notice to quit", "garnishment", "warranty of
habitability" have no clean equivalent in most target languages, and a
plausible-sounding wrong translation is undetectable to us. So we pin the
translations here and inject them into the answer prompt, rather than letting the
model improvise each time.

These are a starting point and must be confirmed by a native-speaker legal
reviewer before the language leaves "machine-assisted, under review". Add a block
per language keyed by the same code used in content.LANGUAGES.
"""

from __future__ import annotations

GLOSSARIES: dict[str, dict[str, str]] = {
    "pl": {
        "eviction": "eksmisja",
        "notice to quit / notice to vacate": "wezwanie do opuszczenia lokalu (wypowiedzenie)",
        "unlawful detainer": "postępowanie eksmisyjne",
        "lease": "umowa najmu",
        "landlord": "wynajmujący (właściciel)",
        "tenant": "najemca (lokator)",
        "security deposit": "kaucja",
        "warranty of habitability": "gwarancja odpowiednich warunków mieszkaniowych",
        "repair and deduct": "naprawa na koszt wynajmującego (potrącenie z czynszu)",
        "foreclosure": "egzekucja z nieruchomości (przejęcie domu przez bank)",
        "garnishment": "zajęcie wynagrodzenia",
        "debt collector": "firma windykacyjna",
        "wage claim": "roszczenie o zaległe wynagrodzenie",
        "unpaid wages / wage theft": "niewypłacone wynagrodzenie (kradzież płacy)",
        "overtime": "nadgodziny",
        "public benefits": "świadczenia publiczne",
        "SNAP (food stamps)": "SNAP (pomoc na żywność)",
        "Medicaid": "Medicaid (ubezpieczenie zdrowotne dla osób o niskich dochodach)",
        "VA disability compensation": "odszkodowanie dla weteranów za niepełnosprawność (VA)",
        "legal aid": "bezpłatna pomoc prawna",
    },
}


def glossary_block(language: str) -> str:
    """A prompt fragment pinning legal-term translations, or '' if none for this
    language. Appended to the answer system prompt for non-English answers."""
    terms = GLOSSARIES.get(language)
    if not terms:
        return ""
    lines = "\n".join(f"- {en} = {tr}" for en, tr in terms.items())
    return ("\n\n8. GLOSSARY — for these legal terms of art, use exactly this "
            "translation and do not substitute a different word:\n" + lines)
