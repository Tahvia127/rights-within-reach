# monitor_sources.py
# Content-freshness monitor for the Rights Within Reach corpus.
# Re-fetches each ingested source, compares to the cached copy, and flags changes
# for human review. Changed legal text is never trusted silently.
#
# Outputs:
#   data/monitor/state.json          -- per-URL hashes + status (for run-over-run diff)
#   data/monitor/report-<date>.md    -- human-readable change report
#
# Usage:
#   python scripts/monitor_sources.py [--limit N] [--topic housing] [--date YYYY-MM-DD]

from __future__ import annotations

import argparse
import difflib
import hashlib
import json
import re
from datetime import date
from pathlib import Path

import requests
from bs4 import BeautifulSoup

RAW = Path("data/raw")
OUT = Path("data/monitor")
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
DROP = ["script", "style", "nav", "header", "footer", "noscript", "aside"]

CHANGED_BELOW = 0.90  # < this = material change, review + re-ingest
MINOR_BELOW   = 0.99  # in [CHANGED, this) = minor drift, glance only


def extract_text(html: str) -> str:
    """Main visible text, normalized -- mirrors the ingestion extractor."""
    soup = BeautifulSoup(html, "html.parser")
    for t in soup(DROP):
        t.decompose()
    # Drop Google Translate widgets and Bootstrap modals.
    for t in soup.select('#google_translate_element, .skiptranslate, .modal, [class*="goog-te"]'):
        t.decompose()
    # Prefer <main>, fall back to body when <main> is a thin wrapper (e.g. ILGA).
    main = soup.find("main")
    body = soup.body or soup
    main_txt = main.get_text(" ") if main else ""
    body_txt = body.get_text(" ")
    root_txt = body_txt if len(main_txt) < 0.6 * len(body_txt) else main_txt
    return re.sub(r"\s+", " ", root_txt).strip().lower()


def sha(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def similarity(a: str, b: str) -> float:
    """Word-level ratio, capped for bounded cost on long documents."""
    return difflib.SequenceMatcher(None, a.split()[:4000], b.split()[:4000]).ratio()


def url_short(url: str) -> str:
    return re.sub(r"^https?://(www\.)?", "", url).split("/")[0]


def load_sources(topic_filter: str | None, limit: int | None) -> list[dict]:
    out = []
    for m in sorted(RAW.glob("*/*.meta.json")):
        html = m.parent / (m.name[:-len(".meta.json")] + ".html")
        if not html.exists():
            continue
        try:
            meta = json.loads(m.read_text())
        except Exception:
            continue
        if topic_filter and meta.get("topic") != topic_filter:
            continue
        if not meta.get("url"):
            continue
        out.append({"meta": meta, "html_path": html})
    return out[:limit] if limit else out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--topic", default=None)
    ap.add_argument("--date", default=date.today().isoformat())
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    state_path = OUT / "state.json"
    prev = {}
    if state_path.exists():
        try:
            prev = json.loads(state_path.read_text()).get("sources", {})
        except Exception:
            prev = {}

    sources = load_sources(args.topic, args.limit)
    print(f"monitoring {len(sources)} ingested sources...\n")

    changed, minor, errors, unchanged = [], [], [], []
    state_sources = {}

    for s in sources:
        meta, html_path = s["meta"], s["html_path"]
        url  = meta["url"]
        name = meta.get("source_name", url_short(url))
        topic = meta.get("topic", "")
        baseline_text = extract_text(html_path.read_text(errors="ignore"))

        try:
            resp = requests.get(url, headers=HEADERS, timeout=25)
            resp.raise_for_status()
            live_text = extract_text(resp.text)
        except Exception as e:
            errors.append({"name": name, "url": url, "topic": topic, "error": str(e)[:80]})
            state_sources[url] = {"source_name": name, "topic": topic, "status": "error",
                                  "error": str(e)[:80], "checked_at": args.date}
            print(f"  ERROR  {topic}/{name[:40]}: {str(e)[:50]}")
            continue

        live_sha = sha(live_text)
        ratio = 1.0 if live_sha == sha(baseline_text) else similarity(baseline_text, live_text)
        changed_since_last = prev.get(url, {}).get("live_sha") not in (None, live_sha)

        if ratio < CHANGED_BELOW:
            changed.append({"name": name, "url": url, "topic": topic,
                            "ratio": ratio, "since_last": changed_since_last})
            print(f"  CHANGED {topic}/{name[:40]}  ({ratio:.0%} vs our copy)")
            status = "changed"
        elif ratio < MINOR_BELOW:
            minor.append({"name": name, "url": url, "topic": topic, "ratio": ratio})
            print(f"  minor   {topic}/{name[:40]}  ({ratio:.0%})")
            status = "minor"
        else:
            unchanged.append(name)
            status = "unchanged"

        state_sources[url] = {"source_name": name, "topic": topic, "status": status,
                              "live_sha": live_sha, "ratio_vs_baseline": round(ratio, 4),
                              "checked_at": args.date}

    state_path.write_text(json.dumps(
        {"generated_at": args.date, "sources": state_sources}, indent=2, ensure_ascii=False))

    report_path = OUT / f"report-{args.date}.md"
    report_path.write_text(_render_report(args.date, changed, minor, errors, unchanged))

    print(f"\n{len(changed)} changed, {len(minor)} minor, {len(errors)} errors, "
          f"{len(unchanged)} unchanged")
    print(f"report -> {report_path}")
    raise SystemExit(1 if (changed or errors) else 0)


def _render_report(when: str, changed, minor, errors, unchanged) -> str:
    total = len(changed) + len(minor) + len(errors) + len(unchanged)
    L = [f"# Source freshness report -- {when}", ""]
    L.append(f"Checked **{total}** ingested sources: "
             f"**{len(changed)} changed**, {len(minor)} minor, {len(errors)} errors, "
             f"{len(unchanged)} unchanged.\n")

    L.append("## Changed -- review and re-ingest\n")
    if changed:
        L.append("The live page differs materially from our ingested copy. Re-read it, update "
                 "the corpus / org cards / topic pages, then re-run `fetch_sources.py` + ingest.\n")
        for c in sorted(changed, key=lambda x: x["ratio"]):
            flag = " -- **new since last check**" if c.get("since_last") else ""
            L.append(f"- [{c['name']}]({c['url']}) -- _{c['topic']}_ -- "
                     f"{c['ratio']:.0%} similar to our copy{flag}")
    else:
        L.append("_None._")
    L.append("")

    L.append("## Fetch errors / possibly dead links\n")
    L += ([f"- [{e['name']}]({e['url']}) -- _{e['topic']}_ -- `{e['error']}`" for e in errors]
          or ["_None._"])
    L.append("")

    L.append("## Minor drift (glance only)\n")
    L += ([f"- [{m['name']}]({m['url']}) -- _{m['topic']}_ -- {m['ratio']:.0%}"
           for m in sorted(minor, key=lambda x: x["ratio"])] or ["_None._"])
    L.append("")

    L.append(f"<details><summary>{len(unchanged)} unchanged</summary>\n")
    L += [f"- {n}" for n in sorted(unchanged)]
    L.append("\n</details>")
    return "\n".join(L) + "\n"


if __name__ == "__main__":
    main()