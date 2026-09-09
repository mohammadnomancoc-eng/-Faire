import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn'

const variantConfig = {
  info: {
    icon: Info,
    styles: 'bg-blue-500/10 border-blue-500/30 text-blue-200',
    iconColor: 'text-blue-400',
  },
  success: {
    icon: CheckCircle2,
    styles: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
    iconColor: 'text-emerald-400',
  },
  warning: {
    icon: AlertTriangle,
    styles: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
    iconColor: 'text-amber-400',
  },
  error: {
    icon: AlertCircle,
    styles: 'bg-rose-500/10 border-rose-500/30 text-rose-200',
    iconColor: 'text-rose-400',
  },
}

/**
 * Alert banner notification component
 * @param {{ title?: string, children: React.ReactNode, variant?: 'info' | 'success' | 'warning' | 'error', dismissible?: boolean, onClose?: () => void, className?: string }} props
 */
export function Alert({
  title,
  children,
  variant = 'info',
  dismissible = false,
  onClose,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(true)
  const config = variantConfig[variant] || variantConfig.info
  const Icon = config.icon

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md relative',
            config.styles,
            className
          )}
        >
          <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', config.iconColor)} />
          <div className="flex-1 text-sm">
            {title && <h5 className="font-semibold mb-1 text-slate-100">{title}</h5>}
            <div className="opacity-90 leading-relaxed">{children}</div>
          </div>
          {dismissible && (
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1 rounded-lg"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
