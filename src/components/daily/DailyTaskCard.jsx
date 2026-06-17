import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, Bell, Trash2, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '../../lib/cn'

// Inline confetti to avoid react-confetti ESM/CJS mismatch (React Error #130)
const CONFETTI_COLORS = ['#3E71C0', '#5A8FD4', '#FFD45C', '#7CFF8A', '#FF8C5C', '#A56CFF']
function InlineConfetti({ show }) {
  if (!show) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-50">
      {CONFETTI_COLORS.map((color, i) => (
        <motion.span
          key={i}
          initial={{ y: -10, opacity: 0, x: `${15 + i * 13}%`, rotate: 0, scale: 0.8 }}
          animate={{ y: 60, opacity: [0, 1, 1, 0], rotate: 360, scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.8, delay: i * 0.08, ease: 'easeOut' }}
          style={{ backgroundColor: color, position: 'absolute', top: 0 }}
          className="w-2 h-2 rounded-sm"
        />
      ))}
    </div>
  )
}

// Format "14:30:00" or "14:30" to "2:30 PM"
function formatTime12(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
}

function TaskCheckbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'relative w-6 h-6 rounded-lg border-2 shrink-0 transition-all duration-300 flex items-center justify-center',
        checked
          ? 'bg-royal border-royal shadow-glow'
          : 'border-white/20 hover:border-royal/50 hover:bg-royal/10'
      )}
      aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
    >
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

export function DailyTaskCard({ task, onToggle, onDelete, sortable = false }) {
  const [showConfetti, setShowConfetti] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: !sortable,
  })

  const handleToggle = useCallback(() => {
    if (!task.is_done) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
    onToggle(task)
  }, [task, onToggle])

  const style = sortable
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : undefined

  const hasTimeRange = task.start_time || task.end_time
  const hasReminder = task.reminder_time

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: task.is_done ? 0.65 : 1,
          y: 0,
          scale: isDragging ? 1.02 : 1,
        }}
        whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
        className={cn(
          'relative glass-card p-4 flex items-start gap-3 group overflow-hidden',
          task.is_done && 'border-royal/10',
          !task.is_done && 'border-l-2 border-l-royal/40',
          isDragging && 'shadow-glow z-10'
        )}
      >
        <InlineConfetti show={showConfetti} />

        {sortable && (
          <button
            type="button"
            className="mt-0.5 text-slate/40 hover:text-slate cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}

        <TaskCheckbox checked={task.is_done} onChange={handleToggle} />

        <div className="flex-1 min-w-0">
          <motion.h3
            className={cn(
              'font-medium text-white transition-all duration-500',
              task.is_done && 'line-through text-slate'
            )}
            animate={task.is_done ? { opacity: 0.7 } : { opacity: 1 }}
          >
            {task.title}
          </motion.h3>
          {task.description && (
            <p className="text-sm text-slate mt-1 line-clamp-2">{task.description}</p>
          )}

          {/* Time metadata row */}
          {(hasTimeRange || hasReminder) && (
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {hasTimeRange && (
                <span className="inline-flex items-center gap-1.5 text-xs text-royal-light/80 bg-royal/8 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3 h-3" />
                  {task.start_time && formatTime12(task.start_time)}
                  {task.start_time && task.end_time && ' → '}
                  {task.end_time && formatTime12(task.end_time)}
                </span>
              )}
              {hasReminder && (
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-400/80 bg-amber-400/8 px-2.5 py-1 rounded-lg">
                  <Bell className="w-3 h-3" />
                  {formatTime12(task.reminder_time)}
                </span>
              )}
            </div>
          )}
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </>
  )
}
