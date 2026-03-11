'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/providers/WalletProvider'
import { useModels } from '@/hooks/useModels'
import { formatQfc } from '@/lib/format'

export function SubmitTaskForm({ defaultModel }: { defaultModel?: string }) {
  const { address, signer, connect } = useWallet()
  const { models } = useModels()
  const [selectedModel, setSelectedModel] = useState(defaultModel || '')
  const [input, setInput] = useState('')
  const [maxFee, setMaxFee] = useState('')
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    if (defaultModel && models.length > 0) {
      setSelectedModel(defaultModel)
    }
  }, [defaultModel, models])

  const selectedModelData = models.find(m => m.modelId === selectedModel)
  const estimatedCost = selectedModelData ? formatQfc(selectedModelData.baseFee) : '---'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) {
      connect()
      return
    }
    if (!signer || !selectedModel || !input || !maxFee) return

    // Validate input length
    if (input.length > 10000) {
      setTxStatus('error')
      return
    }

    // Validate maxFee is a valid number
    const feeNum = parseFloat(maxFee)
    if (isNaN(feeNum) || feeNum <= 0) {
      setTxStatus('error')
      return
    }

    setTxStatus('pending')
    try {
      // TODO: Replace with actual contract call
      // const registry = getTaskRegistry(signer)
      // const tx = await registry.submitTask(modelId, ethers.toUtf8Bytes(input), { value: ethers.parseEther(maxFee) })
      // await tx.wait()
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTxHash('0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2))
      setTxStatus('success')
      setInput('')
      setMaxFee('')
    } catch (err) {
      console.error('Submit task failed:', err)
      setTxStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
        <select
          value={selectedModel}
          onChange={e => setSelectedModel(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        >
          <option value="">Select a model...</option>
          {models.map(m => (
            <option key={m.modelId} value={m.modelId}>{m.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Input</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter your text prompt or describe audio/image input..."
          rows={4}
          maxLength={10000}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Max Fee (QFC)</label>
        <input
          type="number"
          step="0.001"
          min="0"
          value={maxFee}
          onChange={e => setMaxFee(e.target.value)}
          placeholder="0.05"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500"
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Estimated cost: {estimatedCost} QFC</span>
          {selectedModelData && maxFee && Number(maxFee) < Number(selectedModelData.baseFee) / 1e18 && (
            <span className="text-amber-400">Below base fee</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={txStatus === 'pending'}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all text-sm"
      >
        {txStatus === 'pending' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Submitting...
          </span>
        ) : !address ? (
          'Connect Wallet to Submit'
        ) : (
          'Submit Task'
        )}
      </button>

      {txStatus === 'success' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start justify-between">
          <div>
            <p className="text-sm text-emerald-300">Task submitted successfully!</p>
            <p className="text-xs text-gray-400 font-mono mt-1 break-all">Tx: {txHash}</p>
          </div>
          <button onClick={() => setTxStatus('idle')} className="text-gray-500 hover:text-white ml-2 shrink-0">&times;</button>
        </div>
      )}

      {txStatus === 'error' && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start justify-between">
          <p className="text-sm text-rose-300">Failed to submit task. Please try again.</p>
          <button onClick={() => setTxStatus('idle')} className="text-gray-500 hover:text-white ml-2 shrink-0">&times;</button>
        </div>
      )}
    </form>
  )
}
