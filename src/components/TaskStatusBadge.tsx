import { TaskStatus } from '@/lib/types'

const statusStyles: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  [TaskStatus.Assigned]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [TaskStatus.Completed]: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  [TaskStatus.Failed]: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  [TaskStatus.Cancelled]: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
      {status}
    </span>
  )
}
