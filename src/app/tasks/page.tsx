'use client'

import { useState } from 'react'
import { TaskStatus, Task } from '@/lib/types'
import { useTasks } from '@/hooks/useTasks'
import { useModels } from '@/hooks/useModels'
import { LiveFeed } from '@/components/LiveFeed'
import { TaskStatusBadge } from '@/components/TaskStatusBadge'
import { shortenAddress, formatQfc, formatTimeAgo } from '@/lib/format'

function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Task #{task.id}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <TaskStatusBadge status={task.status} />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Model</p>
            <p className="text-sm text-white">{task.modelName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Submitter</p>
            <p className="text-sm font-mono text-gray-300">{task.submitter}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Input</p>
            <p className="text-sm text-gray-300">{task.input}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Input Hash</p>
            <p className="text-sm font-mono text-gray-400">{task.inputHash}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Max Fee</p>
            <p className="text-sm text-white font-mono">{formatQfc(task.maxFee)} QFC</p>
          </div>
          {task.miner && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Miner</p>
              <p className="text-sm font-mono text-gray-300">{task.miner}</p>
            </div>
          )}
          {task.resultHash && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Result Hash</p>
              <p className="text-sm font-mono text-gray-400">{task.resultHash}</p>
            </div>
          )}
          {task.proof && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Proof</p>
              <p className="text-sm font-mono text-gray-400">{task.proof}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 mb-1">Created</p>
            <p className="text-sm text-gray-400">{formatTimeAgo(task.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null)
  const [modelFilter, setModelFilter] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const { models } = useModels()

  const { tasks, loading } = useTasks({
    autoRefresh: true,
    statusFilter,
    modelFilter,
  })

  const statuses = Object.values(TaskStatus)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Task Feed</h1>
          <p className="text-gray-400">Live feed of all inference tasks on the network</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          Auto-refresh 10s
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !statusFilter ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          All
        </button>
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? null : s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
        <select
          value={modelFilter || ''}
          onChange={e => setModelFilter(e.target.value || null)}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        >
          <option value="">All Models</option>
          {models.map(m => (
            <option key={m.modelId} value={m.modelId}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">No tasks found</td>
                </tr>
              ) : (
                tasks.map(task => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  )
}
