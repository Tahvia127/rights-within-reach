import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { BigTextProvider } from './components/BigTextProvider'
import { LanguageProvider } from './lib/translations'
import { SpeechProvider } from './lib/speech'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SpeechProvider>
          <BigTextProvider>
            <App />
          </BigTextProvider>
        </SpeechProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
