"""
ask.py
POST /ask — grounded question answering with CLINIC's safety guardrails.

Flow: pre-filter out-of-scope/dangerous questions (immigration, criminal, family
law, danger) -> retrieve chunks from Chroma -> if nothing relevant, refuse
politely -> otherwise ask Claude with a strict, citation-required system prompt.

Every successful answer is grounded in retrieved sources, carries at least one
citation, avoids individualized-advice phrasing, and ends with the disclaimer.
"""

import json
import os
import re
import time
from collections import Counter
from datetime import datetime, timezone

import anthropic
from dotenv import load_dotenv
from fastapi import APIRouter, Request

from backend.analytics import record
from backend.api.schemas import AskRequest, AskResponse
from backend.limiter import limiter
from backend.services.retriever import search as retrieve

# Load backend/.env so ANTHROPIC_API_KEY is available when run via uvicorn.
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

router = APIRouter()

MODEL = "claude-sonnet-4-6"  # switch to "claude-opus-4-8" for max accuracy
TRANSLATE_MODEL = "claude-haiku-4-5"  # fast/cheap: translate non-English questions for retrieval
MIN_SCORE = 0.20           # below this, retrieval is too weak to answer from
TOP_K = 5

# Supported UI languages -> the name Claude should write the answer in.
LANG_NAMES = {
    "en": "English",
    "es": "Spanish",
    "zh": "Simplified Chinese",
    "tl": "Tagalog",
    "vi": "Vietnamese",
}

DISCLAIMER = (
    "This is legal information, not legal advice. It may not reflect the most "
    "recent changes to the law and may not apply to your situation. For advice "
    "about your specific circumstances, talk to a lawyer or a legal aid "
    "organization."
)

# Out-of-scope / danger categories. Keyword pre-filter; the system prompt is the
# backstop for anything the keywords miss. Each category maps to a short title
# (shown as the refusal headline) and a structured org card the frontend renders.
REFUSAL_TITLES = {
    "danger": "Your safety comes first — please reach out right now.",
    "immigration": "I can't help with immigration here, but here's who can.",
    "criminal": "I can't help with criminal cases here, but here's who can.",
    "family": "I can't help with this one — but here's who can.",
    "no_results": "I don't have that in my sources, but someone here can help.",
}

# Translated refusal headlines. Machine-drafted — PENDING NATIVE-SPEAKER REVIEW
# (the org name/phone/hours are language-neutral and stay as-is). Missing
# languages/categories fall back to the English REFUSAL_TITLES above.
REFUSAL_TITLES_I18N = {
    "es": {
        "danger": "Tu seguridad es lo primero: comunícate ahora mismo.",
        "immigration": "No puedo ayudar con inmigración aquí, pero ellos sí.",
        "criminal": "No puedo ayudar con casos penales aquí, pero ellos sí.",
        "family": "No puedo ayudar con esto, pero aquí está quién sí puede.",
        "no_results": "No tengo eso en mis fuentes, pero alguien aquí puede ayudar.",
    },
    "zh": {
        "danger": "您的安全最重要——请立即寻求帮助。",
        "immigration": "我无法在这里提供移民方面的帮助，但他们可以。",
        "criminal": "我无法在这里提供刑事案件方面的帮助，但他们可以。",
        "family": "这个问题我帮不了，但这里有人可以帮您。",
        "no_results": "我的资料里没有相关信息，但这里有人可以帮您。",
    },
    "tl": {
        "danger": "Ang iyong kaligtasan ang pinakamahalaga — humingi ng tulong ngayon.",
        "immigration": "Hindi ako makakatulong sa imigrasyon dito, pero sila ay makakatulong.",
        "criminal": "Hindi ako makakatulong sa mga kasong kriminal dito, pero sila ay makakatulong.",
        "family": "Hindi ko ito matutulungan, pero narito kung sino ang makakatulong.",
        "no_results": "Wala ako nito sa aking mga mapagkukunan, pero may makakatulong dito.",
    },
    "vi": {
        "danger": "An toàn của bạn là trên hết — hãy liên hệ ngay bây giờ.",
        "immigration": "Tôi không thể giúp về vấn đề nhập cư ở đây, nhưng họ có thể.",
        "criminal": "Tôi không thể giúp về các vụ án hình sự ở đây, nhưng họ có thể.",
        "family": "Tôi không thể giúp việc này, nhưng đây là người có thể.",
        "no_results": "Tôi không có thông tin đó, nhưng ai đó ở đây có thể giúp bạn.",
    },
}

