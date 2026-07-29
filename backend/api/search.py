"""
search.py
GET /search — semantic retrieval over the source corpus. Returns the raw chunks
and their citations. No LLM involved; this is the building block /ask sits on.
"""

from fastapi import APIRouter, Query, Request

from backend.analytics import record
from backend.api.schemas import SearchResponse
from backend.limiter import limiter
from backend.services.retriever import search as retrieve

router = APIRouter()


@router.get("/search", response_model=SearchResponse)
@limiter.limit("30/minute")
def search(
    request: Request,
    q: str = Query(..., max_length=2000, description="natural-language query"),
    k: int = Query(5, ge=1, le=20, description="number of results"),
    topic: str | None = Query(None, description="optional topic filter, e.g. money_debt"),
):
    results = retrieve(q, k=k, topic=topic)
    record(request, kind="search", topic=topic, query_chars=len(q),
           count=len(results), question=q)
    return {"query": q, "count": len(results), "results": results}