import { useState } from 'react'
import { useLanguage, Language } from '../lib/translations'
import { useSpeechContext } from '../lib/speech'
import { Icon } from '../lib/icons'

// Maps UI language to voice-language prefix for ranking the voice list.
const VOICE_PREFIX: Record<Language, string> = {
  en: 'en', es: 'es', zh: 'zh', tl: 'fil', vi: 'vi',
}

// Global read-aloud preferences: playback speed and voice.
// Rendered in the language bar so it applies site-wide.
// Hidden where the browser has no speech support.
export function SpeechSettings() {
  const { supported, rate, setRate, voiceForLang, setVoiceForLang, voices } = useSpeechContext()
  const { t, language } = useLanguage()
  const [open, setOpen] = useState(false)
  if (!supported) return null

  const voiceURI = voiceForLang(language)
  const prefix = VOICE_PREFIX[language]
  const matched = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix))
  const others  = voices.filter((v) => !v.lang.toLowerCase().startsWith(prefix))

  return (
    <div className="speech-settings">
      <button
        type="button"
        className="speech-settings-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={t('speak.settings')}
      >
        <Icon name="volume" size={18} aria-hidden="true" />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="speech-pop" role="dialog" aria-label={t('speak.settings')}>
          <div className="speech-pop-label-row">
            <span className="speech-pop-label">{t('speak.speed')}</span>
            <span className="speech-rate-val">{rate}×</span>
          </div>
          <input
            type="range"
            className="speech-rate"
            min={0.5} max={2} step={0.25}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            aria-label={t('speak.speed')}
          />
          <div className="speech-rate-ends" aria-hidden="true">
            <span>{t('speak.slow')}</span>
            <span>{t('speak.fast')}</span>
          </div>

          <p className="speech-pop-label">{t('speak.voice')}</p>
          <select
            className="speech-voice"
            value={voiceURI}
            onChange={(e) => setVoiceForLang(language, e.target.value)}
            aria-label={t('speak.voice')}
          >
            <option value="">{t('speak.voiceAuto')}</option>
            {matched.length > 0 && (
              <optgroup label={t('speak.voiceForLang')}>
                {matched.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>)}
              </optgroup>
            )}
            {others.length > 0 && (
              <optgroup label={t('speak.voiceAll')}>
                {others.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>)}
              </optgroup>
            )}
          </select>
          {matched.length === 0 && <p className="speech-note">{t('speak.noVoice')}</p>}
        </div>
      )}
    </div>
  )
}