import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'

export function EmptyState({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card flex flex-col items-center justify-center p-8 text-center border-dashed border-white/10 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-royal/10 border border-royal/20 flex items-center justify-center text-royal-light mb-4 shadow-inner">
        <Icon className="w-7 h-7 text-royal-light" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
