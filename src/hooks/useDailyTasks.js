import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useDailyTasks(userId, dueDate) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!userId || !dueDate) return
    setLoading(true)
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
    fetchTasks()
  }, [fetchTasks])

  const addTask = async (task) => {
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
    setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)))
  }

  const deleteTask = async (taskId) => {
    const { error } = await supabase.from('daily_tasks').delete().eq('id', taskId)
    if (error) {
      alert(error.message)
      return
    }
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const completedCount = tasks.filter((t) => t.is_done).length
  const percentage =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100)

  return { tasks, loading, addTask, toggleTask, deleteTask, percentage, refetch: fetchTasks }
}
