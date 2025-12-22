'use client'

import { CountUp } from '@/components/ui/CountUp'

interface HeroStatsProps {
  totalMatches: number
  totalBets: number
  roiPercentage: number
}

export function HeroStats({ totalMatches, totalBets, roiPercentage }: HeroStatsProps) {
  const isPositiveROI = roiPercentage >= 0

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 rounded-lg bg-surface/50 border border-border">
        <div className="text-2xl font-bold text-primary">
          <CountUp end={totalMatches} duration={2000} />
        </div>
        <div className="text-xs text-text-secondary">Matches Tracked</div>
      </div>
      <div className="p-4 rounded-lg bg-surface/50 border border-border">
        <div className="text-2xl font-bold text-success">
          <CountUp end={totalBets} duration={2000} />
        </div>
        <div className="text-xs text-text-secondary">Total Bets</div>
      </div>
      <div className="p-4 rounded-lg bg-surface/50 border border-border">
        <div className={`text-2xl font-bold ${isPositiveROI ? 'text-success' : 'text-danger'}`}>
          <CountUp end={roiPercentage} duration={2000} decimals={1} suffix="%" />
        </div>
        <div className="text-xs text-text-secondary">ROI</div>
      </div>
    </div>
  )
}
