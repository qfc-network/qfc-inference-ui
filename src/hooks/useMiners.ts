'use client'

import { useState, useEffect } from 'react'
import { Miner } from '@/lib/types'
import { mockMiners } from '@/lib/mock-data'

export function useMiners(tierFilter?: 1 | 2 | 3 | null) {
  const [miners, setMiners] = useState<Miner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // TODO: Replace with contract calls
      let data = [...mockMiners]
      if (tierFilter) data = data.filter(m => m.tier === tierFilter)
      data.sort((a, b) => b.tasksCompleted - a.tasksCompleted)
      setMiners(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch miners')
    } finally {
      setLoading(false)
    }
  }, [tierFilter])

  return { miners, loading, error }
}
