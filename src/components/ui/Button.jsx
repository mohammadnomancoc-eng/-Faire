import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn',
  ghost: 'btn-ghost',
}

export function Button({
  children,
  variant = 'primary',
  className,
  icon: Icon,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(variants[variant], className)}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  )
}
