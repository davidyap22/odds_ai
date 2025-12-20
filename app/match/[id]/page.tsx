import { getMatchById } from '@/lib/api/matches'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CurrentOdds } from '@/components/odds/CurrentOdds'
import { LiveOddsRefresh } from '@/components/odds/LiveOddsRefresh'
import { PredictionsSection } from '@/components/predictions/PredictionsSection'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = await getMatchById(id)

  if (!match) {
    notFound()
  }

  const matchDate = new Date(match.match_date)
  const isLive = match.matchType === 'In Play'
  const isFinished = match.matchType === 'Finished' || match.matchType === 'Postponed' || match.matchType === 'Abandoned' || match.matchType === 'Not Played'
  const showScore = (isLive || isFinished) && match.home_score !== null && match.away_score !== null

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to Matches
          </Link>
        </div>

        {/* Match Header */}
        <Card className="mb-8">
          <CardBody className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-2">
                {match.league_logo && (
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Image
                      src={match.league_logo}
                      alt={match.league}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-text-secondary">{match.league}</span>
                    {isLive && <Badge variant="live">LIVE</Badge>}
                    {isFinished && <Badge variant="default">Finished</Badge>}
                    {!isLive && !isFinished && match.matchType === 'Scheduled' && <Badge variant="warning">Upcoming</Badge>}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {matchDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center md:text-right">
                <div className="flex flex-col items-center md:items-end gap-3">
                  {match.home_logo && (
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <Image
                        src={match.home_logo}
                        alt={match.home_team}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                    {match.home_team}
                  </h1>
                  {/* Home Score */}
                  {showScore && (
                    <div className="text-4xl font-bold font-mono text-primary">
                      {match.home_score}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                {showScore ? (
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-5xl font-bold font-mono text-text-primary">
                      {match.home_score}
                    </span>
                    <span className="text-2xl text-text-secondary">-</span>
                    <span className="text-5xl font-bold font-mono text-text-primary">
                      {match.away_score}
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-text-secondary">VS</span>
                )}
              </div>

              <div className="text-center md:text-left">
                <div className="flex flex-col items-center md:items-start gap-3">
                  {match.away_logo && (
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <Image
                        src={match.away_logo}
                        alt={match.away_team}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                    {match.away_team}
                  </h1>
                  {/* Away Score */}
                  {showScore && (
                    <div className="text-4xl font-bold font-mono text-primary">
                      {match.away_score}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Odds Section - Sticky on desktop */}
          <div className="lg:sticky lg:top-8 lg:self-start h-fit">
            <CurrentOdds
              latestOdds={match.latestOdds}
              matchType={match.matchType}
              homeTeam={match.home_team}
              awayTeam={match.away_team}
            />
          </div>

          {/* Predictions Section */}
          <div className="flex flex-col">
            <PredictionsSection
              predictions={match.predictions}
              homeTeam={match.home_team}
              awayTeam={match.away_team}
              league={match.league}
              matchStatus={`比分: ${match.home_score || 0} - ${match.away_score || 0}`}
              matchType={match.matchType || undefined}
            />
          </div>
        </div>
      </div>

      {/* Live odds auto-refresh */}
      <LiveOddsRefresh matchType={match.matchType} />
    </div>
  )
}
