import { createContext, useContext, useState, ReactNode } from 'react'

interface BigTextContextValue {
  bigText: boolean
  toggleBigText: () => void
}

const BigTextContext = createContext<BigTextContextValue | null>(null)

// Toggles the `big-text` class on <html> to scale all rem-based text up.
export function BigTextProvider({ children }: { children: ReactNode }) {
  const [bigText, setBigText] = useState(false)

  const toggleBigText = () => {
    setBigText((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('big-text', next)
      return next
    })
  }

  return (
    <BigTextContext.Provider value={{ bigText, toggleBigText }}>
      {children}
    </BigTextContext.Provider>
  )
}

export function useBigText() {
  const ctx = useContext(BigTextContext)
  if (!ctx) throw new Error('useBigText must be used within BigTextProvider')
  return ctx
}