import { useState, useRef, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CalendarRange, Flame, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'
import { GoalCard } from '../components/goals/GoalCard'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useGoals } from '../hooks/useGoals'
import { cn } from '../lib/cn'
import { supabase } from '../lib/supabaseClient'

function CalendarHeatmap({ userId }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [tooltip, setTooltip] = useState(null)
  const [taskMap, setTaskMap] = useState({})       // { 'yyyy-MM-dd': [task, ...] }
  const [milestoneMap, setMilestoneMap] = useState({}) // { 'yyyy-MM-dd': [milestone, ...] }
  const tooltipRef = useRef(null)

  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const leadingBlanks = getDay(monthStart)

  // Fetch daily_tasks AND goal_landmarks for the viewed month
  useEffect(() => {
    if (!userId) return
    const fromDate = format(monthStart, 'yyyy-MM-dd')
    const toDate = format(monthEnd, 'yyyy-MM-dd')

    const buildMap = (items, dateField) => {
      const map = {}
      ;(items || []).forEach((item) => {
        const key = item[dateField] ? item[dateField].slice(0, 10) : null
        if (!key || key < fromDate || key > toDate) return
        if (!map[key]) map[key] = []
        map[key].push(item)
      })
      return map
    }

    // Expand each milestone across every day in its start_date → target_date range
    const buildMilestoneMap = (milestones, monthFrom, monthTo) => {
      const map = {}
      milestones.forEach((m) => {
        const start = m.start_date ? m.start_date.slice(0, 10) : m.target_date.slice(0, 10)
        const end = m.target_date ? m.target_date.slice(0, 10) : start
        // Clamp to the visible month
        const clampedStart = start < monthFrom ? monthFrom : start
        const clampedEnd = end > monthTo ? monthTo : end
        let cur = clampedStart
        while (cur <= clampedEnd) {
          if (!map[cur]) map[cur] = []
          map[cur].push(m)
          // Increment by 1 day
          const d = new Date(cur)
          d.setDate(d.getDate() + 1)
          cur = format(d, 'yyyy-MM-dd')
        }
      })
      return map
    }

    if (userId === 'guest') {
      const storedTasks = sessionStorage.getItem('af_guest_tasks')
      const storedLandmarks = sessionStorage.getItem('af_guest_landmarks')
      const rawLandmarks = storedLandmarks ? JSON.parse(storedLandmarks) : []
      Promise.resolve().then(() => {
        setTaskMap(buildMap(storedTasks ? JSON.parse(storedTasks) : [], 'due_date'))
        setMilestoneMap(buildMilestoneMap(rawLandmarks, fromDate, toDate))
      })
      return
    }

    Promise.all([
      supabase
        .from('daily_tasks')
        .select('id, title, due_date, is_done')
        .eq('user_id', userId)
        .gte('due_date', fromDate)
        .lte('due_date', toDate),
      supabase
        .from('goal_landmarks')
        .select('id, title, start_date, target_date, is_completed')
        .eq('user_id', userId)
        // fetch any milestone that overlaps the viewed month
        .lte('start_date', toDate)
        .gte('target_date', fromDate),
    ]).then(([tasksRes, landmarksRes]) => {
      if (tasksRes.error) console.error(tasksRes.error)
      if (landmarksRes.error) console.error(landmarksRes.error)
      setTaskMap(buildMap(tasksRes.data, 'due_date'))
      setMilestoneMap(buildMilestoneMap(landmarksRes.data || [], fromDate, toDate))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, viewDate])

  const getTasksForDay = (day) => taskMap[format(day, 'yyyy-MM-dd')] || []
  const getMilestonesForDay = (day) => milestoneMap[format(day, 'yyyy-MM-dd')] || []

  const getHeatLevel = (tasks) => {
    const count = tasks.length
    if (count === 0) return 0
    if (count <= 2) return 1
    if (count <= 4) return 2
    return 3
  }

  const heatColors = [
    'bg-white/[0.04] border border-white/[0.06]',
    'bg-royal/20 border border-royal/30',
    'bg-royal/40 border border-royal/50',
    'bg-royal/70 border border-royal/80',
  ]

  const heatTextColors = ['text-slate/60', 'text-royal-light/80', 'text-royal-light', 'text-white']

  // Close tooltip on outside click
  useEffect(() => {
    const handler = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setTooltip(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleDayMouseEnter = (e, day, tasks, milestones) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ day, tasks, milestones, rect })
  }

  return (
    <div className="select-none">
      {/* Month navigation header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate((d) => subMonths(d, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate hover:text-white hover:bg-white/[0.08] transition-all duration-200"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-white font-display tracking-wide">
          {format(viewDate, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate hover:text-white hover:bg-white/[0.08] transition-all duration-200"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] font-medium text-slate/70 text-center py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 relative">
        {/* Leading blanks */}
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const tasks = getTasksForDay(day)
          const milestones = getMilestonesForDay(day)
          const level = getHeatLevel(tasks)
          const isToday = isSameDay(day, today)
          const doneTasks = tasks.filter((t) => t.is_done)
          const hasMilestone = milestones.length > 0

          return (
            <motion.div
              key={day.toISOString()}
              whileHover={{ scale: (tasks.length > 0 || hasMilestone) ? 1.12 : 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onMouseEnter={(e) => handleDayMouseEnter(e, day, tasks, milestones)}
              onMouseLeave={() => setTooltip(null)}
              className={cn(
                'aspect-square rounded-lg flex flex-col items-center justify-center cursor-default transition-all duration-200 relative',
                heatColors[level],
                isToday && 'ring-2 ring-royal/70 ring-offset-1 ring-offset-transparent',
                (tasks.length > 0 || hasMilestone) && 'cursor-pointer'
              )}
            >
              <span
                className={cn(
                  'text-[10px] sm:text-[11px] font-medium leading-none',
                  isToday ? 'text-royal-light font-bold' : heatTextColors[level]
                )}
              >
                {format(day, 'd')}
              </span>

              {/* Indicator dots row */}
              {(tasks.length > 0 || hasMilestone) && (
                <div className="flex gap-0.5 mt-0.5">
                  {/* Task dot */}
                  {tasks.length > 0 && (
                    <span
                      className={cn(
                        'w-1 h-1 rounded-full',
                        doneTasks.length === tasks.length
                          ? 'bg-royal-light'
                          : level >= 2 ? 'bg-white/60' : 'bg-royal/60'
                      )}
                    />
                  )}
                  {/* Milestone diamond dot */}
                  {hasMilestone && (
                    <span
                      className={cn(
                        'w-1 h-1 rounded-sm rotate-45',
                        milestones.every((m) => m.is_completed)
                          ? 'bg-amber-400'
                          : 'bg-amber-400/60'
                      )}
                    />
                  )}
                </div>
              )}
            </motion.div>
          )
        })}

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              ref={tooltipRef}
              key="tooltip"
              initial={{ opacity: 0, scale: 0.92, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 pointer-events-none"
              style={{
                bottom: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="glass rounded-xl p-3 shadow-lift min-w-[170px] max-w-[230px] border border-royal/20">
                <p className="text-[11px] font-semibold text-royal-light mb-2 font-display">
                  {format(tooltip.day, 'EEEE, MMM d')}
                </p>

                {tooltip.tasks.length === 0 && tooltip.milestones.length === 0 ? (
                  <p className="text-[10px] text-slate/60 italic">No tasks planned for this day</p>
                ) : (
                  <div className="space-y-2">
                    {/* Tasks section */}
                    {tooltip.tasks.length > 0 && (
                      <div>
                        <p className="text-[9px] font-semibold text-slate/50 uppercase tracking-wider mb-1">Tasks</p>
                        <ul className="space-y-1">
                          {tooltip.tasks.slice(0, 5).map((t) => (
                            <li key={t.id} className="flex items-start gap-1.5">
                              <span
                                className={cn(
                                  'mt-[3px] w-1.5 h-1.5 rounded-full flex-shrink-0',
                                  t.is_done ? 'bg-royal-light' : 'bg-slate/50'
                                )}
                              />
                              <span
                                className={cn(
                                  'text-[10px] leading-tight',
                                  t.is_done ? 'line-through text-slate/60' : 'text-white/80'
                                )}
                              >
                                {t.title}
                              </span>
                            </li>
                          ))}
                          {tooltip.tasks.length > 5 && (
                            <li className="text-[10px] text-slate/50 pl-3">
                              +{tooltip.tasks.length - 5} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Milestones section */}
                    {tooltip.milestones.length > 0 && (
                      <div>
                        {tooltip.tasks.length > 0 && (
                          <div className="border-t border-white/[0.06] my-1.5" />
                        )}
                        <p className="text-[9px] font-semibold text-amber-400/70 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          Milestones
                        </p>
                        <ul className="space-y-1">
                          {tooltip.milestones.map((m) => (
                            <li key={m.id} className="flex items-start gap-1.5">
                              <span
                                className={cn(
                                  'mt-[3px] w-1.5 h-1.5 rounded-sm rotate-45 flex-shrink-0',
                                  m.is_completed ? 'bg-amber-400' : 'bg-amber-400/50'
                                )}
                              />
                              <span
                                className={cn(
                                  'text-[10px] leading-tight',
                                  m.is_completed ? 'line-through text-slate/60' : 'text-amber-100/80'
                                )}
                              >
                                {m.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
    deleteGoalTask,
    addLandmark,
    toggleLandmark,
    updateLandmark,
    deleteLandmark,
  } = useGoals(session.user.id)

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(() => new Date())
  const [endDate, setEndDate] = useState(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

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
            <h2 className="card-title text-lg">Monthly Overview</h2>
          </div>
          <CalendarHeatmap userId={session.user.id} />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
            <span className="text-xs text-slate">No tasks</span>
            <div className="flex gap-1 items-center">
              {[0, 1, 2, 3].map((l) => (
                <div
                  key={l}
                  className={cn(
                    'w-3 h-3 rounded border',
                    l === 0
                      ? 'bg-white/[0.04] border-white/[0.06]'
                      : l === 1
                      ? 'bg-royal/20 border-royal/30'
                      : l === 2
                      ? 'bg-royal/40 border-royal/50'
                      : 'bg-royal/70 border-royal/80'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-slate">Many tasks</span>
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
                onUpdateLandmark={updateLandmark}
                onDeleteLandmark={deleteLandmark}
                onDeleteGoal={deleteGoal}
                onDeleteTask={deleteGoalTask}
              />
            ))}
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}
