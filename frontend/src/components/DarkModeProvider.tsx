import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

const KEY = 'rwr.dark'

interface DarkModeContextValue {
  dark: boolean
  toggleDark: () => void
}

const DarkModeContext = createContext<DarkModeContextValue | null>(null)

function load(): boolean {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === '1') return true
    if (saved === '0') return false
    // No saved choice yet: follow the visitor's OS setting on first visit.
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  } catch {
    return false
  }
}

// Toggles the `dark` class on <html>, which flips the whole palette (light tan
// surfaces become dark, text becomes light). Persisted across visits. Replaces
// the old high-contrast toggle.
export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(load)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev
      try { localStorage.setItem(KEY, next ? '1' : '0') } catch { /* ignore */ }
      return next
    })
  }

  return (
    <DarkModeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext)
  if (!ctx) throw new Error('useDarkMode must be used within DarkModeProvider')
  return ctx
}
