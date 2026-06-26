import { useState } from 'react'

const ITEMS = [
  { text: '✦ Free to use',      accent: false },
  { text: '✦ Plain language',   accent: true  },
  { text: '✦ Multilingual',     accent: false },
  { text: '✦ Cited sources',    accent: true  },
  { text: '✦ No login needed',  accent: false },
  { text: '✦ Built in Chicago', accent: true  },
]

// Scrolling homepage banner with pause/play (WCAG 2.2.2).
export function Ticker() {
  const [paused, setPaused] = useState(false)

  return (
    <div className={`ticker-wrap${paused ? ' paused' : ''}`} id="ticker-wrap">
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <span key={i} className={item.accent ? 'accent' : ''}>{item.text}</span>
          ))}
        </div>
      </div>
      <button
        className="ticker-pause-btn"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Play the scrolling banner' : 'Pause the scrolling banner'}
        aria-pressed={paused}
        title={paused ? 'Play' : 'Pause'}
      >
        {paused ? '▶' : '⏸'}
      </button>
    </div>
  )
}