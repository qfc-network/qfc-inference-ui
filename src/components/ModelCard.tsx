import { Model } from '@/lib/types'
import { formatQfc, tierLabel, tierColor } from '@/lib/format'
import Link from 'next/link'

export function ModelCard({ model }: { model: Model }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{model.name}</h3>
        {model.approved && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Approved
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{model.description}</p>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Base Fee</span>
          <span className="text-white font-mono">{formatQfc(model.baseFee)} QFC</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Min Tier</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${tierColor(model.minTier)}`}>
            {tierLabel(model.minTier)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tasks Run</span>
          <span className="text-white">{model.totalTasksRun.toLocaleString()}</span>
        </div>
      </div>
      <Link
        href={`/?model=${model.modelId}`}
        className="block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium py-2 px-4 rounded-xl transition-all"
      >
        Submit Task
      </Link>
    </div>
  )
}
