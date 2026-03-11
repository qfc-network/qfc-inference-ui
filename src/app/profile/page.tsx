'use client'

import { useState } from 'react'
import { useWallet } from '@/providers/WalletProvider'
import { useTasks } from '@/hooks/useTasks'
import { StatsCard } from '@/components/StatsCard'
import { LiveFeed } from '@/components/LiveFeed'
import { formatQfc, shortenAddress, tierLabel } from '@/lib/format'
import { mockMiners } from '@/lib/mock-data'

export default function ProfilePage() {
  const { address, connect, signer } = useWallet()
  const { tasks, loading } = useTasks({
    autoRefresh: true,
    submitterFilter: address,
  })

  const [registerTier, setRegisterTier] = useState<string>('1')
  const [registerGpu, setRegisterGpu] = useState('')
  const [registerEndpoint, setRegisterEndpoint] = useState('')
  const [registering, setRegistering] = useState(false)
  const [registerStatus, setRegisterStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Check if connected address is a miner
  const minerData = address
    ? mockMiners.find(m => m.address.toLowerCase() === address.toLowerCase())
    : null

  const totalSpend = tasks.reduce((acc, t) => acc + BigInt(t.maxFee), BigInt(0)).toString()

  if (!address) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            Connect your wallet to view your submitted tasks, spending, and miner earnings.
          </p>
          <button
            onClick={connect}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium py-3 px-8 rounded-xl transition-all"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signer) return
    setRegistering(true)
    setRegisterStatus('idle')
    try {
      // TODO: Replace with contract call
      // const registry = getMinerRegistry(signer)
      // const tx = await registry.registerMiner(registerTier, registerGpu, registerEndpoint, { value: stakeAmount })
      // await tx.wait()
      await new Promise(resolve => setTimeout(resolve, 2000))
      setRegisterStatus('success')
    } catch (err) {
      console.error('Registration failed:', err)
      setRegisterStatus('error')
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400 font-mono">{shortenAddress(address, 8)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard label="Tasks Submitted" value={tasks.length} sub="By connected wallet" />
        <StatsCard label="Total Spend" value={`${formatQfc(totalSpend)} QFC`} sub="Max fees committed" />
        <StatsCard
          label="Miner Status"
          value={minerData ? `Tier ${minerData.tier}` : 'Not Registered'}
          sub={minerData ? `${minerData.tasksCompleted} tasks completed` : 'Register below'}
        />
      </div>

      {minerData && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Miner Earnings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Earned</p>
              <p className="text-lg font-bold text-white font-mono">{formatQfc(minerData.totalEarned)} QFC</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Reputation</p>
              <p className="text-lg font-bold text-emerald-400">{minerData.reputationScore}/100</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">GPU</p>
              <p className="text-sm text-white">{minerData.gpuModel}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tier</p>
              <p className="text-sm text-white">{tierLabel(minerData.tier)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">My Tasks</h2>
            <LiveFeed tasks={tasks} loading={loading} />
          </div>
        </div>

        {!minerData && (
          <div className="lg:col-span-2">
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Register as Miner</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tier</label>
                  <select
                    value={registerTier}
                    onChange={e => setRegisterTier(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="1">Tier 1 - Consumer (RTX 3080+)</option>
                    <option value="2">Tier 2 - Prosumer (RTX 4090+)</option>
                    <option value="3">Tier 3 - Datacenter (A100/H100)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">GPU Model</label>
                  <input
                    type="text"
                    value={registerGpu}
                    onChange={e => setRegisterGpu(e.target.value)}
                    placeholder="e.g. NVIDIA RTX 4090"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Endpoint URL</label>
                  <input
                    type="url"
                    value={registerEndpoint}
                    onChange={e => setRegisterEndpoint(e.target.value)}
                    placeholder="https://your-miner.example.com"
                    maxLength={200}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={registering || !registerGpu || !registerEndpoint}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-xl transition-all text-sm"
                >
                  {registering ? 'Registering...' : 'Register as Miner'}
                </button>
                {registerStatus === 'success' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start justify-between">
                    <p className="text-sm text-emerald-300">Registration submitted successfully!</p>
                    <button onClick={() => setRegisterStatus('idle')} className="text-gray-500 hover:text-white ml-2 shrink-0">&times;</button>
                  </div>
                )}
                {registerStatus === 'error' && (
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start justify-between">
                    <p className="text-sm text-rose-300">Registration failed. Please try again.</p>
                    <button onClick={() => setRegisterStatus('idle')} className="text-gray-500 hover:text-white ml-2 shrink-0">&times;</button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
