import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useDailyTasks(userId, dueDate) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!userId || !dueDate) return
    setLoading(true)

    if (userId === 'guest') {
      const stored = sessionStorage.getItem('af_guest_tasks')
      const allTasks = stored ? JSON.parse(stored) : []
      const filtered = allTasks.filter((t) => t.due_date === dueDate)
      setTasks(filtered)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('due_date', dueDate)
      .order('created_at', { ascending: true })

    if (error) console.error(error)
    setTasks(data || [])
    setLoading(false)
  }, [userId, dueDate])

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchTasks()
    })
  }, [fetchTasks])

  useEffect(() => {
    if (userId === 'guest') {
      const handleDataChange = () => {
        fetchTasks()
      }
      window.addEventListener('af_guest_data_changed', handleDataChange)
      return () => {
        window.removeEventListener('af_guest_data_changed', handleDataChange)
      }
    }
  }, [userId, fetchTasks])

  const addTask = async (task) => {
    if (userId === 'guest') {
      const newTask = {
        ...task,
        id: 'gt_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        created_at: new Date().toISOString(),
        is_done: task.is_done || false,
      }
      const stored = sessionStorage.getItem('af_guest_tasks')
      const allTasks = stored ? JSON.parse(stored) : []
      allTasks.push(newTask)
      sessionStorage.setItem('af_guest_tasks', JSON.stringify(allTasks))
      setTasks((prev) => [...prev, newTask])
      window.dispatchEvent(new Event('af_guest_data_changed'))
      return newTask
    }

    const { data, error } = await supabase
      .from('daily_tasks')
      .insert({ ...task, user_id: userId })
      .select()
      .single()

    if (error) {
      alert(error.message)
      return null
    }
    setTasks((prev) => [...prev, data])
    return data
  }

  const toggleTask = async (task) => {
    if (userId === 'guest') {
      const stored = sessionStorage.getItem('af_guest_tasks')
      const allTasks = stored ? JSON.parse(stored) : []
      const updatedTasks = allTasks.map((t) => {
        if (t.id === task.id) {
          return { ...t, is_done: !t.is_done }
        }
        return t
      })
      sessionStorage.setItem('af_guest_tasks', JSON.stringify(updatedTasks))
      
      const updatedTask = updatedTasks.find((t) => t.id === task.id)

      if (task.goal_task_id) {
        const storedGoalTasks = sessionStorage.getItem('af_guest_goal_tasks')
        const allGoalTasks = storedGoalTasks ? JSON.parse(storedGoalTasks) : []
        const updatedGoalTasks = allGoalTasks.map((gt) => {
          if (gt.id === task.goal_task_id) {
            return { ...gt, is_done: !task.is_done }
          }
          return gt
        })
        sessionStorage.setItem('af_guest_goal_tasks', JSON.stringify(updatedGoalTasks))
      }

      setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)))
      window.dispatchEvent(new Event('af_guest_data_changed'))
      return
    }

    const { data, error } = await supabase
      .from('daily_tasks')
      .update({ is_done: !task.is_done })
      .eq('id', task.id)
      .select()
      .single()

    if (error) {
      alert(error.message)
      return
    }

    if (task.goal_task_id) {
      const { error: syncError } = await supabase
        .from('goal_tasks')
        .update({ is_done: !task.is_done })
        .eq('id', task.goal_task_id)
      if (syncError) {
        console.error('Failed to sync toggle to goal_tasks:', syncError)
      }
    }

    setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)))
  }

  const deleteTask = async (taskId) => {
    if (userId === 'guest') {
      const stored = sessionStorage.getItem('af_guest_tasks')
      const allTasks = stored ? JSON.parse(stored) : []
      const taskToDelete = allTasks.find((t) => t.id === taskId)
      const updatedTasks = allTasks.filter((t) => t.id !== taskId)
      sessionStorage.setItem('af_guest_tasks', JSON.stringify(updatedTasks))

      if (taskToDelete && taskToDelete.goal_task_id) {
        const storedGoalTasks = sessionStorage.getItem('af_guest_goal_tasks')
        const allGoalTasks = storedGoalTasks ? JSON.parse(storedGoalTasks) : []
        const updatedGoalTasks = allGoalTasks.filter((gt) => gt.id !== taskToDelete.goal_task_id)
        sessionStorage.setItem('af_guest_goal_tasks', JSON.stringify(updatedGoalTasks))
      }

      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      window.dispatchEvent(new Event('af_guest_data_changed'))
      return
    }

    const taskToDelete = tasks.find((t) => t.id === taskId)
    const { error } = await supabase.from('daily_tasks').delete().eq('id', taskId)
    if (error) {
      alert(error.message)
      return
    }

    if (taskToDelete && taskToDelete.goal_task_id) {
      const { error: syncError } = await supabase
        .from('goal_tasks')
        .delete()
        .eq('id', taskToDelete.goal_task_id)
      if (syncError) {
        console.error('Failed to sync delete to goal_tasks:', syncError)
      }
    }

    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const completedCount = tasks.filter((t) => t.is_done).length
  const percentage =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100)

  return { tasks, loading, addTask, toggleTask, deleteTask, percentage, refetch: fetchTasks }
}
