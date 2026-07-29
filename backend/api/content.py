"""
content.py
All the fixed text /ask uses: languages, disclaimer, refusal headlines, referral
orgs, and the prompts we send Claude. No logic lives here, so copy edits and new
translations never touch ask.py.

Translations are machine-drafted and pending native-speaker review. Anything
missing falls back to English.
"""

# ---------------------------------------------------------------- user-facing

# Supported UI languages -> the name Claude should write the answer in.
LANGUAGES = {
    "en": "English",
    "es": "Spanish",
    "zh": "Simplified Chinese",
    "tl": "Tagalog",
    "vi": "Vietnamese",
}

# One block per language: the disclaimer, the refusal headlines, and the
# "we're having trouble" message. To add a language, add one block here.
TEXT = {
    "en": {
        "disclaimer": (
            "Rights Within Reach is not an attorney and does not give legal advice. It "
            "shares neutral legal information to help you understand the law and speak "
            "up for yourself. It may not reflect the most recent changes to the law and "
            "may not apply to your situation. For advice about your specific "
            "circumstances, talk to a lawyer or a legal aid organization."
        ),
        "error": "Sorry — I'm having trouble answering right now. Please try again in a moment.",
        "titles": {
            "danger": "Your safety comes first — please reach out right now.",
            "immigration": "I can't help with immigration here, but here's who can.",
            "criminal": "I can't help with criminal cases here, but here's who can.",
            "family": "I can't help with this one — but here's who can.",
            "no_results": "I don't have that in my sources, but someone here can help.",
        },
    },
    "es": {
        "disclaimer": (
            "Rights Within Reach no es un abogado y no da asesoría legal. Comparte "
            "información legal neutral para ayudarte a entender la ley y defenderte por "
            "ti mismo. Puede no reflejar los cambios más recientes de la ley y puede no "
            "aplicarse a tu situación. Para asesoría sobre tu caso específico, habla con "
            "un abogado o una organización de ayuda legal."
        ),
        "error": "Lo siento, tengo problemas para responder ahora. Inténtalo de nuevo en un momento.",
        "titles": {
            "danger": "Tu seguridad es lo primero: comunícate ahora mismo.",
            "immigration": "No puedo ayudar con inmigración aquí, pero ellos sí.",
            "criminal": "No puedo ayudar con casos penales aquí, pero ellos sí.",
            "family": "No puedo ayudar con esto, pero aquí está quién sí puede.",
            "no_results": "No tengo eso en mis fuentes, pero alguien aquí puede ayudar.",
        },
    },
    "zh": {
        "disclaimer": (
            "Rights Within Reach 不是律师，也不提供法律建议。它提供中立的法律信息，帮助您"
            "理解法律并为自己发声。它可能不反映法律的最新变化，也可能不适用于您的情况。"
            "有关您具体情况的建议，请咨询律师或法律援助机构。"
        ),
        "error": "抱歉，我现在无法回答。请稍后再试。",
        "titles": {
            "danger": "您的安全最重要——请立即寻求帮助。",
            "immigration": "我无法在这里提供移民方面的帮助，但他们可以。",
            "criminal": "我无法在这里提供刑事案件方面的帮助，但他们可以。",
            "family": "这个问题我帮不了，但这里有人可以帮您。",
            "no_results": "我的资料里没有相关信息，但这里有人可以帮您。",
        },
    },
    "tl": {
        "disclaimer": (
            "Ang Rights Within Reach ay hindi abogado at hindi nagbibigay ng legal na "
            "payo. Nagbabahagi ito ng neutral na legal na impormasyon para tulungan kang "
            "maintindihan ang batas at ipagtanggol ang iyong sarili. Maaaring hindi nito "
            "masalamin ang pinakabagong pagbabago sa batas at maaaring hindi ito naaangkop "
            "sa iyong sitwasyon. Para sa payo tungkol sa iyong partikular na sitwasyon, "
            "kumausap sa abogado o organisasyon ng tulong legal."
        ),
        "error": "Paumanhin — nahihirapan akong sumagot ngayon. Pakisubukan muli sa ilang sandali.",
        "titles": {
            "danger": "Ang iyong kaligtasan ang pinakamahalaga — humingi ng tulong ngayon.",
            "immigration": "Hindi ako makakatulong sa imigrasyon dito, pero sila ay makakatulong.",
            "criminal": "Hindi ako makakatulong sa mga kasong kriminal dito, pero sila ay makakatulong.",
            "family": "Hindi ko ito matutulungan, pero narito kung sino ang makakatulong.",
            "no_results": "Wala ako nito sa aking mga mapagkukunan, pero may makakatulong dito.",
        },
    },
    "vi": {
        "disclaimer": (
            "Rights Within Reach không phải là luật sư và không đưa ra tư vấn pháp lý. Nó "
            "cung cấp thông tin pháp lý trung lập để giúp bạn hiểu luật và tự bảo vệ mình. "
            "Nó có thể không phản ánh những thay đổi mới nhất của luật và có thể không áp "
            "dụng cho tình huống của bạn. Để được tư vấn về trường hợp cụ thể của bạn, hãy "
            "nói chuyện với luật sư hoặc tổ chức trợ giúp pháp lý."
        ),
        "error": "Xin lỗi — hiện tôi đang gặp sự cố khi trả lời. Vui lòng thử lại sau giây lát.",
        "titles": {
            "danger": "An toàn của bạn là trên hết — hãy liên hệ ngay bây giờ.",
            "immigration": "Tôi không thể giúp về vấn đề nhập cư ở đây, nhưng họ có thể.",
            "criminal": "Tôi không thể giúp về các vụ án hình sự ở đây, nhưng họ có thể.",
            "family": "Tôi không thể giúp việc này, nhưng đây là người có thể.",
            "no_results": "Tôi không có thông tin đó, nhưng ai đó ở đây có thể giúp bạn.",
        },
    },
}


