interface AgentMessageRowProps {
  content: string
}

export function AgentMessageRow({ content }: AgentMessageRowProps) {
  return (
    <div className="flex gap-2.5 bg-white/[0.02] border border-white/[0.05] rounded-md p-3">
      <div className="w-5 h-5 rounded bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <p className="text-xs text-white/60 leading-relaxed flex-1">{content}</p>
    </div>
  )
}
