import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/translations'
import { ReadAloud } from './ReadAloud'
import { findOrgs, OrgCard } from '../lib/api'

// "Find help near me": a live resource finder backed by GET /api/orgs. Pick a
// state (and optionally a topic + ZIP); we fetch verified referral orgs for that
// place, ranked so the ones that speak the current site language come first.
// This replaced a hardcoded Illinois-only org list that duplicated the backend
// routing — the endpoint is now the single source of truth, and it works for
// every state in the corpus.

const SUPPORTED_STATES = ['IL', 'CA', 'MO', 'TX', 'NY']
const STATE_LABEL: Record<string, string> = {
  IL: 'triage.state.il', CA: 'triage.state.ca', MO: 'triage.state.mo',
  TX: 'triage.state.tx', NY: 'triage.state.ny',
}

// UI topic -> backend topic (matches SUBJECT_TO_TOPIC / TOPIC_TO_LIST_PARENT).
// 'all' sends no topic filter.
const TOPICS: { key: string; topic?: string }[] = [
  { key: 'all' },
  { key: 'housing', topic: 'housing' },
  { key: 'money', topic: 'money_debt' },
  { key: 'repairs', topic: 'housing_repair' },
  { key: 'benefits', topic: 'benefits' },
  { key: 'veterans', topic: 'veterans' },
  { key: 'work', topic: 'work' },
]

// Statewide directory to fall back to when the finder has no local match.
const DIRECTORY: Record<string, { name: string; url: string }> = {
  IL: { name: 'Illinois Legal Aid Online', url: 'illinoislegalaid.org' },
  CA: { name: 'LawHelpCA', url: 'lawhelpca.org' },
  MO: { name: 'MOLawHelp', url: 'molawhelp.org' },
  TX: { name: 'TexasLawHelp', url: 'texaslawhelp.org' },
  NY: { name: 'LawHelpNY', url: 'lawhelpny.org' },
}

function initialState(): string {
  try {
    const saved = localStorage.getItem('rwr.state')
    if (saved && SUPPORTED_STATES.includes(saved)) return saved
  } catch { /* localStorage unavailable */ }
  return 'IL'
}

function href(url?: string): string | undefined {
  if (!url) return undefined
  return url.startsWith('http') ? url : `https://${url}`
}

export function FindHelpNearMe() {
  const { t, language } = useLanguage()
  const [stateCode, setStateCode] = useState<string>(initialState)
  const [topicKey, setTopicKey] = useState<string>('all')
  const [zip, setZip] = useState('')
  const [orgs, setOrgs] = useState<OrgCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const chooseState = (s: string) => {
    setStateCode(s)
    try { localStorage.setItem('rwr.state', s) } catch { /* ignore */ }
  }

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(false)
    const topic = TOPICS.find((x) => x.key === topicKey)?.topic
    findOrgs({
      state: stateCode,
      topic,
      language,
      zip: zip.length === 5 ? zip : undefined,
      limit: 6,
      signal: controller.signal,
    })
      .then((r) => setOrgs(r.results))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return // superseded
        setError(true)
        setOrgs([])
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [stateCode, topicKey, zip, language])

  const directory = DIRECTORY[stateCode]

  return (
    <section className="section section-bone" aria-labelledby="find-help" data-readable>
      <div className="section-inner">
        <p className="eyebrow">{t('findhelp.eyebrow')}</p>
        <div className="section-head">
          <h2 id="find-help" className="serif section-title">{t('findhelp.title')}</h2>
          <ReadAloud id="findhelp" />
        </div>
        <p className="section-sub">{t('findhelp.sub')}</p>

        <div className="findhelp-controls">
          <fieldset className="findhelp-areas">
            <legend>{t('findhelp.state')}</legend>
            <div className="findhelp-area-btns">
              {SUPPORTED_STATES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={stateCode === s ? 'findhelp-area-btn selected' : 'findhelp-area-btn'}
                  aria-pressed={stateCode === s}
                  onClick={() => chooseState(s)}
                >
                  {t(STATE_LABEL[s])}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="findhelp-areas">
            <legend>{t('findhelp.topicLabel')}</legend>
            <div className="findhelp-area-btns">
              {TOPICS.map(({ key }) => (
                <button
                  key={key}
                  type="button"
                  className={topicKey === key ? 'findhelp-area-btn selected' : 'findhelp-area-btn'}
                  aria-pressed={topicKey === key}
                  onClick={() => setTopicKey(key)}
                >
                  {key === 'all' ? t('findhelp.topic.all') : t(`findhelp.topic.${key}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="findhelp-zip">
            <label htmlFor="findhelp-zip-input">{t('findhelp.zip')}</label>
            <input
              id="findhelp-zip-input"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="60629"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            />
            <p className="findhelp-zip-hint">{t('findhelp.zipHint')}</p>
          </div>
        </div>

        <div className="findhelp-results" role="region" aria-live="polite" aria-busy={loading}>
          <p className="findhelp-results-head">
            {t('findhelp.results')} · <strong>{t(STATE_LABEL[stateCode])}</strong>
          </p>

          {loading && <p className="findhelp-prompt">{t('findhelp.loading')}</p>}

          {!loading && error && <p className="findhelp-prompt">{t('findhelp.error')}</p>}

          {!loading && !error && orgs.length === 0 && (
            <p className="findhelp-prompt">
              {t('findhelp.none')}{' '}
              {directory && (
                <a href={href(directory.url)} target="_blank" rel="noopener">
                  {directory.name} ↗
                </a>
              )}
            </p>
          )}

          {!loading && !error && orgs.length > 0 && (
            <div className="findhelp-grid">
              {orgs.map((org, i) => {
                const place = [org.city, org.state].filter(Boolean).join(', ')
                const tel = org.phone ? org.phone.replace(/[^0-9]/g, '') : ''
                const web = href(org.url)
                return (
                  <article className="findhelp-card" key={`${org.name}-${i}`}>
                    <h3 className="findhelp-org">{org.name}</h3>
                    {place && <p className="findhelp-org-sub">{place}</p>}
                    {org.languages && org.languages.length > 0 && (
                      <p className="findhelp-org-sub">
                        {t('findhelp.langs')}: {org.languages.join(', ')}
                      </p>
                    )}
                    <div className="findhelp-actions">
                      {tel && (
                        <a className="findhelp-call" href={`tel:${tel}`}>
                          {t('findhelp.call')} {org.phone}
                        </a>
                      )}
                      {web && (
                        <a className="findhelp-visit" href={web} target="_blank" rel="noopener">
                          {t('findhelp.visit')} ↗
                        </a>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <p className="findhelp-disclaimer">{t('findhelp.disclaimer')}</p>
        </div>
      </div>
    </section>
  )
}
