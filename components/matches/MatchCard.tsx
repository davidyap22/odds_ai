import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MoneylineOdds } from '@/components/odds/MoneylineOdds'
import { AIPredictionBadge } from '@/components/predictions/AIPredictionBadge'
import { MatchWithOdds } from '@/types'
import { formatCurrency } from '@/lib/utils/format'

interface MatchCardProps {
  match: MatchWithOdds
}

export function MatchCard({ match }: MatchCardProps) {
  const matchDate = new Date(match.match_date)
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'
  const isUpcoming = !isLive && !isFinished

  // Calculate average confidence from predictions
  const avgConfidence = match.predictions && match.predictions.length > 0
    ? match.predictions.reduce((sum, p) => sum + p.confidence_score, 0) / match.predictions.length
    : 0

  return (
    <Link href={`/match/${match.id}`}>
      <Card
        hover
        className={`h-full group relative overflow-hidden transition-all duration-300 ${
          isUpcoming ? 'glow-border bg-gradient-to-br from-primary/5 via-surface to-surface hover:from-primary/10' : ''
        } ${
          isLive ? 'border-danger/50 bg-gradient-to-br from-danger/5 to-surface' : ''
        } ${
          isFinished ? 'bg-gradient-to-br from-success/5 to-surface' : ''
        }`}
      >
        {/* Animated background blob for upcoming matches */}
        {isUpcoming && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow"></div>
        )}

        <CardBody className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 flex-1">
              {match.league_logo && (
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
                  <Image
                    src={match.league_logo}
                    alt={match.league}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-text-secondary">{match.league}</span>
                  {isLive && <Badge variant="live">LIVE</Badge>}
                  {isUpcoming && match.predictions && match.predictions.length > 0 && (
                    <Badge variant="primary" className="text-[10px] px-2 py-0.5 animate-pulse">
                      AI ✨
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-text-secondary font-medium">
                  {isLive
                    ? 'In Progress'
                    : matchDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                </div>
              </div>
            </div>

            {/* Confidence indicator for upcoming matches */}
            {isUpcoming && avgConfidence > 0 && (
              <div className="flex flex-col items-end">
                <div className="text-[10px] text-text-secondary mb-1">Confidence</div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        avgConfidence >= 70 ? 'bg-success' : avgConfidence >= 50 ? 'bg-warning' : 'bg-danger'
                      }`}
                      style={{ width: `${avgConfidence}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-bold ${
                    avgConfidence >= 70 ? 'text-success' : avgConfidence >= 50 ? 'text-warning' : 'text-danger'
                  }`}>
                    {avgConfidence.toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between group/team">
              <div className="flex items-center gap-3 flex-1">
                {match.home_logo && (
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 ring-2 ring-primary/10 group-hover/team:ring-primary/30 group-hover/team:scale-110 transition-all duration-300 shadow-sm">
                    <Image
                      src={match.home_logo}
                      alt={match.home_team}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <span className="font-semibold text-text-primary group-hover/team:text-primary transition-colors">
                    {match.home_team}
                  </span>
                  {isUpcoming && (
                    <div className="text-[10px] text-text-secondary mt-0.5">Home</div>
                  )}
                </div>
              </div>
              {isLive && match.home_score !== null && (
                <span className="text-2xl font-bold font-mono text-text-primary tabular-nums">
                  {match.home_score}
                </span>
              )}
            </div>

            {/* VS Separator for Upcoming Matches */}
            {isUpcoming && (
              <div className="flex items-center justify-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                <span className="px-3 text-[10px] font-bold text-text-secondary">VS</span>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              </div>
            )}

            <div className="flex items-center justify-between group/team">
              <div className="flex items-center gap-3 flex-1">
                {match.away_logo && (
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 ring-2 ring-danger/10 group-hover/team:ring-danger/30 group-hover/team:scale-110 transition-all duration-300 shadow-sm">
                    <Image
                      src={match.away_logo}
                      alt={match.away_team}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <span className="font-semibold text-text-primary group-hover/team:text-danger transition-colors">
                    {match.away_team}
                  </span>
                  {isUpcoming && (
                    <div className="text-[10px] text-text-secondary mt-0.5">Away</div>
                  )}
                </div>
              </div>
              {isLive && match.away_score !== null && (
                <span className="text-2xl font-bold font-mono text-text-primary tabular-nums">
                  {match.away_score}
                </span>
              )}
            </div>
          </div>

          {/* Profit Summary for Finished Matches */}
          {isFinished && match.profit_summary && (
            <div className="pt-3 border-t border-border">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="p-2 rounded bg-surface/50">
                  <div className="text-xs text-text-secondary mb-1">Moneyline</div>
                  <div className={`text-sm font-bold ${match.profit_summary.profit_moneyline >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(match.profit_summary.profit_moneyline)}
                  </div>
                </div>
                <div className="p-2 rounded bg-surface/50">
                  <div className="text-xs text-text-secondary mb-1">Over/Under</div>
                  <div className={`text-sm font-bold ${match.profit_summary.profit_ou >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(match.profit_summary.profit_ou)}
                  </div>
                </div>
                <div className="p-2 rounded bg-surface/50">
                  <div className="text-xs text-text-secondary mb-1">Handicap</div>
                  <div className={`text-sm font-bold ${match.profit_summary.profit_handicap >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(match.profit_summary.profit_handicap)}
                  </div>
                </div>
                <div className={`p-2 rounded ${match.profit_summary.total_profit >= 0 ? 'bg-success/10' : 'bg-danger/10'}`}>
                  <div className="text-xs text-text-secondary mb-1">Total P/L</div>
                  <div className={`text-sm font-bold ${match.profit_summary.total_profit >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(match.profit_summary.total_profit)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Odds for Upcoming Matches - Enhanced */}
          {isUpcoming && match.odds && (
            <div className="pt-3 border-t border-border/50 space-y-3">
              {/* Moneyline Odds */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-text-secondary">Moneyline</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-surface border border-primary/20 text-center hover:border-primary/50 transition-colors">
                    <div className="text-[10px] text-text-secondary mb-1 truncate">Home</div>
                    <div className="text-sm font-bold text-primary">{match.odds.moneyline_home?.toFixed(2) || '-'}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-warning/10 to-surface border border-warning/20 text-center hover:border-warning/50 transition-colors">
                    <div className="text-[10px] text-text-secondary mb-1">Draw</div>
                    <div className="text-sm font-bold text-warning">{match.odds.moneyline_draw?.toFixed(2) || '-'}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-danger/10 to-surface border border-danger/20 text-center hover:border-danger/50 transition-colors">
                    <div className="text-[10px] text-text-secondary mb-1 truncate">Away</div>
                    <div className="text-sm font-bold text-danger">{match.odds.moneyline_away?.toFixed(2) || '-'}</div>
                  </div>
                </div>
              </div>

              {/* Handicap & Over/Under Preview */}
              <div className="grid grid-cols-2 gap-2">
                {match.odds.handicap_home_odds && (
                  <div className="p-2 rounded-lg bg-surface/50 border border-border/50 hover:border-success/50 transition-colors">
                    <div className="text-[10px] text-text-secondary mb-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-success"></span>
                      Handicap
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-text-primary">{match.odds.handicap_line}</span>
                      <span className="text-xs font-bold text-success">{match.odds.handicap_home_odds.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                {match.odds.over_under_line && (
                  <div className="p-2 rounded-lg bg-surface/50 border border-border/50 hover:border-warning/50 transition-colors">
                    <div className="text-[10px] text-text-secondary mb-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-warning"></span>
                      Over/Under
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-text-primary">{match.odds.over_under_line}</span>
                      <span className="text-xs font-bold text-warning">{match.odds.over_odds?.toFixed(2) || '-'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Predictions for Upcoming Matches - Enhanced */}
          {isUpcoming && match.predictions && match.predictions.length > 0 && (
            <div className="pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                  <span className="text-primary">🤖</span>
                  AI Recommendations
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {match.predictions.length} tips
                </span>
              </div>
              <div className="space-y-2">
                {match.predictions.slice(0, 2).map((prediction, index) => (
                  <div
                    key={prediction.id}
                    className="p-2.5 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 hover:border-primary/40 transition-all group/pred"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary uppercase">{prediction.prediction_type}</span>
                        <span className="text-[10px] text-text-secondary">•</span>
                        <span className="text-xs text-text-primary font-medium truncate max-w-[120px]">
                          {prediction.predicted_outcome}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          prediction.confidence_score >= 70 ? 'bg-success animate-pulse' :
                          prediction.confidence_score >= 50 ? 'bg-warning' : 'bg-danger'
                        }`}></div>
                        <span className={`text-xs font-bold ${
                          prediction.confidence_score >= 70 ? 'text-success' :
                          prediction.confidence_score >= 50 ? 'text-warning' : 'text-danger'
                        }`}>
                          {prediction.confidence_score}%
                        </span>
                      </div>
                    </div>
                    {prediction.ai_analysis && (
                      <p className="text-[10px] text-text-secondary line-clamp-1 group-hover/pred:line-clamp-none transition-all">
                        {prediction.ai_analysis}
                      </p>
                    )}
                  </div>
                ))}
                {match.predictions.length > 2 && (
                  <div className="text-center pt-1">
                    <span className="text-[10px] text-primary font-medium hover:underline">
                      +{match.predictions.length - 2} more predictions →
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View Details CTA */}
          {isUpcoming && (
            <div className="pt-3 border-t border-border/50 mt-3">
              <div className="flex items-center justify-between group/cta">
                <span className="text-xs font-semibold text-primary group-hover/cta:text-primary-hover transition-colors">
                  View Full Analysis
                </span>
                <span className="text-primary group-hover/cta:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          )}

          {isLive && (
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between group/cta">
                <span className="text-xs font-semibold text-danger animate-pulse">● LIVE - View Match</span>
                <span className="text-danger group-hover/cta:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          )}

          {isFinished && (
            <div className="pt-3 border-t border-border/50">
              <div className="flex items-center justify-between group/cta">
                <span className="text-xs font-semibold text-success group-hover/cta:text-success/80 transition-colors">
                  View Performance Analysis
                </span>
                <span className="text-success group-hover/cta:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </Link>
  )
}
