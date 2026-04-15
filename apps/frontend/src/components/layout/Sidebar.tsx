import { Link, useLocation } from 'wouter'

const NAV_ITEMS = [
  {
    path: '/scenarios',
    label: 'Scenarios',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
  },
  {
    path: '/simulate',
    label: 'Simulate',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
  },
  {
    path: '/policy',
    label: 'Policy Enforcement',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
]

export function Sidebar() {
  const [location] = useLocation()

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-full border-r border-white/[0.06] bg-[#0d0d14]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-none">ClawdShield</div>
            <div className="text-[10px] text-white/40 mt-0.5 leading-none">Security Testing</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path || location.startsWith(item.path + '/')
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={[
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors cursor-pointer',
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]',
                ].join(' ')}
              >
                <span className={isActive ? 'text-blue-400' : 'text-current'}>{item.icon}</span>
                {item.label}
              </a>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <div className="text-[10px] text-white/25">v0.1.0-alpha</div>
      </div>
    </aside>
  )
}
