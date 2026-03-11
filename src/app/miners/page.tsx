'use client'

import { useState, useEffect } from 'react'
import { useMiners } from '@/hooks/useMiners'
import { useTasks } from '@/hooks/useTasks'
import { MinerBadge } from '@/components/MinerBadge'
import { TaskStatusBadge } from '@/components/TaskStatusBadge'
import { shortenAddress, formatQfc, formatTimeAgo, tierLabel, tierColor } from '@/lib/format'
import { Miner, Task } from '@/lib/types'

function MinerProfileModal({ miner, tasks, onClose }: { miner: Miner; tasks: Task[]; onClose: () => void }) {
  const minerTasks = tasks.filter(t => t.miner?.toLowerCase() === miner.address.toLowerCase())
  const successRate = miner.tasksCompleted + miner.tasksFailed > 0
    ? ((miner.tasksCompleted / (miner.tasksCompleted + miner.tasksFailed)) * 100).toFixed(1)
    : '0'

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Miner Profile</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${tierColor(miner.tier)}`}>
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" />
                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
              </svg>
              Tier {miner.tier} - {tierLabel(miner.tier)}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Address</p>
            <p className="text-sm font-mono text-gray-300 break-all">{miner.address}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">GPU</p>
            <p className="text-sm text-white">{miner.gpuModel}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Tasks Completed</p>
              <p className="text-sm text-white">{miner.tasksCompleted.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Success Rate</p>
              <p className="text-sm text-white">{successRate}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Reputation</p>
              <p className="text-sm text-white">{miner.reputationScore}/100</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Earned</p>
              <p className="text-sm text-white font-mono">{formatQfc(miner.totalEarned)} QFC</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Last Active</p>
            <p className="text-sm text-gray-400">{formatTimeAgo(miner.lastActiveAt)}</p>
          </div>
          {minerTasks.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Recent Tasks</p>
              <div className="space-y-2">
                {minerTasks.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-cyan-400">#{t.id}</span>
                    <span className="text-gray-400">{t.modelName}</span>
                    <TaskStatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MinersPage() {
  const [tierFilter, setTierFilter] = useState<1 | 2 | 3 | null>(null)
  const [selectedMiner, setSelectedMiner] = useState<Miner | null>(null)
  const { miners, loading } = useMiners(tierFilter)
  const { tasks } = useTasks({ autoRefresh: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Miner Leaderboard</h1>
        <p className="text-gray-400">Top miners ranked by tasks completed</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTierFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !tierFilter ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          All Tiers
        </button>
        {([1, 2, 3] as const).map(tier => (
          <button
            key={tier}
            onClick={() => setTierFilter(tierFilter === tier ? null : tier)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tierFilter === tier ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Tier {tier} - {tierLabel(tier)}
          </button>
        ))}
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Rank</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Miner</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 hidden md:table-cell">GPU</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Tier</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Completed</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 hidden sm:table-cell">Failed</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 hidden sm:table-cell">Reputation</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
                  </td>
                </tr>
              ) : miners.map((miner, i) => (
                <tr
                  key={miner.address}
                  onClick={() => setSelectedMiner(miner)}
                  className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <span className={`text-sm font-bold ${i < 3 ? 'text-gradient' : 'text-gray-400'}`}>
                      #{i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono text-gray-300">{shortenAddress(miner.address)}</span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-gray-400">{miner.gpuModel}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${tierColor(miner.tier)}`}>
                      T{miner.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-white">{miner.tasksCompleted.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell">
                    <span className="text-sm text-gray-400">{miner.tasksFailed}</span>
                  </td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell">
                    <span className={`text-sm ${miner.reputationScore >= 95 ? 'text-emerald-400' : miner.reputationScore >= 85 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {miner.reputationScore}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right hidden lg:table-cell">
                    <span className="text-sm text-white font-mono">{formatQfc(miner.totalEarned)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMiner && (
        <MinerProfileModal miner={selectedMiner} tasks={tasks} onClose={() => setSelectedMiner(null)} />
      )}
    </div>
  )
}
