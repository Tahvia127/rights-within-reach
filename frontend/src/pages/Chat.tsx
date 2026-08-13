import { useState, useRef, useEffect, FormEvent, Dispatch, SetStateAction } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { SkipLink } from '../components/SkipLink'
import { LanguageStrip } from '../components/LanguageStrip'
import { ChatHeader } from '../components/ChatHeader'
import { SiteFooter } from '../components/SiteFooter'
import { MicButton } from '../components/MicButton'
import { Icon } from '../lib/icons'
import { ask, sendFeedback, AskResponse } from '../lib/api'
import { matchDemoAnswer } from '../lib/demoAnswers'
import { useLanguage, Language, orgText } from '../lib/translations'
import { useSpeech, useSpeechContext } from '../lib/speech'

const VALID = ['en', 'es', 'zh', 'tl', 'vi', 'pl']

interface DemoMessage {
  user: string
  bot: AskResponse
  topicLink?: { slug: string; label: string; sub: string }
  /** Snapshot of what was asked, so the answer can be shared as a deep link. */
  ask?: { lang: Language; state?: string; locality?: string; area?: string; zip?: string; subject?: string }
  /** True when served from the offline demo fallback (live service unreachable). */
  demo?: boolean
}

// Build a shareable /chat URL that reproduces a question (+ its language/triage).
function buildShareUrl(m: DemoMessage): string {
  const p = new URLSearchParams({ q: m.user })
  if (m.ask?.lang) p.set('lang', m.ask.lang)
  if (m.ask?.state) p.set('state', m.ask.state)
  if (m.ask?.locality) p.set('locality', m.ask.locality)
  if (m.ask?.area) p.set('area', m.ask.area)
  if (m.ask?.zip) p.set('zip', m.ask.zip)
  if (m.ask?.subject) p.set('subject', m.ask.subject)
  return `${location.origin}/chat?${p.toString()}`
}

type Speech = ReturnType<typeof useSpeech>

// Flatten an answer into one natural string for the whole-answer read-aloud:
// answer, next steps, who-to-contact, then the disclaimer. For a refusal, read
// the message plus the referral org's contact details.
function spokenText(bot: AskResponse): string {
  if (bot.refused) {
    const org = bot.refusal_org
    return [
      bot.answer,
      org && `${org.name}. ${org.description} Phone: ${org.phone}. Hours: ${org.hours}.`,
      bot.handoff && bot.handoff.name,
      bot.disclaimer,
    ]
      .filter(Boolean)
      .join(' ')
  }
  const parts: string[] = [bot.answer]
  if (bot.next_steps?.length) parts.push(...bot.next_steps)
  if (bot.contact) parts.push(`${bot.contact.name}. ${bot.contact.why ?? ''} ${bot.contact.how ?? ''}`)
  if (bot.local_orgs?.length) parts.push(localOrgsSpeech(bot.local_orgs))
  if (bot.key_points) parts.push(...bot.key_points.map((k) => `${k.label}: ${k.text}`))
  if (bot.note) parts.push(bot.note)
  if (bot.disclaimer) parts.push(bot.disclaimer)
  if (bot.handoff) parts.push(bot.handoff.name)
  return parts.filter(Boolean).join('. ')
}

function contactSpeech(c: NonNullable<AskResponse['contact']>): string {
  return [c.name, c.why, c.how, c.phone && `Phone ${c.phone}`, c.url && `Website ${c.url}`, c.hours && `Hours ${c.hours}`].filter(Boolean).join('. ')
}

function localOrgsSpeech(orgs: NonNullable<AskResponse['local_orgs']>): string {
  return orgs.map((o) => [o.name, o.phone && `Phone ${o.phone}`].filter(Boolean).join('. ')).join('. ')
}

function orgHref(url?: string): string | undefined {
  if (!url) return undefined
  return url.startsWith('http') ? url : `https://${url}`
}

