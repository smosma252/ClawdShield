import { useReducer, useState, useEffect } from 'react'
import { createRunStream } from '../api/client'
import type { SSEPayload } from '../types'

type Action = { type: 'APPEND'; payload: SSEPayload } | { type: 'RESET' }

function reducer(state: SSEPayload[], action: Action): SSEPayload[] {
  if (action.type === 'RESET') return []
  return [...state, action.payload]
}

export function useRunStream(runId: number | null) {
  const [events, dispatch] = useReducer(reducer, [])
  const [streaming, setStreaming] = useState(false)

  useEffect(() => {
    if (runId === null) {
      dispatch({ type: 'RESET' })
      setStreaming(false)
      return
    }

    dispatch({ type: 'RESET' })
    setStreaming(true)

    const cancel = createRunStream(runId, {
      onTool: (p) => dispatch({ type: 'APPEND', payload: p }),
      onAgent: (p) => dispatch({ type: 'APPEND', payload: p }),
      onFailed: (p) => dispatch({ type: 'APPEND', payload: p }),
      onClose: () => setStreaming(false),
    })

    return cancel
  }, [runId])

  return { events, streaming }
}
