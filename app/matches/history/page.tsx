import { getFinishedMatchesWithinYear } from '@/lib/api/matches'
import { getOverallProfitStats, getProfitChartData } from '@/lib/api/profit-summary'
import { FilterableMatchList } from '@/components/matches/FilterableMatchList'
import { OverallProfitStatsDisplay } from '@/components/profit/OverallProfitStats'
import { ProfitChart } from '@/components/profit/ProfitChart'
import { HistoryStatsCard } from '@/components/matches/HistoryStatsCard'
import Link from 'next/link'

export const metadata = {
  title: 'Match History | Football AI Odds',
  description: 'View finished matches with profit/loss analysis and performance statistics'
}

export default async function MatchHistoryPage() {
  const finishedMatches = await getFinishedMatchesWithinYear()
  const overallProfitStats = await getOverallProfitStats()
  const profitChartData = await getProfitChartData()

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section with Dynamic Background */}
      <section className="relative border-b border-border bg-gradient-to-br from-success/5 via-surface to-background overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-danger/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-text-secondary hover:text-success transition-colors mb-6 hover:gap-2 gap-1"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-4">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-success">Performance Tracking</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3 leading-tight">
                Match
                <span className="text-success"> History</span>
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl">
                Performance analysis and profit/loss tracking for finished matches
              </p>
            </div>

            {/* Stats Card with Animation */}
            {overallProfitStats.total_matches > 0 && (
              <div className="hidden md:block animate-float">
                <HistoryStatsCard
                  totalMatches={overallProfitStats.total_matches}
                  roiPercentage={overallProfitStats.roi_percentage}
                  totalBets={overallProfitStats.total_bets}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Overall Profit Stats */}
        {overallProfitStats.total_matches > 0 && (
          <OverallProfitStatsDisplay stats={overallProfitStats} />
        )}

        {/* Profit Chart */}
        {profitChartData.length > 0 && (
          <ProfitChart data={profitChartData} />
        )}

        {/* Match History List */}
        <FilterableMatchList
          matches={finishedMatches}
          title="All Finished Matches"
          emptyMessage="No finished matches found"
          useFinishedLayout={true}
        />
      </div>
    </div>
  )
}
