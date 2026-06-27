import { useState, useRef, FormEvent, Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { SkipLink } from '../components/SkipLink'
import { LanguageStrip } from '../components/LanguageStrip'
import { ChatHeader } from '../components/ChatHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Icon } from '../lib/icons'
import { ask, AskResponse } from '../lib/api'
import { useLanguage, Language } from '../lib/translations'
import { useSpeech, useSpeechContext } from '../lib/speech'

interface DemoMessage {
  user: string
  bot: AskResponse
  topicLink?: { slug: string; label: string; sub: string }
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
      bot.disclaimer,
    ]
      .filter(Boolean)
      .join(' ')
  }
  const parts: string[] = [bot.answer]
  if (bot.next_steps?.length) parts.push(...bot.next_steps)
  if (bot.contact) parts.push(`${bot.contact.name}. ${bot.contact.why ?? ''} ${bot.contact.how ?? ''}`)
  if (bot.key_points) parts.push(...bot.key_points.map((k) => `${k.label}: ${k.text}`))
  if (bot.note) parts.push(bot.note)
  if (bot.disclaimer) parts.push(bot.disclaimer)
  return parts.filter(Boolean).join('. ')
}

function contactSpeech(c: NonNullable<AskResponse['contact']>): string {
  return [c.name, c.why, c.how, c.phone && `Phone ${c.phone}`].filter(Boolean).join('. ')
}

const DEMO_DISCLAIMER =
  'Rights Within Reach is not an attorney and does not give legal advice. It shares neutral legal information to help you understand the law and speak up for yourself. It may not reflect the most recent changes to the law and may not apply to your situation. For advice about your specific circumstances, talk to a lawyer or a legal aid organization.'

const DEMO_CARPLS = {
  name: 'CARPLS Legal Aid Hotline',
  sub: 'Free legal help · Cook County',
  phone: '312-738-9200',
  hours: 'Mon–Fri, 9–4:30',
}

const DEMO_MESSAGES: DemoMessage[] = [
  {
    user: 'How much notice does my landlord need to give before raising my rent in Chicago?',
    bot: {
      answer: 'In Chicago, your landlord must tell you in writing before raising your rent. How much notice depends on how long you have lived there: **30 days** if under 6 months, **60 days** from 6 months to 3 years, and **120 days** if more than 3 years. If the notice is missing or late, the increase may not be valid.',
      next_steps: [
        'Check how long you have lived in your unit to find your notice period.',
        'Look at the written notice for its date and when the new rent starts.',
        'Keep a copy of the notice if you think it was too short.',
      ],
      contact: {
        ...DEMO_CARPLS,
        why: 'CARPLS helps Cook County renters check whether a rent-increase notice follows Chicago’s rules.',
        how: 'Call and ask about landlord notice requirements; have your lease and the notice ready.',
      },
      disclaimer: DEMO_DISCLAIMER,
      sources: [
        { title: 'Chicago RLTO', section: '§5-12-130 Notice of rent increase', topic: 'housing' },
        { title: 'Fair Notice Ordinance', section: 'Chicago Municipal Code 5-14', topic: 'housing' },
      ],
      topic: 'housing',
    },
    topicLink: { slug: '/housing', label: 'Read the full housing guide', sub: 'More on eviction, deposits, repairs, and where to get help' },
  },
  {
    user: 'A debt collector keeps calling me at work even after I told them to stop. Is that legal?',
    bot: {
      answer: 'Generally, no. Under the federal Fair Debt Collection Practices Act (FDCPA), debt collectors must stop contacting people at work once they have been told the employer does not allow such calls. Continuing after that is a separate violation.',
      next_steps: [
        'Tell the collector in writing or by phone that you cannot take calls at work.',
        'Keep a log of every call: date, time, who called, and what was said.',
        'Report violations to the CFPB or the Illinois Attorney General.',
      ],
      contact: {
        ...DEMO_CARPLS,
        why: 'CARPLS handles consumer-debt and collector-harassment cases for Cook County residents.',
        how: 'Call with your call log and any collection letters; ask whether the collector broke the law.',
      },
      disclaimer: DEMO_DISCLAIMER,
      sources: [
        { title: 'Fair Debt Collection Practices Act', section: '15 U.S.C. §1692c(a)(3)', topic: 'money_debt' },
        { title: 'Illinois Collection Agency Act', section: '225 ILCS 425', topic: 'money_debt' },
      ],
      topic: 'money_debt',
    },
    topicLink: { slug: '/money', label: 'Read the full money & debt guide', sub: 'More on garnishment, utility shutoffs, and harassment' },
  },
  {
    user: 'Can I get full custody of my children?',
    bot: {
      answer: 'This is something I can not help with, but here is who can.',
      disclaimer: DEMO_DISCLAIMER,
      sources: [],
      topic: 'family',
      refused: true,
      refusal_org: {
        name: 'CARPLS Legal Aid Hotline',
        sub: 'Free legal help · Cook County',
        description: 'Call to speak with a lawyer about your family case. Walk-in help also available.',
        phone: '312-738-9200',
        hours: 'Mon–Fri, 9–4:30',
      },
    },
  },
]

