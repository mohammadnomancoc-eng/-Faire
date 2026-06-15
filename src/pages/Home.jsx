import { useState } from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Target, Sparkles } from 'lucide-react'
import { MotivationalQuote } from '../components/shared/MotivationalQuote'
import { ProgressDisplay } from '../components/daily/ProgressDisplay'
import { DailyTaskCard } from '../components/daily/DailyTaskCard'
import { GlassCard } from '../components/ui/GlassCard'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { useGoals } from '../hooks/useGoals'
import { ProgressCircle } from '../components/shared/ProgressCircle'

export function Home({ session }) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [viewMode, setViewMode] = useState('circle')
  const { tasks, toggleTask, percentage, loading } = useDailyTasks(session.user.id, today)
  const { activeGoals, getGoalProgress } = useGoals(session.user.id)

  const completedTasks = tasks.filter((t) => t.is_done).length
  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-slate text-sm mb-1">{format(new Date(), 'EEEE, MMMM d')}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
          {greeting()},{' '}
          <span className="gradient-text">
            {session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'there'}
          </span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5">
        {/* Progress widget - large */}
        <GlassCard hover className="md:col-span-2 lg:col-span-5 p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-royal-light" />
            <h2 className="card-title">Today&apos;s Progress</h2>
          </div>
          <ProgressDisplay
            percentage={percentage}
            viewMode={viewMode}
            setViewMode={setViewMode}
            compact
          />
          <p className="text-sm text-slate mt-2 text-center">
            {completedTasks} of {tasks.length} tasks complete
          </p>
        </GlassCard>

        {/* Quick stats */}
        <GlassCard hover className="lg:col-span-3 p-6 flex flex-col justify-between">
          <div>
            <Calendar className="w-5 h-5 text-royal-light mb-3" />
            <p className="text-3xl font-display font-bold text-white">{tasks.length}</p>
            <p className="text-sm text-slate mt-1">Tasks today</p>
          </div>
          <Link
            to="/daily"
            className="mt-4 text-sm text-royal-light hover:text-white flex items-center gap-1 transition-colors"
          >
            Open Daily Planner <ArrowRight className="w-3 h-3" />
          </Link>
        </GlassCard>

        <GlassCard hover className="lg:col-span-4 p-6 flex flex-col justify-between">
          <div>
            <Target className="w-5 h-5 text-royal-light mb-3" />
            <p className="text-3xl font-display font-bold text-white">{activeGoals.length}</p>
            <p className="text-sm text-slate mt-1">Active goals</p>
          </div>
          <Link
            to="/month"
            className="mt-4 text-sm text-royal-light hover:text-white flex items-center gap-1 transition-colors"
          >
            View Month Planner <ArrowRight className="w-3 h-3" />
          </Link>
        </GlassCard>

        {/* Quote */}
        <GlassCard hover className="md:col-span-2 lg:col-span-12 p-6">
          <MotivationalQuote session={session} />
        </GlassCard>

        {/* Tasks */}
        <GlassCard hover className="md:col-span-2 lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="card-title">Today&apos;s Tasks</h2>
            <Link
              to="/daily"
              className="text-xs text-royal-light hover:text-white transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-slate text-sm text-center py-8">
              No tasks for today.{' '}
              <Link to="/daily" className="text-royal-light hover:text-white">
                Add some →
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 4).map((task) => (
                <DailyTaskCard key={task.id} task={task} onToggle={toggleTask} />
              ))}
              {tasks.length > 4 && (
                <p className="text-xs text-slate text-center pt-2">
                  +{tasks.length - 4} more tasks
                </p>
              )}
            </div>
          )}
        </GlassCard>

        {/* Goals */}
        <GlassCard hover className="lg:col-span-5 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="card-title">Active Goals</h2>
            <Link
              to="/month"
              className="text-xs text-royal-light hover:text-white transition-colors flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {activeGoals.length === 0 ? (
            <p className="text-slate text-sm text-center py-8">
              No active goals.{' '}
              <Link to="/month" className="text-royal-light hover:text-white">
                Create one →
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              {activeGoals.slice(0, 3).map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-royal/20 hover:shadow-[0_0_30px_rgba(62,113,192,0.14)] transition-all duration-300"
                >
                  <ProgressCircle percentage={getGoalProgress(goal.id)} size={56} strokeWidth={4} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white text-sm truncate">{goal.title}</h3>
                    <p className="text-xs text-slate mt-0.5">
                      {format(new Date(goal.start_date), 'MMM d')} —{' '}
                      {format(new Date(goal.end_date), 'MMM d')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
