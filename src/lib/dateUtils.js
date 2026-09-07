import { format, isToday, isTomorrow, isYesterday, formatDistanceToNow } from 'date-fns'

/**
 * Formats a date into a human-friendly string (e.g., 'Today', 'Tomorrow', or 'MMM d, yyyy')
 * @param {Date | string | number} date
 * @returns {string}
 */
export function formatFriendlyDate(date) {
  if (!date) return ''
  const target = new Date(date)
  if (isNaN(target.getTime())) return ''

  if (isToday(target)) return 'Today'
  if (isTomorrow(target)) return 'Tomorrow'
  if (isYesterday(target)) return 'Yesterday'

  return format(target, 'MMM d, yyyy')
}

/**
 * Formats a date into a readable short format (e.g., 'May 14')
 * @param {Date | string | number} date
 * @returns {string}
 */
export function formatShortDate(date) {
  if (!date) return ''
  const target = new Date(date)
  if (isNaN(target.getTime())) return ''
  return format(target, 'MMM d')
}

/**
 * Returns relative time string from now (e.g., 'in 3 days', '2 hours ago')
 * @param {Date | string | number} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return ''
  const target = new Date(date)
  if (isNaN(target.getTime())) return ''
  return formatDistanceToNow(target, { addSuffix: true })
}
