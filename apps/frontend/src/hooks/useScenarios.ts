import { useState, useEffect, useCallback } from 'react'
import { getScenarios } from '../api/client'
import type { Scenario } from '../types'

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getScenarios()
      setScenarios(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { scenarios, loading, error, refetch: fetch }
}
