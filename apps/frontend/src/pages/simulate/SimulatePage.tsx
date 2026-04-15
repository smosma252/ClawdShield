import { useState, useEffect } from 'react'
import { useSearch } from 'wouter'
import { useScenarios } from '../../hooks/useScenarios'
import { useRunStream } from '../../hooks/useRunStream'
import { createRun, getRun } from '../../api/client'
import { SimulatorControls } from './SimulatorControls'
import { LiveFeed } from './LiveFeed'
import { RunResult } from './RunResult'
import type { Run } from '../../types'

export function SimulatePage() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const preselected = params.get('scenario') ?? ''

  const { scenarios } = useScenarios()

  const [selectedScenarioId, setSelectedScenarioId] = useState(preselected)
  const [selectedModel, setSelectedModel] = useState('gpt-4o')
  const [activeRunId, setActiveRunId] = useState<number | null>(null)
  const [finalRun, setFinalRun] = useState<Run | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)

  const { events, streaming } = useRunStream(activeRunId)

  // Pre-select scenario from query param once scenarios load
  useEffect(() => {
    if (preselected && scenarios.length > 0) {
      setSelectedScenarioId(preselected)
    }
  }, [preselected, scenarios])

  // Fetch final run details once stream closes
  useEffect(() => {
    if (!streaming && activeRunId !== null) {
      getRun(activeRunId)
        .then(setFinalRun)
        .catch(() => {/* best-effort */})
    }
  }, [streaming, activeRunId])

  async function handleRun() {
    if (!selectedScenarioId) return
    setCreateError(null)
    setFinalRun(null)
    setActiveRunId(null)

    try {
      const run = await createRun({ scenario_id: selectedScenarioId, model: selectedModel })
      setActiveRunId(run.id)
    } catch (err) {
      setCreateError((err as Error).message)
    }
  }

  function handleRunAgain() {
    setActiveRunId(null)
    setFinalRun(null)
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Simulate</h1>
        <p className="text-sm text-white/40 mt-0.5">Execute a prompt injection scenario against an AI agent</p>
      </div>

      {/* Controls */}
      <SimulatorControls
        scenarios={scenarios}
        selectedScenarioId={selectedScenarioId}
        onScenarioChange={setSelectedScenarioId}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onRun={handleRun}
        running={streaming}
      />

      {createError && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          Failed to start run: {createError}
        </div>
      )}

      {/* Live feed — shown once a run starts */}
      {(activeRunId !== null || events.length > 0) && (
        <LiveFeed events={events} streaming={streaming} />
      )}

      {/* Result — shown once stream ends */}
      {!streaming && finalRun && (
        <RunResult run={finalRun} onRunAgain={handleRunAgain} />
      )}

      {/* Idle state hint */}
      {activeRunId === null && events.length === 0 && !createError && (
        <div className="rounded-lg border border-white/[0.06] bg-[#1e1e2e] p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <p className="text-sm text-white/40">Select a scenario and click Run to start</p>
          <p className="text-xs text-white/20 mt-1">Tool calls and agent responses will stream in real time</p>
        </div>
      )}
    </div>
  )
}
