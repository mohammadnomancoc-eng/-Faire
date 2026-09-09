import { cn } from '../../lib/cn'

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
}

const colorMap = {
  primary: 'border-royal border-t-transparent',
  white: 'border-white border-t-transparent',
  muted: 'border-slate-400 border-t-transparent',
}

/**
 * Animated loading spinner component
 * @param {{ size?: 'sm' | 'md' | 'lg' | 'xl', color?: 'primary' | 'white' | 'muted', className?: string, label?: string }} props
 */
export function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
  label = 'Loading...',
}) {
  return (
    <div role="status" className="inline-flex items-center justify-center">
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeMap[size] || sizeMap.md,
          colorMap[color] || colorMap.primary,
          className
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
