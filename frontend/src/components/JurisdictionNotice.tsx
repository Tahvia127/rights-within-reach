import { Link } from 'react-router-dom'
import { useLanguage } from '../lib/translations'

// The static topic/resource pages are still Illinois-focused, but the triage
// funnel lets users pick another state (persisted in `rwr.state`). This banner
// is shown to non-Illinois users so they aren't silently reading the wrong
// jurisdiction's guides, and points them to the state-aware chat.
const STATE_NAMES: Record<string, string> = {
  CA: 'California', MO: 'Missouri', TX: 'Texas', NY: 'New York',
}

export function JurisdictionNotice() {
  const { t } = useLanguage()
  let state = 'IL'
  try { state = localStorage.getItem('rwr.state') || 'IL' } catch { /* localStorage unavailable */ }
  const name = STATE_NAMES[state]
  if (!name) return null // Illinois (or unknown) — these pages already apply

  return (
    <div className="jurisdiction-notice" role="note">
      <p>
        <strong>{name}:</strong> {t('jurisdiction.notice')}{' '}
        <Link to="/chat">{t('jurisdiction.cta')} →</Link>
      </p>
    </div>
  )
}