def text(language: str, key: str) -> str:
    """Get 'disclaimer' or 'error' in a language, falling back to English."""
    return TEXT.get(language, {}).get(key) or TEXT["en"][key]


def title(language: str, category: str) -> str:
    """Get a refusal headline in a language, falling back to English."""
    return TEXT.get(language, {}).get("titles", {}).get(category) or TEXT["en"]["titles"][category]


# Org card shown with a refusal. CARPLS covers three of the five categories, so
# it's defined once and given a different description each time.
CARPLS = {
    "name": "CARPLS Legal Aid Hotline",
    "sub": "Free legal help · Cook County",
    "phone": "312-738-9200",
    "hours": "Mon–Fri, 9–4:30",
}

REFERRAL_ORGS = {
    "danger": {
        "name": "National Domestic Violence Hotline",
        "sub": "Free & confidential · 24/7",
        "phone": "1-800-799-7233",
        "hours": "24 hours, every day",
        "description": "If you are in immediate danger, call 911. For domestic "
        "violence, call or chat anytime to speak with an advocate.",
    },
    "immigration": {
        "name": "National Immigrant Justice Center",
        "sub": "Immigration legal help · Chicago",
        "phone": "312-660-1370",
        "hours": "Mon–Fri, 9–5",
        "description": "Rights Within Reach does not cover immigration law. NIJC "
        "can help with immigration questions and referrals.",
    },
    "criminal": {**CARPLS, "description": "Rights Within Reach does not cover criminal "
                   "law. CARPLS can talk through your situation and refer you to help."},
    "family": {**CARPLS, "description": "Rights Within Reach doesn't cover divorce, "
                 "custody, or child support. CARPLS can connect you with a lawyer who does."},
    "no_results": {**CARPLS, "description": "I don't have information about that in my "
                     "sources, but CARPLS can point you in the right direction."},
}


# --------------------------------------------------------------- model-facing

# Pass 1: research. Claude reads our corpus, may check the allow-listed web, and
# writes a plain brief. Pass 2 turns that brief into the structured answer.
RESEARCH_PROMPT = """You are a careful legal-information researcher for Rights \
Within Reach (Illinois housing, public benefits, home-repair programs, consumer debt).

You are given excerpts from our own library. First rely on those. You MAY use the \
web_search tool to CHECK whether our library is current and to fill small gaps — but only \
the authoritative government and legal-aid sites it allows. Do not invent facts.

Write a short research brief in English that:
- answers the question using the sources, in plain language;
- notes any place where the web shows our library may be outdated, or where sources \
disagree or don't fully cover the question;
- keeps every statute citation, dollar amount, deadline, and phone number exactly as \
the sources state them;
- ends with one line: "Confidence: high|medium|low — <one short reason>", where \
high = sources clearly and consistently cover it, medium = mostly covered with gaps, \
low = thin/outdated/conflicting so the person should verify with an organization.

This brief is internal notes, not the final user-facing answer."""

