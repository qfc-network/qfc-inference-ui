'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task, TaskStatus } from '@/lib/types'
import { mockTasks } from '@/lib/mock-data'

interface UseTasksOptions {
  autoRefresh?: boolean
  intervalMs?: number
  statusFilter?: TaskStatus | null
  modelFilter?: string | null
  minerFilter?: string | null
  submitterFilter?: string | null
}

export function useTasks(options: UseTasksOptions = {}) {
  const {
    autoRefresh = true,
    intervalMs = 10000,
    statusFilter = null,
    modelFilter = null,
    minerFilter = null,
    submitterFilter = null,
  } = options

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(() => {
    // TODO: Replace with contract calls
    let filtered = [...mockTasks]
    if (statusFilter) filtered = filtered.filter(t => t.status === statusFilter)
    if (modelFilter) filtered = filtered.filter(t => t.modelId === modelFilter)
    if (minerFilter) filtered = filtered.filter(t => t.miner?.toLowerCase() === minerFilter.toLowerCase())
    if (submitterFilter) filtered = filtered.filter(t => t.submitter.toLowerCase() === submitterFilter.toLowerCase())
    filtered.sort((a, b) => b.createdAt - a.createdAt)
    setTasks(filtered)
    setLoading(false)
  }, [statusFilter, modelFilter, minerFilter, submitterFilter])

  useEffect(() => {
    fetchTasks()
    if (!autoRefresh) return
    const interval = setInterval(fetchTasks, intervalMs)
    return () => clearInterval(interval)
  }, [fetchTasks, autoRefresh, intervalMs])

  return { tasks, loading, refresh: fetchTasks }
}
