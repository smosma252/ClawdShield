import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import type { EventStatus } from '../../types'

interface ToolEvent {
  tool_name?: string
  args?: Record<string, unknown>
  result?: Record<string, unknown> | string
  status?: EventStatus
  content?: string
}

interface ToolCallRowProps {
  raw: string
}

export function ToolCallRow({ raw }: ToolCallRowProps) {
  const [expanded, setExpanded] = useState(false)

  let parsed: ToolEvent = {}
  try {
    parsed = JSON.parse(raw) as ToolEvent
  } catch {
    parsed = { content: raw }
  }

  const toolName = parsed.tool_name ?? 'tool'
  const status = parsed.status ?? 'success'

  return (
    <div className="bg-blue-950/20 border border-blue-500/10 rounded-md p-3">
      <div
        className="flex items-center gap-2.5 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="w-5 h-5 rounded bg-blue-500/15 flex items-center justify-center flex-shrink-0">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
        <span className="text-xs font-mono text-blue-300 flex-1">{toolName}</span>
        <Badge variant="event-status" value={status} />
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          className={`text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {expanded && (
        <div className="mt-2.5 space-y-2 pl-7">
          {parsed.args && (
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Args</div>
              <pre className="text-[11px] text-white/60 bg-black/20 rounded p-2 overflow-x-auto">
                {JSON.stringify(parsed.args, null, 2)}
              </pre>
            </div>
          )}
          {parsed.result !== undefined && (
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Result</div>
              <pre className="text-[11px] text-white/60 bg-black/20 rounded p-2 overflow-x-auto">
                {typeof parsed.result === 'string' ? parsed.result : JSON.stringify(parsed.result, null, 2)}
              </pre>
            </div>
          )}
          {parsed.content && !parsed.tool_name && (
            <pre className="text-[11px] text-white/60 bg-black/20 rounded p-2 overflow-x-auto">
              {parsed.content}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
