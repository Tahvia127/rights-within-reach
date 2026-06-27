import { useState, useRef, FormEvent } from 'react'
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

// Flatten an answer into one natural string for the read-aloud feature:
// the answer, then each key point ("label: text"), then the closing note. For
// a refusal, read the message plus the referral org's contact details.
function spokenText(bot: AskResponse): string {
  if (bot.refused) {
    const org = bot.refusal_org
    return [
      bot.answer,
      org && `${org.name}. ${org.description} Phone: ${org.phone}. Hours: ${org.hours}.`,
    ]
      .filter(Boolean)
      .join(' ')
  }
  const parts = [bot.answer]
  if (bot.key_points) parts.push(...bot.key_points.map((k) => `${k.label}: ${k.text}`))
  if (bot.note) parts.push(bot.note)
  return parts.join('. ')
}

const DEMO_MESSAGES: DemoMessage[] = [
  {
    user: 'How much notice does my landlord need to give before raising my rent in Chicago?',
    bot: {
      answer: 'In Chicago, your landlord has to tell you in writing before raising your rent. The notice they must give depends on how long you have lived there:',
      key_points: [
        { label: '30 days', text: 'if you have lived there less than 6 months' },
        { label: '60 days', text: 'if you have lived there 6 months to 3 years' },
        { label: '120 days', text: 'if you have lived there more than 3 years' },
      ],
      note: 'If the notice is missing or late, the rent increase may not be valid. You can show the notice you got to a legal aid organization to check.',
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
      answer: 'Generally, no. Under the federal Fair Debt Collection Practices Act (FDCPA), debt collectors must stop contacting people at work once they have been told that the employer does not allow such calls.',
      key_points: [
        { label: '✓ Tell them', text: 'in writing or by phone that you cannot take calls at work' },
        { label: '✓ Keep a log', text: 'of every call: date, time, who called, what was said' },
        { label: '✓ Report', text: 'violations to the CFPB or Illinois Attorney General' },
      ],
      note: 'If they keep calling after being told to stop, that is a separate violation. You may have grounds for a complaint or a private lawsuit.',
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
      const response = await ask({ question, language })
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

      <SiteFooter />
    </div>
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

function AnswerCard({ bot, id, speech, language }: { bot: AskResponse; id: string; speech: Speech; language: Language }) {
  const { t } = useLanguage()
  return (
    <article className="answer-card" aria-label="Answer">
      <div className="answer-card-top">
        <div className="answer-sticker" aria-hidden="true">{t('chat.answered')}</div>
        <ReadAloudButton id={id} text={spokenText(bot)} speech={speech} language={language} />
      </div>
      <div className="answer-text"><ReactMarkdown>{bot.answer}</ReactMarkdown></div>
      {bot.key_points && bot.key_points.length > 0 && (
        <ul className="answer-key" style={{ listStyle: 'none', padding: '1.1rem 1.2rem', margin: '0 0 1rem' }}>
          {bot.key_points.map((kp, i) => (
            <li key={i} className="key-row">
              <span className="key-pill">{kp.label}</span>
              <span className="key-text">{kp.text}</span>
            </li>
          ))}
        </ul>
      )}
      {bot.note && <p className="answer-note">{bot.note}</p>}
    </article>
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
