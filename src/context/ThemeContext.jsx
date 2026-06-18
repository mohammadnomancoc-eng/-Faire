/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { themeTokens } from '../lib/themeTokens'

const ThemeContext = createContext(null)

const SYSTEM_THEME = 'system'
const LIGHT_THEME = 'light'
const DARK_THEME = 'dark'

const getStoredTheme = () => {
  if (typeof window === 'undefined') return SYSTEM_THEME
  return window.localStorage.getItem('theme') || SYSTEM_THEME
}

const getSystemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? DARK_THEME
    : LIGHT_THEME

const getResolvedTheme = (theme) => {
  if (theme === SYSTEM_THEME) return getSystemTheme()
  return theme
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState(getResolvedTheme(theme))

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      const nextResolvedTheme = getResolvedTheme(theme)
      setResolvedTheme(nextResolvedTheme)
      document.documentElement.classList.toggle('dark', nextResolvedTheme === DARK_THEME)
      document.documentElement.classList.toggle('light', nextResolvedTheme === LIGHT_THEME)
      document.documentElement.dataset.theme = nextResolvedTheme
      document.documentElement.style.setProperty('color-scheme', nextResolvedTheme)
      window.localStorage.setItem('theme', theme)

      const tokens = themeTokens[nextResolvedTheme] || themeTokens.dark
      Object.entries(tokens).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value)
      })
    }

    applyTheme()

    const handleSystemChange = () => {
      if (theme === SYSTEM_THEME) {
        applyTheme()
      }
    }

    mediaQuery.addEventListener?.('change', handleSystemChange)
    mediaQuery.addListener?.(handleSystemChange)

    return () => {
      mediaQuery.removeEventListener?.('change', handleSystemChange)
      mediaQuery.removeListener?.(handleSystemChange)
    }
  }, [theme])

  const value = useMemo(
    () => ({ theme, setTheme, resolvedTheme, setResolvedTheme }),
    [theme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
