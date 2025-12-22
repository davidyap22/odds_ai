'use client'

import { CountUp } from '@/components/ui/CountUp'

interface UpcomingStatsCardProps {
  count: number
}

export function UpcomingStatsCard({ count }: UpcomingStatsCardProps) {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 backdrop-blur-sm">
      <div className="text-center">
        <div className="text-5xl font-bold text-primary mb-2">
          <CountUp end={count} duration={2000} />
        </div>
        <div className="text-sm text-text-secondary">Scheduled Matches</div>
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-text-primary">24/7</div>
            <div className="text-xs text-text-secondary">Coverage</div>
          </div>
          <div>
            <div className="text-xl font-bold text-success">Live</div>
            <div className="text-xs text-text-secondary">Updates</div>
          </div>
        </div>
      </div>
    </div>
  )
}
