import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

export function GlassCard({
  children,
  className,
  hover = false,
  tilt = false,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: '0 0 40px rgba(62, 113, 192, 0.15)',
              borderColor: 'rgba(62, 113, 192, 0.3)',
            }
          : undefined
      }
      className={cn(
        hover ? 'glass-card-hover' : 'glass-card',
        tilt && 'hover:scale-[1.01]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
