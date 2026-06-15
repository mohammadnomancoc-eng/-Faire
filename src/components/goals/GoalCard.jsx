import { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Trash2 } from 'lucide-react'
import { GoalProgressDisplay } from './GoalProgressDisplay'
import { GoalTaskList } from './GoalTaskList'
import { LandmarkList } from './LandmarkList'
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
  onDeleteGoal,
}) {
  const [expanded, setExpanded] = useState(false)
  const [viewMode, setViewMode] = useState('circle')

  const tasksForGoal = goalTasks.filter((t) => t.goal_id === goal.id)
  const doneTasks = tasksForGoal.filter((t) => t.is_done)
  const goalProgress =
    tasksForGoal.length > 0
      ? Math.round((doneTasks.length / tasksForGoal.length) * 100)
      : 0

  const goalLandmarks = landmarks.filter((l) => l.goal_id === goal.id)
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(goal.end_date) - new Date()) / (1000 * 60 * 60 * 24))
  )

  return (
    <GlassCard hover className="overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="card-title">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-slate mt-1">{goal.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="text-xs text-slate glass px-2.5 py-1 rounded-lg">
              {format(new Date(goal.start_date), 'MMM d')} —{' '}
              {format(new Date(goal.end_date), 'MMM d, yyyy')}
            </span>
            <span className="text-xs text-royal-light">{daysLeft} days left</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="ghost"
            className="text-xs px-3 py-1.5"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Collapse' : 'Expand'}
            <ChevronDown
              className={cn('w-3 h-3 transition-transform', expanded && 'rotate-180')}
            />
          </Button>
          {onDeleteGoal && (
            <button
              type="button"
              onClick={() => onDeleteGoal(goal.id)}
              className="p-2 rounded-xl text-slate hover:text-red-400 hover:bg-red-400/10 transition-colors"
              aria-label="Delete goal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-5">
        <GoalProgressDisplay
          percentage={goalProgress}
          viewMode={viewMode}
          setViewMode={setViewMode}
          label={`${doneTasks.length} of ${tasksForGoal.length} tasks complete`}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-6">
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
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
