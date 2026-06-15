import { ProgressDisplay } from '../daily/ProgressDisplay'

export function GoalProgressDisplay({ percentage, viewMode, setViewMode, label }) {
  return (
    <ProgressDisplay
      percentage={percentage}
      viewMode={viewMode}
      setViewMode={setViewMode}
      label={label}
    />
  )
}
