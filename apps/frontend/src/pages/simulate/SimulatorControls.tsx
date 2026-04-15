import type { Scenario } from '../../types'
import { Button } from '../../components/ui/Button'

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'claude-sonnet-4-6', 'claude-haiku-4-5']

interface SimulatorControlsProps {
  scenarios: Scenario[]
  selectedScenarioId: string
  onScenarioChange: (id: string) => void
  selectedModel: string
  onModelChange: (model: string) => void
  onRun: () => void
  running: boolean
}

const selectClass =
  'bg-[#252535] border border-white/[0.08] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 cursor-pointer'

export function SimulatorControls({
  scenarios,
  selectedScenarioId,
  onScenarioChange,
  selectedModel,
  onModelChange,
  onRun,
  running,
}: SimulatorControlsProps) {
  const noScenarios = scenarios.length === 0
  const canRun = !noScenarios && selectedScenarioId !== '' && !running

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-48">
        <label className="block text-xs font-medium text-white/50 mb-1.5">Scenario</label>
        <select
          className={`${selectClass} w-full`}
          value={selectedScenarioId}
          onChange={(e) => onScenarioChange(e.target.value)}
          disabled={noScenarios || running}
        >
          {noScenarios ? (
            <option value="">No scenarios available</option>
          ) : (
            <>
              <option value="">Select a scenario…</option>
              {scenarios.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      <div className="min-w-40">
        <label className="block text-xs font-medium text-white/50 mb-1.5">Model</label>
        <select
          className={`${selectClass} w-full`}
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          disabled={running}
        >
          {MODELS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <Button
        variant="primary"
        onClick={onRun}
        disabled={!canRun}
        loading={running}
      >
        {running ? 'Running…' : 'Run Simulation'}
      </Button>
    </div>
  )
}
