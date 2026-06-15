import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { Button } from '../ui/Button'

export function AddTaskModal({ isOpen, onClose, onAdd, defaultDate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(defaultDate ? new Date(defaultDate) : new Date())
  const [reminderTime, setReminderTime] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onAdd({
      title,
      description: description || null,
      due_date: format(dueDate, 'yyyy-MM-dd'),
      reminder_time: reminderTime || null,
    })
    setTitle('')
    setDescription('')
    setReminderTime('')
    setLoading(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-navy/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-strong rounded-2xl w-full max-w-md p-6 shadow-lift border border-white/[0.1]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-bold text-white">Add Task</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="task-title" className="block text-sm text-slate mb-2">
                  Title *
                </label>
                <input
                  id="task-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="What needs to be done?"
                />
              </div>
              <div>
                <label htmlFor="task-desc" className="block text-sm text-slate mb-2">
                  Description
                </label>
                <textarea
                  id="task-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate mb-2">Due date</label>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="task-reminder" className="block text-sm text-slate mb-2">
                  Reminder time (optional)
                </label>
                <input
                  id="task-reminder"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Adding…' : 'Add task'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
