import { useNavigate } from 'react-router-dom'
import { useBigText } from './BigTextProvider'
import { Icon } from '../lib/icons'
import { useLanguage } from '../lib/translations'

interface Props {
  backTo?: string
  /** Read the latest answer aloud. Omitted when the browser has no speech support. */
  onReadAloud?: () => void
  /** Whether the page read-aloud is currently playing. */
  reading?: boolean
}

// Slim header for the Chat screen: back button, logo, and A+/volume controls.
export function ChatHeader({ backTo = '/', onReadAloud, reading = false }: Props) {
  const navigate = useNavigate()
  const { toggleBigText, bigText } = useBigText()
  const { t } = useLanguage()

  return (
    <header className="chat-header" role="banner">
      <div className="chat-header-left">
        <a
          className="back-btn"
          onClick={(e) => { e.preventDefault(); navigate(backTo) }}
          href={backTo}
          aria-label={t('chat.goBack')}
        >
          <span aria-hidden="true">←</span> {t('chat.back')}
        </a>
        <a
          className="brand"
          onClick={(e) => { e.preventDefault(); navigate('/') }}
          href="/"
          aria-label={t('brand.homeAria')}
        >
          <span className="brand-compact-img" role="img" aria-label="Rights Within Reach" />
        </a>
      </div>
      <div className="chat-header-right">
        <button
          className="big-text-btn"
          onClick={toggleBigText}
          aria-label={t('nav.biggerText')}
          aria-pressed={bigText}
        >
          A+
        </button>
        {onReadAloud && (
          <button
            className="big-text-btn"
            onClick={onReadAloud}
            aria-label={reading ? t('chat.stopReading') : t('chat.readAloud')}
            aria-pressed={reading}
          >
            <Icon name="volume" size={20} />
          </button>
        )}
      </div>
    </header>
  )
}
