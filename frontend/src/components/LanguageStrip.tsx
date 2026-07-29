import { useLanguage, LANGUAGES, Language } from '../lib/translations'
import { SpeechSettings } from './SpeechSettings'

export function LanguageStrip() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="lang-strip" role="navigation" aria-label={t('language.selectAria')}>
      <span className="label">{t('language.label')}</span>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          className={language === code ? 'active' : ''}
          onClick={() => setLanguage(code as Language)}
          aria-pressed={language === code}
          aria-label={label}
        >
          {label}
        </button>
      ))}
      <SpeechSettings />
    </div>
  )
}
