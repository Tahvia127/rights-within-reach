import { useDarkMode } from './DarkModeProvider'
import { useLanguage } from '../lib/translations'

// Header button that flips the whole site between light and dark.
// Shows a moon in light mode (tap to go dark) and a sun in dark mode.
export function DarkModeToggle() {
  const { dark, toggleDark } = useDarkMode()
  const { t } = useLanguage()

  return (
    <button
      className="contrast-btn"
      onClick={toggleDark}
      aria-label={t('nav.darkMode')}
      aria-pressed={dark}
      title={t('nav.darkMode')}
    >
      {dark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}
