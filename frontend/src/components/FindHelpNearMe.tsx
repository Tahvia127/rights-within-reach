import { useState } from 'react'
import { useLanguage } from '../lib/translations'
import { ReadAloud } from './ReadAloud'

// "Find help near me", mirrors the backend routing (backend/services/routing.py
// contact_for/resolve_region) on the client: pick an area (or a Chicago ZIP
// auto-selects it), and we surface the right free organization per topic for that
// region. Org names / phone numbers stay in English across languages, matching the
// rest of the site; only chrome and topic labels translate.

type Region = 'chicago' | 'suburban_cook' | 'collar' | 'illinois'
type Topic = 'housing' | 'money' | 'repairs' | 'benefits' | 'general'

interface Org {
  name: string
  sub: string
  phone?: string
  tel?: string
  hours?: string
  url?: string
}

const ORGS: Record<string, Org> = {
  carpls: { name: 'CARPLS Legal Aid Hotline', sub: 'Free legal help · Cook County', phone: '312-738-9200', tel: '3127389200', hours: 'Mon to Fri, 9 to 4:30' },
  cclahd: { name: 'Cook County Legal Aid for Housing & Debt', sub: 'Free · all Cook County, any status', phone: '855-956-5763', tel: '8559565763', hours: 'Mon to Fri, 9 to 4:30' },
  legalAidChicago: { name: 'Legal Aid Chicago', sub: 'Benefits, appeals & hearings', phone: '312-341-1070', tel: '3123411070', hours: 'Mon to Fri, 9 to 5' },
  evictionHelp: { name: 'Eviction Help Illinois', sub: 'Free eviction help statewide', phone: '855-631-0811', tel: '8556310811', hours: 'Text “eviction” to 85622' },
  ilao: { name: 'Illinois Legal Aid Online', sub: 'Find free legal help statewide', url: 'illinoislegalaid.org' },
  ceda: { name: 'CEDA of Cook County', sub: 'Utility & repair help · suburban Cook', phone: '800-571-2332', tel: '8005712332' },
  chicagoDoh: { name: 'City of Chicago, Dept. of Housing', sub: 'Home repair programs', phone: '312-744-3653', tel: '3127443653', hours: 'Mon to Fri' },
  ihda: { name: 'Illinois Housing Development Authority', sub: 'Statewide home-repair grants', phone: '312-836-5200', tel: '3128365200', hours: 'Mon to Fri' },
  twoOneOne: { name: '211 Metro Chicago', sub: 'Free 24/7, routed to local help', phone: '2-1-1', tel: '211', hours: '24/7 · free' },
}

// Same decision tree as backend contact_for(topic, region).
function contactFor(topic: Topic, region: Region): Org {
  const cook = region === 'chicago' || region === 'suburban_cook'
  if (topic === 'benefits') return cook ? ORGS.legalAidChicago : ORGS.ilao
  if (topic === 'repairs') {
    if (region === 'suburban_cook') return ORGS.ceda
    if (region === 'collar' || region === 'illinois') return ORGS.ihda
    return ORGS.chicagoDoh
  }
  if (topic === 'housing') return cook ? ORGS.cclahd : ORGS.evictionHelp
  if (topic === 'general') return ORGS.twoOneOne // 211 is a good universal front door
  return cook ? ORGS.carpls : ORGS.ilao // money
}

const TOPICS: Topic[] = ['housing', 'money', 'repairs', 'benefits', 'general']
const AREAS: Region[] = ['chicago', 'suburban_cook', 'collar', 'illinois']

// Coarse Chicago-ZIP detection, matching routing.py's _region_from_zip fallback
// (60601 to 60661, plus 60666/60707). Only Chicago is reliably ZIP-detectable; every
// other area comes from the explicit button choice.
function chicagoZip(zip: string): boolean {
  const z = zip.trim().slice(0, 5)
  if (!/^\d{5}$/.test(z)) return false
  const n = parseInt(z, 10)
  return (n >= 60601 && n <= 60661) || n === 60666 || n === 60707
}

export function FindHelpNearMe() {
  const { t } = useLanguage()
  const [region, setRegion] = useState<Region | null>(null)
  const [zip, setZip] = useState('')

  function onZip(value: string) {
    const cleaned = value.replace(/\D/g, '').slice(0, 5)
    setZip(cleaned)
    if (chicagoZip(cleaned)) setRegion('chicago')
  }

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
            <legend>{t('findhelp.area')}</legend>
            <div className="findhelp-area-btns">
              {AREAS.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={region === a ? 'findhelp-area-btn selected' : 'findhelp-area-btn'}
                  aria-pressed={region === a}
                  onClick={() => setRegion(a)}
                >
                  {t(`findhelp.area.${a}`)}
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
              onChange={(e) => onZip(e.target.value)}
            />
            <p className="findhelp-zip-hint">{t('findhelp.zipHint')}</p>
          </div>
        </div>

        {region === null ? (
          <p className="findhelp-prompt">{t('findhelp.prompt')}</p>
        ) : (
          <div className="findhelp-results" role="region" aria-live="polite">
            <p className="findhelp-results-head">
              {t('findhelp.results')} · <strong>{t(`findhelp.area.${region}`)}</strong>
            </p>
            <div className="findhelp-grid">
              {TOPICS.map((topic) => {
                const org = contactFor(topic, region)
                return (
                  <article className="findhelp-card" key={topic}>
                    <p className="findhelp-topic">{t(`findhelp.topic.${topic}`)}</p>
                    <h3 className="findhelp-org">{org.name}</h3>
                    <p className="findhelp-org-sub">{org.sub}</p>
                    <div className="findhelp-actions">
                      {org.tel && (
                        <a className="findhelp-call" href={`tel:${org.tel}`}>
                          {t('findhelp.call')} {org.phone}
                        </a>
                      )}
                      {org.url && (
                        <a className="findhelp-visit" href={`https://${org.url}`} target="_blank" rel="noopener">
                          {t('findhelp.visit')} ↗
                        </a>
                      )}
                    </div>
                    {org.hours && <p className="findhelp-hours">{org.hours}</p>}
                  </article>
                )
              })}
            </div>
            <p className="findhelp-disclaimer">{t('findhelp.disclaimer')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
