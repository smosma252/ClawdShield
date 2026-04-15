import type { Scenario } from '../../types'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { useLocation } from 'wouter'

interface ScenarioCardProps {
  scenario: Scenario
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const [, navigate] = useLocation()

  return (
    <Card
      onClick={() => navigate(`/simulate?scenario=${scenario.id}`)}
      className="p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-white leading-snug">{scenario.name}</h3>
        <Badge variant="severity" value={scenario.severity} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="category" value={scenario.category} />
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono text-white/30 bg-white/[0.04] border border-white/[0.06]">
          {scenario.scenario_key}
        </span>
      </div>

      <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
        {scenario.user_task}
      </p>

      <div className="pt-1 flex items-center justify-between">
        <span className="text-[11px] text-white/25">
          {scenario.expected_safe_actions.split(',').length} expected action{scenario.expected_safe_actions.split(',').length !== 1 ? 's' : ''}
        </span>
        <span className="text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors">
          Simulate →
        </span>
      </div>
    </Card>
  )
}
