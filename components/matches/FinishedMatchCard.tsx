import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody } from '@/components/ui/Card'
import { MatchWithOdds } from '@/types'
import { formatCurrency } from '@/lib/utils/format'

interface FinishedMatchCardProps {
  match: MatchWithOdds
}

export function FinishedMatchCard({ match }: FinishedMatchCardProps) {
  const hasProfitData = match.profit_summary !== null && match.profit_summary !== undefined

  return (
    <Link href={`/match/${match.id}`}>
      <Card hover className="h-full border-success/20 bg-surface/50 hover:border-success/40 transition-all">
        <CardBody className="p-6">
          {/* League Info */}
          <div className="flex items-center gap-2 mb-4">
            {match.league_logo && (
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Image
                  src={match.league_logo}
                  alt={match.league}
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-xs font-semibold text-text-secondary">{match.league}</span>
            <span className="ml-auto text-xs text-text-secondary">
              {new Date(match.match_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Match Score Layout - Home vs Away */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-6">
            {/* Home Team */}
            <div className="flex flex-col items-center text-center">
              {match.home_logo && (
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg mb-3">
                  <Image
                    src={match.home_logo}
                    alt={match.home_team}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}
              <span className="font-bold text-text-primary text-sm mb-1">{match.home_team}</span>
              <span className="text-xs text-text-secondary">Home</span>
            </div>

            {/* VS & Score */}
            <div className="flex flex-col items-center px-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold font-mono text-text-primary tabular-nums">
                  {match.home_score ?? 0}
                </span>
                <span className="text-sm font-bold text-text-secondary">:</span>
                <span className="text-3xl font-bold font-mono text-text-primary tabular-nums">
                  {match.away_score ?? 0}
                </span>
              </div>
              <span className="text-xs text-text-secondary font-medium">FINAL</span>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center text-center">
              {match.away_logo && (
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg mb-3">
                  <Image
                    src={match.away_logo}
                    alt={match.away_team}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}
              <span className="font-bold text-text-primary text-sm mb-1">{match.away_team}</span>
              <span className="text-xs text-text-secondary">Away</span>
            </div>
          </div>

          {/* Profit Summary or No Analysis Message */}
          {hasProfitData ? (
            <div className="pt-4 border-t border-border/50">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="p-2.5 rounded-lg bg-surface/80 border border-border/50">
                  <div className="text-xs text-text-secondary mb-1">Moneyline</div>
                  <div className={`text-sm font-bold ${match.profit_summary!.profit_moneyline >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(match.profit_summary!.profit_moneyline)}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface/80 border border-border/50">
                  <div className="text-xs text-text-secondary mb-1">Over/Under</div>
                  <div className={`text-sm font-bold ${match.profit_summary!.profit_ou >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(match.profit_summary!.profit_ou)}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface/80 border border-border/50">
                  <div className="text-xs text-text-secondary mb-1">Handicap</div>
                  <div className={`text-sm font-bold ${match.profit_summary!.profit_handicap >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(match.profit_summary!.profit_handicap)}
                  </div>
                </div>
                <div className={`p-2.5 rounded-lg border ${match.profit_summary!.total_profit >= 0 ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30'}`}>
                  <div className="text-xs text-text-secondary mb-1">Total P/L</div>
                  <div className={`text-sm font-bold ${match.profit_summary!.total_profit >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(match.profit_summary!.total_profit)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-border/50">
              <div className="p-4 rounded-lg bg-surface/50 border border-border/50 text-center">
                <p className="text-sm text-text-secondary italic">
                  AI has not analyzed this match
                </p>
              </div>
            </div>
          )}

          {/* View Details CTA */}
          <div className="pt-4 border-t border-border/50 mt-4">
            <div className="flex items-center justify-between group/cta">
              <span className="text-xs font-semibold text-success group-hover/cta:text-success/80 transition-colors">
                View Performance Analysis
              </span>
              <span className="text-success group-hover/cta:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
