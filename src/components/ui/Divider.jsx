import { cn } from '../../lib/cn'

/**
 * Divider component with optional label and orientation
 * @param {{ label?: string, orientation?: 'horizontal' | 'vertical', className?: string }} props
 */
export function Divider({ label, orientation = 'horizontal', className = '' }) {
  if (orientation === 'vertical') {
    return <div className={cn('w-[1px] bg-white/10 self-stretch my-1', className)} />
  }

  if (label) {
    return (
      <div className={cn('relative flex items-center py-3 my-2', className)}>
        <div className="flex-grow border-t border-white/10" />
        <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-slate-400 font-medium">
          {label}
        </span>
        <div className="flex-grow border-t border-white/10" />
      </div>
    )
  }

  return <hr className={cn('border-0 border-t border-white/10 my-4', className)} />
}