# Pass 2: write the user-facing answer. Rule 7 gets appended for non-English.
ANSWER_PROMPT = """You are the assistant for Rights Within Reach, a free tool that gives \
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

3. NO CITATION MARKERS. The app shows the user a list of source cards separately, so do \
NOT put markers like [1] or [5] in your answer. Just write it in plain words.

4. FORMAT FOR A PHONE. Write short paragraphs of plain sentences. Do NOT use markdown \
headings (no "#" or "##"). Do not write a title. You may use a simple bullet list ("- ") \
for steps or a few options, and bold ("**word**") only for a key number or deadline. Lead \
with the direct answer in the first sentence.

5. STAY IN SCOPE. You only cover Illinois housing, benefits, home repair, and consumer \
debt. If the question is about immigration, criminal law, or family law (divorce, custody, \
child support), do not answer it — briefly say it's out of scope and that a referral \
follows.

6. RETURN STRUCTURED OUTPUT via the `answer` tool. Put the plain-language answer in \
`answer` (no disclaimer — the app adds it separately), 2-5 concrete actions in \
`next_steps`, and short `contact_why` / `contact_how` text about the referral \
organization named below. Do not write the disclaimer anywhere.
"""

# Appended to ANSWER_PROMPT when the user is not reading in English.
LANGUAGE_RULE = """

7. LANGUAGE: Write EVERY tool field (answer, next_steps, contact_why, contact_how, \
follow_ups) in {language}. Use simple, everyday {language} a non-lawyer can read easily. \
The sources are in English; translate the meaning faithfully and do not include any \
English text."""

# Forces Claude to return the answer as fields instead of free text.
ANSWER_TOOL = {
    "name": "answer",
    "description": "Return the structured legal-information answer to the user.",
    "input_schema": {
        "type": "object",
        "properties": {
            "answer": {
                "type": "string",
                "description": "The direct, plain-language answer grounded ONLY in the "
                "sources. Lead with the answer in the first sentence. No markdown "
                "headings, no citation markers like [1], no closing disclaimer.",
            },
            "next_steps": {
                "type": "array",
                "items": {"type": "string"},
                "description": "2 to 5 short, concrete next actions the person can take. "
                "Each one short imperative sentence. Empty list if none apply.",
            },
            "contact_why": {
                "type": "string",
                "description": "One or two sentences on why the referral organization "
                "fits this person's situation.",
            },
            "contact_how": {
                "type": "string",
                "description": "One or two sentences on how to use them — what to ask "
                "for and what to bring.",
            },
            "follow_ups": {
                "type": "array",
                "items": {"type": "string"},
                "description": "2 to 3 short follow-up questions the person might ask "
                "next, each phrased as a question they would tap. Empty list if none fit.",
            },
            "confidence": {
                "type": "string",
                "enum": ["high", "medium", "low"],
                "description": "How well the sources support this answer. "
                "'high' = the sources clearly and consistently cover the question; "
                "'medium' = the sources mostly cover it but with gaps or minor "
                "uncertainty; 'low' = the sources are thin, outdated, or disagree, so "
                "the person should verify with an organization before relying on it.",
            },
        },
        "required": ["answer", "next_steps", "contact_why", "contact_how",
                     "follow_ups", "confidence"],
    },
}

# The only sites Claude may check live. Keeps web grounding on authoritative
# government and legal-aid pages instead of arbitrary search results.
ALLOWED_DOMAINS = [
    "illinoislegalaid.org",
    "illinois.gov",
    "illinoisattorneygeneral.gov",
    "ilga.gov",                 # Illinois statutes
    "illinoiscourts.gov",
    "cookcountyil.gov",
    "cookcountylegalaid.org",
    "chicago.gov",
    "cityofchicago.org",
    "ihda.org",                 # Illinois Housing Development Authority
    "consumerfinance.gov",      # CFPB
    "hud.gov",
    "ftc.gov",
    "ssa.gov",
    "benefits.gov",
    "usa.gov",
    "law.cornell.edu",          # federal statutes (e.g., FDCPA text)
    "evictionhelpillinois.org", # statewide legal-aid eviction program
    "dhs.state.il.us",          # IL Dept of Human Services (SNAP/TANF/AABD)
    "medicaid.gov",
    "irs.gov",                  # tax debt
    "usda.gov",                 # rural home-repair (Section 504)
    "hhs.gov",
]