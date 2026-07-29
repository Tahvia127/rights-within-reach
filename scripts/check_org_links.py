# check_org_links.py
# Checks org website links in routing.py and Resources.tsx for dead/moved URLs.
# Phone numbers and hours need manual audit (see docs/review/).
#
# Usage: python scripts/check_org_links.py
# Exits non-zero if any link is dead.

from __future__ import annotations

import re
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
           "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
DOMAIN = re.compile(r"\b([a-z0-9][a-z0-9.-]*\.(?:org|gov|com|net|us|edu))(/[^\s'\"]*)?", re.I)


def collect() -> dict[str, str]:
    """Return {url: where_seen}, deduped by normalized URL."""
    found: dict[str, str] = {}
    sources = {
        "routing.py":    ROOT / "backend/services/routing.py",
        "Resources.tsx": ROOT / "frontend/src/pages/Resources.tsx",
    }
    for label, path in sources.items():
        if not path.exists():
            continue
        for m in DOMAIN.finditer(path.read_text(errors="ignore")):
            host, tail = m.group(1), (m.group(2) or "")
            if host.endswith((".png", ".svg")) or "example" in host:
                continue
            url = f"https://{host}{tail}".rstrip(".,)")
            found.setdefault(url, label)
    return found


def _fetch(url: str):
    """Return (status, detail). 403/401/429 = live but bot-protected; 404/410 = dead."""
    last = ""
    for _ in range(2):
        try:
            r = requests.get(url, headers=HEADERS, timeout=20, allow_redirects=True)
            c = r.status_code
            if c in (401, 403, 429): return "blocked", f"HTTP {c} (bot-protected; live in a browser)"
            if c in (404, 410):      return "dead",    f"HTTP {c}"
            if c >= 500:             return "warn",    f"HTTP {c} (server error)"
            return "ok", (r.url if r.history else "")
        except requests.exceptions.RequestException as e:
            last = str(e)
    if any(s in last.lower() for s in ("name or service not known", "nodename nor servname", "getaddrinfo")):
        return "dead", "DNS not found"
    return "warn", f"unreachable: {last[:50]}"


def main() -> None:
    links = collect()
    print(f"checking {len(links)} org website links...\n")
    buckets: dict[str, list] = {"ok": [], "blocked": [], "dead": [], "warn": []}
    for url in sorted(links):
        status, detail = _fetch(url)
        buckets[status].append((url, detail, links[url]))

    for url, detail, where in buckets["dead"]:
        print(f"  DEAD   {url}  -- {detail}  [{where}]")
    for url, detail, where in buckets["warn"]:
        print(f"  CHECK  {url}  -- {detail}  [{where}]")
    if buckets["blocked"]:
        print(f"\n  {len(buckets['blocked'])} live but bot-protected (403/429) -- fine.")

    print(f"\n{len(buckets['ok'])} ok · {len(buckets['blocked'])} blocked-but-live · "
          f"{len(buckets['warn'])} to check manually · {len(buckets['dead'])} DEAD")
    print("Phone numbers and hours need manual audit -- see docs/review/.")
    raise SystemExit(1 if buckets["dead"] else 0)


if __name__ == "__main__":
    main()