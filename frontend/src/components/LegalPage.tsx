import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SkipLink } from './SkipLink'
import { LanguageStrip } from './LanguageStrip'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { useLanguage } from '../lib/translations'
import { SITE } from '../lib/siteInfo'

interface Props {
  title: string
  /** One-sentence plain-language summary shown under the title. */
  intro: string
  children: ReactNode
}

// Shared shell for the policy pages (privacy, terms, cookies, refunds,
// accessibility, about). The policies are written in English only, so the body
// is marked lang="en" (WCAG 3.1.2) and other languages get a short notice.
export function LegalPage({ title, intro, children }: Props) {
  const { t, language } = useLanguage()
  return (
    <>
      <SkipLink />
      <LanguageStrip />
      <SiteHeader />

      <main id="main" className="legal-page">
        <div className="legal-inner" lang="en">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link> · {title}
          </nav>
          {language !== 'en' && (
            <p className="legal-lang-note" lang={language}>{t('legal.englishOnly')}</p>
          )}
          <h1 className="serif legal-title">{title}</h1>
          <p className="legal-updated">Last updated: {SITE.legalUpdated}</p>
          <p className="legal-intro">{intro}</p>
          {children}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}

/** mailto link for the site contact address. */
export function ContactEmail() {
  return <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
}
