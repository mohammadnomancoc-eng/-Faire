import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { cn } from '../../lib/cn'

export function ProgressCircle({ percentage, size = 160, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2 - 4
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  const center = size / 2

  const { ref, inView } = useInView({ triggerOnce: true })
  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    if (inView) setDisplayPct(percentage)
  }, [inView, percentage])

  return (
    <div ref={ref} className="relative inline-flex">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5A8FD4" />
            <stop offset="100%" stopColor="#3E71C0" />
          </linearGradient>
          <filter id="progressGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          transform={`rotate(-90 ${center} ${center})`}
          filter="url(#progressGlow)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-2xl font-bold text-white">
          {inView ? `${displayPct}%` : '0%'}
        </span>
      </div>
    </div>
  )
}

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
