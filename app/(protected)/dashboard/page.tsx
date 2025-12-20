import { createClient } from '@/lib/supabase/server'
import { getUpcomingMatches, getLiveMatches } from '@/lib/api/matches'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { MatchList } from '@/components/matches/MatchList'
import { FilterableMatchList } from '@/components/matches/FilterableMatchList'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const upcomingMatches = await getUpcomingMatches()
  const liveMatches = await getLiveMatches()

  // Get top 3 upcoming matches with predictions
  const recommendedMatches = upcomingMatches.slice(0, 3)

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome back!</h1>
          <p className="text-text-secondary">{user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Live Matches</p>
                  <p className="text-3xl font-bold text-text-primary">{liveMatches.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center">
                  <span className="text-2xl">🔴</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Upcoming</p>
                  <p className="text-3xl font-bold text-text-primary">{upcomingMatches.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">AI Predictions</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {upcomingMatches.length * 3}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recommended Matches */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-text-primary">Recommended for You</h2>
              <p className="text-sm text-text-secondary mt-1">
                Top upcoming matches based on AI confidence scores
              </p>
            </CardHeader>
            <CardBody>
              {recommendedMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedMatches.map((match) => {
                    const matchDate = new Date(match.match_date)
                    return (
                      <a
                        key={match.id}
                        href={`/match/${match.id}`}
                        className="block p-4 rounded-lg bg-surface border border-border hover:border-primary hover:bg-surface-hover transition-all"
                      >
                        <div className="text-xs text-text-secondary mb-2">
                          {matchDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="font-medium text-text-primary mb-1">
                          {match.home_team}
                        </div>
                        <div className="text-xs text-text-secondary mb-1">vs</div>
                        <div className="font-medium text-text-primary">{match.away_team}</div>
                        {match.odds && (
                          <div className="mt-3 pt-3 border-t border-border text-xs text-primary">
                            View Predictions →
                          </div>
                        )}
                      </a>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-text-secondary py-8">
                  No recommendations available
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-danger rounded-full animate-pulse" />
              Live Now
            </h2>
            <MatchList matches={liveMatches} />
          </div>
        )}

        {/* All Upcoming Matches with League Filter */}
        <div>
          <FilterableMatchList
            matches={upcomingMatches}
            title="All Upcoming Matches"
            emptyMessage="No upcoming matches scheduled"
          />
        </div>
      </div>
    </div>
  )
}
