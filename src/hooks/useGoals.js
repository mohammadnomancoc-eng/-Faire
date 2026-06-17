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

    if (userId === 'guest') {
      const storedGoals = sessionStorage.getItem('af_guest_goals')
      const storedTasks = sessionStorage.getItem('af_guest_goal_tasks')
      const storedLandmarks = sessionStorage.getItem('af_guest_landmarks')

      setGoals(storedGoals ? JSON.parse(storedGoals) : [])
      setGoalTasks(storedTasks ? JSON.parse(storedTasks) : [])
      setLandmarks(storedLandmarks ? JSON.parse(storedLandmarks) : [])
      setLoading(false)
      return
    }

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

  useEffect(() => {
    if (userId === 'guest') {
      const handleDataChange = () => {
        fetchAll()
      }
      window.addEventListener('af_guest_data_changed', handleDataChange)
      return () => {
        window.removeEventListener('af_guest_data_changed', handleDataChange)
      }
    }
  }, [userId, fetchAll])

  const addGoal = async (goal) => {
    if (userId === 'guest') {
      const newGoal = {
        ...goal,
        id: 'g_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        created_at: new Date().toISOString()
      }
      const stored = sessionStorage.getItem('af_guest_goals')
      const allGoals = stored ? JSON.parse(stored) : []
      allGoals.unshift(newGoal)
      sessionStorage.setItem('af_guest_goals', JSON.stringify(allGoals))
      setGoals((prev) => [newGoal, ...prev])
      window.dispatchEvent(new Event('af_guest_data_changed'))
      return newGoal
    }

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
    if (userId === 'guest') {
      const storedGoals = sessionStorage.getItem('af_guest_goals')
      const allGoals = storedGoals ? JSON.parse(storedGoals) : []
      const updatedGoals = allGoals.filter(g => g.id !== goalId)
      sessionStorage.setItem('af_guest_goals', JSON.stringify(updatedGoals))

      const storedTasks = sessionStorage.getItem('af_guest_goal_tasks')
      const allTasks = storedTasks ? JSON.parse(storedTasks) : []
      const updatedTasks = allTasks.filter(t => t.goal_id !== goalId)
      sessionStorage.setItem('af_guest_goal_tasks', JSON.stringify(updatedTasks))

      const storedLandmarks = sessionStorage.getItem('af_guest_landmarks')
      const allLandmarks = storedLandmarks ? JSON.parse(storedLandmarks) : []
      const updatedLandmarks = allLandmarks.filter(l => l.goal_id !== goalId)
      sessionStorage.setItem('af_guest_landmarks', JSON.stringify(updatedLandmarks))

      // Also clean up daily tasks that are linked to these goal tasks!
      const storedDailyTasks = sessionStorage.getItem('af_guest_tasks')
      const allDailyTasks = storedDailyTasks ? JSON.parse(storedDailyTasks) : []
      const updatedDailyTasks = allDailyTasks.filter(t => !updatedTasks.some(gt => gt.id === t.goal_task_id))
      sessionStorage.setItem('af_guest_tasks', JSON.stringify(updatedDailyTasks))

      setGoals((prev) => prev.filter((g) => g.id !== goalId))
      setGoalTasks((prev) => prev.filter((t) => t.goal_id !== goalId))
      setLandmarks((prev) => prev.filter((l) => l.goal_id !== goalId))

      window.dispatchEvent(new Event('af_guest_data_changed'))
      return
    }

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
    if (userId === 'guest') {
      const items = Array.isArray(taskOrTasks) ? taskOrTasks : [taskOrTasks]
      const insertedTasks = items.map(t => ({
        ...t,
        id: 'gt_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        created_at: new Date().toISOString(),
        is_done: t.is_done || false
      }))

      const stored = sessionStorage.getItem('af_guest_goal_tasks')
      const allGoalTasks = stored ? JSON.parse(stored) : []
      allGoalTasks.push(...insertedTasks)
      sessionStorage.setItem('af_guest_goal_tasks', JSON.stringify(allGoalTasks))

      // Sync to daily_tasks
      const dailyPayload = insertedTasks.map((gt) => ({
        id: 'dgt_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        title: gt.title,
        due_date: gt.due_date,
        is_done: gt.is_done,
        goal_task_id: gt.id,
        created_at: new Date().toISOString()
      }))

      const storedDaily = sessionStorage.getItem('af_guest_tasks')
      const allDailyTasks = storedDaily ? JSON.parse(storedDaily) : []
      allDailyTasks.push(...dailyPayload)
      sessionStorage.setItem('af_guest_tasks', JSON.stringify(allDailyTasks))

      setGoalTasks((prev) => [...prev, ...insertedTasks])
      window.dispatchEvent(new Event('af_guest_data_changed'))
      return insertedTasks
    }

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

    const insertedTasks = Array.isArray(data) ? data : [data]

    // Sync to daily_tasks
    const dailyPayload = insertedTasks.map((gt) => ({
      user_id: userId,
      title: gt.title,
      due_date: gt.due_date,
      is_done: gt.is_done,
      goal_task_id: gt.id,
    }))

    const { error: dailyError } = await supabase
      .from('daily_tasks')
      .insert(dailyPayload)

    if (dailyError) {
      console.error('Failed to sync to daily_tasks:', dailyError)
    }

    setGoalTasks((prev) => [...prev, ...insertedTasks])
    return data
  }

  const toggleGoalTask = async (task) => {
    if (userId === 'guest') {
      const stored = sessionStorage.getItem('af_guest_goal_tasks')
      const allGoalTasks = stored ? JSON.parse(stored) : []
      const updatedGoalTasks = allGoalTasks.map(t => {
        if (t.id === task.id) {
          return { ...t, is_done: !t.is_done }
        }
        return t
      })
      sessionStorage.setItem('af_guest_goal_tasks', JSON.stringify(updatedGoalTasks))

      const updatedTask = updatedGoalTasks.find(t => t.id === task.id)

      // Sync with daily_tasks
      const storedDaily = sessionStorage.getItem('af_guest_tasks')
      const allDaily = storedDaily ? JSON.parse(storedDaily) : []
      const updatedDaily = allDaily.map(t => {
        if (t.goal_task_id === task.id) {
          return { ...t, is_done: !task.is_done }
        }
        return t
      })
      sessionStorage.setItem('af_guest_tasks', JSON.stringify(updatedDaily))

      setGoalTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)))
      window.dispatchEvent(new Event('af_guest_data_changed'))
      return
    }

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

    // Sync with daily_tasks
    const { error: syncError } = await supabase
      .from('daily_tasks')
      .update({ is_done: !task.is_done })
      .eq('goal_task_id', task.id)

    if (syncError) {
      console.error('Failed to sync toggle to daily_tasks:', syncError)
    }

    setGoalTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)))
  }

  const addLandmark = async (landmark) => {
    if (userId === 'guest') {
      const newLandmark = {
        ...landmark,
        id: 'l_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        created_at: new Date().toISOString(),
        is_completed: false
      }
      const stored = sessionStorage.getItem('af_guest_landmarks')
      const allLandmarks = stored ? JSON.parse(stored) : []
      allLandmarks.push(newLandmark)
      sessionStorage.setItem('af_guest_landmarks', JSON.stringify(allLandmarks))

      setLandmarks((prev) => [...prev, newLandmark])
      window.dispatchEvent(new Event('af_guest_data_changed'))
      return newLandmark
    }

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
    if (userId === 'guest') {
      const stored = sessionStorage.getItem('af_guest_landmarks')
      const allLandmarks = stored ? JSON.parse(stored) : []
      const updatedLandmarks = allLandmarks.map(l => {
        if (l.id === landmark.id) {
          return { ...l, is_completed: !l.is_completed }
        }
        return l
      })
      sessionStorage.setItem('af_guest_landmarks', JSON.stringify(updatedLandmarks))

      const updated = updatedLandmarks.find(l => l.id === landmark.id)
      setLandmarks((prev) => prev.map((l) => (l.id === landmark.id ? updated : l)))
      window.dispatchEvent(new Event('af_guest_data_changed'))
      return
    }

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

  const updateLandmark = async (landmarkId, updates) => {
    if (userId === 'guest') {
      const stored = sessionStorage.getItem('af_guest_landmarks')
      const allLandmarks = stored ? JSON.parse(stored) : []
      const updatedLandmarks = allLandmarks.map(l => {
        if (l.id === landmarkId) {
          return { ...l, ...updates }
        }
        return l
      })
      sessionStorage.setItem('af_guest_landmarks', JSON.stringify(updatedLandmarks))

      const updated = updatedLandmarks.find(l => l.id === landmarkId)
      setLandmarks((prev) => prev.map((l) => (l.id === landmarkId ? updated : l)))
      window.dispatchEvent(new Event('af_guest_data_changed'))
      return updated
    }

    const { data, error } = await supabase
      .from('goal_landmarks')
      .update(updates)
      .eq('id', landmarkId)
      .select()
      .single()

    if (error) {
      alert(error.message)
      return null
    }
    setLandmarks((prev) => prev.map((l) => (l.id === landmarkId ? data : l)))
    return data
  }

  const deleteLandmark = async (landmarkId) => {
    if (userId === 'guest') {
      const stored = sessionStorage.getItem('af_guest_landmarks')
      const allLandmarks = stored ? JSON.parse(stored) : []
      const updatedLandmarks = allLandmarks.filter(l => l.id !== landmarkId)
      sessionStorage.setItem('af_guest_landmarks', JSON.stringify(updatedLandmarks))

      setLandmarks((prev) => prev.filter((l) => l.id !== landmarkId))
      window.dispatchEvent(new Event('af_guest_data_changed'))
      return
    }

    const { error } = await supabase.from('goal_landmarks').delete().eq('id', landmarkId)
    if (error) {
      alert(error.message)
      return
    }
    setLandmarks((prev) => prev.filter((l) => l.id !== landmarkId))
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
    updateLandmark,
    deleteLandmark,
    getGoalProgress,
    refetch: fetchAll,
  }
}
