'use client'

import { Task } from '@/lib/types'
import { TaskStatusBadge } from './TaskStatusBadge'
import { shortenAddress, formatQfc, formatTimeAgo } from '@/lib/format'

interface LiveFeedProps {
  tasks: Task[]
  loading: boolean
}

export function LiveFeed({ tasks, loading }: LiveFeedProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">No tasks found</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Task ID</th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Model</th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 hidden sm:table-cell">Submitter</th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 hidden md:table-cell">Miner</th>
            <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 hidden sm:table-cell">Fee</th>
            <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {tasks.map(task => (
            <tr key={task.id} className="hover:bg-gray-900/50 transition-colors cursor-pointer group">
              <td className="py-3 px-4">
                <span className="text-sm font-mono text-cyan-400">#{task.id}</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-white">{task.modelName}</span>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <span className="text-sm font-mono text-gray-400">{shortenAddress(task.submitter)}</span>
              </td>
              <td className="py-3 px-4">
                <TaskStatusBadge status={task.status} />
              </td>
              <td className="py-3 px-4 hidden md:table-cell">
                <span className="text-sm font-mono text-gray-400">
                  {task.miner ? shortenAddress(task.miner) : '---'}
                </span>
              </td>
              <td className="py-3 px-4 text-right hidden sm:table-cell">
                <span className="text-sm text-white font-mono">{formatQfc(task.maxFee)}</span>
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-sm text-gray-500">{formatTimeAgo(task.createdAt)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
