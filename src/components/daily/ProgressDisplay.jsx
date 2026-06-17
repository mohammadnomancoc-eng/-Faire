import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProgressBar } from '../shared/ProgressBar'
import { ProgressCircle } from '../shared/ProgressCircle'
import { cn } from '../../lib/cn'

const celebrationItems = [
  { left: 10, color: '#FF5CE8' },
  { left: 22, color: '#5C9CFF' },
  { left: 35, color: '#7CFF8A' },
  { left: 48, color: '#FFD45C' },
  { left: 60, color: '#FF8C5C' },
  { left: 72, color: '#A56CFF' },
  { left: 85, color: '#4CE0FF' },
]

export function ProgressDisplay({ percentage, viewMode, setViewMode, label, compact = false }) {
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    let timer
    if (percentage === 100) {
      setShowCelebration(true)
      timer = window.setTimeout(() => setShowCelebration(false), 5000)
    } else {
      setShowCelebration(false)
    }
    return () => window.clearTimeout(timer)
  }, [percentage])

    return (
    <div className={cn(!compact && 'mb-6', 'relative')}>
      {label && (
        <p className="text-sm font-medium text-slate mb-3">{label}</p>
      )}
      <div className="flex gap-2 mb-5">
        <button
          type="button"
          onClick={() => setViewMode('circle')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300',
            viewMode === 'circle'
              ? 'bg-royal/20 text-white border border-royal/30'
              : 'bg-white/[0.04] text-slate border border-white/[0.06] hover:text-white'
          )}
        >
          Circle
        </button>
        <button
          type="button"
          onClick={() => setViewMode('bar')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300',
            viewMode === 'bar'
              ? 'bg-royal/20 text-white border border-royal/30'
              : 'bg-white/[0.04] text-slate border border-white/[0.06] hover:text-white'
          )}
        >
          Bar
        </button>
      </div>

      {/* Celebration banner — sits above the visualization */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex justify-center mb-4"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-success/15 border border-success/25 px-5 py-2 text-sm font-semibold text-success shadow-lg backdrop-blur-sm">
              🎉 Goal complete!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex justify-center">
        {/* Confetti — falls over the whole area but behind the badge */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute -top-8 left-0 right-0 bottom-0 overflow-hidden z-0"
            >
              {celebrationItems.map((item, index) => (
                <motion.span
                  key={item.left}
                  initial={{ y: -60, opacity: 0, scale: 0.8 }}
                  animate={{ y: 280, opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 4.8,
                    ease: 'easeOut',
                    delay: index * 0.15,
                  }}
                  style={{
                    left: `${item.left}%`,
                    backgroundColor: item.color,
                  }}
                  className="absolute top-0 h-3 w-10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.18)]"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress visualization */}
        <div className="relative z-10">
          {viewMode === 'circle' ? (
            <ProgressCircle percentage={percentage} />
          ) : (
            <div className="w-full max-w-md self-center">
              <ProgressBar percentage={percentage} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Re-export ProgressBar from shared for backwards compat
export { ProgressBar } from '../shared/ProgressBar'
