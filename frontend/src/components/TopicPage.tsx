import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SkipLink } from './SkipLink'
import { LanguageStrip } from './LanguageStrip'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { Icon, IconName } from '../lib/icons'
import { useLanguage } from '../lib/translations'
import { ReadAloud } from './ReadAloud'

export interface FAQ {
  q: string
  a: ReactNode
  source: string
  sourceUrl?: string
}

export interface Program {
  name: string
  amount?: string
  meta: string
  body: ReactNode
  cta: string
  ctaUrl?: string
  meta2?: string
}

export interface Step {
  title: string
  body: string
}

export interface QuickNavItem {
  id: string
  label: string
}

export interface TopicPageProps {
  /** URL slug for breadcrumb back-link */
  parentLabel: string
  eyebrow: string
  title: string
  sub: string
  iconName: IconName
  /** Topic identity color, matching this topic's card on the home directory. */
  accent?: string
  quickNav: QuickNavItem[]
  summary: ReactNode
  faqs: FAQ[]
  programs: Program[]
  steps: Step[]
  /** Featured referral card shown in the "Get help" section */
  referral: ReactNode
}

export function TopicPage(props: TopicPageProps) {
  const { parentLabel, eyebrow, title, sub, iconName, accent, quickNav, summary, faqs, programs, steps, referral } = props
  const { t } = useLanguage()

  return (
    <>
      <SkipLink />
      <LanguageStrip />
      <SiteHeader />

      <header className="topic-page-hero" role="banner" data-readable>
        <div className="topic-page-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">{t('nav.home')}</Link> · {parentLabel}
          </nav>
          <div className="topic-hero-icon-wrap" aria-hidden="true" style={accent ? { background: accent } : undefined}>
            <Icon name={iconName} size={36} />
          </div>
          <p className="eyebrow">{eyebrow}</p>
          <div className="section-head">
            <h1 className="serif topic-page-title">{title}</h1>
            <ReadAloud id="topic-hero" />
          </div>
          <p className="topic-page-sub">{sub}</p>
        </div>
      </header>

      <nav className="quick-nav" aria-label="Sections on this page">
        <div className="quick-nav-inner">
          {quickNav.map(({ id, label }) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </div>
      </nav>

      <main id="main" className="topic-content" role="main">
        <div className="topic-content-inner">

          <section className="tc-section" id="summary" aria-labelledby="summary-h" data-readable>
            <p className="tc-eyebrow">{t('topic.summaryEyebrow')}</p>
            <div className="section-head">
              <h2 id="summary-h" className="serif">{t('topic.summaryTitle')}</h2>
              <ReadAloud id="sec-summary" />
            </div>
            <p>{summary}</p>
            <div className="callout">
              <p className="callout-label">{t('topic.startHere')}</p>
              <p>{t('topic.startHereBody')}</p>
            </div>
          </section>

          <section className="tc-section" id="questions" aria-labelledby="questions-h" data-readable>
            <p className="tc-eyebrow">{t('topic.faqEyebrow')}</p>
            <div className="section-head">
              <h2 id="questions-h" className="serif">{t('topic.faqTitle')}</h2>
              <ReadAloud id="sec-questions" />
            </div>
            <div className="faq-grid">
              {faqs.map((faq, i) => (
                <article key={i} className="faq-item" data-readable>
                  <h3 className="faq-q">{faq.q}</h3>
                  <p className="faq-a">{faq.a}</p>
                  <div className="faq-foot">
                    <p className="faq-source">
                      <strong>{t('topic.source')}</strong>{' '}
                      <a href={faq.sourceUrl ?? '#'} className="external" target="_blank" rel="noopener">
                        {faq.source}
                      </a>
                    </p>
                    <ReadAloud id={`faq-${i}`} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="tc-section" id="programs" aria-labelledby="programs-h" data-readable>
            <p className="tc-eyebrow">{t('topic.programsEyebrow')}</p>
            <div className="section-head">
              <h2 id="programs-h" className="serif">{t('topic.programsTitle')}</h2>
              <ReadAloud id="sec-programs" />
            </div>
            <div className="program-grid">
              {programs.map((p, i) => (
                <article key={i} className="program-card" data-readable>
                  <div className="program-head">
                    <h3 className="program-name">{p.name}</h3>
                    {p.amount && <span className="program-amount">{p.amount}</span>}
                  </div>
                  <p className="program-meta">{p.meta}</p>
                  <p className="program-body">{p.body}</p>
                  <div className="program-foot">
                    <a
                      href={p.ctaUrl ?? '#'}
                      className="btn btn-clover external"
                      target="_blank"
                      rel="noopener"
                      style={{ fontSize: '0.92rem', padding: '0.65rem 1.1rem', minHeight: 0 }}
                    >
                      {p.cta}
                    </a>
                    {p.meta2 && <span style={{ fontSize: '0.92rem', color: 'var(--mute)' }}>{p.meta2}</span>}
                    <ReadAloud id={`program-${i}`} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="tc-section" id="action" aria-labelledby="action-h" data-readable>
            <p className="tc-eyebrow">{t('topic.actionEyebrow')}</p>
            <div className="section-head">
              <h2 id="action-h" className="serif">{t('topic.actionTitle')}</h2>
              <ReadAloud id="sec-action" />
            </div>
            <p>{t('topic.actionIntro')}</p>
            <ol className="step-list">
              {steps.map((s, i) => (
                <li key={i}>
                  <strong>{s.title}</strong>
                  {s.body}
                </li>
              ))}
            </ol>
          </section>

          <section className="tc-section" id="help" aria-labelledby="help-h" data-readable>
            <p className="tc-eyebrow">{t('topic.helpEyebrow')}</p>
            <div className="section-head">
              <h2 id="help-h" className="serif">{t('topic.helpTitle')}</h2>
              <ReadAloud id="sec-help" />
            </div>
            <p>{t('topic.helpIntro')}</p>

            {referral}

            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/resources" className="btn btn-clover">{t('topic.seeAll')}</Link>
              <Link to="/chat" className="btn btn-outline">{t('topic.askAnother')}</Link>
            </div>
          </section>

        </div>
      </main>

      <SiteFooter />
    </>
  )
}
