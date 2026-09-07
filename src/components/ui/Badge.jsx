import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const badgeVariants = {
  default: 'bg-white/10 text-slate-200 border-white/10',
  primary: 'bg-royal/20 text-royal-light border-royal/30',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon: Icon,
  ...props
}) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors',
        badgeVariants[variant] || badgeVariants.default,
        sizeClasses,
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </motion.span>
  )
}
