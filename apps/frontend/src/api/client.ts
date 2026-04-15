import type { CreateRunRequest, Run, Scenario, SSEPayload } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    throw new ApiError(res.status, `${res.status} ${res.statusText}`)
  }
  return (await res.json()) as T
}

export async function getScenarios(): Promise<Scenario[]> {
  const data = await request<Scenario[] | null>('/api/v1/scenarios/')
  return data ?? []
}

export async function getScenario(id: number): Promise<Scenario> {
  return request<Scenario>(`/api/v1/scenarios/${id}`)
}

export async function getRuns(): Promise<Run[]> {
  const data = await request<Run[] | null>('/api/v1/runs/')
  return data ?? []
}

export async function getRun(id: number): Promise<Run> {
  return request<Run>(`/api/v1/runs/${id}`)
}

export async function createRun(body: CreateRunRequest): Promise<Run> {
  return request<Run>('/api/v1/runs/', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export interface StreamHandlers {
  onTool: (payload: SSEPayload & { type: 'tool' }) => void
  onAgent: (payload: SSEPayload & { type: 'agent' }) => void
  onFailed: (payload: SSEPayload & { type: 'failed' }) => void
  onClose: () => void
}

export function createRunStream(runId: number, handlers: StreamHandlers): () => void {
  const controller = new AbortController()

  ;(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/runs/${runId}/stream`, {
        method: 'POST',
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        handlers.onFailed({ type: 'failed', content: `Stream failed: ${res.status}` })
        handlers.onClose()
        return
      }

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += value
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw) continue
          try {
            const payload = JSON.parse(raw) as SSEPayload
            if (payload.type === 'tool') handlers.onTool(payload as SSEPayload & { type: 'tool' })
            else if (payload.type === 'agent') handlers.onAgent(payload as SSEPayload & { type: 'agent' })
            else if (payload.type === 'failed') handlers.onFailed(payload as SSEPayload & { type: 'failed' })
          } catch {
            // malformed JSON line — skip
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        handlers.onFailed({ type: 'failed', content: (err as Error).message })
      }
    } finally {
      handlers.onClose()
    }
  })()

  return () => controller.abort()
}
