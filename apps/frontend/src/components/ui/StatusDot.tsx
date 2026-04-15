import type { RunStatus } from '../../types'

interface StatusDotProps {
  status: RunStatus
}

const DOT_STYLES: Record<RunStatus, string> = {
  completed: 'bg-green-400',
  failed: 'bg-red-400',
  running: 'bg-blue-400 animate-pulse',
  queued: 'bg-white/30',
}

export function StatusDot({ status }: StatusDotProps) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${DOT_STYLES[status]}`} />
  )
}
