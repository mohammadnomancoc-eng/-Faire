import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { format, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import { Plus, Check, MapPin, Edit2, Trash2 } from 'lucide-react'
import { ProgressBar } from '../shared/ProgressBar'
import { ProgressCircle } from '../shared/ProgressCircle'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

function LandmarkProgress({ landmark, goalTasks }) {
  const [viewMode, setViewMode] = useState('circle')

  const tasksBeforeLandmark = goalTasks.filter(
    (t) => t.due_date <= landmark.target_date
  )
  const doneBeforeLandmark = tasksBeforeLandmark.filter((t) => t.is_done)
  const landmarkProgress =
    tasksBeforeLandmark.length > 0
      ? Math.round((doneBeforeLandmark.length / tasksBeforeLandmark.length) * 100)
      : 0

  if (!landmark.is_completed) return null

  return (
    <div className="mt-3 pl-7">
      <p className="text-xs text-slate mb-2">Milestone progress</p>
      <div className="flex gap-2 mb-2">
        {['circle', 'bar'].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
              viewMode === mode
                ? 'bg-royal/20 text-white border border-royal/30'
                : 'text-slate hover:text-white bg-white/[0.04]'
            )}
          >
            {mode === 'circle' ? 'Circle' : 'Bar'}
          </button>
        ))}
      </div>
      {viewMode === 'circle' ? (
        <ProgressCircle percentage={landmarkProgress} size={80} strokeWidth={6} />
      ) : (
        <ProgressBar percentage={landmarkProgress} />
      )}
    </div>
  )
}

export function LandmarkList({
  goal,
  landmarks,
  goalTasks,
  onAddLandmark,
  onToggleLandmark,
  onUpdateLandmark,
  onDeleteLandmark,
}) {
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState(parseISO(goal.start_date))
  const [showForm, setShowForm] = useState(false)

  // Editing state
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editTargetDate, setEditTargetDate] = useState(new Date())

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await onAddLandmark({
      goal_id: goal.id,
      title: title.trim(),
      target_date: format(targetDate, 'yyyy-MM-dd'),
    })
    setTitle('')
    setShowForm(false)
  }

  const handleStartEdit = (landmark) => {
    setEditingId(landmark.id)
    setEditTitle(landmark.title)
    setEditTargetDate(parseISO(landmark.target_date))
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const handleSaveEdit = async (landmarkId) => {
    if (!editTitle.trim()) return
    await onUpdateLandmark(landmarkId, {
      title: editTitle.trim(),
      target_date: format(editTargetDate, 'yyyy-MM-dd'),
    })
    setEditingId(null)
    setEditTitle('')
  }

  const sortedLandmarks = [...landmarks].sort(
    (a, b) => new Date(a.target_date) - new Date(b.target_date)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-royal-light" />
          Milestones
        </h4>
        <Button variant="ghost" className="text-xs px-3 py-1.5" onClick={() => setShowForm(!showForm)} icon={Plus}>
          {showForm ? 'Cancel' : 'Add milestone'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-4 space-y-3 p-4 glass rounded-xl">
          <input
            type="text"
            placeholder="Milestone title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field text-sm"
          />
          <DatePicker
            selected={targetDate}
            onChange={(date) => setTargetDate(date)}
            minDate={parseISO(goal.start_date)}
            maxDate={parseISO(goal.end_date)}
            className="input-field text-sm"
          />
          <Button type="submit" variant="primary" className="text-xs">
            Add
          </Button>
        </form>
      )}

      {sortedLandmarks.length === 0 ? (
        <p className="text-sm text-slate">No milestones yet.</p>
      ) : (
        <div className="relative pl-4">
          <div className="absolute left-1.5 top-2 bottom-2 w-px bg-gradient-to-b from-royal/40 to-transparent" />
          <ul className="space-y-4">
            {sortedLandmarks.map((landmark, i) => {
              const isEditing = editingId === landmark.id
              return (
                <motion.li
                  key={landmark.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative glass rounded-xl p-4 ml-2"
                >
                  <div className="absolute -left-[13px] top-5 w-2.5 h-2.5 rounded-full bg-royal border-2 border-navy" />
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          required
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="input-field text-sm flex-1"
                          placeholder="Milestone title"
                        />
                        <DatePicker
                          selected={editTargetDate}
                          onChange={(date) => setEditTargetDate(date)}
                          minDate={parseISO(goal.start_date)}
                          maxDate={parseISO(goal.end_date)}
                          className="input-field text-sm w-full sm:w-auto"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="primary"
                          className="text-xs px-3 py-1.5"
                          onClick={() => handleSaveEdit(landmark.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-xs px-3 py-1.5"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => onToggleLandmark(landmark)}
                          className={cn(
                            'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                            landmark.is_completed
                              ? 'bg-royal border-royal'
                              : 'border-white/20 hover:border-royal/50'
                          )}
                        >
                          {landmark.is_completed && (
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <span
                            className={cn(
                              'text-sm truncate block',
                              landmark.is_completed ? 'line-through text-slate' : 'font-medium text-white'
                            )}
                          >
                            {landmark.title}
                          </span>
                          <p className="text-xs text-slate mt-0.5">
                            Target: {format(parseISO(landmark.target_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>

                      {/* Edit/Delete controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(landmark)}
                          className="p-1.5 rounded-lg text-slate hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                          aria-label="Edit milestone"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteLandmark && (
                          <button
                            type="button"
                            onClick={() => onDeleteLandmark(landmark.id)}
                            className="p-1.5 rounded-lg text-slate hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                            aria-label="Delete milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {!isEditing && <LandmarkProgress landmark={landmark} goalTasks={goalTasks} />}
                </motion.li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
