'use client'

import { Card, CardBody } from '@/components/ui/Card'
import { CountUp } from '@/components/ui/CountUp'
import Link from 'next/link'
import { OverallProfitStats } from '@/lib/api/profit-summary'

interface PerformanceOverviewProps {
  stats: OverallProfitStats
}

export function PerformanceOverview({ stats }: PerformanceOverviewProps) {
  const calculateWinRate = (wins: number, total: number) => {
    return total > 0 ? (wins / total) * 100 : 0
  }

  const mlWinRate = calculateWinRate(stats.wins_moneyline, stats.bets_moneyline)
  const hdpWinRate = calculateWinRate(stats.wins_handicap, stats.bets_handicap)
  const ouWinRate = calculateWinRate(stats.wins_ou, stats.bets_ou)

  return (
    <div className="space-y-4 animate-float">
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 glow-border">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary">Performance Overview</h3>
            <Link href="/matches/history" className="text-sm text-primary hover:underline animate-shimmer">
              View Details →
            </Link>
          </div>

          <div className="space-y-4">
            {/* Moneyline Performance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Moneyline</span>
                <span className={`text-sm font-bold ${stats.profit_moneyline >= 0 ? 'text-success' : 'text-danger'}`}>
                  {stats.profit_moneyline >= 0 ? '+' : ''}RM <CountUp end={stats.profit_moneyline} duration={2000} decimals={2} />
                </span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    stats.profit_moneyline >= 0 ? 'bg-success' : 'bg-danger'
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(stats.profit_moneyline) / 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Handicap Performance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Handicap</span>
                <span className={`text-sm font-bold ${stats.profit_handicap >= 0 ? 'text-success' : 'text-danger'}`}>
                  {stats.profit_handicap >= 0 ? '+' : ''}RM <CountUp end={stats.profit_handicap} duration={2000} decimals={2} />
                </span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    stats.profit_handicap >= 0 ? 'bg-success' : 'bg-danger'
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(stats.profit_handicap) / 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Over/Under Performance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Over/Under</span>
                <span className={`text-sm font-bold ${stats.profit_ou >= 0 ? 'text-success' : 'text-danger'}`}>
                  {stats.profit_ou >= 0 ? '+' : ''}RM <CountUp end={stats.profit_ou} duration={2000} decimals={2} />
                </span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    stats.profit_ou >= 0 ? 'bg-success' : 'bg-danger'
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(stats.profit_ou) / 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Win Rate Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div style={{ animationDelay: '0s' }}>
          <Card className="animate-bounce-subtle">
            <CardBody className="p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                <CountUp end={mlWinRate} duration={2000} decimals={0} suffix="%" />
              </div>
              <div className="text-xs text-text-secondary">ML Win Rate</div>
            </CardBody>
          </Card>
        </div>
        <div style={{ animationDelay: '0.5s' }}>
          <Card className="animate-bounce-subtle">
            <CardBody className="p-4 text-center">
              <div className="text-3xl font-bold text-warning mb-1">
                <CountUp end={hdpWinRate} duration={2000} decimals={0} suffix="%" />
              </div>
              <div className="text-xs text-text-secondary">HDP Win Rate</div>
            </CardBody>
          </Card>
        </div>
        <div style={{ animationDelay: '1s' }}>
          <Card className="animate-bounce-subtle">
            <CardBody className="p-4 text-center">
              <div className="text-3xl font-bold text-danger mb-1">
                <CountUp end={ouWinRate} duration={2000} decimals={0} suffix="%" />
              </div>
              <div className="text-xs text-text-secondary">O/U Win Rate</div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
