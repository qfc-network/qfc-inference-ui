'use client'

import { useState, useEffect } from 'react'
import { Model } from '@/lib/types'
import { mockModels } from '@/lib/mock-data'

export function useModels() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with contract calls
    setModels(mockModels)
    setLoading(false)
  }, [])

  return { models, loading }
}
