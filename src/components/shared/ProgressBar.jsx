import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { cn } from '../../lib/cn'

export function ProgressBar({ percentage, className, showLabel = true }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    if (inView) setDisplayPct(percentage)
  }, [inView, percentage])

  return (
    <div ref={ref} className={cn('w-full', className)}>
      <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden border border-white/[0.04]">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${percentage}%` : 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'linear-gradient(90deg, #3E71C0, #5A8FD4)',
          }}
        >
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </motion.div>
      </div>
      {showLabel && (
        <p className="text-center mt-2 text-sm font-semibold text-royal-light">
          {inView ? `${displayPct}%` : '0%'}
        </p>
      )}
    </div>
  )
}
