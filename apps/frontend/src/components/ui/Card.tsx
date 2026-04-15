import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-[#1e1e2e] border border-white/[0.08] rounded-lg',
        onClick ? 'cursor-pointer hover:border-white/[0.14] transition-colors' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
