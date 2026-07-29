import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SkipLink } from '../components/SkipLink'
import { LanguageStrip } from '../components/LanguageStrip'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Icon } from '../lib/icons'
import { ReadAloud } from '../components/ReadAloud'
import { useLanguage, Language } from '../lib/translations'

const DATE_LOCALE: Record<Language, string> = {
  en: 'en-US', es: 'es', zh: 'zh-CN', tl: 'fil-PH', vi: 'vi',
}

export default function Deadline() {
  const { t, language } = useLanguage()
  const [start, setStart] = useState('')
  const [days, setDays] = useState('')
  const [bizOnly, setBizOnly] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const calculate = () => {
    const n = parseInt(days, 10)
    const d = new Date(`${start}T00:00:00`)
    if (!start || isNaN(n) || isNaN(d.getTime())) { setResult(null); return }
    if (bizOnly) {
      let added = 0
      while (added < n) {
        d.setDate(d.getDate() + 1)
        const wd = d.getDay()
        if (wd !== 0 && wd !== 6) added++
      }
    } else {
      d.setDate(d.getDate() + n)
    }
    setResult(d.toLocaleDateString(DATE_LOCALE[language] || 'en-US',
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
  }

  return (
    <>
      <SkipLink />
      <LanguageStrip />
      <SiteHeader />

      <header className="topic-page-hero" role="banner" data-readable>
        <div className="topic-page-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">{t('nav.home')}</Link> · {t('deadline.crumb')}
          </nav>
          <div className="topic-hero-icon-wrap" aria-hidden="true">
            <Icon name="calendar" size={36} />
          </div>
          <div className="section-head">
            <h1 className="serif topic-page-title">{t('deadline.title')}</h1>
            <ReadAloud id="deadline" />
          </div>
          <p className="topic-page-sub">{t('deadline.sub')}</p>
        </div>
      </header>

      <main id="main" className="section section-cream">
        <div className="section-inner" style={{ maxWidth: 620 }}>
          <div className="program-card">
            <div className="deadline-field">
              <label htmlFor="dl-start">{t('deadline.startDate')}</label>
              <input id="dl-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="deadline-field">
              <label htmlFor="dl-days">{t('deadline.days')}</label>
              <input id="dl-days" type="number" min="1" inputMode="numeric" value={days}
                     onChange={(e) => setDays(e.target.value)} placeholder="30" />
            </div>
            <label className="deadline-check">
              <input type="checkbox" checked={bizOnly} onChange={(e) => setBizOnly(e.target.checked)} />
              <span>{t('deadline.bizOnly')}</span>
            </label>
            <button type="button" className="btn btn-midnight" style={{ width: '100%', minHeight: '3.2rem' }}
                    onClick={calculate} disabled={!start || !days}>
              {t('deadline.calc')}
            </button>

            {result && (
              <div className="deadline-result" role="status">
                <p className="deadline-result-label">{t('deadline.result')}</p>
                <p className="deadline-result-date serif">{result}</p>
              </div>
            )}
          </div>

          <p className="deadline-disclaimer">{t('deadline.disclaimer')}</p>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
