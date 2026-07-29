# daily_ingest.py
# Safe daily refresh of the ingested corpus. Re-fetches each tracked source and
# decides what to do without silently replacing good legal text with a broken page.
#
#   fetch fails or page is suspiciously thin -> keep last-good copy, flag "broken"
#   >= 99% similar -> leave as-is (no churn)
#   changed and healthy -> overwrite .html/.meta.json for next deploy
#   < 90% similar -> still refreshed but flagged for human legal review
#
# Writes data/monitor/ingest-<date>.md. Exits non-zero when anything needs a
# human (broken fetches or material changes) so CI can open a review issue.
#
# Usage:
#   python scripts/daily_ingest.py [--date YYYY-MM-DD] [--limit N] [--topic T] [--dry-run]

from __future__ import annotations

import argparse
import json
from datetime import date

import requests

from monitor_sources import HEADERS, OUT, extract_text, load_sources, similarity, sha

CHANGED_BELOW   = 0.90  # < this = material change, flag for review
UNCHANGED_ABOVE = 0.99  # >= this = leave cached copy alone
BROKEN_BELOW    = 0.25  # < this = likely moved/restructured, keep last-good
THIN_REL        = 0.5   # live page lost half+ cached text = suspect


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", default=date.today().isoformat())
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--topic", default=None)
    ap.add_argument("--dry-run", action="store_true", help="report only; write nothing")
    args = ap.parse_args()

    sources = load_sources(args.topic, args.limit)
    print(f"daily re-ingest: {len(sources)} sources (dry-run={args.dry_run})\n")

    refreshed, material, broken, unchanged = [], [], [], []

    for s in sources:
        meta, html_path = s["meta"], s["html_path"]
        url, name, topic = meta["url"], meta.get("source_name", meta["url"]), meta.get("topic", "")
        cached_text = extract_text(html_path.read_text(errors="ignore"))

        try:
            resp = requests.get(url, headers=HEADERS, timeout=25)
            resp.raise_for_status()
            live_html = resp.text
            live_text = extract_text(live_html)
        except Exception as e:
            broken.append({"name": name, "url": url, "topic": topic, "why": f"fetch failed: {str(e)[:70]}"})
            print(f"  KEEP(broken)  {topic}/{name[:38]}: {str(e)[:45]}")
            continue

        ratio = 1.0 if sha(live_text) == sha(cached_text) else similarity(cached_text, live_text)

        if ratio >= UNCHANGED_ABOVE:
            unchanged.append(name)
            continue

        # Keep last-good copy if the live page looks moved or broken.
        if ratio < BROKEN_BELOW or len(live_text) < THIN_REL * max(1, len(cached_text)):
            broken.append({"name": name, "url": url, "topic": topic,
                           "why": f"live page looks moved/broken ({len(live_text)} chars, {ratio:.0%} similar)"})
            print(f"  KEEP(suspect) {topic}/{name[:38]}: {len(live_text)} chars, {ratio:.0%}")
            continue

        # Healthy change -- refresh cached copy so it re-ingests on next deploy.
        if not args.dry_run:
            html_path.write_text(live_html, encoding="utf-8")
            meta_path = html_path.parent / (html_path.stem + ".meta.json")
            meta_path.write_text(json.dumps({**meta, "downloaded_at": args.date}, indent=2, ensure_ascii=False))

        entry = {"name": name, "url": url, "topic": topic, "ratio": ratio}
        if ratio < CHANGED_BELOW:
            material.append(entry)
            print(f"  REFRESH*      {topic}/{name[:38]}: {ratio:.0%} (MATERIAL -- review)")
        else:
            refreshed.append(entry)
            print(f"  refresh       {topic}/{name[:38]}: {ratio:.0%}")

    OUT.mkdir(parents=True, exist_ok=True)
    report = _render(args.date, refreshed, material, broken, unchanged, args.dry_run)
    (OUT / f"ingest-{args.date}.md").write_text(report)

    print(f"\n{len(refreshed)} refreshed, {len(material)} material, "
          f"{len(broken)} broken/kept, {len(unchanged)} unchanged")
    print(f"report -> {OUT / f'ingest-{args.date}.md'}")
    raise SystemExit(1 if (material or broken) else 0)


def _render(when, refreshed, material, broken, unchanged, dry) -> str:
    L = [f"# Daily re-ingest -- {when}{' (dry run)' if dry else ''}", ""]
    L.append(f"{len(refreshed)} refreshed · **{len(material)} material (review)** · "
             f"**{len(broken)} broken/kept** · {len(unchanged)} unchanged\n")

    L.append("## Materially changed -- refreshed, but review the legal content\n")
    L += ([f"- [{m['name']}]({m['url']}) -- _{m['topic']}_ -- {m['ratio']:.0%} similar to prior copy"
           for m in sorted(material, key=lambda x: x["ratio"])] or ["_None._"])
    L.append("")

    L.append("## Possibly broken -- kept last-good copy, needs a human\n")
    L += ([f"- [{b['name']}]({b['url']}) -- _{b['topic']}_ -- {b['why']}" for b in broken] or ["_None._"])
    L.append("")

    L.append(f"<details><summary>{len(refreshed)} minor refreshes</summary>\n")
    L += [f"- {r['name']} ({r['ratio']:.0%})" for r in refreshed]
    L.append("\n</details>\n")
    L.append(f"<details><summary>{len(unchanged)} unchanged</summary>\n")
    L += [f"- {n}" for n in sorted(unchanged)]
    L.append("\n</details>")
    return "\n".join(L) + "\n"


if __name__ == "__main__":
    main()