REFERRAL_ORGS = {
    "danger": {
        "name": "National Domestic Violence Hotline",
        "sub": "Free & confidential · 24/7",
        "description": "If you are in immediate danger, call 911. For domestic "
        "violence, call or chat anytime to speak with an advocate.",
        "phone": "1-800-799-7233",
        "hours": "24 hours, every day",
    },
    "immigration": {
        "name": "National Immigrant Justice Center",
        "sub": "Immigration legal help · Chicago",
        "description": "Rights Within Reach does not cover immigration law. NIJC "
        "can help with immigration questions and referrals.",
        "phone": "312-660-1370",
        "hours": "Mon–Fri, 9–5",
    },
    "criminal": {
        "name": "CARPLS Legal Aid Hotline",
        "sub": "Free legal help · Cook County",
        "description": "Rights Within Reach does not cover criminal law. CARPLS "
        "can talk through your situation and refer you to help.",
        "phone": "312-738-9200",
        "hours": "Mon–Fri, 9–4:30",
    },
    "family": {
        "name": "CARPLS Legal Aid Hotline",
        "sub": "Free legal help · Cook County",
        "description": "Rights Within Reach doesn't cover divorce, custody, or "
        "child support. CARPLS can connect you with a lawyer who does.",
        "phone": "312-738-9200",
        "hours": "Mon–Fri, 9–4:30",
    },
    "no_results": {
        "name": "CARPLS Legal Aid Hotline",
        "sub": "Free legal help · Cook County",
        "description": "I don't have information about that in my sources, but "
        "CARPLS can point you in the right direction.",
        "phone": "312-738-9200",
        "hours": "Mon–Fri, 9–4:30",
    },
}

REFUSAL_PATTERNS = {
    "danger": r"\b(kill myself|suicide|hurt myself|end my life|being (beaten|hit|abused)|he hits me|she hits me)\b",
    "immigration": r"\b(immigration|immigrant|green ?card|visa|deport|deportation|asylum|uscis|undocumented|daca|citizenship|naturaliz)\b",
    "criminal": r"\b(arrest|arrested|criminal charge|criminal case|bail|bond hearing|felony|misdemeanor|expunge|jail|prison|parole|probation)\b",
    "family": r"\b(divorce|custody|child support|alimony|spousal support|guardianship|paternity|visitation|restraining order)\b",
}

SYSTEM_PROMPT = f"""You are the assistant for Rights Within Reach, a free tool that gives \
plain-language LEGAL INFORMATION (never legal advice) about Illinois housing, public \
benefits, home repair programs, and consumer debt. Your users are working-class families, \
older immigrants, and longtime homeowners, often in a stressful situation and reading on a \
phone. Write at a 6th-grade reading level, in short sentences.

STRICT RULES — follow all of them:

1. GROUND EVERY CLAIM in the provided sources. Use only the information in the sources \
below. Do not add facts from your own knowledge. If the sources do not contain the answer, \
say you don't have that information and suggest the user contact a legal aid organization. \
Do not guess.

2. INFORMATION, NOT ADVICE. Describe what the law or a program says in general terms. NEVER \
tell the user what they personally should do or predict their personal outcome. Never write \
phrases like "you may be eligible", "you should apply", "you qualify", "this applies to \
you", "you are entitled", or "you can get". Instead use general framing: "The program is \
open to households that...", "The law says landlords must...", "Eligibility generally \
depends on...".

3. ONLY STATE THINGS FROM THE SOURCES. The app shows the user a list of the source \
cards separately, so DO NOT put citation markers like [1] or [5] in your answer. Just \
write the answer in plain words.

3a. FORMAT FOR A PHONE, IN PLAIN LANGUAGE. Write short paragraphs of plain sentences. \
Do NOT use markdown headings (no "#" or "##"). Do not write a title. You may use a \
simple bullet list ("- ") for steps or a few options, and bold ("**word**") only for a \
key number or deadline. Lead with the direct answer in the first sentence.

4. STAY IN SCOPE. You only cover Illinois housing, benefits, home repair, and consumer \
debt. If the question is about immigration, criminal law, or family law (divorce, custody, \
child support), do not answer it — briefly say it's out of scope and that a referral \
follows.

5. END EVERY ANSWER with this exact disclaimer on its own line:
{DISCLAIMER}
"""


