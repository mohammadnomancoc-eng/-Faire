import { useState } from 'react'
import { cn } from '../../lib/cn'

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const statusClasses = {
  online: 'bg-emerald-500',
  busy: 'bg-rose-500',
  away: 'bg-amber-500',
  offline: 'bg-slate-500',
}

/**
 * Avatar component with image and name initials fallback
 * @param {{ src?: string, alt?: string, name?: string, size?: 'sm' | 'md' | 'lg' | 'xl', status?: 'online' | 'busy' | 'away' | 'offline', className?: string }} props
 */
export function Avatar({
  src,
  alt = 'User Avatar',
  name = '',
  size = 'md',
  status,
  className = '',
}) {
  const [imageError, setImageError] = useState(false)

  const getInitials = (str) => {
    if (!str) return '?'
    const parts = str.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return str.slice(0, 2).toUpperCase()
  }

  const showFallback = !src || imageError

  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-medium select-none ring-2 ring-white/10',
          sizeClasses[size] || sizeClasses.md,
          showFallback ? 'bg-royal/30 text-royal-light border border-royal/40' : 'bg-slate-800'
        )}
      >
        {showFallback ? (
          <span>{getInitials(name || alt)}</span>
        ) : (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-slate-900',
            size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
            statusClasses[status] || statusClasses.offline
          )}
        />
      )}
    </div>
  )
}
