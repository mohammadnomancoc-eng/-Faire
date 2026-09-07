import { cn } from '../../lib/cn'

/**
 * Skeleton loading placeholder component
 * @param {{ className?: string, variant?: 'text' | 'circular' | 'rectangular' }} props
 */
export function Skeleton({ className, variant = 'rectangular', ...props }) {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-white/5 border border-white/5',
        variantStyles[variant] || variantStyles.rectangular,
        className
      )}
      {...props}
    />
  )
}
