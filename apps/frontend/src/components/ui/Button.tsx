import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
  children: ReactNode
}

const VARIANT_STYLES = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 disabled:bg-blue-900/50 disabled:text-blue-300/40 disabled:border-blue-800/40',
  secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-white/80 border border-white/[0.08] disabled:opacity-40',
  ghost: 'bg-transparent hover:bg-white/[0.06] text-white/60 hover:text-white/80 border border-transparent disabled:opacity-40',
}

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer',
        'disabled:cursor-not-allowed',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
