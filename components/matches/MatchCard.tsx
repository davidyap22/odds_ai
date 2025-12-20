import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MoneylineOdds } from '@/components/odds/MoneylineOdds'
import { AIPredictionBadge } from '@/components/predictions/AIPredictionBadge'
import { MatchWithOdds } from '@/types'

interface MatchCardProps {
  match: MatchWithOdds
}

export function MatchCard({ match }: MatchCardProps) {
  const matchDate = new Date(match.match_date)
  const isLive = match.status === 'live'

  return (
    <Link href={`/match/${match.id}`}>
      <Card hover className="h-full">
        <CardBody>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 flex-1">
              {match.league_logo && (
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
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
                  <span className="text-xs text-text-secondary">{match.league}</span>
                  {isLive && <Badge variant="live">LIVE</Badge>}
                </div>
                <div className="text-xs text-text-secondary">
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
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                {match.home_logo && (
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Image
                      src={match.home_logo}
                      alt={match.home_team}
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                  </div>
                )}
                <span className="font-medium text-text-primary">{match.home_team}</span>
              </div>
              {isLive && match.home_score !== null && (
                <span className="text-2xl font-bold font-mono text-text-primary">
                  {match.home_score}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                {match.away_logo && (
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Image
                      src={match.away_logo}
                      alt={match.away_team}
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                  </div>
                )}
                <span className="font-medium text-text-primary">{match.away_team}</span>
              </div>
              {isLive && match.away_score !== null && (
                <span className="text-2xl font-bold font-mono text-text-primary">
                  {match.away_score}
                </span>
              )}
            </div>
          </div>

          {match.odds && !isLive && (
            <div className="pt-3 border-t border-border">
              <MoneylineOdds
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                homeOdds={match.odds.moneyline_home}
                drawOdds={match.odds.moneyline_draw}
                awayOdds={match.odds.moneyline_away}
                compact
              />
            </div>
          )}

          {/* AI Predictions */}
          {match.predictions && match.predictions.length > 0 && (
            <div className="pt-3 border-t border-border">
              <div className="text-xs text-text-secondary mb-2 font-medium">AI Predictions</div>
              <div className="flex flex-wrap gap-2">
                {match.predictions.slice(0, 3).map((prediction) => (
                  <AIPredictionBadge key={prediction.id} prediction={prediction} compact />
                ))}
              </div>
            </div>
          )}

          {isLive && (
            <div className="pt-3 border-t border-border">
              <span className="text-xs text-primary">View Live Odds →</span>
            </div>
          )}
        </CardBody>
      </Card>
    </Link>
  )
}
