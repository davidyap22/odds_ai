import { getUpcomingMatches } from '@/lib/api/matches'
import { FilterableMatchList } from '@/components/matches/FilterableMatchList'
import { UpcomingStatsCard } from '@/components/matches/UpcomingStatsCard'
import Link from 'next/link'

export const metadata = {
  title: 'Upcoming Matches | Football AI Odds',
  description: 'View upcoming football matches with AI-powered predictions and odds analysis'
}

export default async function UpcomingMatchesPage() {
  const upcomingMatches = await getUpcomingMatches()

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section with Dynamic Background */}
      <section className="relative border-b border-border bg-gradient-to-br from-primary/5 via-surface to-background overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-warning/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-text-secondary hover:text-primary transition-colors mb-6 hover:gap-2 gap-1"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-primary">AI-Powered Predictions</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3 leading-tight">
                Upcoming
                <span className="text-primary"> Matches</span>
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl">
                View all scheduled matches with AI predictions and comprehensive odds analysis
              </p>
            </div>

            {/* Stats Card with Animation */}
            <div className="hidden md:block animate-float">
              <UpcomingStatsCard count={upcomingMatches.length} />
            </div>
          </div>
        </div>
      </section>

      {/* Matches List */}
      <div className="container mx-auto px-4 py-8">
        <FilterableMatchList
          matches={upcomingMatches}
          title=""
          emptyMessage="No upcoming matches scheduled"
          useUpcomingLayout={true}
        />
      </div>
    </div>
  )
}
