# usage_report.py
# Summarizes the analytics log into a usage report: volume, languages, topics,
# refusal rate, cache hit rate, and feedback. Aggregate only -- no raw questions
# or IPs (see backend/analytics.py).
#
# Usage:
#   python scripts/usage_report.py [path/to/requests.jsonl] [--since YYYY-MM-DD]
#   python scripts/usage_report.py --html report.html

from __future__ import annotations

import argparse
import html as html_mod
import json
from collections import Counter
from pathlib import Path

DEFAULT = Path("data/analytics/requests.jsonl")


def load(path: Path, since: str | None) -> list[dict]:
    if not path.exists():
        return []
    rows = []
    for line in path.read_text(errors="ignore").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            r = json.loads(line)
        except json.JSONDecodeError:
            continue
        if since and str(r.get("ts", r.get("time", "")))[:10] < since:
            continue
        rows.append(r)
    return rows


def pct(n: int, total: int) -> str:
    return f"{(100 * n / total):.0f}%" if total else "--"


def bar(count: int, total: int, width: int = 24) -> str:
    filled = round(width * count / total) if total else 0
    return "█" * filled + "·" * (width - filled)


def aggregate(rows: list[dict]) -> dict:
    asks = [r for r in rows if r.get("kind") == "ask"]
    n = len(asks)
    fb = [r for r in rows if r.get("kind") == "feedback"]
    refused = sum(1 for r in asks if r.get("refused"))
    return {
        "rows": len(rows),
        "asks": n,
        "refused": refused,
        "cached":   sum(1 for r in asks if r.get("cached")),
        "triaged":  sum(1 for r in asks if r.get("triaged")),
        "zip_given": sum(1 for r in asks if r.get("zip_given")),
        "q_lens":   [r["query_chars"] for r in asks if isinstance(r.get("query_chars"), int)],
        "languages": Counter(r.get("language") for r in asks),
        "topics":    Counter(r.get("topic") for r in asks if not r.get("refused") and r.get("topic")),
        "subjects":  Counter(r.get("subject") for r in asks if r.get("subject")),
        "areas":     Counter(r.get("area") for r in asks if r.get("area")),
        "reasons":   Counter(r.get("reason") for r in asks if r.get("refused")),
        "feedback":  fb,
        "feedback_helpful":  sum(1 for r in fb if r.get("helpful")),
        "feedback_by_topic": Counter(r.get("topic") for r in fb),
    }


# --- text output ---

def dist(title: str, counter: Counter, total: int) -> None:
    print(f"\n{title}")
    if not counter:
        print("  (none)")
        return
    for key, count in counter.most_common():
        print(f"  {str(key or '--'):<16} {bar(count, total)} {count:>5}  {pct(count, total)}")


def render_text(s: dict, source: str, since: str | None) -> None:
    print("=" * 52)
    print("  Rights Within Reach -- usage report")
    print(f"  source: {source}" + (f" (since {since})" if since else ""))
    print("=" * 52)
    print(f"\nTotal logged requests: {s['rows']}")
    print(f"  /ask requests:       {s['asks']}")
    if not s["asks"]:
        print("\nNo /ask events yet.")
        return

    n = s["asks"]
    print("\nHeadline")
    print(f"  Refusal rate (out-of-scope):  {pct(s['refused'], n)}  ({s['refused']}/{n})")
    print(f"  Triage funnel used:           {pct(s['triaged'], n)}  ({s['triaged']}/{n})")
    print(f"  ZIP provided:                 {pct(s['zip_given'], n)}")
    print(f"  Served from cache:            {pct(s['cached'], n)}")
    if s["q_lens"]:
        print(f"  Avg question length:          {sum(s['q_lens'])//len(s['q_lens'])} chars")

    dist("Languages", s["languages"], n)
    dist("Topics (answered)", s["topics"], n)
    dist("Triage subject chosen", s["subjects"], n)
    dist("Triage area chosen", s["areas"], n)
    dist("Refusal reasons", s["reasons"], max(1, s["refused"]))

    if s["feedback"]:
        fb = s["feedback"]
        print(f"\nFeedback: {len(fb)} votes -- {pct(s['feedback_helpful'], len(fb))} helpful")
        dist("Feedback by topic", s["feedback_by_topic"], len(fb))


# --- html output ---

