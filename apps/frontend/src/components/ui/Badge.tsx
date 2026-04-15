import type { ScenarioCategory, Severity, RunStatus, EventStatus } from '../../types'

type BadgeVariant = 'severity' | 'run-status' | 'event-status' | 'category'

interface BadgeProps {
  variant: BadgeVariant
  value: Severity | RunStatus | EventStatus | ScenarioCategory | string
}

const SEVERITY_STYLES: Record<Severity, string> = {
  high: 'bg-red-500/10 text-red-400 border border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border border-green-500/20',
}

const RUN_STATUS_STYLES: Record<RunStatus, string> = {
  completed: 'bg-green-500/10 text-green-400 border border-green-500/20',
  failed: 'bg-red-500/10 text-red-400 border border-red-500/20',
  running: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  queued: 'bg-white/5 text-white/50 border border-white/10',
}

const EVENT_STATUS_STYLES: Record<EventStatus, string> = {
  success: 'bg-green-500/10 text-green-400 border border-green-500/20',
  blocked: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  error: 'bg-red-500/10 text-red-400 border border-red-500/20',
}

const CATEGORY_STYLES: Record<ScenarioCategory, string> = {
  file_injection: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  email_injection: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  web_injection: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  toolchain_escalation: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
}

const CATEGORY_LABELS: Record<ScenarioCategory, string> = {
  file_injection: 'File Injection',
  email_injection: 'Email Injection',
  web_injection: 'Web Injection',
  toolchain_escalation: 'Toolchain Escalation',
}

export function Badge({ variant, value }: BadgeProps) {
  let style = 'bg-white/5 text-white/50 border border-white/10'
  let label = value

  if (variant === 'severity') {
    style = SEVERITY_STYLES[value as Severity] ?? style
  } else if (variant === 'run-status') {
    style = RUN_STATUS_STYLES[value as RunStatus] ?? style
  } else if (variant === 'event-status') {
    style = EVENT_STATUS_STYLES[value as EventStatus] ?? style
  } else if (variant === 'category') {
    style = CATEGORY_STYLES[value as ScenarioCategory] ?? style
    label = CATEGORY_LABELS[value as ScenarioCategory] ?? value
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${style}`}>
      {label}
    </span>
  )
}
