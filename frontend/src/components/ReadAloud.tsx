import { useEffect, useRef, type MouseEvent } from 'react'
import { useLanguage } from '../lib/translations'
import { useSpeechContext } from '../lib/speech'
import { Icon } from '../lib/icons'

interface Props {
  id: string       // unique id so the button shows the right play/stop state
  text?: string    // explicit text to read; omit to read the nearest [data-readable] section
  dark?: boolean   // light-on-dark style for dark-background sections
}

// Per-section read-aloud button. Reads just that section's visible text.
// Playback is shared site-wide (one section at a time).
// Renders nothing where the browser has no speech support.
export function ReadAloud({ id, text, dark }: Props) {
  const { t, language } = useLanguage()
  const speech = useSpeechContext()
  if (!speech.supported) return null

  const active = speech.speakingId === id
  const btnRef = useRef<HTMLButtonElement>(null)

  // Highlight the readable section while it's being read.
  useEffect(() => {
    const section = btnRef.current?.closest('[data-readable]')
    if (!section) return
    section.classList.toggle('is-reading-section', active)
    return () => section.classList.remove('is-reading-section')
  }, [active])

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    let toRead = text
    if (!toRead) {
      const section = e.currentTarget.closest('[data-readable]')
      if (section) {
        // Strip the read-aloud buttons before reading.
        const clone = section.cloneNode(true) as HTMLElement
        clone.querySelectorAll('.section-speak').forEach((n) => n.remove())
        // Add a period after each block so words don't run together in speech.
        clone
          .querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,tr,blockquote,div')
          .forEach((el) => el.appendChild(document.createTextNode('. ')))
        toRead = (clone.textContent || '').replace(/\s+/g, ' ').replace(/(\.\s*){2,}/g, '. ').trim()
      }
    }
    speech.toggle(id, toRead || '', language)
  }

  return (
    <button
      ref={btnRef}
      type="button"
      className={`section-speak${dark ? ' section-speak--dark' : ''}${active ? ' is-reading' : ''}`}
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? t('speak.stopSection') : t('speak.readSection')}
    >
      <Icon name="volume" size={17} aria-hidden="true" />
      <span>{active ? t('speak.stop') : t('speak.listen')}</span>
    </button>
  )
}