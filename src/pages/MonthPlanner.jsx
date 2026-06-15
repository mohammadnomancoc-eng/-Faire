import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CalendarRange, Flame, MapPin } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'
import { GoalCard } from '../components/goals/GoalCard'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useGoals } from '../hooks/useGoals'
import { cn } from '../lib/cn'

function CalendarHeatmap({ goals, goalTasks }) {
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getHeatLevel = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const tasksOnDay = goalTasks.filter((t) => {
      const goal = goals.find((g) => g.id === t.goal_id)
      if (!goal) return false
      return dateStr >= goal.start_date && dateStr <= goal.end_date && t.is_done
    })
    if (tasksOnDay.length === 0) return 0
    if (tasksOnDay.length <= 2) return 1
    if (tasksOnDay.length <= 4) return 2
    return 3
  }

  const heatColors = [
    'bg-white/[0.04]',
    'bg-royal/20',
    'bg-royal/40',
    'bg-royal/70',
  ]

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
        <div key={d} className="text-[10px] text-slate text-center pb-1">{d}</div>
      ))}
      {Array.from({ length: monthStart.getDay() }).map((_, i) => (
        <div key={`empty-${i}`} />
      ))}
      {days.map((day) => {
        const level = getHeatLevel(day)
        return (
          <motion.div
            key={day.toISOString()}
            whileHover={{ scale: 1.15 }}
            className={cn(
              'aspect-square rounded-lg transition-colors cursor-default',
              heatColors[level],
              isSameDay(day, today) && 'ring-1 ring-royal/50'
            )}
            title={format(day, 'MMM d')}
          />
        )
      })}
    </div>
  )
}

export function MonthPlanner({ session }) {
  const {
    goals,
    goalTasks,
    landmarks,
    loading,
    addGoal,
    deleteGoal,
    addGoalTask,
    toggleGoalTask,
    addLandmark,
    toggleLandmark,
  } = useGoals(session.user.id)

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

  const totalTasks = goalTasks.length
  const doneTasks = goalTasks.filter((t) => t.is_done).length
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const handleCreateGoal = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await addGoal({
      title: title.trim(),
      description: description || null,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
    })
    setTitle('')
    setDescription('')
    setShowForm(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-slate text-sm mb-1 flex items-center gap-2">
            <CalendarRange className="w-4 h-4" />
            Long-term Planning
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Month Planner
          </h1>
          <p className="text-slate mt-2">Set goals, track milestones, and visualize your journey.</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)} icon={Plus}>
          {showForm ? 'Cancel' : 'New goal'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        <GlassCard className="lg:col-span-4 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-royal-light" />
            <h2 className="card-title text-lg">Activity Heatmap</h2>
          </div>
          <CalendarHeatmap goals={goals} goalTasks={goalTasks} />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
            <span className="text-xs text-slate">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((l) => (
                <div
                  key={l}
                  className={cn(
                    'w-3 h-3 rounded',
                    l === 0 ? 'bg-white/[0.04]' : l === 1 ? 'bg-royal/20' : l === 2 ? 'bg-royal/40' : 'bg-royal/70'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-slate">More</span>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-8 p-6">
          <h2 className="card-title text-lg mb-4">Completion Analytics</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-3xl font-display font-bold text-white">{goals.length}</p>
              <p className="text-xs text-slate mt-1">Total Goals</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-3xl font-display font-bold text-royal-light">{overallProgress}%</p>
              <p className="text-xs text-slate mt-1">Overall Progress</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-3xl font-display font-bold text-white">
                {landmarks.filter((l) => l.is_completed).length}/{landmarks.length}
              </p>
              <p className="text-xs text-slate mt-1">Milestones</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard className="p-6 mb-6">
              <h2 className="card-title text-lg mb-5">Create a Goal</h2>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label htmlFor="goal-title" className="block text-sm text-slate mb-2">
                    Title *
                  </label>
                  <input
                    id="goal-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Learn French in 30 days"
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="goal-desc" className="block text-sm text-slate mb-2">
                    Description
                  </label>
                  <textarea
                    id="goal-desc"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field resize-none"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate mb-2">Start date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate mb-2">End date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      minDate={startDate}
                      className="input-field"
                    />
                  </div>
                </div>
                <Button type="submit" variant="primary">
                  Create goal
                </Button>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="goals">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-4 h-4 text-royal-light" />
          <h2 className="card-title">Goal Roadmap</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/[0.04] animate-pulse" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-slate mb-4">No goals yet. Create your first goal to start planning.</p>
            <Button variant="primary" onClick={() => setShowForm(true)} icon={Plus}>
              Create your first goal
            </Button>
          </GlassCard>
        ) : (
          <ScrollReveal stagger className="space-y-5">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                goalTasks={goalTasks}
                landmarks={landmarks}
                onAddTask={addGoalTask}
                onAddLandmark={addLandmark}
                onToggleTask={toggleGoalTask}
                onToggleLandmark={toggleLandmark}
                onDeleteGoal={deleteGoal}
              />
            ))}
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}
