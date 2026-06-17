import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useGoals(userId) {
  const [goals, setGoals] = useState([])
  const [goalTasks, setGoalTasks] = useState([])
  const [landmarks, setLandmarks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const [goalsRes, tasksRes, landmarksRes] = await Promise.all([
      supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('goal_tasks').select('*').eq('user_id', userId),
      supabase.from('goal_landmarks').select('*').eq('user_id', userId).order('target_date', { ascending: true }),
    ])

    if (goalsRes.error) console.error(goalsRes.error)
    if (tasksRes.error) console.error(tasksRes.error)
    if (landmarksRes.error) console.error(landmarksRes.error)

    setGoals(goalsRes.data || [])
    setGoalTasks(tasksRes.data || [])
    setLandmarks(landmarksRes.data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const addGoal = async (goal) => {
    const { data, error } = await supabase
      .from('goals')
      .insert({ ...goal, user_id: userId })
      .select()
      .single()

    if (error) {
      alert(error.message)
      return null
    }
    setGoals((prev) => [data, ...prev])
    return data
  }

  const deleteGoal = async (goalId) => {
    const { error } = await supabase.from('goals').delete().eq('id', goalId)
    if (error) {
      alert(error.message)
      return
    }
    setGoals((prev) => prev.filter((g) => g.id !== goalId))
    setGoalTasks((prev) => prev.filter((t) => t.goal_id !== goalId))
    setLandmarks((prev) => prev.filter((l) => l.goal_id !== goalId))
  }

  const addGoalTask = async (taskOrTasks) => {
    // Support both single object and array of objects
    const items = Array.isArray(taskOrTasks) ? taskOrTasks : [taskOrTasks]
    const payload = items.map((t) => ({ ...t, user_id: userId }))

    const { data, error } = await supabase
      .from('goal_tasks')
      .insert(payload)
      .select()

    if (error) {
      alert(error.message)
      return null
    }
    setGoalTasks((prev) => [...prev, ...(Array.isArray(data) ? data : [data])])
    return data
  }

  const toggleGoalTask = async (task) => {
    const { data, error } = await supabase
      .from('goal_tasks')
      .update({ is_done: !task.is_done })
      .eq('id', task.id)
      .select()
      .single()

    if (error) {
      alert(error.message)
      return
    }
    setGoalTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)))
  }

  const addLandmark = async (landmark) => {
    const { data, error } = await supabase
      .from('goal_landmarks')
      .insert({ ...landmark, user_id: userId })
      .select()
      .single()

    if (error) {
      alert(error.message)
      return null
    }
    setLandmarks((prev) => [...prev, data])
    return data
  }

  const toggleLandmark = async (landmark) => {
    const { data, error } = await supabase
      .from('goal_landmarks')
      .update({ is_completed: !landmark.is_completed })
      .eq('id', landmark.id)
      .select()
      .single()

    if (error) {
      alert(error.message)
      return
    }
    setLandmarks((prev) => prev.map((l) => (l.id === landmark.id ? data : l)))
  }

  const getGoalProgress = (goalId) => {
    const tasks = goalTasks.filter((t) => t.goal_id === goalId)
    const done = tasks.filter((t) => t.is_done)
    return tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0
  }

  const activeGoals = goals.filter((g) => {
    const today = new Date().toISOString().split('T')[0]
    return g.start_date <= today && g.end_date >= today
  })

  return {
    goals,
    goalTasks,
    landmarks,
    loading,
    activeGoals,
    addGoal,
    deleteGoal,
    addGoalTask,
    toggleGoalTask,
    addLandmark,
    toggleLandmark,
    getGoalProgress,
    refetch: fetchAll,
  }
}
