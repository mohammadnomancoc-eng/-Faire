import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { format, parseISO, isWithinInterval, eachDayOfInterval } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Calendar, CalendarRange, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

export function GoalTaskList({ goal, tasks, onAddTask, onToggleTask }) {
  const [title, setTitle] = useState('')
  const [showForm, setShowForm] = useState(false)

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
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="mb-4 space-y-4 p-4 glass rounded-xl">
              <input
                type="text"
                placeholder="Task title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field text-sm"
              />

              {/* Date mode selector */}
              <div>
                <p className="text-xs text-slate mb-2">Schedule for</p>
                <div className="flex gap-2">
                  {[
                    { key: 'single', label: 'One day', icon: Calendar },
                    { key: 'range', label: 'Date range', icon: CalendarRange },
                    { key: 'multi', label: 'Pick days', icon: CalendarRange },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDateMode(key)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border',
                        dateMode === key
                          ? 'bg-royal/15 border-royal/30 text-royal-light'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate hover:text-white hover:border-white/[0.12]'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Single date picker */}
              {dateMode === 'single' && (
                <div>
                  <label className="block text-xs text-slate mb-2">Date</label>
                  <DatePicker
                    selected={singleDate}
                    onChange={(date) => setSingleDate(date)}
                    minDate={goalStart}
                    maxDate={goalEnd}
                    filterDate={filterGoalDates}
                    className="input-field text-sm"
                  />
                </div>
              )}

              {/* Date range picker */}
              {dateMode === 'range' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate mb-2">From</label>
                    <DatePicker
                      selected={rangeStart}
                      onChange={(date) => {
                        setRangeStart(date)
                        if (date > rangeEnd) setRangeEnd(date)
                      }}
                      minDate={goalStart}
                      maxDate={goalEnd}
                      filterDate={filterGoalDates}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate mb-2">To</label>
                    <DatePicker
                      selected={rangeEnd}
                      onChange={(date) => setRangeEnd(date)}
                      minDate={rangeStart}
                      maxDate={goalEnd}
                      filterDate={filterGoalDates}
                      className="input-field text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Multi-day picker */}
              {dateMode === 'multi' && (
                <div>
                  <label className="block text-xs text-slate mb-2">
                    Click dates to select/deselect
                  </label>
                  <DatePicker
                    selected={null}
                    onChange={(date) => toggleMultiDate(date)}
                    minDate={goalStart}
                    maxDate={goalEnd}
                    filterDate={filterGoalDates}
                    highlightDates={multiDates}
                    inline
                    className="input-field text-sm"
                  />
                  {/* Selected dates chips */}
                  {multiDates.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {multiDates.map((d) => (
                        <span
                          key={d.toISOString()}
                          className="inline-flex items-center gap-1 text-xs bg-royal/15 text-royal-light border border-royal/25 px-2.5 py-1 rounded-lg"
                        >
                          {format(d, 'MMM d')}
                          <button
                            type="button"
                            onClick={() => toggleMultiDate(d)}
                            className="hover:text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              {selectedCount > 0 && (
                <p className="text-xs text-royal-light bg-royal/8 border border-royal/15 px-3 py-2 rounded-lg">
                  {selectedCount === 1
                    ? `Task will be added for ${format(selectedDates[0], 'MMM d')}`
                    : `Task will be added for ${selectedCount} days (${format(selectedDates[0], 'MMM d')} — ${format(selectedDates[selectedCount - 1], 'MMM d')})`}
                </p>
              )}

              <div className="flex gap-2">
                <Button type="submit" variant="primary" className="text-xs">
                  {selectedCount > 1 ? `Add to ${selectedCount} days` : 'Add'}
                </Button>
                <Button type="button" variant="ghost" className="text-xs" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
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
                      {/* Animated checkbox */}
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
                    </motion.li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
