"""
orgs.py
GET /orgs — the resource finder. Returns verified referral organizations that
serve a given state + topic, ranked toward the user's language and ZIP. Reads the
harvested org list (data/orgs.csv); no LLM involved.
"""

from fastapi import APIRouter, Query, Request

from backend.analytics import record
from backend.api.schemas import OrgsResponse
from backend.limiter import limiter
from backend.services.orgs import find_orgs

router = APIRouter()


@router.get("/orgs", response_model=OrgsResponse)
@limiter.limit("30/minute")
def orgs(
    request: Request,
    state: str | None = Query(None, description="two-letter state, e.g. IL, CA"),
    topic: str | None = Query(None, description="content topic, e.g. housing, benefits"),
    list_code: str | None = Query(None, description="LIST code, e.g. HO-06"),
    language: str | None = Query(None, description="site language code, e.g. es, zh"),
    zip: str | None = Query(None, max_length=10, description="ZIP to rank nearby orgs"),
    limit: int = Query(6, ge=1, le=20),
):
    results = find_orgs(state=state, topic=topic, list_code=list_code,
                        language=language, zip_code=zip, limit=limit)
    record(request, kind="orgs", state=(state or None), topic=(topic or None),
           language=(language or None), zip_given=bool(zip), count=len(results))
    return {"count": len(results), "results": results}
