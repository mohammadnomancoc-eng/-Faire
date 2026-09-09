import { useState, useCallback } from 'react'

/**
 * Custom hook to copy text to clipboard with auto-resetting copied state
 * @param {number} [resetInterval=2000] - Duration in ms before resetting copied status
 * @returns {[boolean, (text: string) => Promise<boolean>]}
 */
export function useCopyToClipboard(resetInterval = 2000) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not supported')
        return false
      }

      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), resetInterval)
        return true
      } catch (error) {
        console.warn('Copy to clipboard failed:', error)
        setIsCopied(false)
        return false
      }
    },
    [resetInterval]
  )

  return [isCopied, copy]
}
