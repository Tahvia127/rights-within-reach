# Rights Within Reach, 5-minute presentation script

Timing is a guide (5:00 total, 10 slides). Practice out loud; trim to fit. The same notes are in the deck's Notes view.

## Slide 1 · Title  ·  ~0:00

Hi, I'm Latahvia. My project is Rights Within Reach, a free, multilingual web app that helps everyday Illinois residents understand their legal rights around housing, money, home repairs, and public benefits. Every answer is in plain language, in their language, and cites the actual law. I'll walk you through what it is, why it matters, how it works, and where it's going.

## Slide 2 · What I built  ·  ~0:30

So what is it? In one sentence: Rights Within Reach is a free web app that answers everyday legal questions in plain language, cites the law, and connects you to real help. It's built for the people who fall through the cracks, working families facing eviction or debt, immigrants who don't speak English, older homeowners, and really anyone facing a legal problem without a lawyer.

## Slide 3 · Why it matters  ·  ~1:05

Why does this matter? Three walls stand between people and their rights. First, cost, lawyers are hundreds of dollars an hour, so most people face these problems alone. Second, language, legal information is written for lawyers and is mostly English-only, in a state where millions speak another language at home. And third, the stakes are high: a missed deadline or an unknown right can mean losing your home, your heat, or a benefit you depend on. Rights Within Reach lowers all three walls at once.

## Slide 4 · How it works  ·  ~1:45

Here's how it works, in four steps. One: you ask a question, typed or spoken, in any of five languages. Two: the AI searches a curated library of Illinois legal sources to find the relevant law. Three: you get a plain-language answer with the law it's based on and a confidence rating. And four: it points you to a real, verified, free organization near you, matched by your ZIP code or area. [If demoing: let me show you quickly...]

## Slide 5 · Under the hood (pipeline)  ·  ~2:20

This slide is the pipeline behind a single answer. Your question, in any language, becomes a search over a curated library of real Illinois legal sources. Claude reads the most relevant sources, grades how confident it is, and refuses anything out of scope. It returns a plain-language answer with the exact law cited and a confidence rating. And it always ends by pointing you to a real, verified, free organization near you. That referral comes from a directory of over 40 organizations, matched to your area by ZIP, and the legal sources are re-checked and re-loaded every day, so the information stays current.

## Slide 6 · Features  ·  ~2:55

Under that simple flow is a lot of care. Answers come in five languages that auto-detect from the browser, with read-aloud and voice input for low-literacy users. Every answer cites its sources and shows a confidence rating. There's a find-help-near-you tool, a deadline calculator, large-text and high-contrast modes, and it works on a phone, even offline. It's private, no login, no data collected, and it knows its limits: it refuses questions outside its scope and always says this is information, not legal advice.

## Slide 7 · AI usage  ·  ~3:30

Did I use AI? Absolutely, in two ways. In the product, the answer engine runs on Claude. But it's not just a chatbot: it retrieves from a curated library of real legal sources, grades its own confidence, cites every source, and refuses anything out of scope, that's what keeps it grounded and trustworthy. And in building it, I used Claude Code as a pair-programmer for features, tests, and first-draft translations, all clearly labeled as machine-assisted and pending native-speaker review.

## Slide 8 · Lessons learned  ·  ~4:00

What did I learn? The hardest part wasn't the AI, it was making the AI trustworthy for something as high-stakes as legal information: grounding every answer in real sources, adding a confidence gate, and teaching it to refuse instead of guess. What surprised me most is that the design matters as much as the model, plain language, translation, and accessibility are what make it truly usable. And what I'm proudest of is that it cites real Illinois law and connects people to real, verified help, for someone on a phone, in Spanish, in a hard moment.

## Slide 9 · What's next  ·  ~4:25

Where's it going? Yes, I plan to keep building. Next up: native-speaker review of every translation, deploying it publicly so anyone can use a live link, and adding topics like workers' rights and immigration referrals. Bigger picture, I want to partner with legal-aid organizations and pilot it with a real community group, finish the design refresh with real photography, and expand coverage statewide. The goal is to go from a showcase project to something that actually helps people.

## Slide 10 · Closing  ·  ~4:50

To close: nobody should have to face an eviction, a debt, or a benefits denial alone, in a language they don't speak. Rights Within Reach puts a plain, cited, trustworthy legal answer, and a real person to call, within reach of anyone, in their language. Thank you so much, I'd love to take your questions.

## 2-min Q&A, likely judge questions
- **How do you keep it from giving wrong legal info?** Retrieval over a curated source library, a confidence gate that lowers or refuses when unsure, every answer cites its source, and hard refusals for out-of-scope topics. It always says information, not legal advice.
- **How accurate are the translations?** First-drafted by AI and clearly labeled as machine-assisted, pending native-speaker review, which is the next step before public launch.
- **Where does the legal content come from?** Illinois statutes, Chicago ordinances, federal guidance, and legal-aid sources, re-checked daily.
- **Is it live / can we try it?** Yes, there is a public link; the chat also has a built-in demo mode so it works even without API credits.
- **What was the hardest part?** Making the model trustworthy: grounding, confidence, and graceful refusal, not the chat itself.