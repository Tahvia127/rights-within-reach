"""
schemas.py
Pydantic response models for the API. Using these as FastAPI `response_model`s
gives validated, documented output (visible in /docs) and a stable contract the
frontend can rely on.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


# --- /ask -------------------------------------------------------------------

class Source(BaseModel):
    title: str
    section: str = ""
    url: str = ""
    topic: str = ""
    score: float | None = None


class RefusalOrg(BaseModel):
    name: str
    sub: str = ""
    description: str = ""
    phone: str = ""
    hours: str = ""


class AskRequest(BaseModel):
    question: str = Field(..., max_length=2000, description="the user's question")
    language: str = "en"


class AskResponse(BaseModel):
    refused: bool
    reason: str | None = None
    answer: str
    sources: list[Source] = []
    topic: str = ""
    refusal_org: RefusalOrg | None = None


# --- /search ----------------------------------------------------------------

class SearchResult(BaseModel):
    source_name: str
    url: str = ""
    topic: str = ""
    jurisdiction: str = ""
    text: str
    score: float


class SearchResponse(BaseModel):
    query: str
    count: int
    results: list[SearchResult]
