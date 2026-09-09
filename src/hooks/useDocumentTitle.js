import { useEffect } from 'react'

/**
 * Custom hook to dynamically update document title
 * @param {string} title - The title text to append
 * @param {string} [baseTitle='À Faire'] - The base application title
 */
export function useDocumentTitle(title, baseTitle = 'À Faire') {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title ? `${title} | ${baseTitle}` : baseTitle

    return () => {
      document.title = previousTitle
    }
  }, [title, baseTitle])
}
