import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { format, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import { Plus, Check, MapPin, Edit2, Trash2, AlertTriangle } from 'lucide-react'
import { ProgressBar } from '../shared/ProgressBar'
import { ProgressCircle } from '../shared/ProgressCircle'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

// ── Inline confirmation dialog ────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
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
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm text-slate hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500/80 hover:bg-red-500 border border-red-400/30 transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Milestone progress sub-component ─────────────────────────────────────────
function LandmarkProgress({ landmark, goalTasks }) {
  const [viewMode, setViewMode] = useState('circle')

  const tasksBeforeLandmark = goalTasks.filter(
    (t) => t.due_date <= (landmark.target_date || landmark.end_date)
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

// ── Main LandmarkList component ───────────────────────────────────────────────
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
  const [startDate, setStartDate] = useState(parseISO(goal.start_date))
  const [targetDate, setTargetDate] = useState(parseISO(goal.start_date))
  const [showForm, setShowForm] = useState(false)

  // Editing state
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editStartDate, setEditStartDate] = useState(new Date())
  const [editTargetDate, setEditTargetDate] = useState(new Date())

  // Confirm-delete state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const goalStart = parseISO(goal.start_date)
  const goalEnd = parseISO(goal.end_date)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await onAddLandmark({
      goal_id: goal.id,
      title: title.trim(),
      start_date: format(startDate, 'yyyy-MM-dd'),
      target_date: format(targetDate, 'yyyy-MM-dd'),
    })
    setTitle('')
    setShowForm(false)
  }

  const handleStartEdit = (landmark) => {
    setEditingId(landmark.id)
    setEditTitle(landmark.title)
    setEditStartDate(
      landmark.start_date ? parseISO(landmark.start_date) : parseISO(landmark.target_date)
    )
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
      start_date: format(editStartDate, 'yyyy-MM-dd'),
      target_date: format(editTargetDate, 'yyyy-MM-dd'),
    })
    setEditingId(null)
    setEditTitle('')
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return
    await onDeleteLandmark(confirmDeleteId)
    setConfirmDeleteId(null)
  }

  const sortedLandmarks = [...landmarks].sort(
    (a, b) => new Date(a.target_date) - new Date(b.target_date)
  )

  return (
    <>
      {/* Confirm delete dialog */}
      {confirmDeleteId && (
        <ConfirmDialog
          message="This milestone will be permanently deleted. This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}

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

            {/* Start date */}
            <div>
              <label className="block text-xs text-slate mb-1.5">Start date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date)
                  if (date > targetDate) setTargetDate(date)
                }}
                minDate={goalStart}
                maxDate={goalEnd}
                className="input-field text-sm"
                placeholderText="Start date"
              />
            </div>

            {/* End / target date */}
            <div>
              <label className="block text-xs text-slate mb-1.5">Target (end) date</label>
              <DatePicker
                selected={targetDate}
                onChange={(date) => setTargetDate(date)}
                minDate={startDate}
                maxDate={goalEnd}
                className="input-field text-sm"
                placeholderText="Target date"
              />
            </div>

            {/* Range summary */}
            {startDate && targetDate && (
              <p className="text-xs text-royal-light bg-royal/8 border border-royal/15 px-3 py-2 rounded-lg">
                Milestone spans{' '}
                {format(startDate, 'MMM d')} — {format(targetDate, 'MMM d, yyyy')}
              </p>
            )}

            <Button type="submit" variant="primary" className="text-xs">
              Add milestone
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
                const effectiveStart = landmark.start_date || landmark.target_date
                const effectiveEnd = landmark.target_date

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
                        <input
                          type="text"
                          required
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="input-field text-sm"
                          placeholder="Milestone title"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-slate mb-1.5">Start date</label>
                            <DatePicker
                              selected={editStartDate}
                              onChange={(date) => {
                                setEditStartDate(date)
                                if (date > editTargetDate) setEditTargetDate(date)
                              }}
                              minDate={goalStart}
                              maxDate={goalEnd}
                              className="input-field text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate mb-1.5">End date</label>
                            <DatePicker
                              selected={editTargetDate}
                              onChange={(date) => setEditTargetDate(date)}
                              minDate={editStartDate}
                              maxDate={goalEnd}
                              className="input-field text-sm"
                            />
                          </div>
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
                          {/* Mark-as-done checkbox with tooltip */}
                          <div className="relative group/check">
                            <button
                              type="button"
                              onClick={() => onToggleLandmark(landmark)}
                              className={cn(
                                'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                                landmark.is_completed
                                  ? 'bg-royal border-royal'
                                  : 'border-white/20 hover:border-royal/50'
                              )}
                              aria-label={landmark.is_completed ? 'Mark as undone' : 'Mark as done'}
                            >
                              {landmark.is_completed && (
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              )}
                            </button>
                            {/* Tooltip */}
                            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg text-[10px] font-medium text-white bg-navy-dark border border-white/10 whitespace-nowrap opacity-0 group-hover/check:opacity-100 transition-opacity duration-150 z-10">
                              {landmark.is_completed ? 'Mark as undone' : 'Mark as done'}
                            </span>
                          </div>

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
                              {effectiveStart && effectiveStart !== effectiveEnd
                                ? `${format(parseISO(effectiveStart), 'MMM d')} — ${format(parseISO(effectiveEnd), 'MMM d, yyyy')}`
                                : `Target: ${format(parseISO(effectiveEnd), 'MMM d, yyyy')}`}
                            </p>
                          </div>
                        </div>

                        {/* Edit / Delete */}
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
                              onClick={() => setConfirmDeleteId(landmark.id)}
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
    </>
  )
}
