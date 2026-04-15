import type { Run } from '../../types'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { StatusDot } from '../../components/ui/StatusDot'

interface RunResultProps {
  run: Run | null
  onRunAgain: () => void
}

export function RunResult({ run, onRunAgain }: RunResultProps) {
  if (!run) return null

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StatusDot status={run.status} />
          <span className="text-sm font-medium text-white">Run #{run.id}</span>
          <Badge variant="run-status" value={run.status} />
        </div>
        <Button variant="secondary" size="sm" onClick={onRunAgain}>
          Run Again
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#252535] rounded-md p-3">
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Score</div>
          <div className="text-2xl font-semibold text-white">
            {run.score !== null ? run.score.toFixed(2) : '—'}
          </div>
        </div>
        <div className="bg-[#252535] rounded-md p-3">
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Model</div>
          <div className="text-sm font-mono text-white/80 truncate">{run.model}</div>
        </div>
        <div className="bg-[#252535] rounded-md p-3">
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Status</div>
          <div className="text-sm text-white/80 capitalize">{run.status}</div>
        </div>
      </div>

      {run.error_message && (
        <div className="mt-3 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          {run.error_message}
        </div>
      )}
    </Card>
  )
}
