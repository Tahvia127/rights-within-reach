import { useRef, useState } from 'react'
import { useLanguage, Language } from '../lib/translations'

// Map the UI language to a BCP-47 locale for the speech recognizer.
const RECOG_LOCALE: Record<Language, string> = {
  en: 'en-US', es: 'es-US', zh: 'zh-CN', tl: 'fil-PH', vi: 'vi-VN',
}

// SpeechRecognition is unprefixed in some browsers, webkit-prefixed in others,
// and absent in a few (e.g. Firefox), we hide the button when it's missing.
function getSpeechRecognition(): any {
  if (typeof window === 'undefined') return null
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null
}

interface Props {
  language: Language
  /** Called when listening starts, so the caller can snapshot the current input. */
  onStart: () => void
  /** Called with the (possibly interim) transcript; isFinal marks the last result. */
  onResult: (text: string, isFinal: boolean) => void
  disabled?: boolean
}

/**
 * "Ask by voice" button. Transcribes speech in the current language via the free
 * browser SpeechRecognition API (no backend). Renders nothing where unsupported.
 */
export function MicButton({ language, onStart, onResult, disabled }: Props) {
  const { t } = useLanguage()
  const [listening, setListening] = useState(false)
  const recRef = useRef<any>(null)
  const SR = getSpeechRecognition()
  if (!SR) return null

  const stop = () => {
    try { recRef.current?.stop() } catch { /* ignore */ }
    setListening(false)
  }

  const toggle = () => {
    if (listening) { stop(); return }
    const rec = new SR()
    rec.lang = RECOG_LOCALE[language] ?? 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e: any) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript
      onResult(text.trim(), e.results[e.results.length - 1].isFinal)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    onStart()
    setListening(true)
    try { rec.start() } catch { setListening(false) }
  }

  const label = listening ? t('chat.stopListening') : t('chat.speakQuestion')
  return (
    <button
      type="button"
      className={`mic-btn${listening ? ' listening' : ''}`}
      onClick={toggle}
      disabled={disabled}
      aria-label={label}
      aria-pressed={listening}
      title={label}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    </button>
  )
}
