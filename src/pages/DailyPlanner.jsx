import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Plus, Calendar, Focus, TrendingUp } from 'lucide-react'
import { ProgressDisplay } from '../components/daily/ProgressDisplay'
import { DailyTaskCard } from '../components/daily/DailyTaskCard'
import { AddTaskModal } from '../components/daily/AddTaskModal'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ProgressCircle } from '../components/shared/ProgressCircle'
import { useDailyTasks } from '../hooks/useDailyTasks'

export function DailyPlanner({ session }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('circle')
  const [modalOpen, setModalOpen] = useState(false)

  const dueDate = format(selectedDate, 'yyyy-MM-dd')
  const { tasks, addTask, toggleTask, deleteTask, percentage, loading } = useDailyTasks(
    session.user.id,
    dueDate
  )

  const [orderedIds, setOrderedIds] = useState([])
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks])

  const sortedTasks = useMemo(() => {
    if (orderedIds.length === 0) return tasks
    return [...tasks].sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id))
  }, [tasks, orderedIds])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const ids = orderedIds.length ? orderedIds : taskIds
    const oldIndex = ids.indexOf(active.id)
    const newIndex = ids.indexOf(over.id)
    setOrderedIds(arrayMove(ids, oldIndex, newIndex))
  }

  const completedCount = tasks.filter((t) => t.is_done).length
  const pendingTasks = sortedTasks.filter((t) => !t.is_done)
  const doneTasks = sortedTasks.filter((t) => t.is_done)

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-slate text-sm mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Daily Workspace
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Daily Planner
          </h1>
          <p className="text-slate mt-2">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="input-field text-sm w-auto"
          />
          <Button variant="primary" onClick={() => setModalOpen(true)} icon={Plus}>
            Add task
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        {/* Sticky progress sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard className="p-6 lg:sticky lg:top-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-royal-light" />
              <h2 className="card-title text-lg">Daily Progress</h2>
            </div>
            <div className="flex justify-center mb-4">
              <ProgressCircle percentage={percentage} size={140} />
            </div>
            <ProgressDisplay
              percentage={percentage}
              viewMode={viewMode}
              setViewMode={setViewMode}
              compact
            />
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Focus className="w-4 h-4 text-royal-light" />
              <h3 className="font-medium text-white text-sm">Today&apos;s Focus</h3>
            </div>
            {pendingTasks.length > 0 ? (
              <p className="text-sm text-slate">
                Focus on:{' '}
                <span className="text-white font-medium">{pendingTasks[0].title}</span>
              </p>
            ) : (
              <p className="text-sm text-slate">
                {doneTasks.length > 0
                  ? 'All tasks complete — great work!'
                  : 'Add a task to set your focus.'}
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-xl font-display font-bold text-white">{pendingTasks.length}</p>
                <p className="text-[10px] text-slate uppercase tracking-wider">Remaining</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-xl font-display font-bold text-royal-light">{completedCount}</p>
                <p className="text-[10px] text-slate uppercase tracking-wider">Done</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Timeline task list */}
        <div className="lg:col-span-8">
          <GlassCard className="p-6">
            <h2 className="card-title text-lg mb-6">Timeline</h2>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate mb-4">No tasks for this day.</p>
                <Button variant="primary" onClick={() => setModalOpen(true)} icon={Plus}>
                  Add your first task
                </Button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                  <div className="relative space-y-3 pl-6">
                    <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-royal/40 via-royal/20 to-transparent" />

                    <AnimatePresence mode="popLayout">
                      {sortedTasks.map((task, i) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="relative"
                        >
                          <div className="absolute -left-[18px] top-5 w-2.5 h-2.5 rounded-full bg-royal/60 border-2 border-navy" />
                          <DailyTaskCard
                            task={task}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                            sortable
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </GlassCard>
        </div>
      </div>

      <AddTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addTask}
        defaultDate={dueDate}
      />
    </div>
  )
}
