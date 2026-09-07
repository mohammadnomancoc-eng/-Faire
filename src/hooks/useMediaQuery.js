import { useState, useEffect } from 'react'

/**
 * Custom hook to detect CSS media query match state
 * @param {string} query - CSS media query (e.g. '(min-width: 768px)')
 * @returns {boolean} - Matches state
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQueryList = window.matchMedia(query)
    const listener = (event) => setMatches(event.matches)

    setMatches(mediaQueryList.matches)
    mediaQueryList.addEventListener('change', listener)

    return () => {
      mediaQueryList.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}
