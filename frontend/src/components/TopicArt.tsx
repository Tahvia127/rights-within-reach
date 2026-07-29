type Topic = 'housing' | 'money' | 'repairs' | 'benefits'

// Friendly filled spot-illustrations for the home topic cards (replace the plain
// line icons). They inherit the chip's text color via currentColor, so they read
// white on the colored topic chips. Filler art — swap for richer illustrations.
export function TopicArt({ topic, size = 34 }: { topic: Topic; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 40 40',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (topic) {
    case 'housing':
      return (
        <svg {...p}>
          <path d="M6 19 L20 7 L34 19" />
          <path d="M9 17 V33 H31 V17" />
          <rect x="17" y="24" width="6" height="9" rx="1" fill="currentColor" stroke="none" />
          <circle cx="20" cy="4.5" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'money':
      return (
        <svg {...p}>
          <ellipse cx="20" cy="12" rx="12" ry="5" />
          <path d="M8 12 V22 c0 2.8 5.4 5 12 5 s12-2.2 12-5 V12" />
          <path d="M8 22 V28 c0 2.8 5.4 5 12 5 s12-2.2 12-5 V22" />
          <path d="M20 15.5 v6.5" strokeWidth={2} />
        </svg>
      )
    case 'repairs':
      return (
        <svg {...p}>
          <path d="M25 6 a6 6 0 0 0-8.2 7.8 L7 23.6 8.4 25 l1.4 1.4 L11 27 l1.4 1.4 L14 30 l9.8-9.8 A6 6 0 0 0 33 12 l-4 4-3.5-1-1-3.5 4-4z" fill="currentColor" stroke="none" />
          <circle cx="12" cy="28" r="1.5" fill="var(--midnight)" stroke="none" />
        </svg>
      )
    case 'benefits':
      return (
        <svg {...p}>
          <path d="M20 15 c-1.8-2.6-6-1.4-6 2 0 2.8 6 6 6 6 s6-3.2 6-6 c0-3.4-4.2-4.6-6-2z" fill="currentColor" stroke="none" />
          <path d="M7 25 c3.5-2.4 7-2.4 11.5-.2 3.6 1.7 7 1 9.5-1.6" />
          <path d="M10 27.5 V32 M15 28.5 V32.5 M20 29 V33 M25 28 V32.5" strokeWidth={2} />
        </svg>
      )
  }
}
