from backend.ingest.parse_html import parse_html
from backend.ingest.parse_pdf import parse_pdf


def test_parse_html_returns_text():
    result = parse_html("data/raw/immigration/uscis-asylum.html")
    assert result["text"]
    assert len(result["text"]) > 100
    assert result["topic"] == "immigration"
    assert result["jurisdiction"] == "federal"


def test_parse_pdf_returns_text():
    result = parse_pdf("data/raw/immigration/uscis-i589-instructions.pdf")
    assert result["text"]
    assert len(result["text"]) > 100
    assert result["topic"] == "immigration"
