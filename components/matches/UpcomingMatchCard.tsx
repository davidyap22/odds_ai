import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody } from '@/components/ui/Card'
import { MatchWithOdds } from '@/types'

interface UpcomingMatchCardProps {
  match: MatchWithOdds
}

export function UpcomingMatchCard({ match }: UpcomingMatchCardProps) {
  const matchDate = new Date(match.match_date)
  const hasPredictions = match.predictions && match.predictions.length > 0

  // Calculate average confidence
  const avgConfidence = hasPredictions
    ? match.predictions!.reduce((sum, p) => sum + p.confidence_score, 0) / match.predictions!.length
    : 0

  return (
    <Link href={`/match/${match.id}`}>
      <Card hover className="h-full border-primary/20 bg-surface/50 hover:border-primary/40 transition-all group relative overflow-hidden">
        {/* Subtle animated glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <CardBody className="p-5 relative z-10">
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
          </div>

          {/* Match Teams Layout - Home vs Away */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center mb-4">
            {/* Home Team */}
            <div className="flex flex-col items-center text-center">
              {match.home_logo && (
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg mb-2 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <Image
                    src={match.home_logo}
                    alt={match.home_team}
                    width={42}
                    height={42}
                    className="object-contain"
                  />
                </div>
              )}
              <span className="font-bold text-text-primary text-xs mb-0.5 group-hover:text-primary transition-colors">{match.home_team}</span>
              <span className="text-[10px] text-text-secondary">Home</span>
            </div>

            {/* VS & Time */}
            <div className="flex flex-col items-center px-3">
              <div className="text-xs font-bold text-text-secondary mb-1">VS</div>
              <div className="text-[10px] text-text-secondary text-center whitespace-nowrap">
                {matchDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="text-[10px] text-primary font-medium">
                {matchDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center text-center">
              {match.away_logo && (
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg mb-2 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <Image
                    src={match.away_logo}
                    alt={match.away_team}
                    width={42}
                    height={42}
                    className="object-contain"
                  />
                </div>
              )}
              <span className="font-bold text-text-primary text-xs mb-0.5 group-hover:text-danger transition-colors">{match.away_team}</span>
              <span className="text-[10px] text-text-secondary">Away</span>
            </div>
          </div>

          {/* AI Confidence Indicator */}
          {hasPredictions && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-text-secondary font-medium">AI Confidence</span>
                <span className={`text-xs font-bold ${
                  avgConfidence >= 70 ? 'text-success' : avgConfidence >= 50 ? 'text-warning' : 'text-danger'
                }`}>
                  {avgConfidence.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    avgConfidence >= 70 ? 'bg-success' : avgConfidence >= 50 ? 'bg-warning' : 'bg-danger'
                  }`}
                  style={{ width: `${avgConfidence}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Top AI Prediction */}
          {hasPredictions && match.predictions!.length > 0 && (
            <div className="pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-primary text-sm">🤖</span>
                <span className="text-[10px] font-semibold text-text-secondary">Top Prediction</span>
              </div>
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-primary uppercase">{match.predictions![0].prediction_type}</span>
                  <span className={`text-xs font-bold ${
                    match.predictions![0].confidence_score >= 70 ? 'text-success' :
                    match.predictions![0].confidence_score >= 50 ? 'text-warning' : 'text-danger'
                  }`}>
                    {match.predictions![0].confidence_score}%
                  </span>
                </div>
                <div className="text-xs text-text-primary font-medium">
                  {match.predictions![0].predicted_outcome}
                </div>
              </div>
              {match.predictions!.length > 1 && (
                <div className="text-center mt-2">
                  <span className="text-[10px] text-primary font-medium">
                    +{match.predictions!.length - 1} more predictions →
                  </span>
                </div>
              )}
            </div>
          )}

          {/* No Predictions Message */}
          {!hasPredictions && (
            <div className="pt-3 border-t border-border/50">
              <div className="p-3 rounded-lg bg-surface/50 border border-border/50 text-center">
                <p className="text-xs text-text-secondary italic">
                  AI analysis coming soon
                </p>
              </div>
            </div>
          )}

          {/* View Details CTA */}
          <div className="pt-3 border-t border-border/50 mt-3">
            <div className="flex items-center justify-between group/cta">
              <span className="text-xs font-semibold text-primary group-hover/cta:text-primary-hover transition-colors">
                View Full Analysis
              </span>
              <span className="text-primary group-hover/cta:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
