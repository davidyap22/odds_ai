import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'live' | 'primary'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-surface text-text-secondary border-border',
    success: 'bg-success/10 text-success border-success/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    live: 'bg-danger text-white border-danger animate-pulse',
    primary: 'bg-primary/10 text-primary border-primary/20',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
      )}
      {children}
    </span>
  )
}