# Friendly "service is having trouble" message shown if the model call fails.
ERROR_MESSAGES = {
    "en": "Sorry — I'm having trouble answering right now. Please try again in a moment.",
    "es": "Lo siento, tengo problemas para responder ahora. Inténtalo de nuevo en un momento.",
    "zh": "抱歉，我现在无法回答。请稍后再试。",
    "tl": "Paumanhin — nahihirapan akong sumagot ngayon. Pakisubukan muli sa ilang sandali.",
    "vi": "Xin lỗi — hiện tôi đang gặp sự cố khi trả lời. Vui lòng thử lại sau giây lát.",
}


def _to_english(question: str, language: str) -> str:
    """Translate a non-English question to English so the English embedding model
    and the English keyword pre-filter work. Falls back to the original on error."""
    if language == "en":
        return question
    try:
        client = anthropic.Anthropic()
        resp = client.messages.create(
            model=TRANSLATE_MODEL,
            max_tokens=300,
            system="Translate the user's message into English. Output ONLY the "
                   "English translation — no quotes, no explanation.",
            messages=[{"role": "user", "content": question}],
        )
        english = "".join(b.text for b in resp.content if b.type == "text").strip()
        return english or question
    except Exception:
        return question


def _category(question: str) -> str | None:
    q = question.lower()
    # danger first — highest priority
    for cat in ("danger", "immigration", "criminal", "family"):
        if re.search(REFUSAL_PATTERNS[cat], q):
            return cat
    return None


def _refuse(category: str, language: str = "en") -> dict:
    """Refusal response in the frontend's shape: short answer + structured org.
    The headline is translated when available; org contact details stay as-is."""
    title = REFUSAL_TITLES_I18N.get(language, {}).get(category) or REFUSAL_TITLES[category]
    return {
        "refused": True,
        "reason": category,
        "answer": title,
        "sources": [],
        "topic": category,
        "refusal_org": REFERRAL_ORGS[category],
    }


# --- in-memory answer cache -------------------------------------------------
# Identical (question, language) pairs are common on a public tool; serving them
# from cache avoids a repeat Claude call. Single-process, TTL + size-bounded.
_CACHE: dict[tuple, tuple[float, dict]] = {}
_CACHE_TTL = 3600   # seconds
_CACHE_MAX = 500    # entries


def _cache_get(key: tuple) -> dict | None:
    item = _CACHE.get(key)
    if not item:
        return None
    ts, value = item
    if time.time() - ts > _CACHE_TTL:
        _CACHE.pop(key, None)
        return None
    return value


def _cache_put(key: tuple, value: dict) -> None:
    if len(_CACHE) >= _CACHE_MAX and key not in _CACHE:
        oldest = min(_CACHE, key=lambda k: _CACHE[k][0])
        _CACHE.pop(oldest, None)
    _CACHE[key] = (time.time(), value)