export default function Chat() {
  const [messages, setMessages] = useState<DemoMessage[]>(DEMO_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { language, t } = useLanguage()
  const speech = useSpeechContext()
  const formRef = useRef<HTMLFormElement>(null)

  // Guided triage (Phase 2). 'ready' = collected or skipped → show the input.
  const [triage, setTriage] = useState<{ area: string | null; zip: string; subject: string | null }>({ area: null, zip: '', subject: null })
  const [triageStep, setTriageStep] = useState<'area' | 'zip' | 'subject' | 'ready'>('area')

  const lastMessage = messages[messages.length - 1]
  const readPage = () =>
    speech.toggle('page', lastMessage ? spokenText(lastMessage.bot) : '', language)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    setLoading(true)
    setError(null)
    const question = input
    setInput('')

    try {
      const response = await ask({
        question, language,
        area: triage.area ?? undefined,
        zip: triage.zip || undefined,
        subject: triage.subject ?? undefined,
      })
      setMessages((prev) => [...prev, { user: question, bot: response }])
    } catch (err) {
      setError(err instanceof Error ? err.message : t('chat.error'))
    } finally {
      setLoading(false)
    }
  }

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
        {messages.map((m, i) => (
          <Exchange key={i} message={m} id={String(i)} speech={speech} language={language} />
        ))}
        {loading && <LoadingMessage />}
        {error && <ErrorMessage message={error} />}
      </main>

      {triageStep !== 'ready' ? (
        <TriagePanel triage={triage} step={triageStep} setTriage={setTriage} setStep={setTriageStep} speech={speech} language={language} />
      ) : (
        <>
          {(triage.area || triage.subject) && (
            <div className="triage-summary">
              <span>
                {t('triage.summary')}: {[
                  triage.area && t(AREA_LABEL[triage.area]),
                  triage.subject && t(SUBJECT_LABEL[triage.subject]),
                  triage.zip,
                ].filter(Boolean).join(' · ')}
              </span>
              <button className="triage-edit" onClick={() => setTriageStep('area')}>{t('triage.edit')}</button>
            </div>
          )}

          <section className="suggest-block" aria-label="Suggested follow-up questions">
            <p className="suggest-label">{t('chat.tryNext')}</p>
            <div className="suggest-chips">
              <button className="suggest-chip" onClick={() => setInput(t('chat.suggest1'))}>{t('chat.suggest1')} →</button>
              <button className="suggest-chip" onClick={() => setInput(t('chat.suggest2'))}>{t('chat.suggest2')} →</button>
              <button className="suggest-chip" onClick={() => setInput(t('chat.suggest3'))}>{t('chat.suggest3')} →</button>
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
              aria-label={t('chat.typeQuestion')}
              disabled={loading}
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

type TriageState = { area: string | null; zip: string; subject: string | null }

const AREA_LABEL: Record<string, string> = {
  chicago: 'triage.area.chicago',
  suburban_cook: 'triage.area.suburbanCook',
  collar: 'triage.area.collar',
  elsewhere: 'triage.area.elsewhere',
}
const SUBJECT_LABEL: Record<string, string> = {
  housing: 'bottomnav.housing',
  money: 'bottomnav.money',
  repairs: 'bottomnav.repairs',
  benefits: 'bottomnav.benefits',
}

function TriagePanel({ triage, step, setTriage, setStep, speech, language }: {
  triage: TriageState
  step: 'area' | 'zip' | 'subject' | 'ready'
  setTriage: Dispatch<SetStateAction<TriageState>>
  setStep: Dispatch<SetStateAction<'area' | 'zip' | 'subject' | 'ready'>>
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

  return (
    <section className="triage-panel" aria-label="Guided questions">
      {step === 'area' && (
        <div className="triage-step">
          <Prompt promptKey="triage.area.prompt" />
          <div className="triage-options">
            {Object.entries(AREA_LABEL).map(([val, key]) => (
              <button key={val} className="triage-option" onClick={() => { setTriage((p) => ({ ...p, area: val })); setStep('zip') }}>
                {t(key)}
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

      <button className="triage-skip" onClick={() => setStep('ready')}>{t('triage.skip')}</button>
    </section>
  )
}

function Exchange({ message, id, speech, language }: { message: DemoMessage; id: string; speech: Speech; language: Language }) {
  const { user, bot, topicLink } = message
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

        {bot.refused ? (
          <RefusalCard bot={bot} id={id} speech={speech} language={language} />
        ) : (
          <AnswerCard bot={bot} id={id} speech={speech} language={language} />
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
                  className="source-card external"
                  target="_blank"
                  rel="noopener"
                >
                  <p className="source-title">{src.title}</p>
                  <p className="source-section">{src.section}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function SectionHead({ title, id, text, speech, language }: { title: string; id: string; text: string; speech: Speech; language: Language }) {
  return (
    <div className="answer-section-head">
      <h4 className="answer-section-title">{title}</h4>
      <ReadAloudButton id={id} text={text} speech={speech} language={language} />
    </div>
  )
}

function AnswerCard({ bot, id, speech, language }: { bot: AskResponse; id: string; speech: Speech; language: Language }) {
  const { t } = useLanguage()
  return (
    <article className="answer-card" aria-label="Answer">
      <div className="answer-card-top">
        <div className="answer-sticker" aria-hidden="true">{t('chat.answered')}</div>
      </div>

      {bot.disclaimer && (
        <div className="answer-disclaimer answer-disclaimer-top">
          <ReadAloudButton id={`${id}:d0`} text={bot.disclaimer} speech={speech} language={language} />
          <p>{bot.disclaimer}</p>
        </div>
      )}

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

      {bot.disclaimer && <p className="answer-disclaimer answer-disclaimer-bottom">{bot.disclaimer}</p>}
    </article>
  )
}

function ContactCard({ contact }: { contact: NonNullable<AskResponse['contact']> }) {
  const { t } = useLanguage()
  const tel = contact.phone ? `tel:${contact.phone.replace(/[^0-9]/g, '')}` : undefined
  return (
    <div className="contact-card">
      <p className="serif contact-name">{contact.name}</p>
      {contact.sub && <p className="contact-sub">{contact.sub}</p>}
      {contact.why && <p className="contact-why">{contact.why}</p>}
      {contact.how && <p className="contact-how">{contact.how}</p>}
      <div className="org-stats">
        {contact.phone && <div className="stat"><p className="stat-label">Phone</p><p className="stat-val"><a href={tel}>{contact.phone}</a></p></div>}
        {!contact.phone && contact.url && <div className="stat"><p className="stat-label">Website</p><p className="stat-val">{contact.url}</p></div>}
        {contact.hours && <div className="stat"><p className="stat-label">Hours</p><p className="stat-val">{contact.hours}</p></div>}
      </div>
      {contact.phone && (
        <a href={tel} className="btn btn-burgundy" style={{ marginTop: '0.7rem', minHeight: '3rem', justifyContent: 'center' }}>
          {t('chat.callNow')}
        </a>
      )}
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
    <article className="refuse-card" aria-label="Out of scope, please call this organization">
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
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--mute)' }}>{org.sub}</p>
          </div>
        </div>
        <p style={{ margin: '0.7rem 0', fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--ink)' }}>{org.description}</p>
        <div className="org-stats" style={{ marginBottom: 0 }}>
          <div className="stat" style={{ background: 'var(--cream)' }}>
            <p className="stat-label">Phone</p>
            <p className="stat-val"><a href={`tel:${org.phone.replace(/[^0-9]/g, '')}`}>{org.phone}</a></p>
          </div>
          <div className="stat" style={{ background: 'var(--cream)' }}>
            <p className="stat-label">Hours</p>
            <p className="stat-val">{org.hours}</p>
          </div>
        </div>
      </div>

      <div className="refuse-buttons">
        <a href={`tel:${org.phone.replace(/[^0-9]/g, '')}`} className="btn btn-burgundy" style={{ flex: 1, minHeight: '3.2rem', justifyContent: 'center' }}>
          {t('chat.callNow')}
        </a>
        <button className="btn btn-outline">{t('chat.moreOptions')}</button>
      </div>
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
