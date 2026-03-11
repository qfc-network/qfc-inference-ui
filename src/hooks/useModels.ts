'use client'

import { useState, useEffect } from 'react'
import { Model } from '@/lib/types'
import { mockModels } from '@/lib/mock-data'

export function useModels() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // TODO: Replace with contract calls
      setModels(mockModels)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models')
    } finally {
      setLoading(false)
    }
  }, [])

  return { models, loading, error }
}
