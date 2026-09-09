import { cn } from '../../lib/cn'

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300',
        hover && 'hover:border-royal/40 hover:bg-slate-900/80 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={cn('flex items-center justify-between pb-4 border-b border-white/5 mb-4', className)} {...props}>
      {children}
    </div>
  )
}

Card.Body = function CardBody({ children, className = '', ...props }) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={cn('pt-4 border-t border-white/5 mt-4 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}
