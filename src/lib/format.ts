import { ethers } from 'ethers'

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatQfc(wei: string): string {
  try {
    const formatted = ethers.formatEther(wei)
    const value = parseFloat(formatted)
    if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    if (value >= 1) return value.toFixed(4)
    if (value >= 0.001) return value.toFixed(6)
    if (value === 0) return '0'
    return value.toExponential(2)
  } catch {
    return '0'
  }
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function tierLabel(tier: 1 | 2 | 3): string {
  const labels: Record<number, string> = { 1: 'Consumer', 2: 'Prosumer', 3: 'Datacenter' }
  return labels[tier] || 'Unknown'
}

export function tierColor(tier: 1 | 2 | 3): string {
  const colors: Record<number, string> = {
    1: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
    2: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    3: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
  }
  return colors[tier] || ''
}
