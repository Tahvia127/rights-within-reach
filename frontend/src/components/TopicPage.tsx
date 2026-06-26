import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SkipLink } from './SkipLink'
import { LanguageStrip } from './LanguageStrip'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { Icon, IconName } from '../lib/icons'

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
  quickNav: QuickNavItem[]
  summary: ReactNode
  faqs: FAQ[]
  programs: Program[]
  steps: Step[]
  /** Featured referral card shown in the "Get help" section */
  referral: ReactNode
}

export function TopicPage(props: TopicPageProps) {
  const { parentLabel, eyebrow, title, sub, iconName, quickNav, summary, faqs, programs, steps, referral } = props

  return (
    <>
      <SkipLink />
      <LanguageStrip />
      <SiteHeader />

      <header className="topic-page-hero" role="banner">
        <div className="topic-page-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link> · {parentLabel}
          </nav>
          <div className="topic-hero-row">
            <div className="topic-hero-icon-wrap" aria-hidden="true">
              <Icon name={iconName} size={36} />
            </div>
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="serif topic-page-title">{title}</h1>
            </div>
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

          <section className="tc-section" id="summary" aria-labelledby="summary-h">
            <p className="tc-eyebrow">Quick summary</p>
            <h2 id="summary-h" className="serif">What you need to know.</h2>
            <p>{summary}</p>
            <div className="callout">
              <p className="callout-label">★ Start here</p>
              <p>If you only have time to read one thing, read the FAQ below. Each answer cites the law it comes from.</p>
            </div>
          </section>

          <section className="tc-section" id="questions" aria-labelledby="questions-h">
            <p className="tc-eyebrow">Common questions</p>
            <h2 id="questions-h" className="serif">The questions people ask most.</h2>
            {faqs.map((faq, i) => (
              <article key={i} className="faq-item">
                <h3 className="faq-q">{faq.q}</h3>
                <p className="faq-a">{faq.a}</p>
                <p className="faq-source">
                  <strong>Source:</strong>{' '}
                  <a href={faq.sourceUrl ?? '#'} className="external" target="_blank" rel="noopener">
                    {faq.source}
                  </a>
                </p>
              </article>
            ))}
          </section>

          <section className="tc-section" id="programs" aria-labelledby="programs-h">
            <p className="tc-eyebrow">Programs &amp; rules</p>
            <h2 id="programs-h" className="serif">What is available and how to apply.</h2>
            {programs.map((p, i) => (
              <article key={i} className="program-card">
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
                </div>
              </article>
            ))}
          </section>

          <section className="tc-section" id="action" aria-labelledby="action-h">
            <p className="tc-eyebrow">How to use this information</p>
            <h2 id="action-h" className="serif">Step-by-step next actions.</h2>
            <p>Reading the law is the first step. Here is what to do with what you just learned.</p>
            <ol className="step-list">
              {steps.map((s, i) => (
                <li key={i}>
                  <strong>{s.title}</strong>
                  {s.body}
                </li>
              ))}
            </ol>
          </section>

          <section className="tc-section" id="help" aria-labelledby="help-h">
            <p className="tc-eyebrow">Get help</p>
            <h2 id="help-h" className="serif">Talk to a real person.</h2>
            <p>If your situation is urgent, complicated, or you want someone to review your case, these organizations help Illinois residents for free.</p>

            {referral}

            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/resources" className="btn btn-clover">See all resources →</Link>
              <Link to="/chat" className="btn btn-outline">Ask another question</Link>
            </div>
          </section>

        </div>
      </main>

      <SiteFooter />
    </>
  )
}
