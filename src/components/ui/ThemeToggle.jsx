import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/cn'

export function ThemeToggle({ compact = false, className }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'

  const handleToggle = () => setTheme(isDark ? 'light' : 'dark')

  /* ── Compact icon-only button (for sidebar / mobile bar) ── */
  if (compact) {
    return (
      <button
        id="theme-toggle-compact"
        type="button"
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        onClick={handleToggle}
        className={cn(
          'relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300',
          'border border-base bg-page-accent',
          'hover:border-primary/40 hover:bg-primary/10',
          'focus:outline-none focus:ring-2 focus:ring-primary/30',
          'active:scale-95',
          className
        )}
      >
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={cn(
            'text-primary',
            isDark ? 'text-royal-light' : 'text-amber-400'
          )}
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </motion.div>
      </button>
    )
  }

  /* ── Full pill toggle (for navbar) ── */
  return (
    <button
      id="theme-toggle"
      type="button"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={handleToggle}
      className={cn(
        'relative inline-flex h-9 w-[72px] items-center rounded-full p-1',
        'border border-base bg-page-accent',
        'hover:border-primary/40',
        'focus:outline-none focus:ring-2 focus:ring-primary/30',
        'transition-colors duration-500 active:scale-[0.97]',
        isDark ? 'bg-[rgba(62,113,192,0.12)]' : 'bg-[rgba(251,191,36,0.10)]',
        className
      )}
    >
      {/* Track background glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={
          isDark
            ? { background: 'rgba(62, 113, 192, 0.15)' }
            : { background: 'rgba(251, 191, 36, 0.12)' }
        }
        transition={{ duration: 0.4 }}
      />

      {/* Sun icon — left side */}
      <span
        className={cn(
          'relative z-10 flex items-center justify-center w-7 h-7 transition-all duration-300',
          isDark ? 'opacity-40 text-slate' : 'opacity-100 text-amber-400'
        )}
      >
        <Sun className="w-3.5 h-3.5" />
      </span>

      {/* Moon icon — right side */}
      <span
        className={cn(
          'relative z-10 flex items-center justify-center w-7 h-7 transition-all duration-300',
          isDark ? 'opacity-100 text-royal-light' : 'opacity-40 text-slate'
        )}
      >
        <Moon className="w-3.5 h-3.5" />
      </span>

      {/* Animated thumb */}
      <motion.span
        className={cn(
          'absolute top-1 h-7 w-7 rounded-full shadow-md flex items-center justify-center',
          isDark
            ? 'bg-[#1e3a6e] border border-royal/30'
            : 'bg-white border border-amber-200'
        )}
        animate={{ x: isDark ? 37 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <motion.div
          key={isDark ? 'thumb-moon' : 'thumb-sun'}
          initial={{ rotate: -30, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className={isDark ? 'text-royal-light' : 'text-amber-500'}
        >
          {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </motion.div>
      </motion.span>
    </button>
  )
}
