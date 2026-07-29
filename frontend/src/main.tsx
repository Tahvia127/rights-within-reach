import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { BigTextProvider } from './components/BigTextProvider'
import { DarkModeProvider } from './components/DarkModeProvider'
import { LanguageProvider } from './lib/translations'
import { SpeechProvider } from './lib/speech'
import './styles/global.css'

// Register the service worker for offline/installable support. Production only, // in dev it would cache stale assets and interfere with Vite HMR.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* offline unavailable */ })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SpeechProvider>
          <BigTextProvider>
            <DarkModeProvider>
              <App />
            </DarkModeProvider>
          </BigTextProvider>
        </SpeechProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
