import { shortenAddress, tierLabel, tierColor } from '@/lib/format'

interface MinerBadgeProps {
  address: string
  tier: 1 | 2 | 3
  gpuModel?: string
}

export function MinerBadge({ address, tier, gpuModel }: MinerBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${tierColor(tier)}`}>
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 7H7v6h6V7z" />
          <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
        </svg>
        Tier {tier}
      </span>
      <span className="text-sm font-mono text-gray-300">{shortenAddress(address)}</span>
      {gpuModel && <span className="text-xs text-gray-500">{gpuModel}</span>}
    </div>
  )
}
