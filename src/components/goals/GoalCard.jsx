import { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Trash2, Target, Clock, CheckCircle2, ListTodo } from 'lucide-react'
import { GoalTaskList } from './GoalTaskList'
import { LandmarkList } from './LandmarkList'
import { ProgressCircle } from '../shared/ProgressCircle'
import { GlassCard } from '../ui/GlassCard'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

export function GoalCard({
  goal,
  goalTasks,
  landmarks,
  onAddTask,
  onAddLandmark,
  onToggleTask,
  onToggleLandmark,
  onUpdateLandmark,
  onDeleteLandmark,
  onDeleteGoal,
}) {
  const [expanded, setExpanded] = useState(false)

  const tasksForGoal = goalTasks.filter((t) => t.goal_id === goal.id)
  const doneTasks = tasksForGoal.filter((t) => t.is_done)
  const goalProgress =
    tasksForGoal.length > 0
      ? Math.round((doneTasks.length / tasksForGoal.length) * 100)
      : 0

  const goalLandmarks = landmarks.filter((l) => l.goal_id === goal.id)
  const completedLandmarks = goalLandmarks.filter((l) => l.is_completed)
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(goal.end_date) - new Date()) / (1000 * 60 * 60 * 24))
  )
  const isOverdue = daysLeft === 0 && goalProgress < 100
  const isComplete = goalProgress === 100

  return (
    <GlassCard hover className="overflow-hidden p-0">
      {/* Header section with gradient accent */}
      <div className="relative p-6 pb-5">
        {/* Subtle accent glow at top */}
        <div
          className={cn(
            'absolute top-0 left-0 right-0 h-1 rounded-t-2xl',
            isComplete
              ? 'bg-gradient-to-r from-green-500/60 via-emerald-400/40 to-green-500/60'
              : isOverdue
                ? 'bg-gradient-to-r from-red-500/60 via-orange-400/40 to-red-500/60'
                : 'bg-gradient-to-r from-royal/60 via-royal-light/40 to-royal/60'
          )}
        />

        <div className="flex items-start gap-5">
          {/* Progress circle — compact */}
          <div className="shrink-0 hidden sm:block">
            <ProgressCircle percentage={goalProgress} size={80} strokeWidth={6} />
          </div>

          {/* Goal info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Target className={cn(
                    'w-4 h-4 shrink-0',
                    isComplete ? 'text-green-400' : 'text-royal-light'
                  )} />
                  <h3 className="font-display text-lg font-bold text-white truncate">
                    {goal.title}
                  </h3>
                </div>
                {goal.description && (
                  <p className="text-sm text-slate mt-0.5 line-clamp-2">{goal.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300',
                    expanded
                      ? 'bg-royal/15 text-royal-light border border-royal/25'
                      : 'text-slate hover:text-white hover:bg-white/[0.06]'
                  )}
                >
                  {expanded ? 'Collapse' : 'Expand'}
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-300',
                      expanded && 'rotate-180'
                    )}
                  />
                </button>
                {onDeleteGoal && (
                  <button
                    type="button"
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-2 rounded-xl text-slate hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                    aria-label="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-2.5 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate bg-white/[0.04] border border-white/[0.06] px-2.5 py-1.5 rounded-lg">
                <Clock className="w-3 h-3" />
                {format(new Date(goal.start_date), 'MMM d')} — {format(new Date(goal.end_date), 'MMM d, yyyy')}
              </span>
              <span className={cn(
                'inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium',
                isComplete
                  ? 'text-green-400 bg-green-400/10 border border-green-400/20'
                  : isOverdue
                    ? 'text-red-400 bg-red-400/10 border border-red-400/20'
                    : 'text-royal-light bg-royal/10 border border-royal/20'
              )}>
                {isComplete ? '✓ Complete' : isOverdue ? 'Overdue' : `${daysLeft}d left`}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate bg-white/[0.04] border border-white/[0.06] px-2.5 py-1.5 rounded-lg">
                <ListTodo className="w-3 h-3" />
                {doneTasks.length}/{tasksForGoal.length} tasks
              </span>
              {goalLandmarks.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs text-slate bg-white/[0.04] border border-white/[0.06] px-2.5 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-3 h-3" />
                  {completedLandmarks.length}/{goalLandmarks.length} milestones
                </span>
              )}
            </div>

            {/* Progress bar — always visible, compact */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate font-medium">Progress</span>
                <span className={cn(
                  'text-[11px] font-bold',
                  isComplete ? 'text-green-400' : 'text-royal-light'
                )}>
                  {goalProgress}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: isComplete
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                      : 'linear-gradient(90deg, #3E71C0, #5A8FD4)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] space-y-6">
              <GoalTaskList
                goal={goal}
                tasks={tasksForGoal}
                onAddTask={onAddTask}
                onToggleTask={onToggleTask}
              />
              <LandmarkList
                goal={goal}
                landmarks={goalLandmarks}
                goalTasks={tasksForGoal}
                onAddLandmark={onAddLandmark}
                onToggleLandmark={onToggleLandmark}
                onUpdateLandmark={onUpdateLandmark}
                onDeleteLandmark={onDeleteLandmark}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