@router.post("/ask", response_model=AskResponse)
@limiter.limit("20/minute")
def ask(request: Request, req: AskRequest):
    question = (req.question or "").strip()
    language = req.language if req.language in LANG_NAMES else "en"
    if not question:
        # Not a refusal — just a gentle nudge; no org card needed.
        record(request, kind="ask", language=language, reason="empty", query_chars=0)
        return {"refused": False, "reason": "empty",
                "answer": "Please type a question.", "sources": [], "topic": ""}

    key = (question.lower(), language)
    cached = _cache_get(key)
    if cached is not None:
        _record_ask(request, language, question, cached, cached=True)
        return cached

    result = _handle(question, language)
    if result.get("reason") != "error":  # never cache a transient failure
        _cache_put(key, result)
    _record_ask(request, language, question, result, cached=False)
    return result


def _record_ask(request, language: str, question: str, result: dict, cached: bool) -> None:
    """Log one /ask outcome for analytics. Privacy-safe fields only; the raw
    question is gated behind ANALYTICS_LOG_QUESTIONS (dropped by the middleware
    when that flag is off)."""
    record(
        request,
        kind="ask",
        language=language,
        query_chars=len(question),
        cached=cached,
        refused=bool(result.get("refused")),
        reason=result.get("reason"),
        topic=result.get("topic") or None,
        n_sources=len(result.get("sources") or []),
        question=question,
    )


def _handle(question: str, language: str) -> dict:
    """The full answer pipeline: translate -> filter -> retrieve -> answer."""
    # Translate to English for retrieval + the keyword pre-filter (the corpus
    # and embedding model are English). The answer is still written in `language`.
    q_en = _to_english(question, language)

    # 1. Out-of-scope / danger pre-filter (on the English version).
    cat = _category(q_en)
    if cat:
        return _refuse(cat, language)

    # 2. Retrieve. Refuse politely if nothing is relevant enough.
    chunks = retrieve(q_en, k=TOP_K)
    chunks = [c for c in chunks if c["score"] >= MIN_SCORE]
    if not chunks:
        return _refuse("no_results", language)

    # 3. Build the grounded prompt (model sees [n]-labelled context blocks).
    blocks = []
    for i, c in enumerate(chunks, start=1):
        blocks.append(f"[{i}] {c['source_name']} ({c['url']})\n{c['text']}")
    context = "\n\n".join(blocks)
    user_content = (
        f"Sources:\n\n{context}\n\n"
        f"Question: {q_en}\n\n"
        "Answer using only the sources above."
    )

    # Sources are written in English; the answer can be in the user's language.
    system = SYSTEM_PROMPT
    if language != "en":
        lang = LANG_NAMES[language]
        system += (
            f"\n\n6. LANGUAGE: Write your ENTIRE response — every sentence, including "
            f"the closing disclaimer — in {lang}. Use simple, everyday {lang} that a "
            f"non-lawyer can read easily. The sources are in English; translate the "
            f"meaning faithfully and do not include any English text in your answer."
        )

    try:
        client = anthropic.Anthropic()
        resp = client.messages.create(
            model=MODEL,
            max_tokens=1024,
            thinking={"type": "adaptive"},
            system=system,
            messages=[{"role": "user", "content": user_content}],
        )
        answer = "".join(b.text for b in resp.content if b.type == "text").strip()
    except anthropic.APIError as e:
        # Don't 500 on the user — return a friendly, language-appropriate message.
        print(f"[ask] Anthropic API error: {e}")
        return {
            "refused": False, "reason": "error",
            "answer": ERROR_MESSAGES.get(language, ERROR_MESSAGES["en"]),
            "sources": [], "topic": "",
        }

    # 4. Build the frontend's source cards: one per distinct source.
    sources = []
    seen = set()
    for c in chunks:
        if c["source_name"] in seen:
            continue
        seen.add(c["source_name"])
        sources.append({
            "title": c["source_name"],
            "section": (c.get("jurisdiction") or "").title(),
            "url": c["url"],
            "topic": c["topic"],
            "score": c["score"],
        })
    top_topic = Counter(c["topic"] for c in chunks).most_common(1)[0][0]

    return {
        "refused": False,
        "reason": None,
        "answer": answer,
        "sources": sources,
        "topic": top_topic,
    }
