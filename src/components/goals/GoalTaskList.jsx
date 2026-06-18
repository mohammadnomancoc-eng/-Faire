import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { format, parseISO, isWithinInterval, eachDayOfInterval } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Calendar, X, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative glass rounded-2xl p-6 max-w-sm w-full border border-red-400/20 shadow-lift">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">Confirm deletion</p>
            <p className="text-xs text-slate leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-slate hover:text-white hover:bg-white/[0.06] transition-all duration-200">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500/80 hover:bg-red-500 border border-red-400/30 transition-all duration-200">Delete</button>
        </div>
      </div>
    </motion.div>
  )
}

export function GoalTaskList({ goal, tasks, onAddTask, onToggleTask, onDeleteTask }) {
  const [title, setTitle] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  // Mode: 'single' = one date, 'range' = date range, 'multi' = pick multiple dates
  const [dateMode, setDateMode] = useState('single')
  const [singleDate, setSingleDate] = useState(parseISO(goal.start_date))
  const [rangeStart, setRangeStart] = useState(parseISO(goal.start_date))
  const [rangeEnd, setRangeEnd] = useState(parseISO(goal.start_date))
  const [multiDates, setMultiDates] = useState([])

  const goalStart = parseISO(goal.start_date)
  const goalEnd = parseISO(goal.end_date)

  const filterGoalDates = (date) =>
    isWithinInterval(date, { start: goalStart, end: goalEnd })

  const getSelectedDates = () => {
    if (dateMode === 'single') return [singleDate]
    if (dateMode === 'range') {
      if (rangeEnd < rangeStart) return [rangeStart]
      return eachDayOfInterval({ start: rangeStart, end: rangeEnd })
    }
    return multiDates
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const dates = getSelectedDates()
    if (dates.length === 0) return

    // Add a task for each selected date
    for (const date of dates) {
      await onAddTask({
        goal_id: goal.id,
        title: title.trim(),
        due_date: format(date, 'yyyy-MM-dd'),
      })
    }

    setTitle('')
    setMultiDates([])
    setShowForm(false)
  }

  const toggleMultiDate = (date) => {
    setMultiDates((prev) => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const exists = prev.find((d) => format(d, 'yyyy-MM-dd') === dateStr)
      if (exists) return prev.filter((d) => format(d, 'yyyy-MM-dd') !== dateStr)
      return [...prev, date].sort((a, b) => a - b)
    })
  }

  const selectedDates = getSelectedDates()
  const selectedCount = selectedDates.length

  // Group tasks by due_date for visual grouping
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.due_date) - new Date(b.due_date)
  )

  const tasksByDate = sortedTasks.reduce((acc, task) => {
    const key = task.due_date
    if (!acc[key]) acc[key] = []
    acc[key].push(task)
    return acc
  }, {})

  return (
    <>
      <AnimatePresence>
        {confirmDeleteId && (
          <ConfirmDialog
            message="This task and any linked daily planner tasks will be permanently deleted."
            onConfirm={async () => {
              await onDeleteTask(confirmDeleteId)
              setConfirmDeleteId(null)
            }}
            onCancel={() => setConfirmDeleteId(null)}
          />
        )}
      </AnimatePresence>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-white text-sm">Daily tasks</h4>
          <Button
            variant="ghost"
            className="text-xs px-3 py-1.5"
            onClick={() => setShowForm(!showForm)}
            icon={Plus}
          >
            {showForm ? 'Cancel' : 'Add task'}
          </Button>
        </div>

        {/* Add task form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <form onSubmit={handleAdd} className="space-y-4 p-4 glass rounded-xl border border-white/[0.06]">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Task title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field text-sm"
                  />

                  {/* Date Mode Selector */}
                  <div className="flex gap-2">
                    {[
                      { id: 'single', label: 'One Day' },
                      { id: 'range', label: 'Date Range' },
                      { id: 'multi', label: 'Pick Days' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setDateMode(mode.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                          dateMode === mode.id
                            ? 'bg-royal text-white shadow-lift'
                            : 'text-slate hover:text-white bg-white/[0.04]'
                        )}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {/* Scheduling Fields */}
                  {dateMode === 'single' && (
                    <div>
                      <DatePicker
                        selected={singleDate}
                        onChange={(date) => setSingleDate(date)}
                        filterDate={filterGoalDates}
                        className="input-field text-sm"
                      />
                    </div>
                  )}

                  {dateMode === 'range' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate mb-1">Start Date</label>
                        <DatePicker
                          selected={rangeStart}
                          onChange={(date) => {
                            setRangeStart(date)
                            if (date > rangeEnd) setRangeEnd(date)
                          }}
                          filterDate={filterGoalDates}
                          className="input-field text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate mb-1">End Date</label>
                        <DatePicker
                          selected={rangeEnd}
                          onChange={(date) => setRangeEnd(date)}
                          filterDate={filterGoalDates}
                          minDate={rangeStart}
                          className="input-field text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {dateMode === 'multi' && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-lg bg-navy/40 border border-white/[0.04]">
                        {multiDates.length === 0 ? (
                          <span className="text-xs text-slate italic">Click days on calendar to add...</span>
                        ) : (
                          multiDates.map((date) => (
                            <span
                              key={date.toISOString()}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-royal-light bg-royal/10 border border-royal/20 px-2 py-0.5 rounded-full"
                            >
                              {format(date, 'MMM d')}
                              <button
                                type="button"
                                onClick={() => toggleMultiDate(date)}
                                className="hover:text-red-400"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                      <div>
                        <DatePicker
                          inline
                          selected={null}
                          onChange={toggleMultiDate}
                          filterDate={filterGoalDates}
                          highlightDates={multiDates}
                        />
                      </div>
                    </div>
                  )}

                  {/* Summary of dates */}
                  {selectedCount > 0 && (
                    <p className="text-xs text-royal-light font-medium">
                      Will create {selectedCount} task{selectedCount > 1 ? 's' : ''} on: {
                        selectedDates.map(d => format(d, 'MMM d')).join(', ')
                      }
                    </p>
                  )}
                </div>

                <Button type="submit" variant="primary" className="text-xs">
                  Create Tasks
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks list — grouped by date */}
        {sortedTasks.length === 0 ? (
          <p className="text-sm text-slate">No tasks assigned yet.</p>
        ) : (
          <div className="space-y-5">
            {Object.entries(tasksByDate).map(([dateStr, dateTasks]) => {
              const doneCount = dateTasks.filter((t) => t.is_done).length
              const allDone = doneCount === dateTasks.length
              return (
                <div key={dateStr}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] text-slate uppercase tracking-wider font-medium flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {format(parseISO(dateStr), 'EEEE, MMM d')}
                    </p>
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                      allDone
                        ? 'bg-green-400/15 text-green-400'
                        : 'bg-white/[0.04] text-slate'
                    )}>
                      {doneCount}/{dateTasks.length}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {dateTasks.map((task) => (
                      <motion.li
                        key={task.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer',
                          task.is_done
                            ? 'bg-green-400/[0.04] border-green-400/15 hover:border-green-400/25'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-royal/25 hover:bg-white/[0.04]'
                        )}
                        onClick={() => onToggleTask(task)}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Animated checkbox with tooltip */}
                        <div className="relative group/check">
                          <div className={cn(
                            'relative w-6 h-6 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all duration-300',
                            task.is_done
                              ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                              : 'border-white/20 group-hover:border-royal/50 group-hover:bg-royal/10'
                          )}>
                            <AnimatePresence mode="wait">
                              {task.is_done && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 90 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                >
                                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          {/* Tooltip */}
                          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg text-[10px] font-medium text-white bg-navy-dark border border-white/10 whitespace-nowrap opacity-0 group-hover/check:opacity-100 transition-opacity duration-150 z-10">
                            {task.is_done ? 'Mark as undone' : 'Mark as done'}
                          </span>
                        </div>

                        {/* Task title */}
                        <motion.span
                          className={cn(
                            'flex-1 text-sm font-medium transition-all duration-300',
                            task.is_done ? 'line-through text-slate' : 'text-white'
                          )}
                          animate={{ opacity: task.is_done ? 0.6 : 1 }}
                        >
                          {task.title}
                        </motion.span>

                        {/* Done label */}
                        <AnimatePresence>
                          {task.is_done && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="text-[10px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full shrink-0"
                            >
                              Done
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Delete button */}
                        {onDeleteTask && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation() // Prevent toggling the task
                              setConfirmDeleteId(task.id)
                            }}
                            className="p-1.5 rounded-lg text-slate hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 opacity-0 group-hover:opacity-100 shrink-0"
                            aria-label="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
