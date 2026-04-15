import { Card } from '../../components/ui/Card'

export function PolicyPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Policy Enforcement</h1>
        <p className="text-sm text-white/40 mt-0.5">Rules that govern agent tool usage</p>
      </div>

      <Card className="p-8 text-center max-w-lg">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
          OPA-based policy rules will be manageable here. Define which tool calls are allowed, blocked, or require review — and see which runs triggered each rule.
        </p>
      </Card>
    </div>
  )
}
