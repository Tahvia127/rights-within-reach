# daily_resource_review.py
# Daily review queue for published organizations. Never edits the live site --
# only produces a report for a human to act on.
#
# Pass 1 (always runs, free): re-checks every published org website link and
#   flags dead/moved/unreachable ones.
# Pass 2 (gated, costs money): uses Claude web_search to find orgs we may be
#   missing, de-dupes against what we publish, lists novel candidates for review.
#   Requires RESOURCE_DISCOVERY_ENABLED=1 and ANTHROPIC_API_KEY.
#
# Output: data/monitor/resource-review-<date>.md
# Exits non-zero when anything needs a human (dead links or new candidates).
#
# Usage:
#   python scripts/daily_resource_review.py [--date YYYY-MM-DD] [--dry-run]
# Env:
#   RESOURCE_DISCOVERY_ENABLED=1
#   ANTHROPIC_API_KEY=sk-ant-...
#   RESOURCE_MODEL=claude-sonnet-4-6
#   RESOURCE_DISCOVERY_MAX_SEARCHES=5

from __future__ import annotations

import argparse
import json
import os
import re
from datetime import date
from pathlib import Path

from check_org_links import _fetch, collect

ROOT = Path(__file__).resolve().parents[1]
MONITOR = ROOT / "data" / "monitor"
RESOURCES_TSX = ROOT / "frontend/src/pages/Resources.tsx"
FINDHELP_TSX = ROOT / "frontend/src/components/FindHelpNearMe.tsx"

DISCOVERY_MODEL = os.getenv("RESOURCE_MODEL", "claude-sonnet-4-6")
DISCOVERY_MAX_SEARCHES = int(os.getenv("RESOURCE_DISCOVERY_MAX_SEARCHES", "5"))


def _truthy(v: str | None) -> bool:
    return (v or "").strip().lower() in {"1", "true", "yes", "on"}


def _norm(s: str) -> str:
    """Loose key for deduping org names ('CARPLS Legal Aid Hotline' -> 'carplslegalaidhotline')."""
    return re.sub(r"[^a-z0-9]", "", s.lower())


def _domain(url: str) -> str:
    m = re.search(r"https?://([^/]+)", url or "")
    return m.group(1).lower().removeprefix("www.") if m else ""


def existing_orgs() -> tuple[set[str], set[str]]:
    """Return (known org name keys, known website domains) to skip in discovery."""
    names: set[str] = set()
    for p in (RESOURCES_TSX, FINDHELP_TSX):
        if p.exists():
            for m in re.finditer(r"name:\s*'([^']+)'", p.read_text(errors="ignore")):
                names.add(_norm(m.group(1)))
    domains = {_domain(u) for u in collect()}
    domains.discard("")
    return names, domains


# --- pass 1: verify existing links (free) ---

def verify_links() -> tuple[list, list, int]:
    """Return (dead, warn, total). Reuses liveness logic from check_org_links.py."""
    links = collect()
    dead, warn = [], []
    for url in sorted(links):
        status, detail = _fetch(url)
        if status == "dead": dead.append((url, detail, links[url]))
        elif status == "warn": warn.append((url, detail, links[url]))
    return dead, warn, len(links)


# --- pass 2: discover new orgs (gated, costs money) ---

DISCOVERY_PROMPT = """You help maintain a public directory of FREE or low-cost legal-aid \
and assistance organizations for Illinois residents (the app is "Rights Within Reach").

Use the web_search tool to find organizations we may be MISSING. Cover these needs:
tenant/eviction help, debt/consumer/utilities, home-repair grants, public benefits \
(SNAP/Medicaid/All Kids), and also domestic violence, veterans, seniors & people with \
disabilities, LGBTQ+, and immigrants.

Requirements for every candidate:
- Serves Illinois (statewide, or Chicago / Cook County / the collar counties).
- Free or sliding-scale / no-cost intake.
- Currently operating, with a working website you actually found in search.

Do NOT include any organization already on this list (these are already published):
{existing}

Return ONLY a fenced json code block containing an array. Each item:
  {{"name": "...", "url": "https://...", "phone": "...", "serves": "...",
    "helps_with": "...", "source": "https://... (page where you verified it)"}}
Use "" for anything you cannot verify. If you are not confident an org still \
operates, leave it out. Do not invent phone numbers."""


def _parse_json_array(text: str) -> list[dict]:
    """Pull the JSON array out of the model reply (fenced block preferred)."""
    m = re.search(r"```(?:json)?\s*(\[.*?\])\s*```", text, re.S)
    blob = m.group(1) if m else None
    if blob is None:
        start, end = text.find("["), text.rfind("]")
        blob = text[start:end + 1] if 0 <= start < end else None
    if not blob:
        return []
    try:
        return [d for d in json.loads(blob) if isinstance(d, dict)]
    except json.JSONDecodeError:
        return []


