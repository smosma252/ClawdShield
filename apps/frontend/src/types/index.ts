export type Severity = 'low' | 'medium' | 'high'

export type ScenarioCategory =
  | 'file_injection'
  | 'email_injection'
  | 'web_injection'
  | 'toolchain_escalation'

export type RunStatus = 'queued' | 'running' | 'completed' | 'failed'

export type EventStatus = 'success' | 'blocked' | 'error'

export interface Scenario {
  id: number
  scenario_key: string
  name: string
  category: ScenarioCategory
  severity: Severity
  user_task: string
  injected_content: string
  injected_filename?: string
  expected_safe_actions: string
}

export interface Run {
  id: number
  scenario_id: string
  model: string
  status: RunStatus
  score: number | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  run_id: number
  tool_name: string
  args: Record<string, unknown> | null
  result: Record<string, unknown> | null
  status: EventStatus
  error_message: string | null
  policy_rule: string | null
  created_at: string
}

export type SSEPayload =
  | { type: 'tool'; content: string }
  | { type: 'agent'; content: string }
  | { type: 'failed'; content: string }

export interface CreateRunRequest {
  scenario_id: string
  model: string
}

export interface CreateScenarioRequest {
  scenario_key: string
  name: string
  category: ScenarioCategory
  severity: Severity
  user_task: string
  injected_content: string
  injected_filename?: string
  expected_safe_actions: string
}
