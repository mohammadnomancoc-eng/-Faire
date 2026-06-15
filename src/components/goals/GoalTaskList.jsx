import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { format, parseISO, isWithinInterval } from 'date-fns'
import { Plus, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

export function GoalTaskList({ goal, tasks, onAddTask, onToggleTask }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState(parseISO(goal.start_date))
  const [showForm, setShowForm] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await onAddTask({
      goal_id: goal.id,
      title: title.trim(),
      due_date: format(dueDate, 'yyyy-MM-dd'),
    })
    setTitle('')
    setShowForm(false)
  }

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.due_date) - new Date(b.due_date)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white text-sm">Daily tasks</h4>
        <Button variant="ghost" className="text-xs px-3 py-1.5" onClick={() => setShowForm(!showForm)} icon={Plus}>
          {showForm ? 'Cancel' : 'Add task'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-4 space-y-3 p-4 glass rounded-xl">
          <input
            type="text"
            placeholder="Task title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field text-sm"
          />
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            minDate={parseISO(goal.start_date)}
            maxDate={parseISO(goal.end_date)}
            filterDate={(date) =>
              isWithinInterval(date, {
                start: parseISO(goal.start_date),
                end: parseISO(goal.end_date),
              })
            }
            className="input-field text-sm"
          />
          <Button type="submit" variant="primary" className="text-xs">
            Add
          </Button>
        </form>
      )}

      {sortedTasks.length === 0 ? (
        <p className="text-sm text-slate">No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-2">
          {sortedTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 text-sm p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <button
                type="button"
                onClick={() => onToggleTask(task)}
                className={cn(
                  'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                  task.is_done
                    ? 'bg-royal border-royal'
                    : 'border-white/20 hover:border-royal/50'
                )}
              >
                {task.is_done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </button>
              <span className={cn('flex-1', task.is_done && 'line-through text-slate')}>
                {task.title}
              </span>
              <span className="text-xs text-slate">
                {format(parseISO(task.due_date), 'MMM d')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
