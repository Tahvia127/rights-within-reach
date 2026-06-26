import { NavLink, useLocation } from 'react-router-dom'
import { Icon, IconName } from '../lib/icons'
import { useLanguage } from '../lib/translations'

interface NavItem {
  to: string
  labelKey: string
  icon: IconName
  primary?: boolean
}

// Home is reached via the brand logo, so it's not listed here.
const ITEMS: NavItem[] = [
  { to: '/housing',   labelKey: 'bottomnav.housing',  icon: 'home'     },
  { to: '/money',     labelKey: 'bottomnav.money',    icon: 'money'    },
  { to: '/repairs',   labelKey: 'bottomnav.repairs',  icon: 'wrench'   },
  { to: '/benefits',  labelKey: 'bottomnav.benefits', icon: 'benefits' },
  { to: '/resources', labelKey: 'bottomnav.resources',icon: 'book'     },
  { to: '/chat',      labelKey: 'bottomnav.ask',      icon: 'chat', primary: true },
]

// Fixed bottom nav shown on all pages except Chat (which has its own input bar).
export function MovingNav() {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  if (pathname === '/chat') return null

  return (
    <nav className="moving-nav" role="navigation" aria-label={t('bottomnav.aria')}>
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `moving-nav-item${item.primary ? ' primary' : ''}${isActive ? ' active' : ''}`
          }
        >
          <Icon name={item.icon} size={24} className="moving-nav-icon" />
          <span className="moving-nav-label">{t(item.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  )
}