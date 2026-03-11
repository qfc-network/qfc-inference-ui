'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { SubmitTaskForm } from '@/components/SubmitTaskForm'
import { StatsCard } from '@/components/StatsCard'
import { LiveFeed } from '@/components/LiveFeed'
import { useTasks } from '@/hooks/useTasks'
import { useWallet } from '@/providers/WalletProvider'
import { mockModels } from '@/lib/mock-data'
import { mockMiners } from '@/lib/mock-data'

function HomeContent() {
  const searchParams = useSearchParams()
  const defaultModel = searchParams.get('model') || undefined
  const { address } = useWallet()
  const { tasks, loading } = useTasks({
    autoRefresh: true,
    submitterFilter: address,
  })

  const totalTasks = 3955
  const activeMiners = mockMiners.filter(m => m.status === 'Active').length
  const modelsAvailable = mockModels.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Submit Inference Task</h1>
        <p className="text-gray-400">Submit AI inference tasks to the decentralized QFC network</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard label="Total Tasks" value={totalTasks.toLocaleString()} sub="All time" />
        <StatsCard label="Active Miners" value={activeMiners} sub="Online now" />
        <StatsCard label="Models Available" value={modelsAvailable} sub="Approved models" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">New Task</h2>
            <SubmitTaskForm defaultModel={defaultModel} />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                {address ? 'My Recent Tasks' : 'Recent Tasks'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Live
              </div>
            </div>
            <LiveFeed tasks={address ? tasks : tasks} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" /></div>}>
      <HomeContent />
    </Suspense>
  )
}
