import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useNotifications(userId) {
  const notifiedRef = useRef(new Set())

  useEffect(() => {
    if (!userId) return
    if (!('Notification' in window)) return

    Notification.requestPermission()

    const interval = setInterval(async () => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const today = now.toISOString().split('T')[0]

      const { data: tasks } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('due_date', today)
        .eq('is_done', false)
        .not('reminder_time', 'is', null)

      tasks?.forEach((task) => {
        const reminderTime = task.reminder_time?.slice(0, 5)
        if (reminderTime !== currentTime) return

        const key = `${task.id}-${today}-${currentTime}`
        if (notifiedRef.current.has(key)) return
        notifiedRef.current.add(key)

        if (Notification.permission === 'granted') {
          new Notification(`Reminder: ${task.title}`, {
            body: task.description || 'Time to work on this task!',
            icon: '/favicon.svg',
          })
        }
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [userId])
}
