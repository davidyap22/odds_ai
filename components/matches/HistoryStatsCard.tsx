'use client'

import { CountUp } from '@/components/ui/CountUp'

interface HistoryStatsCardProps {
  totalMatches: number
  roiPercentage: number
  totalBets: number
}

export function HistoryStatsCard({ totalMatches, roiPercentage, totalBets }: HistoryStatsCardProps) {
  const isPositiveROI = roiPercentage >= 0

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-success/10 to-transparent border border-success/20 backdrop-blur-sm">
      <div className="text-center">
        <div className="text-5xl font-bold text-success mb-2">
          <CountUp end={totalMatches} duration={2000} />
        </div>
        <div className="text-sm text-text-secondary">Analyzed Matches</div>
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className={`text-xl font-bold ${isPositiveROI ? 'text-success' : 'text-danger'}`}>
              <CountUp end={roiPercentage} duration={2000} decimals={1} suffix="%" />
            </div>
            <div className="text-xs text-text-secondary">ROI</div>
          </div>
          <div>
            <div className="text-xl font-bold text-primary">
              <CountUp end={totalBets} duration={2000} />
            </div>
            <div className="text-xs text-text-secondary">Bets</div>
          </div>
        </div>
      </div>
    </div>
  )
}
