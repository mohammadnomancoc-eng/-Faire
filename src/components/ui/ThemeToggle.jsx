import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const ICON_SIZE = 18

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const activeTheme = theme === 'system' ? resolvedTheme : theme

  const handleToggle = () => {
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className="relative inline-flex h-11 w-20 items-center justify-between rounded-full border border-base bg-page-accent p-1 shadow-glass transition-all duration-300 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25"
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={activeTheme === 'dark' ? { backgroundColor: 'rgba(255, 255, 255, 0.08)' } : { backgroundColor: 'rgba(15, 23, 42, 0.08)' }}
        transition={{ duration: 0.35 }}
      />
      <motion.span
        className="relative z-10 h-9 w-9 rounded-full bg-surface text-primary flex items-center justify-center shadow-soft"
        animate={activeTheme === 'dark' ? { x: 0, rotate: -15, scale: 1.05 } : { x: 28, rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, duration: 0.35 }}
      >
        {activeTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </motion.span>
      {theme === 'system' && (
        <span className="pointer-events-none absolute inset-y-0 right-0 w-1/2 rounded-full bg-royal/10" />
      )}
    </button>
  )
}
