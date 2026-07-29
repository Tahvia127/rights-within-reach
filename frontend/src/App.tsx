import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import wordmarkMidnight from './assets/logos/wordmark-midnight.svg'
import wordmarkBone from './assets/logos/wordmark-bone.svg'
import bubbleMidnight from './assets/logos/bubble-midnight.svg'

import Home from './pages/Home'
import Chat from './pages/Chat'
import Housing from './pages/Housing'
import Money from './pages/Money'
import Repairs from './pages/Repairs'
import Benefits from './pages/Benefits'
import Resources from './pages/Resources'
import Deadline from './pages/Deadline'
import { MovingNav } from './components/MovingNav'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Rights Within Reach, Free legal information for Illinois',
  '/chat': 'Chat, Rights Within Reach',
  '/housing': 'Housing & Rent, Rights Within Reach',
  '/money': 'Money & Debt, Rights Within Reach',
  '/repairs': 'Home Repairs, Rights Within Reach',
  '/benefits': 'Public Benefits, Rights Within Reach',
  '/resources': 'Resources, Rights Within Reach',
}

// Updates page title and scrolls to top on each route change (WCAG 2.4.2).
// Also focuses #main so screen-reader users land at the right place.
function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = PAGE_TITLES[pathname] ?? 'Rights Within Reach'
    window.scrollTo({ top: 0 })
    const main = document.getElementById('main')
    if (main) {
      main.setAttribute('tabindex', '-1')
      main.focus({ preventScroll: true })
    }
  }, [pathname])

  return null
}

// Sets logo SVGs as CSS variables on :root so components can use
// background-image: var(--logo-...). Vite URLs ensure proper asset hashing.
function LogoVarsInjector() {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--logo-wordmark-midnight', `url("${wordmarkMidnight}")`)
    root.style.setProperty('--logo-wordmark-bone', `url("${wordmarkBone}")`)
    root.style.setProperty('--logo-bubble-midnight', `url("${bubbleMidnight}")`)
  }, [])
  return null
}

export default function App() {
  return (
    <>
      <LogoVarsInjector />
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/housing" element={<Housing />} />
        <Route path="/money" element={<Money />} />
        <Route path="/repairs" element={<Repairs />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/deadline" element={<Deadline />} />
      </Routes>
      <MovingNav />
    </>
  )
}