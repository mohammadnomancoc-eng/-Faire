import { cn } from '../../lib/cn'

/**
 * Keyboard key badge indicator
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export function Kbd({ children, className = '' }) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-300 bg-white/10 border border-white/15 rounded shadow-sm',
        className
      )}
    >
      {children}
    </kbd>
  )
}
