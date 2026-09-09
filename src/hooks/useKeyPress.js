import { useEffect } from 'react'

/**
 * Custom hook to listen for specific key presses
 * @param {string | string[]} targetKeys - Key or array of keys to listen for (e.g. 'Escape', ['Control', 'k'])
 * @param {(event: KeyboardEvent) => void} callback - Handler function
 * @param {boolean} [enabled=true] - Whether the listener is active
 */
export function useKeyPress(targetKeys, callback, enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const keys = Array.isArray(targetKeys) ? targetKeys : [targetKeys]

    const handleKeyDown = (event) => {
      if (keys.includes(event.key)) {
        callback(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [targetKeys, callback, enabled])
}
