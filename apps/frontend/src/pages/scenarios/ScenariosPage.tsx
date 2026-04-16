import { useState } from 'react'
import { useScenarios } from '../../hooks/useScenarios'
import { ScenarioCard } from './ScenarioCard'
import { NewScenarioModal } from './NewScenarioModal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'

function SkeletonCard() {
  return (
    <div className="bg-[#1e1e2e] border border-white/[0.08] rounded-lg p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 bg-white/[0.06] rounded w-2/3" />
        <div className="h-4 bg-white/[0.06] rounded w-12" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-4 bg-white/[0.06] rounded w-24" />
        <div className="h-4 bg-white/[0.06] rounded w-20" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-white/[0.06] rounded w-full" />
        <div className="h-3 bg-white/[0.06] rounded w-4/5" />
      </div>
    </div>
  )
}

export function ScenariosPage() {
  const { scenarios, loading, error } = useScenarios()
  const [modalOpen, setModalOpen] = useState(false)
  const scenarioMap = {'length': scenarios.length}

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Scenarios</h1>
          <p className="text-sm text-white/40 mt-0.5">Prompt injection test cases</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Scenario
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          Failed to load scenarios: {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(scenarioMap).map((_, i) => <SkeletonCard key={i}/>)}
        </div>
      ) : scenarios.length === 0 ? (
        <EmptyState
          message="No scenarios yet"
          hint="Scenarios are seeded from YAML files on server start, or you can create one manually."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((s) => <ScenarioCard key={s.id} scenario={s} />)}
        </div>
      )}

      <NewScenarioModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
