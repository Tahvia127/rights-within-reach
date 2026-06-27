import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Language } from './translations'

// Map the app's UI language to a BCP-47 voice locale for the browser
// SpeechSynthesis engine. If the OS has no matching voice (common for Tagalog
// and Vietnamese), the engine falls back to a default voice but still uses the
// `lang` hint, which is the best we can do without a paid voice API.
const VOICE_LOCALE: Record<Language, string> = {
  en: 'en-US',
  es: 'es-US',
  zh: 'zh-CN',
  tl: 'fil-PH',
  vi: 'vi-VN',
}

export function speechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  )
}

/**
 * Read-aloud controller around the browser SpeechSynthesis API.
 *
 * One utterance plays at a time. `speakingId` names whatever is currently
 * playing (an answer index, or 'page'), so a button can show a play/stop state
 * and starting one read-aloud stops any other. Returns `supported: false` when
 * the browser has no speech synthesis, so callers can hide the control.
 */
export function useSpeech() {
  const supported = speechSupported()
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  // Voices load asynchronously; getVoices() is often empty on first call until
  // the 'voiceschanged' event fires. Cache them as they become available.
  useEffect(() => {
    if (!supported) return
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel() // never let audio outlive the screen
    }
  }, [supported])

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
    setSpeakingId(null)
  }, [supported])

  const speak = useCallback(
    (id: string, text: string, lang: Language) => {
      if (!supported || !text.trim()) return
      window.speechSynthesis.cancel() // replace anything already playing

      const utterance = new SpeechSynthesisUtterance(text)
      const locale = VOICE_LOCALE[lang] ?? 'en-US'
      utterance.lang = locale

      const voices = voicesRef.current.length
        ? voicesRef.current
        : window.speechSynthesis.getVoices()
      const voice =
        voices.find((v) => v.lang === locale) ||
        voices.find((v) => v.lang.replace('_', '-').startsWith(locale.slice(0, 2)))
      if (voice) utterance.voice = voice

      utterance.rate = 0.95 // a touch slower — clearer for stressed readers
      utterance.onend = () => setSpeakingId((cur) => (cur === id ? null : cur))
      utterance.onerror = () => setSpeakingId((cur) => (cur === id ? null : cur))

      setSpeakingId(id)
      window.speechSynthesis.speak(utterance)
    },
    [supported]
  )

  const toggle = useCallback(
    (id: string, text: string, lang: Language) => {
      if (speakingId === id) stop()
      else speak(id, text, lang)
    },
    [speakingId, speak, stop]
  )

  return { supported, speakingId, speak, stop, toggle }
}

// Shared controller so read-aloud is global: starting one section (anywhere on
// the site) stops any other, and every button reflects the same playing state.
type SpeechController = ReturnType<typeof useSpeech>
const SpeechContext = createContext<SpeechController | null>(null)

export function SpeechProvider({ children }: { children: ReactNode }) {
  const speech = useSpeech()
  return createElement(SpeechContext.Provider, { value: speech }, children)
}

export function useSpeechContext(): SpeechController {
  const ctx = useContext(SpeechContext)
  if (!ctx) throw new Error('useSpeechContext must be used within SpeechProvider')
  return ctx
}
