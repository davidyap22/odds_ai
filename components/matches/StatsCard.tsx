'use client'

import { CountUp } from '@/components/ui/CountUp'

interface StatsCardProps {
  count: number
  label: string
  colorClass?: string
}

export function StatsCard({ count, label, colorClass = 'text-primary' }: StatsCardProps) {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 backdrop-blur-sm">
      <div className="text-center">
        <div className={`text-5xl font-bold ${colorClass} mb-2`}>
          <CountUp end={count} duration={2000} />
        </div>
        <div className="text-sm text-text-secondary">{label}</div>
      </div>
    </div>
  )
}

interface StatsGridProps {
  leftValue: number | string
  leftLabel: string
  leftColor?: string
  rightValue: number | string
  rightLabel: string
  rightColor?: string
}

export function StatsGrid({
  leftValue,
  leftLabel,
  leftColor = 'text-text-primary',
  rightValue,
  rightLabel,
  rightColor = 'text-success'
}: StatsGridProps) {
  const renderValue = (value: number | string, color: string) => {
    if (typeof value === 'number') {
      return (
        <div className={`text-xl font-bold ${color}`}>
          <CountUp end={value} duration={2000} decimals={1} />
        </div>
      )
    }
    return <div className={`text-xl font-bold ${color}`}>{value}</div>
  }

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          {renderValue(leftValue, leftColor)}
          <div className="text-xs text-text-secondary">{leftLabel}</div>
        </div>
        <div>
          {renderValue(rightValue, rightColor)}
          <div className="text-xs text-text-secondary">{rightLabel}</div>
        </div>
      </div>
    </div>
  )
}
