import { useState } from 'react'
import { useLanguage } from '../lib/translations'

const ITEMS: { key: string; accent: boolean }[] = [
  { key: 'ticker.free',        accent: false },
  { key: 'ticker.plain',       accent: true  },
  { key: 'ticker.multilingual', accent: false },
  { key: 'ticker.cited',       accent: true  },
  { key: 'ticker.noLogin',     accent: false },
  { key: 'ticker.chicago',     accent: true  },
]

// Scrolling homepage banner with pause/play (WCAG 2.2.2).
export function Ticker() {
  const { t } = useLanguage()
  const [paused, setPaused] = useState(false)

  return (
    <div className={`ticker-wrap${paused ? ' paused' : ''}`} id="ticker-wrap">
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <span key={i} className={item.accent ? 'accent' : ''}>{`${t(item.key)}`}</span>
          ))}
        </div>
      </div>
      <button
        className="ticker-pause-btn"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? t('ticker.play') : t('ticker.pause')}
        aria-pressed={paused}
        title={paused ? t('ticker.play') : t('ticker.pause')}
      >
        {paused
          ? <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" fill="currentColor" /><rect x="14" y="5" width="4" height="14" fill="currentColor" /></svg>}
      </button>
    </div>
  )
}