def discover(existing_names: set[str], existing_domains: set[str]) -> tuple[list[dict], str]:
    """Return (novel_candidates, status_note). No-op unless explicitly enabled."""
    if not _truthy(os.getenv("RESOURCE_DISCOVERY_ENABLED")):
        return [], "off -- set RESOURCE_DISCOVERY_ENABLED=1 to enable"
    if not os.getenv("ANTHROPIC_API_KEY"):
        return [], "skipped -- ANTHROPIC_API_KEY is not set"
    try:
        import anthropic
    except ImportError:
        return [], "skipped -- the `anthropic` package is not installed"

    client = anthropic.Anthropic()
    prompt = DISCOVERY_PROMPT.format(existing="\n".join(f"- {n}" for n in sorted(existing_names)))
    try:
        resp = client.messages.create(
            model=DISCOVERY_MODEL,
            max_tokens=4096,
            tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": DISCOVERY_MAX_SEARCHES}],
            messages=[{"role": "user", "content": prompt}],
        )
    except Exception as e:
        return [], f"web search failed: {type(e).__name__}: {str(e)[:120]}"

    text = "".join(getattr(b, "text", "") for b in resp.content if getattr(b, "type", None) == "text")
    candidates = _parse_json_array(text)

    novel = [c for c in candidates
             if c.get("name") and _norm(c["name"]) not in existing_names
             and _domain(c.get("url", "")) not in existing_domains]
    return novel, f"{len(candidates)} found, {len(novel)} new after dedup"


# --- report ---

def render(when: str, dead: list, warn: list, total: int, candidates: list[dict], disc_note: str) -> str:
    lines = [
        f"# Resource review, {when}", "",
        "Automated daily check. Nothing here is live -- a human reviews it, then "
        "fixes links / adds approved orgs to `frontend/src/pages/Resources.tsx` by hand.",
        "",
        f"- Website links checked: **{total}**",
        f"- Dead / broken: **{len(dead)}**  ·  To double-check: **{len(warn)}**",
        f"- New resource candidates: **{len(candidates)}**  ({disc_note})", "",
    ]

    lines += ["## Dead or broken links (fix these)", ""]
    lines += ([f"- [ ] `{url}` -- {detail}  _(in {where})_" for url, detail, where in dead]
              or ["_None. Every published link resolved._"])
    lines.append("")

    if warn:
        lines += ["## Links to double-check (transient/server errors)", ""]
        lines += [f"- [ ] `{url}` -- {detail}  _(in {where})_" for url, detail, where in warn]
        lines.append("")

    lines += ["## Candidate new resources (review, then add if legit)", ""]
    if candidates:
        for c in candidates:
            lines.append(f"- [ ] **{c.get('name','(no name)')}** -- {c.get('helps_with','')}")
            meta = "  ".join(x for x in (
                c.get("url", ""),
                (f"tel: {c['phone']}" if c.get("phone") else ""),
                (f"serves {c['serves']}" if c.get("serves") else ""),
            ) if x)
            if meta: lines.append(f"      {meta}")
            if c.get("source"): lines.append(f"      verify: {c['source']}")
    else:
        lines.append(f"_None this run ({disc_note})._")

    lines += ["", "---",
              "_Phone numbers and hours can't be verified over HTTP -- confirm by hand "
              "before publishing (see `docs/review/`)._"]
    return "\n".join(lines) + "\n"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", default=date.today().isoformat())
    ap.add_argument("--dry-run", action="store_true", help="print report but write no file")
    args = ap.parse_args()

    print(f"resource review for {args.date}\n  verifying published links...")
    dead, warn, total = verify_links()
    print(f"  {total} links: {len(dead)} dead, {len(warn)} to check")

    names, domains = existing_orgs()
    print(f"  discovery pass ({len(names)} orgs known)...")
    candidates, note = discover(names, domains)
    print(f"  discovery: {note}")

    report = render(args.date, dead, warn, total, candidates, note)

    if args.dry_run:
        print("\n" + report)
    else:
        MONITOR.mkdir(parents=True, exist_ok=True)
        out = MONITOR / f"resource-review-{args.date}.md"
        out.write_text(report)
        print(f"\nwrote {out.relative_to(ROOT)}")
        print("\n" + report)

    raise SystemExit(1 if (dead or candidates) else 0)


if __name__ == "__main__":
    main()