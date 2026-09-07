export const APP_CONFIG = {
  name: 'À Faire',
  tagline: 'Where Intent Becomes Action',
  version: '1.0.0',
  description: 'A modern personal productivity and goal-tracking web application.',
}

export const STORAGE_KEYS = {
  THEME: 'a-faire-theme',
  TASKS: 'a-faire-daily-tasks',
  GOALS: 'a-faire-goals',
  GUEST_SESSION: 'a-faire-guest-session',
}

export const TASK_PRIORITIES = {
  LOW: { value: 'low', label: 'Low', color: 'text-slate-400', badgeVariant: 'default' },
  MEDIUM: { value: 'medium', label: 'Medium', color: 'text-amber-400', badgeVariant: 'warning' },
  HIGH: { value: 'high', label: 'High', color: 'text-rose-400', badgeVariant: 'danger' },
}

export const GOAL_STATUSES = {
  NOT_STARTED: { value: 'not_started', label: 'Not Started', badgeVariant: 'default' },
  IN_PROGRESS: { value: 'in_progress', label: 'In Progress', badgeVariant: 'primary' },
  COMPLETED: { value: 'completed', label: 'Completed', badgeVariant: 'success' },
}
