import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

export function Logo({ className = 'h-9 w-9 text-primary', animated = true }) {
  const Wrapper = animated ? motion.svg : 'svg'
  const motionProps = animated
    ? {
        initial: { rotate: -10, opacity: 0 },
        animate: { rotate: 0, opacity: 1 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        whileHover: {
          filter: 'drop-shadow(0 0 12px rgba(62, 113, 192, 0.6))',
          scale: 1.05,
        },
      }
    : {}

  return (
    <Wrapper
      viewBox="0 0 48 48"
      className={cn('shrink-0', className)}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="À Faire logo"
      {...motionProps}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5A8FD4" />
          <stop offset="100%" stopColor="#3E71C0" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#logoGrad)" />
      <path
        d="M14 12 L14 36 L18 36 L18 24 L26 36 L31 36 L22 23 L30 12 L25 12 L18 21 L18 12 Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M32 28 L36 32 L40 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logoGlow)"
      />
    </Wrapper>
  )
}

export function Wordmark({ className }) {
  return (
    <div className={cn('flex flex-col leading-tight', className)}>
      <span className="font-display text-xl font-bold tracking-[0.08em] text-primary">
        À Faire
      </span>
      <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-secondary">
        Where Intent Becomes Action
      </span>
    </div>
  )
}
