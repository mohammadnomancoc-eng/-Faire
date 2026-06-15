import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { Check, Clock, Trash2, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '../../lib/cn'

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
  const [cardRef, setCardRef] = useState(null)

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

  const refCallback = (node) => {
    setCardRef(node)
    if (setNodeRef) setNodeRef(node)
  }

  return (
    <>
      {showConfetti && cardRef && (
        <Confetti
          width={cardRef.offsetWidth}
          height={cardRef.offsetHeight}
          recycle={false}
          numberOfPieces={40}
          confettiSource={{
            x: cardRef.offsetWidth / 2,
            y: cardRef.offsetHeight / 2,
            w: 0,
            h: 0,
          }}
          colors={['#3E71C0', '#5A8FD4', '#D9D9D9', '#C6C8CC']}
          gravity={0.3}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 50 }}
        />
      )}

      <motion.div
        ref={refCallback}
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
          {task.reminder_time && (
            <p className="text-xs text-royal-light/80 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Reminder at {task.reminder_time.slice(0, 5)}
            </p>
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
