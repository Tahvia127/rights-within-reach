import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Language } from './translations'

// Maps UI language to BCP-47 locale for SpeechSynthesis.
// If the OS has no matching voice, the engine falls back to a default but still
// uses the lang hint -- best possible without a paid voice API.
const VOICE_LOCALE: Record<Language, string> = {
  en: 'en-US',
  es: 'es-US',
  zh: 'zh-CN',
  tl: 'fil-PH',
  vi: 'vi-VN',
  pl: 'pl-PL',
}

export function speechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  )
}

// Chosen rate and voice are persisted per language so switching languages
// recalls the right voice automatically.
function _loadRate(): number {
  try {
    const v = Number(localStorage.getItem('rwr.rate'))
    if (v >= 0.5 && v <= 2) return v
  } catch { /* private mode */ }
  return 1.0
}

function _loadVoiceMap(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem('rwr.voices') || '{}') } catch { return {} }
}

// One utterance plays at a time. speakingId names what's currently playing so
// buttons can show play/stop state and starting one section stops any other.
export function useSpeech() {
  const supported = speechSupported()
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [rate, setRateState] = useState<number>(_loadRate)
  const [voiceByLang, setVoiceByLang] = useState<Record<string, string>>(_loadVoiceMap)

  // Voices load async; getVoices() is often empty until 'voiceschanged'.
  useEffect(() => {
    if (!supported) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel() // never let audio outlive the screen
    }
  }, [supported])

  const setRate = useCallback((r: number) => {
    setRateState(r)
    try { localStorage.setItem('rwr.rate', String(r)) } catch { /* ignore */ }
  }, [])

  const setVoiceForLang = useCallback((lang: Language, uri: string) => {
    setVoiceByLang((prev) => {
      const next = { ...prev, [lang]: uri }
      try { localStorage.setItem('rwr.voices', JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const voiceForLang = useCallback((lang: Language) => voiceByLang[lang] || '', [voiceByLang])

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
    setSpeakingId(null)
  }, [supported])

  const speak = useCallback(
    (id: string, text: string, lang: Language) => {
      if (!supported || !text.trim()) return
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const locale = VOICE_LOCALE[lang] ?? 'en-US'
      utterance.lang = locale

      const pool = voices.length ? voices : window.speechSynthesis.getVoices()
      const wantURI = voiceByLang[lang]
      const chosen = wantURI ? pool.find((v) => v.voiceURI === wantURI) : undefined
      const voice =
        chosen ||
        pool.find((v) => v.lang === locale) ||
        pool.find((v) => v.lang.replace('_', '-').startsWith(locale.slice(0, 2)))
      if (voice) utterance.voice = voice

      utterance.rate = rate
      utterance.onend = () => setSpeakingId((cur) => (cur === id ? null : cur))
      utterance.onerror = () => setSpeakingId((cur) => (cur === id ? null : cur))

      setSpeakingId(id)
      window.speechSynthesis.speak(utterance)
    },
    [supported, voices, rate, voiceByLang]
  )

  const toggle = useCallback(
    (id: string, text: string, lang: Language) => {
      if (speakingId === id) stop()
      else speak(id, text, lang)
    },
    [speakingId, speak, stop]
  )

  return { supported, speakingId, speak, stop, toggle, rate, setRate, voiceForLang, setVoiceForLang, voices }
}

// Shared context so read-aloud is global across the whole site.
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