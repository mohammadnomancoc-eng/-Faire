import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, CalendarClock, Bell, ChevronDown, ChevronUp } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

export function AddTaskModal({ isOpen, onClose, onAdd, defaultDate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(defaultDate ? new Date(defaultDate) : new Date())
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [reminderTime, setReminderTime] = useState('')
  const [showTimeOptions, setShowTimeOptions] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onAdd({
      title,
      description: description || null,
      due_date: format(dueDate, 'yyyy-MM-dd'),
      start_time: startTime || null,
      end_time: endTime || null,
      reminder_time: reminderTime || null,
    })
    setTitle('')
    setDescription('')
    setStartTime('')
    setEndTime('')
    setReminderTime('')
    setShowTimeOptions(false)
    setLoading(false)
    onClose()
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setStartTime('')
    setEndTime('')
    setReminderTime('')
    setShowTimeOptions(false)
    onClose()
  }

  // Format a time string like "14:30" to "2:30 PM"
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return ''
    const [h, m] = timeStr.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 || 12
    return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
  }

  // Quick duration presets
  const applyDuration = (minutes) => {
    if (!startTime) return
    const [h, m] = startTime.split(':').map(Number)
    const totalMin = h * 60 + m + minutes
    const endH = Math.floor(totalMin / 60) % 24
    const endM = totalMin % 60
    setEndTime(`${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`)
  }

  const hasAnyTime = startTime || endTime || reminderTime

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-navy/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-strong rounded-2xl w-full max-w-md p-6 shadow-lift border border-white/[0.1] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-bold text-white">Add Task</h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-lg text-slate hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
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

              {/* Description */}
              <div>
                <label htmlFor="task-desc" className="block text-sm text-slate mb-2">
                  Description
                </label>
                <textarea
                  id="task-desc"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Additional details…"
                />
              </div>

              {/* Due date */}
              <div>
                <label className="block text-sm text-slate mb-2">Due date</label>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  className="input-field"
                />
              </div>

              {/* Time options toggle */}
              <button
                type="button"
                onClick={() => setShowTimeOptions(!showTimeOptions)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border',
                  showTimeOptions || hasAnyTime
                    ? 'bg-royal/10 border-royal/25 text-royal-light'
                    : 'bg-white/[0.04] border-white/[0.06] text-slate hover:text-white hover:border-white/[0.12]'
                )}
              >
                <span className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4" />
                  {hasAnyTime ? 'Time & Reminder set' : 'Add time & reminder (optional)'}
                </span>
                {showTimeOptions ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Collapsible time section */}
              <AnimatePresence>
                {showTimeOptions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-1">
                      {/* Start & End time row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="task-start-time" className="flex items-center gap-1.5 text-sm text-slate mb-2">
                            <Clock className="w-3.5 h-3.5" />
                            Start time
                          </label>
                          <input
                            id="task-start-time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="input-field text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="task-end-time" className="flex items-center gap-1.5 text-sm text-slate mb-2">
                            <Clock className="w-3.5 h-3.5" />
                            End time
                          </label>
                          <input
                            id="task-end-time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="input-field text-sm"
                          />
                        </div>
                      </div>

                      {/* Quick duration presets */}
                      {startTime && (
                        <div>
                          <p className="text-xs text-slate mb-2">Quick duration</p>
                          <div className="flex flex-wrap gap-2">
                            {[15, 30, 45, 60, 90, 120].map((mins) => (
                              <button
                                key={mins}
                                type="button"
                                onClick={() => applyDuration(mins)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-slate hover:text-white hover:bg-royal/10 hover:border-royal/25 transition-all duration-200"
                              >
                                {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Time preview */}
                      {(startTime || endTime) && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-royal/8 border border-royal/15 text-xs text-royal-light">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>
                            {startTime && formatTimeDisplay(startTime)}
                            {startTime && endTime && ' → '}
                            {endTime && formatTimeDisplay(endTime)}
                          </span>
                        </div>
                      )}

                      {/* Reminder time */}
                      <div>
                        <label htmlFor="task-reminder" className="flex items-center gap-1.5 text-sm text-slate mb-2">
                          <Bell className="w-3.5 h-3.5" />
                          Reminder time
                        </label>
                        <input
                          id="task-reminder"
                          type="time"
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          className="input-field text-sm"
                        />
                        <p className="text-[11px] text-slate/60 mt-1.5">
                          You'll get a browser notification at this time
                        </p>
                      </div>

                      {/* Clear all times */}
                      {hasAnyTime && (
                        <button
                          type="button"
                          onClick={() => {
                            setStartTime('')
                            setEndTime('')
                            setReminderTime('')
                          }}
                          className="text-xs text-slate hover:text-danger transition-colors"
                        >
                          Clear all times
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={handleClose}>
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