// Readable multi-line text for copy/share (not the run-on read-aloud string).
function shareText(bot: AskResponse, t: (k: string) => string): string {
  const lines: string[] = [bot.answer]
  if (bot.next_steps?.length) {
    lines.push('', `${t('chat.nextSteps')}:`)
    bot.next_steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`))
  }
  if (bot.contact) {
    lines.push('', `${t('chat.whoToContact')}:`)
    lines.push([bot.contact.name, bot.contact.phone].filter(Boolean).join(', '))
    const wh = [bot.contact.why, bot.contact.how].filter(Boolean).join(' ')
    if (wh) lines.push(wh)
  }
  if (bot.local_orgs?.length) {
    lines.push('', `${t('chat.localOrgs')}:`)
    bot.local_orgs.forEach((o) => lines.push([o.name, o.phone].filter(Boolean).join(', ')))
  }
  if (bot.refusal_org) {
    const o = bot.refusal_org
    lines.push('', [o.name, o.phone].filter(Boolean).join(', '))
    if (o.description) lines.push(o.description)
  }
  if (bot.disclaimer) lines.push('', bot.disclaimer)
  if (bot.handoff) lines.push('', `${t('chat.getLegalHelp')}: ${bot.handoff.name}${bot.handoff.url ? ` — ${bot.handoff.url}` : ''}`)
  lines.push('', ', Rights Within Reach · rightswithinreach.org')
  return lines.filter((l) => l !== undefined).join('\n')
}

function ShareActions({ bot, shareUrl }: { bot: AskResponse; shareUrl?: string }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState<null | 'text' | 'link'>(null)
  const flash = (which: 'text' | 'link') => { setCopied(which); setTimeout(() => setCopied(null), 2000) }
  const copyText = async () => {
    try { await navigator.clipboard.writeText(shareText(bot, t)); flash('text') } catch { /* blocked */ }
  }
  const copyLink = async () => {
    if (!shareUrl) return
    try { await navigator.clipboard.writeText(shareUrl); flash('link') } catch { /* blocked */ }
  }
  return (
    <div className="share-actions no-print">
      <button type="button" className="share-btn" onClick={copyText} aria-label={t('chat.copy')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg> {copied === 'text' ? t('chat.copied') : t('chat.copy')}
      </button>
      {shareUrl && (
        <button type="button" className="share-btn" onClick={copyLink} aria-label={t('chat.copyLink')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg> {copied === 'link' ? t('chat.linkCopied') : t('chat.copyLink')}
        </button>
      )}
      <button type="button" className="share-btn" onClick={() => window.print()} aria-label={t('chat.print')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" rx="1" />
        </svg> {t('chat.print')}
      </button>
    </div>
  )
}

export default function Chat() {
  // Start empty, the guided triage funnel leads to the first (real, translated)
  // answer. No hardcoded seed conversation, so the chat is fully localized.
  const [messages, setMessages] = useState<DemoMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { language, setLanguage, t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const speech = useSpeechContext()
  const formRef = useRef<HTMLFormElement>(null)
  const voiceBaseRef = useRef('') // input text when voice dictation started
  const lastMsgRef = useRef<HTMLDivElement>(null) // newest exchange, for scroll + focus
  const [announce, setAnnounce] = useState('')    // polite screen-reader announcement

  // Guided triage (Phase 2). 'ready' = collected or skipped → show the input.
  const [triage, setTriage] = useState<TriageState>({ state: initialState(), area: null, zip: '', subject: null })
  const [triageStep, setTriageStep] = useState<'state' | 'area' | 'zip' | 'subject' | 'ready'>('state')

  const lastMessage = messages[messages.length - 1]
  const readPage = () =>
    speech.toggle('page', lastMessage ? spokenText(lastMessage.bot) : '', language)

  // Suggestion chips: the latest answer's model-generated follow-ups when present,
  // otherwise the static starter suggestions.
  const followUps = lastMessage && !lastMessage.bot.refused && lastMessage.bot.follow_ups?.length
    ? lastMessage.bot.follow_ups
    : [t('chat.suggest1'), t('chat.suggest2'), t('chat.suggest3')]

  // Shared ask path (takes explicit context so it works from the form OR a deep link).
  const submitQuestion = async (question: string, ctx: DemoMessage['ask'] & { lang: Language }) => {
    if (!question.trim()) return
    setLoading(true)
    setError(null)
    try {
      const response = await ask({ question, language: ctx.lang, state: ctx.state, locality: ctx.locality, area: ctx.area, zip: ctx.zip, subject: ctx.subject })
      // If the answer engine soft-failed (e.g. out of API credits), fall back to a
      // curated demo answer so a live demo still shows a real, structured card —
      // but flag it so the UI can tell the user it's offline example info.
      const isDemo = response.reason === 'error'
      const bot = isDemo ? matchDemoAnswer(question, ctx.subject, ctx.lang) : response
      setMessages((prev) => [...prev, { user: question, bot, ask: ctx, demo: isDemo }])
    } catch {
      // Hard failure (network/server unreachable): use the demo fallback too.
      setMessages((prev) => [...prev, { user: question, bot: matchDemoAnswer(question, ctx.subject, ctx.lang), ask: ctx, demo: true }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    const question = input
    setInput('')
    submitQuestion(question, {
      lang: language, state: triage.state,
      locality: deriveLocality(triage.state, triage.area),
      area: triage.area ?? undefined,
      zip: triage.zip || undefined, subject: triage.subject ?? undefined,
    })
  }

  // Deep link: /chat?q=…&lang=…&area=…&subject= auto-asks (share links, flyers, QR).
  const didAutoAsk = useRef(false)
  useEffect(() => {
    if (didAutoAsk.current) return
    const q = searchParams.get('q')
    if (!q) return
    didAutoAsk.current = true
    const l = searchParams.get('lang')
    const lang = (l && VALID.includes(l)) ? (l as Language) : language
    if (lang !== language) setLanguage(lang)
    const area = searchParams.get('area') || undefined
    const zip = searchParams.get('zip') || undefined
    const subject = searchParams.get('subject') || undefined
    const stateParam = searchParams.get('state') || undefined
    const stateVal = stateParam && SUPPORTED_STATES.includes(stateParam) ? stateParam : triage.state
    const locality = searchParams.get('locality') || deriveLocality(stateVal, area ?? null)
    setTriage({ state: stateVal, area: area ?? null, zip: zip ?? '', subject: subject ?? null })
    setTriageStep('ready')
    setSearchParams({}, { replace: true }) // clean URL so refresh doesn't re-ask
    submitQuestion(q, { lang, state: stateVal, locality, area, zip, subject })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When a new answer renders, move focus to it and scroll it into view (so it
  // isn't below the fold on a phone), and announce it to screen readers.
  useEffect(() => {
    if (loading) { setAnnounce(''); return }
    if (!messages.length) return
    setAnnounce(t('chat.answerReady'))
    const el = lastMsgRef.current
    if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, messages.length])

  return (
    <div className="chat-page">
      <SkipLink />
      <LanguageStrip />
      <ChatHeader
        onReadAloud={speech.supported ? readPage : undefined}
        reading={speech.speakingId === 'page'}
      />

      <div className="chat-topic-strip">
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <span className="topic-pill">{t('chat.live')}</span>
          <span className="topic-strip-count">{messages.length} {messages.length === 1 ? t('chat.question') : t('chat.questions')}</span>
        </div>
        <span className="topic-strip-count">{t('chat.allCite')}</span>
      </div>

      <main id="main" className="chat-body" role="main" aria-label={t('chat.conversationAria')}>
        <h1 className="sr-only">{t('chat.heading')}</h1>
        {messages.length === 0 && !loading && (
          <div className="chat-welcome">
            <span className="msg-bot-icon-img" aria-hidden="true" />
            <p>{t('chat.welcome')}</p>
          </div>
        )}
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1
          return (
            <div key={i} ref={isLast ? lastMsgRef : undefined} tabIndex={isLast ? -1 : undefined} style={{ outline: 'none' }}>
              <Exchange message={m} id={String(i)} speech={speech} language={language} />
            </div>
          )
        })}
        {loading && <LoadingMessage />}
        {error && <ErrorMessage message={error} />}
      </main>

      <div className="sr-only" aria-live="polite" role="status">{announce}</div>

      {triageStep !== 'ready' ? (
        <TriagePanel triage={triage} step={triageStep} setTriage={setTriage} setStep={setTriageStep} speech={speech} language={language} />
      ) : (
        <>
          {(triage.state || triage.area || triage.subject) && (
            <div className="triage-summary">
              <span>
                {t('triage.summary')}: {[
                  triage.state && t(STATE_LABEL[triage.state]),
                  triage.area && t(AREA_LABEL[triage.area]),
                  triage.subject && t(SUBJECT_LABEL[triage.subject]),
                  triage.zip,
                ].filter(Boolean).join(' · ')}
              </span>
              <button className="triage-edit" onClick={() => setTriageStep('state')}>{t('triage.edit')}</button>
            </div>
          )}

          <section className="suggest-block" aria-label={t('chat.suggestAria')}>
            <p className="suggest-label">{t('chat.tryNext')}</p>
            <div className="suggest-chips">
              {followUps.map((q, i) => (
                <button key={i} className="suggest-chip" onClick={() => setInput(q)}>{q} →</button>
              ))}
            </div>
          </section>

          <form ref={formRef} className="input-bar" onSubmit={handleSubmit} aria-label={t('chat.askAria')}>
            <label htmlFor="chat-input" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
              {t('chat.typeQuestion')}
            </label>
            <textarea
              id="chat-input"
              className="input-field"
              rows={2}
              placeholder={t('chat.placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Enter sends; Shift+Enter inserts a newline.
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); formRef.current?.requestSubmit() }
              }}
              aria-label={t('chat.typeQuestion')}
              disabled={loading}
            />
            <MicButton
              language={language}
              disabled={loading}
              onStart={() => setInput((cur) => { voiceBaseRef.current = cur; return cur })}
              onResult={(text) => {
                const base = voiceBaseRef.current
                setInput(base && text ? `${base} ${text}` : base + text)
              }}
            />
            <button type="submit" className="send-btn" aria-label={t('chat.send')} disabled={loading || !input.trim()}>
              <Icon name="send" size={28} />
            </button>
          </form>
        </>
      )}

      <SiteFooter />
    </div>
  )
}

type TriageState = { state: string; area: string | null; zip: string; subject: string | null }

// Which state the user is in decides which "area" options to show and whether
// the ZIP step applies (ZIP→region is an Illinois-only table today).
const SUPPORTED_STATES = ['IL', 'CA', 'MO', 'TX', 'NY']
const STATE_LABEL: Record<string, string> = {
  IL: 'triage.state.il', CA: 'triage.state.ca', MO: 'triage.state.mo',
  TX: 'triage.state.tx', NY: 'triage.state.ny',
}
const STATE_AREAS: Record<string, string[]> = {
  IL: ['chicago', 'suburban_cook', 'collar', 'elsewhere'],
  CA: ['san_francisco', 'elsewhere_ca'],
  MO: ['st_louis', 'kansas_city', 'elsewhere_mo'],
  TX: ['houston', 'dallas', 'elsewhere_tx'],
  NY: ['nyc', 'elsewhere_ny'],
}

const AREA_LABEL: Record<string, string> = {
  chicago: 'triage.area.chicago',
  suburban_cook: 'triage.area.suburbanCook',
  collar: 'triage.area.collar',
  elsewhere: 'triage.area.elsewhere',
  san_francisco: 'triage.area.sf',
  elsewhere_ca: 'triage.area.elsewhereCa',
  st_louis: 'triage.area.stLouis',
  kansas_city: 'triage.area.kansasCity',
  elsewhere_mo: 'triage.area.elsewhereMo',
  houston: 'triage.area.houston',
  dallas: 'triage.area.dallas',
  elsewhere_tx: 'triage.area.elsewhereTx',
  nyc: 'triage.area.nyc',
  elsewhere_ny: 'triage.area.elsewhereNy',
}

// Map an (state, area) choice to a locality code the backend can boost on. Only
// localities with distinct local law return a value; everything else is
// statewide (undefined).
function deriveLocality(state: string, area: string | null): string | undefined {
  if (state === 'IL') {
    if (area === 'chicago') return 'chicago'
    if (area === 'suburban_cook') return 'cook_county'
  }
  if (state === 'CA' && area === 'san_francisco') return 'san_francisco'
  if (state === 'MO') {
    if (area === 'st_louis') return 'st_louis_city'
    if (area === 'kansas_city') return 'kansas_city'
  }
  if (state === 'TX' && area === 'houston') return 'houston'
  if (state === 'NY' && area === 'nyc') return 'new_york_city'
  return undefined
}

function initialState(): string {
  try {
    const saved = localStorage.getItem('rwr.state')
    if (saved && SUPPORTED_STATES.includes(saved)) return saved
  } catch { /* localStorage unavailable */ }
  return 'IL' // incumbent jurisdiction; an explicit pick overrides + persists
}
const SUBJECT_LABEL: Record<string, string> = {
  housing: 'bottomnav.housing',
  money: 'bottomnav.money',
  repairs: 'bottomnav.repairs',
  benefits: 'bottomnav.benefits',
  veterans: 'subject.veterans',
  work: 'subject.work',
}

function TriagePanel({ triage, step, setTriage, setStep, speech, language }: {
  triage: TriageState
  step: 'state' | 'area' | 'zip' | 'subject' | 'ready'
  setTriage: Dispatch<SetStateAction<TriageState>>
  setStep: Dispatch<SetStateAction<'state' | 'area' | 'zip' | 'subject' | 'ready'>>
  speech: Speech
  language: Language
}) {
  const { t } = useLanguage()
  const [zipInput, setZipInput] = useState(triage.zip)

  const Prompt = ({ promptKey }: { promptKey: string }) => (
    <div className="triage-q">
      <p className="triage-prompt">{t(promptKey)}</p>
      <ReadAloudButton id={`triage:${promptKey}`} text={t(promptKey)} speech={speech} language={language} />
    </div>
  )

  // Step flow depends on state (only Illinois uses the ZIP step).
  const flow: ('state' | 'area' | 'zip' | 'subject')[] =
    triage.state === 'IL' ? ['state', 'area', 'zip', 'subject'] : ['state', 'area', 'subject']
  const idx = flow.indexOf(step as 'state' | 'area' | 'zip' | 'subject')
  const goBack = () => { const prev = flow[idx - 1]; if (prev) setStep(prev) }

  return (
    <section className="triage-panel" aria-label={t('triage.aria')}>
      {idx >= 0 && (
        <div className="triage-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          {idx > 0
            ? <button type="button" className="triage-skip" onClick={goBack}>← {t('triage.back')}</button>
            : <span />}
          <span style={{ fontSize: '0.82rem', color: 'var(--mute)' }}
                aria-label={`${t('triage.step')} ${idx + 1} / ${flow.length}`}>
            {idx + 1} / {flow.length}
          </span>
        </div>
      )}
      {step === 'state' && (
        <div className="triage-step">
          <Prompt promptKey="triage.state.prompt" />
          <div className="triage-options">
            {SUPPORTED_STATES.map((val) => (
              <button key={val} className="triage-option" aria-pressed={triage.state === val} onClick={() => {
                // Changing state invalidates the old area, so clear it.
                setTriage((p) => ({ ...p, state: val, area: null }))
                try { localStorage.setItem('rwr.state', val) } catch { /* ignore */ }
                setStep('area')
              }}>
                {t(STATE_LABEL[val])}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'area' && (
        <div className="triage-step">
          <Prompt promptKey="triage.area.prompt" />
          <div className="triage-options">
            {(STATE_AREAS[triage.state] ?? STATE_AREAS.IL).map((val) => (
              <button key={val} className="triage-option" onClick={() => {
                setTriage((p) => ({ ...p, area: val }))
                // ZIP→region is an Illinois-only table, so only IL uses the ZIP step.
                setStep(triage.state === 'IL' ? 'zip' : 'subject')
              }}>
                {t(AREA_LABEL[val])}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'zip' && (
        <div className="triage-step">
          <Prompt promptKey="triage.zip.prompt" />
          <div className="triage-zip-row">
            <input
              className="triage-zip-input"
              inputMode="numeric"
              maxLength={5}
              placeholder={t('triage.zip.placeholder')}
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value.replace(/[^0-9]/g, ''))}
              aria-label={t('triage.zip.prompt')}
            />
            <button className="triage-option" onClick={() => { setTriage((p) => ({ ...p, zip: zipInput })); setStep('subject') }}>
              {t('triage.zip.next')}
            </button>
          </div>
        </div>
      )}

      {step === 'subject' && (
        <div className="triage-step">
          <Prompt promptKey="triage.subject.prompt" />
          <div className="triage-options">
            {Object.entries(SUBJECT_LABEL).map(([val, key]) => (
              <button key={val} className="triage-option" onClick={() => { setTriage((p) => ({ ...p, subject: val })); setStep('ready') }}>
                {t(key)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* State is the highest-value question, so it can't be skipped — but the
          rest of the funnel can. */}
      {step !== 'state' && (
        <button className="triage-skip" onClick={() => setStep('ready')}>{t('triage.skip')}</button>
      )}
    </section>
  )
}

function Exchange({ message, id, speech, language }: { message: DemoMessage; id: string; speech: Speech; language: Language }) {
  const { user, bot, topicLink, demo } = message
  const { t } = useLanguage()
  return (
    <>
      <div className="msg-user">
        <div className="msg-user-bubble">{user}</div>
      </div>

      <div>
        <div className="msg-bot-label">
          <span className="msg-bot-icon-img" aria-hidden="true" />
          <span>Rights Within Reach</span>
        </div>

        {demo && (
          <p className="demo-notice" role="note" style={{ background: '#FFF4E5', border: '1px solid #E8A33D', borderRadius: '6px', padding: '0.5rem 0.75rem', margin: '0 0 0.6rem', fontSize: '0.88rem', color: 'var(--ink)' }}>
            {t('chat.demoNotice')}
          </p>
        )}

        {bot.refused ? (
          <RefusalCard bot={bot} id={id} speech={speech} language={language} />
        ) : (
          <AnswerCard bot={bot} id={id} speech={speech} language={language} shareUrl={buildShareUrl(message)} />
        )}

        {topicLink && !bot.refused && (
          <Link to={topicLink.slug} className="deep-link" aria-label={topicLink.label}>
            <span className="deep-link-icon" aria-hidden="true">
              <Icon name="book" size={22} />
            </span>
            <span className="deep-link-text">
              <strong>{topicLink.label}</strong>
              <span>{topicLink.sub}</span>
            </span>
            <span className="deep-link-arrow" aria-hidden="true">→</span>
          </Link>
        )}

        {bot.sources.length > 0 && (
          <div className="sources-block">
            <p className="sources-label">{t('chat.sources')}</p>
            <div className="source-grid">
              {bot.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url ?? '#'}
                  className={`source-card external${src.web ? ' source-card-web' : ''}`}
                  target="_blank"
                  rel="noopener"
                >
                  <p className="source-title">{src.title}</p>
                  <p className="source-section">
                    {src.web && <span className="source-web-tag">{t('chat.webSource')}</span>}
                    {src.web ? t('chat.webChecked') : src.section}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        <FeedbackButtons topic={bot.topic || ''} language={language} />
      </div>
    </>
  )
}

function SectionHead({ title, id, text, speech, language }: { title: string; id: string; text: string; speech: Speech; language: Language }) {
  return (
    <div className="answer-section-head">
      <h2 className="answer-section-title">{title}</h2>
      <ReadAloudButton id={id} text={text} speech={speech} language={language} />
    </div>
  )
}

function HandoffCTA({ handoff }: { handoff: NonNullable<AskResponse['handoff']> }) {
  const { t } = useLanguage()
  const url = handoff.url ? (handoff.url.startsWith('http') ? handoff.url : `https://${handoff.url}`) : undefined
  return (
    <div className="handoff-cta" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--line, #e4ded3)' }}>
      <p className="handoff-prompt" style={{ margin: '0 0 0.5rem', fontSize: '0.92rem', color: 'var(--mute)' }}>
        {t('chat.handoffPrompt')}
      </p>
      {url ? (
        <a href={url} target="_blank" rel="noopener" className="btn btn-burgundy"
           style={{ minHeight: '3rem', justifyContent: 'center', width: '100%' }}>
          {t('chat.getLegalHelp')}: {handoff.name} ↗
        </a>
      ) : (
        <p style={{ margin: 0 }}>{handoff.name}</p>
      )}
    </div>
  )
}

function ConfidenceBadge({ level }: { level?: string }) {
  const { t } = useLanguage()
  if (!level || !['high', 'medium', 'low'].includes(level)) return null
  return (
    <span className={`confidence-badge conf-${level}`} title={t('chat.confidenceHelp')}>
      {t('chat.confidence')}: {t(`chat.conf.${level}`)}
    </span>
  )
}

function AnswerCard({ bot, id, speech, language, shareUrl }: { bot: AskResponse; id: string; speech: Speech; language: Language; shareUrl?: string }) {
  const { t } = useLanguage()
  return (
    <article className="answer-card" aria-label={t('chat.answerLabel')}>
      <div className="answer-card-top">
        {bot.confidence !== 'low' && (
          <div className="answer-sticker" aria-hidden="true">{t('chat.answered')}</div>
        )}
        <ConfidenceBadge level={bot.confidence} />
        <ShareActions bot={bot} shareUrl={shareUrl} />
      </div>

      <section className="answer-section">
        <SectionHead title={t('chat.answerLabel')} id={`${id}:ans`} text={bot.answer} speech={speech} language={language} />
        <div className="answer-text"><ReactMarkdown>{bot.answer}</ReactMarkdown></div>
      </section>

      {bot.next_steps && bot.next_steps.length > 0 && (
        <section className="answer-section">
          <SectionHead title={t('chat.nextSteps')} id={`${id}:steps`} text={bot.next_steps.join('. ')} speech={speech} language={language} />
          <ol className="next-steps-list">
            {bot.next_steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>
      )}

      {bot.contact && (
        <section className="answer-section">
          <SectionHead title={t('chat.whoToContact')} id={`${id}:contact`} text={contactSpeech(bot.contact)} speech={speech} language={language} />
          <ContactCard contact={bot.contact} />
        </section>
      )}

      {bot.local_orgs && bot.local_orgs.length > 0 && (
        <section className="answer-section">
          <SectionHead title={t('chat.localOrgs')} id={`${id}:orgs`} text={localOrgsSpeech(bot.local_orgs)} speech={speech} language={language} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {bot.local_orgs.map((o, i) => {
              const tel = o.phone ? o.phone.replace(/[^0-9]/g, '') : ''
              const web = orgHref(o.url)
              const place = [o.city, o.state].filter(Boolean).join(', ')
              return (
                <div className="contact-card" key={`${o.name}-${i}`}>
                  <p className="serif contact-name">{o.name}</p>
                  {place && <p className="contact-sub">{place}</p>}
                  {o.languages && o.languages.length > 0 && (
                    <p className="contact-sub">{t('findhelp.langs')}: {o.languages.join(', ')}</p>
                  )}
                  <div className="contact-actions">
                    {tel && (
                      <a href={`tel:${tel}`} className="btn btn-burgundy" style={{ minHeight: '3rem', justifyContent: 'center' }}>
                        {t('chat.callNow')} {o.phone}
                      </a>
                    )}
                    {web && (
                      <a href={web} target="_blank" rel="noopener" className="btn btn-outline" style={{ minHeight: '3rem', justifyContent: 'center' }}>
                        {t('chat.visitSite')}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {bot.disclaimer && <p className="answer-disclaimer answer-disclaimer-bottom">{bot.disclaimer}</p>}

      {bot.handoff && <HandoffCTA handoff={bot.handoff} />}
    </article>
  )
}

function FeedbackButtons({ topic, language }: { topic: string; language: Language }) {
  const { t } = useLanguage()
  const [voted, setVoted] = useState<null | boolean>(null)
  const vote = (helpful: boolean) => {
    setVoted(helpful)
    sendFeedback(helpful, language, topic)
  }
  if (voted !== null) return <p className="feedback-thanks" role="status">{t('chat.feedbackThanks')}</p>
  return (
    <div className="feedback-row">
      <span className="feedback-q">{t('chat.helpful')}</span>
      <button type="button" className="feedback-btn" onClick={() => vote(true)} aria-label={t('chat.yes')}>
        <Icon name="like" size={17} aria-hidden="true" /> {t('chat.yes')}
      </button>
      <button type="button" className="feedback-btn" onClick={() => vote(false)} aria-label={t('chat.no')}>
        <Icon name="like" size={17} aria-hidden="true" style={{ transform: 'rotate(180deg)' }} /> {t('chat.no')}
      </button>
    </div>
  )
}

function ContactCard({ contact }: { contact: NonNullable<AskResponse['contact']> }) {
  const { t, language } = useLanguage()
  const tel = contact.phone ? `tel:${contact.phone.replace(/[^0-9]/g, '')}` : undefined
  const web = contact.url ? (contact.url.startsWith('http') ? contact.url : `https://${contact.url}`) : undefined
  return (
    <div className="contact-card">
      <p className="serif contact-name">{contact.name}</p>
      {contact.sub && <p className="contact-sub">{orgText(contact.sub, language)}</p>}
      {contact.why && <p className="contact-why">{contact.why}</p>}
      {contact.how && <p className="contact-how">{contact.how}</p>}
      <div className="org-stats">
        {contact.phone && <div className="stat"><p className="stat-label">{t('chat.phone')}</p><p className="stat-val"><a href={tel}>{contact.phone}</a></p></div>}
        {web && <div className="stat"><p className="stat-label">{t('chat.website')}</p><p className="stat-val"><a href={web} target="_blank" rel="noopener">{contact.url}</a></p></div>}
        {contact.hours && <div className="stat"><p className="stat-label">{t('chat.hours')}</p><p className="stat-val">{orgText(contact.hours, language)}</p></div>}
      </div>
      <div className="contact-actions">
        {contact.phone && (
          <a href={tel} className="btn btn-burgundy" style={{ minHeight: '3rem', justifyContent: 'center' }}>
            {t('chat.callNow')}
          </a>
        )}
        {web && (
          <a href={web} target="_blank" rel="noopener" className="btn btn-outline" style={{ minHeight: '3rem', justifyContent: 'center' }}>
            {t('chat.visitSite')}
          </a>
        )}
      </div>
    </div>
  )
}

function ReadAloudButton({ id, text, speech, language }: { id: string; text: string; speech: Speech; language: Language }) {
  const { t } = useLanguage()
  if (!speech.supported) return null
  const active = speech.speakingId === id
  const label = active ? t('chat.stopReading') : t('chat.readAnswer')
  return (
    <button
      type="button"
      className={`read-aloud-btn${active ? ' is-reading' : ''}`}
      onClick={() => speech.toggle(id, text, language)}
      aria-pressed={active}
      aria-label={label}
    >
      <Icon name="volume" size={18} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}

function RefusalCard({ bot, id, speech, language }: { bot: AskResponse; id: string; speech: Speech; language: Language }) {
  const { t } = useLanguage()
  const org = bot.refusal_org!
  return (
    <article className="refuse-card" aria-label={t('chat.refuseAria')}>
      <div className="answer-card-top">
        <p className="serif refuse-title" style={{ margin: 0 }}>{bot.answer}</p>
        <ReadAloudButton id={id} text={spokenText(bot)} speech={speech} language={language} />
      </div>
      <p className="refuse-body">{t('chat.refuseBody')}</p>

      <div className="refuse-org-card">
        <div className="refuse-org-head">
          <div className="refuse-org-badge" aria-hidden="true">CP</div>
          <div>
            <p className="serif" style={{ margin: 0, fontSize: '1.2rem', color: 'var(--midnight)' }}>{org.name}</p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--mute)' }}>{orgText(org.sub, language)}</p>
          </div>
        </div>
        <p style={{ margin: '0.7rem 0', fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--ink)' }}>{orgText(org.description, language)}</p>
        <div className="org-stats" style={{ marginBottom: 0 }}>
          <div className="stat" style={{ background: 'var(--cream)' }}>
            <p className="stat-label">{t('chat.phone')}</p>
            <p className="stat-val"><a href={`tel:${org.phone.replace(/[^0-9]/g, '')}`}>{org.phone}</a></p>
          </div>
          <div className="stat" style={{ background: 'var(--cream)' }}>
            <p className="stat-label">{t('chat.hours')}</p>
            <p className="stat-val">{orgText(org.hours, language)}</p>
          </div>
        </div>
      </div>

      <div className="refuse-buttons">
        <a href={`tel:${org.phone.replace(/[^0-9]/g, '')}`} className="btn btn-burgundy" style={{ flex: 1, minHeight: '3.2rem', justifyContent: 'center' }}>
          {t('chat.callNow')}
        </a>
        <a href="/resources" className="btn btn-outline" style={{ justifyContent: 'center' }}>{t('chat.moreOptions')}</a>
      </div>

      {bot.handoff && <HandoffCTA handoff={bot.handoff} />}
    </article>
  )
}

function LoadingMessage() {
  const { t } = useLanguage()
  return (
    <div>
      <div className="msg-bot-label">
        <span className="msg-bot-icon-img" aria-hidden="true" />
        <span>Rights Within Reach</span>
      </div>
      <article className="answer-card" aria-live="polite" aria-busy="true">
        <p className="answer-text">{t('chat.searching')}</p>
      </article>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  const { t } = useLanguage()
  return (
    <div role="alert">
      <div className="msg-bot-label">
        <span className="msg-bot-icon-img" aria-hidden="true" />
        <span>Rights Within Reach</span>
      </div>
      <article className="refuse-card">
        <p className="serif refuse-title">{t('chat.errorTitle')}</p>
        <p className="refuse-body">{message}</p>
      </article>
    </div>
  )
}
