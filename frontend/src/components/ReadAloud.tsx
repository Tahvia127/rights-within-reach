import type { MouseEvent } from 'react'
import { useLanguage } from '../lib/translations'
import { useSpeechContext } from '../lib/speech'
import { Icon } from '../lib/icons'

interface Props {
  /** Unique id for this section so its button shows the right play/stop state. */
  id: string
  /** Explicit text to read. If omitted, reads the nearest [data-readable] section. */
  text?: string
  /** Use the light-on-dark style for dark-background sections. */
  dark?: boolean
}

/**
 * Per-section read-aloud button. Drop it inside a section marked
 * `data-readable` and it reads just that section's visible text — so people can
 * listen to one part instead of the whole page. Playback is shared site-wide
 * (one section at a time). Renders nothing where the browser has no speech.
 */
export function ReadAloud({ id, text, dark }: Props) {
  const { t, language } = useLanguage()
  const speech = useSpeechContext()
  if (!speech.supported) return null

  const active = speech.speakingId === id

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    let toRead = text
    if (!toRead) {
      const section = e.currentTarget.closest('[data-readable]')
      if (section) {
        // Clone so we can strip the read-aloud buttons before reading the text.
        const clone = section.cloneNode(true) as HTMLElement
        clone.querySelectorAll('.section-speak').forEach((n) => n.remove())
        toRead = (clone.textContent || '').replace(/\s+/g, ' ').trim()
      }
    }
    speech.toggle(id, toRead || '', language)
  }

  return (
    <button
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
