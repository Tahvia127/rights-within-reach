# Resource review, 2026-08-22

Automated daily check. Nothing here is live -- a human reviews it, then fixes links / adds approved orgs to `frontend/src/pages/Resources.tsx` by hand.

- Website links checked: **41**
- Dead / broken: **0**  ·  To double-check: **8**
- New resource candidates: **0**  (off -- set RESOURCE_DISCOVERY_ENABLED=1 to enable)

## Dead or broken links (fix these)

_None. Every published link resolved._

## Links to double-check (transient/server errors)

- [ ] `https://cvls.org` -- unreachable: HTTPSConnectionPool(host='cvls.org', port=443): Ma  _(in Resources.tsx)_
- [ ] `https://dhs.state.il.us` -- unreachable: HTTPConnectionPool(host='www.dhs.state.il.us', por  _(in Resources.tsx)_
- [ ] `https://helpillinoisfamilies.com` -- unreachable: HTTPSConnectionPool(host='helpillinoisfamilies.com  _(in Resources.tsx)_
- [ ] `https://lawhelpca.org` -- unreachable: HTTPSConnectionPool(host='lawhelpca.org', port=443  _(in routing.py)_
- [ ] `https://lawmo.org` -- unreachable: HTTPSConnectionPool(host='lawmo.org', port=443): M  _(in routing.py)_
- [ ] `https://metcouncilonhousing.org` -- unreachable: HTTPSConnectionPool(host='metcouncilonhousing.org'  _(in routing.py)_
- [ ] `https://molawhelp.org` -- unreachable: HTTPSConnectionPool(host='molawhelp.org', port=443  _(in routing.py)_
- [ ] `https://the-network.org` -- unreachable: HTTPSConnectionPool(host='the-network.org', port=4  _(in Resources.tsx)_

## Candidate new resources (review, then add if legit)

_None this run (off -- set RESOURCE_DISCOVERY_ENABLED=1 to enable)._

---
_Phone numbers and hours can't be verified over HTTP -- confirm by hand before publishing (see `docs/review/`)._
