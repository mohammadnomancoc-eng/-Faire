/**
 * Clamps a number between a minimum and maximum boundary
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculates percentage with safe division and rounding
 * @param {number} current
 * @param {number} total
 * @param {number} [decimals=0]
 * @returns {number}
 */
export function calculatePercentage(current, total, decimals = 0) {
  if (!total || total <= 0) return 0
  const ratio = (current / total) * 100
  return Number(clamp(ratio, 0, 100).toFixed(decimals))
}

/**
 * Formats a number with compact notation (e.g. 1.2k, 4.5M)
 * @param {number} num
 * @returns {string}
 */
export function formatCompactNumber(num) {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(num)
}
