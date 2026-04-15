import { useEffect, useRef } from 'react'
import type { SSEPayload } from '../../types'
import { ToolCallRow } from './ToolCallRow'
import { AgentMessageRow } from './AgentMessageRow'
import { Spinner } from '../../components/ui/Spinner'

interface LiveFeedProps {
  events: SSEPayload[]
  streaming: boolean
}

export function LiveFeed({ events, streaming }: LiveFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  const isEmpty = events.length === 0

  return (
    <div className="bg-[#0d0d14] border border-white/[0.06] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <span className="text-xs font-medium text-white/50">Live Feed</span>
        {streaming && (
          <div className="flex items-center gap-1.5 text-blue-400 text-xs">
            <Spinner size="sm" />
            <span>Streaming…</span>
          </div>
        )}
      </div>

      <div className="overflow-y-auto max-h-[50vh] p-3 space-y-2">
        {isEmpty && streaming && (
          <div className="flex items-center gap-2 px-2 py-3 text-xs text-white/30">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Waiting for agent…
          </div>
        )}

        {isEmpty && !streaming && (
          <div className="py-6 text-center text-xs text-white/25">
            No events yet. Run a simulation to see output here.
          </div>
        )}

        {events.map((event, i) => (
          <div key={i}>
            {event.type === 'tool' && <ToolCallRow raw={event.content} />}
            {event.type === 'agent' && <AgentMessageRow content={event.content} />}
            {event.type === 'failed' && (
              <div className="px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {event.content}
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