_CSS = """
:root { --burgundy:#6B1F2E; --midnight:#15233E; --clover:#3D6B3A; --bone:#F3EBE0;
  --cream:#FBF8F2; --ink:#1F1A14; --mute:#5F5950; --border:rgba(31,26,20,.14); }
* { box-sizing:border-box; }
body { margin:0; background:var(--bone); color:var(--ink);
  font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; line-height:1.5; }
.wrap { max-width:900px; margin:0 auto; padding:32px 20px 64px; }
h1 { font-family:'Fraunces',Georgia,serif; color:var(--midnight); font-size:2rem; margin:0 0 4px; letter-spacing:-.02em; }
.sub { color:var(--mute); font-size:.95rem; margin:0 0 28px; }
.cards { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:32px; }
.card { background:var(--cream); border:2px solid var(--border); border-radius:14px; padding:16px; }
.card .big { font-family:'Fraunces',Georgia,serif; color:var(--midnight); font-size:1.9rem; font-weight:700; line-height:1; }
.card .lbl { color:var(--mute); font-size:.78rem; text-transform:uppercase; letter-spacing:.06em; margin-top:8px; font-weight:700; }
h2 { font-family:'Fraunces',Georgia,serif; color:var(--midnight); font-size:1.25rem; margin:28px 0 12px; }
.dist { background:var(--cream); border:2px solid var(--border); border-radius:14px; padding:14px 18px; }
.row { display:grid; grid-template-columns:130px 1fr 88px; align-items:center; gap:12px; padding:5px 0; }
.row .k { font-weight:600; color:var(--midnight); font-size:.92rem; overflow-wrap:anywhere; }
.track { background:rgba(21,35,62,.08); border-radius:50px; height:14px; overflow:hidden; }
.fill { background:var(--clover); height:100%; border-radius:50px; }
.row .v { text-align:right; font-size:.86rem; color:var(--mute); font-variant-numeric:tabular-nums; }
.empty { color:var(--mute); font-style:italic; padding:6px 0; }
.foot { color:var(--mute); font-size:.8rem; margin-top:36px; border-top:1px solid var(--border); padding-top:16px; }
@media (max-width:640px){ .cards{grid-template-columns:repeat(2,1fr);} .row{grid-template-columns:96px 1fr 70px;} }
"""


def _dist_html(title: str, counter: Counter, total: int) -> str:
    if not counter:
        rows = '<div class="empty">(none yet)</div>'
    else:
        rows = ""
        for key, count in counter.most_common():
            w = round(100 * count / total) if total else 0
            rows += (
                '<div class="row">'
                f'<div class="k">{html_mod.escape(str(key or "--"))}</div>'
                f'<div class="track"><div class="fill" style="width:{w}%"></div></div>'
                f'<div class="v">{count} · {pct(count, total)}</div>'
                "</div>"
            )
    return f"<h2>{html_mod.escape(title)}</h2><div class=\"dist\">{rows}</div>"


def render_html(s: dict, source: str, since: str | None) -> str:
    n = s["asks"]
    avg = f"{sum(s['q_lens'])//len(s['q_lens'])}" if s["q_lens"] else "--"
    src = html_mod.escape(source) + (f" · since {html_mod.escape(since)}" if since else "")

    if not n:
        body = ('<div class="empty" style="padding:24px 0">No /ask events logged yet. '
                "This dashboard fills in once the live site receives traffic.</div>")
    else:
        cards = [
            (str(n),                                                      "Questions asked"),
            (pct(s["refused"], n),                                        "Refused (out-of-scope)"),
            (pct(s["triaged"], n),                                        "Used triage funnel"),
            (pct(s["cached"], n),                                         "Served from cache"),
            (pct(s["zip_given"], n),                                      "Gave a ZIP"),
            (avg,                                                         "Avg question chars"),
            (str(len(s["feedback"])),                                     "Feedback votes"),
            (pct(s["feedback_helpful"], len(s["feedback"])) if s["feedback"] else "--", "Rated helpful"),
        ]
        card_html = "".join(
            f'<div class="card"><div class="big">{html_mod.escape(v)}</div>'
            f'<div class="lbl">{html_mod.escape(l)}</div></div>'
            for v, l in cards
        )
        body = f'<div class="cards">{card_html}</div>'
        body += _dist_html("Languages", s["languages"], n)
        body += _dist_html("Topics (answered)", s["topics"], n)
        body += _dist_html("Triage subject chosen", s["subjects"], n)
        body += _dist_html("Triage area chosen", s["areas"], n)
        body += _dist_html("Refusal reasons", s["reasons"], max(1, s["refused"]))
        if s["feedback"]:
            body += _dist_html("Feedback by topic", s["feedback_by_topic"], len(s["feedback"]))

    return (
        "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
        "<title>Rights Within Reach -- usage dashboard</title>"
        f"<style>{_CSS}</style></head><body><div class=\"wrap\">"
        "<h1>Rights Within Reach -- usage</h1>"
        f'<p class="sub">Privacy-first analytics · {src} · {s["rows"]} logged events</p>'
        f"{body}"
        '<p class="foot">Aggregate only -- no raw questions or IP addresses are ever '
        "logged (see backend/analytics.py). Generated by scripts/usage_report.py.</p>"
        "</div></body></html>"
    )


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("path", nargs="?", default=str(DEFAULT))
    ap.add_argument("--since", default=None, help="only include rows on/after YYYY-MM-DD")
    ap.add_argument("--html", metavar="OUT", default=None,
                    help="write a self-contained HTML dashboard to OUT instead of text")
    args = ap.parse_args()

    rows = load(Path(args.path), args.since)
    stats = aggregate(rows)

    if args.html:
        out = Path(args.html)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render_html(stats, args.path, args.since), encoding="utf-8")
        print(f"wrote dashboard -> {out}  ({stats['asks']} /ask events, {stats['rows']} total)")
    else:
        render_text(stats, args.path, args.since)


if __name__ == "__main__":
    main()