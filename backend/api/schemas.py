"""
schemas.py
Pydantic models for the API. FastAPI uses these as `response_model`s, which
validates what we send, documents it in /docs, and gives the frontend a stable
contract to build against.
"""

from typing import Literal

from pydantic import BaseModel, Field


# what the frontend sends us

class AskRequest(BaseModel):
    question: str = Field(..., max_length=2000, description="the user's question")
    language: str = "en"
    # Optional triage inputs that refine retrieval and org routing.
    # area: chicago | suburban_cook | collar | elsewhere
    # subject: housing | money | repairs | benefits
    # Kept as plain strings so an unexpected value falls back in the handler
    # instead of failing the whole request.
    area: str | None = None
    zip: str | None = Field(None, max_length=10)
    subject: str | None = None
    # Jurisdiction the user is asking about. `state` keeps retrieval to
    # `federal` + this state so a California user never gets Illinois law;
    # `locality` (e.g. "chicago", "san_francisco") boosts local ordinances.
    # Plain strings so an unknown value degrades gracefully in the handler.
    state: str | None = Field(None, max_length=16)
    locality: str | None = Field(None, max_length=40)


class FeedbackRequest(BaseModel):
    """One 'was this helpful?' vote. Privacy-first: no raw question is sent."""
    helpful: bool
    language: str = "en"
    topic: str = ""


# what we send back

class Org(BaseModel):
    """Fields shared by both organization cards. Always from verified org data."""
    name: str
    sub: str = ""
    phone: str = ""
    hours: str = ""
    url: str = ""


class RefusalOrg(Org):
    """Shown when we can't answer. `description` says why they can help instead."""
    description: str = ""


class Contact(Org):
    """The who-to-contact card on a normal answer. why/how are written by the
    model in the user's language; everything else is our own data."""
    why: str = ""
    how: str = ""


class Source(BaseModel):
    title: str
    section: str = ""
    url: str = ""
    topic: str = ""
    score: float | None = None
    web: bool = False   # True if from a live web search rather than our corpus


class Handoff(BaseModel):
    """Warm-handoff intake: a guided legal-aid front door for the user's state.
    Present on refusals and low-confidence answers so we never dead-end."""
    name: str
    url: str = ""
    description: str = ""


class OrgCard(BaseModel):
    """A verified referral org from the resource finder (data/orgs.csv). Shared by
    the /orgs endpoint and the `local_orgs` list on an /ask answer."""
    name: str
    city: str = ""
    state: str = ""
    zip: str = ""
    address: str = ""
    phone: str = ""
    url: str = ""
    list_codes: list[str] = []
    languages: list[str] = []
    source: str = ""


class AskResponse(BaseModel):
    refused: bool
    reason: str | None = None
    answer: str
    disclaimer: str = ""
    next_steps: list[str] = []
    contact: Contact | None = None
    follow_ups: list[str] = []
    sources: list[Source] = []
    topic: str = ""
    refusal_org: RefusalOrg | None = None
    # Verified local orgs that serve this state + topic, ranked toward the user's
    # language. Empty on refusals and when the finder has no match.
    local_orgs: list[OrgCard] = []
    # Warm handoff to a guided legal-aid intake — set on refusals and
    # low-confidence answers so the user always has a real next step.
    handoff: Handoff | None = None
    # How well the sources support the answer. None on refusals and errors,
    # where we never computed one.
    confidence: Literal["high", "medium", "low"] | None = None


#  /search only

class SearchResult(BaseModel):
    source_name: str
    url: str = ""
    topic: str = ""
    jurisdiction: str = ""
    state: str = ""
    locality: str = ""
    list_code: str = ""
    text: str
    score: float


class SearchResponse(BaseModel):
    query: str
    count: int
    results: list[SearchResult]


#  /orgs only — the resource finder (OrgCard is defined above, shared with /ask)

class OrgsResponse(BaseModel):
    count: int
    results: list[OrgCard]