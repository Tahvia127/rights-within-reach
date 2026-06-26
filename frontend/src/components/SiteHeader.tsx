import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useBigText } from './BigTextProvider'
import { useLanguage } from '../lib/translations'

const TOPIC_PATHS = ['/housing', '/money', '/repairs', '/benefits']

// Top nav: brand wordmark, page links, A+ toggle, and chat CTA.
// Not used on the Chat screen, which has its own header.
export function SiteHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleBigText, bigText } = useBigText()
  const { t } = useLanguage()

  const isTopic = TOPIC_PATHS.includes(location.pathname)

  return (
    <header className="site-header" role="banner">
      <a
        className="brand"
        onClick={(e) => { e.preventDefault(); navigate('/') }}
        href="/"
        aria-label={t('brand.homeAria')}
      >
        <span className="brand-wordmark-img" role="img" aria-label="Rights Within Reach" />
      </a>
      <nav className="nav-links" role="navigation" aria-label="Main">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          {t('nav.home')}
        </NavLink>
        <NavLink to="/housing" className={isTopic ? 'active' : ''}>
          {t('nav.topics')}
        </NavLink>
        <NavLink to="/resources" className={({ isActive }) => isActive ? 'active' : ''}>
          {t('nav.resources')}
        </NavLink>
        <button
          className="big-text-btn"
          onClick={toggleBigText}
          aria-label={t('nav.biggerText')}
          aria-pressed={bigText}
        >
          A+
        </button>
        <NavLink to="/chat" className="cta">
          {t('nav.askQuestion')}
        </NavLink>
      </nav>
    </header>
  )
}
