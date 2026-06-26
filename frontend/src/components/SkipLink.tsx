import { useLanguage } from '../lib/translations'

// Keyboard skip link -- lets users jump past the header to main content (WCAG 2.4.1).
export function SkipLink() {
  const { t } = useLanguage()
  return (
    <a href="#main" className="skip-link">
      {t('skip.toMain')}
    </a>
  )
}