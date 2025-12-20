import { getLiveMatches, getUpcomingMatches } from '@/lib/api/matches'
import { MatchList } from '@/components/matches/MatchList'
import { FilterableMatchList } from '@/components/matches/FilterableMatchList'
import Link from 'next/link'

export default async function Home() {
  const liveMatches = await getLiveMatches()
  const upcomingMatches = await getUpcomingMatches()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-surface to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              AI-Powered Football Odds Analysis
            </h1>
            <p className="text-lg text-text-secondary mb-8">
              Get advanced AI predictions for Premier League matches. Analyze moneyline, over/under,
              and handicap odds with confidence scores backed by data.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#live"
                className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
              >
                View Live Matches
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-lg bg-surface border border-border text-text-primary font-medium hover:bg-surface-hover hover:border-border-hover transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section id="live" className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-danger rounded-full animate-pulse" />
              <h2 className="text-2xl font-bold text-text-primary">Live Matches</h2>
            </div>
            <MatchList matches={liveMatches} />
          </div>
        </section>
      )}

      {/* Upcoming Matches with League Filter */}
      <section id="upcoming" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <FilterableMatchList
            matches={upcomingMatches}
            title="Upcoming Matches"
            emptyMessage="No upcoming matches scheduled"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">AI-Powered Analysis</h3>
              <p className="text-text-secondary">
                Advanced machine learning algorithms analyze team performance, form, and statistics
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Comprehensive Odds</h3>
              <p className="text-text-secondary">
                Moneyline, over/under, and handicap odds all in one place
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Real-Time Updates</h3>
              <p className="text-text-secondary">
                Live match tracking and odds updates as games progress
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
