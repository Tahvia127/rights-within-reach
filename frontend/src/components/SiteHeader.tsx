import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useBigText } from './BigTextProvider'
import { DarkModeToggle } from './DarkModeToggle'
import { useLanguage } from '../lib/translations'

const TOPIC_PATHS = ['/housing', '/money', '/repairs', '/benefits']

// Top nav: brand wordmark, page links, A+ toggle, and chat CTA.
// Not used on the Chat screen, which has its own header.
export function SiteHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleBigText, bigText } = useBigText()
  const { t, language } = useLanguage()

  const isTopic = TOPIC_PATHS.includes(location.pathname)

  return (
    <>
    <header className="site-header" role="banner">
      <a
        className="brand"
        onClick={(e) => { e.preventDefault(); navigate('/') }}
        href="/"
        aria-label={t('brand.homeAria')}
      >
        <span className="brand-wordmark-img" role="img" aria-label="Rights Within Reach" />
      </a>
      <nav className="nav-links" role="navigation" aria-label={t('nav.mainAria')}>
        <NavLink to="/" end className={({ isActive }) => 'nav-collapse' + (isActive ? ' active' : '')}>
          {t('nav.home')}
        </NavLink>
        <NavLink to="/housing" className={'nav-collapse' + (isTopic ? ' active' : '')}>
          {t('nav.topics')}
        </NavLink>
        <NavLink to="/resources" className={({ isActive }) => 'nav-collapse' + (isActive ? ' active' : '')}>
          {t('nav.resources')}
        </NavLink>
      </nav>
      <div className="nav-utils">
        <button
          className="big-text-btn"
          onClick={toggleBigText}
          aria-label={t('nav.biggerText')}
          aria-pressed={bigText}
        >
          A+
        </button>
        <DarkModeToggle />
        <NavLink to="/chat" className="cta nav-cta">
          {t('nav.askQuestion')}
        </NavLink>
      </div>
    </header>
    {language !== 'en' && (
      <p className="mt-notice" role="note">{t('mt.notice')}</p>
    )}
    </>
  )
}
