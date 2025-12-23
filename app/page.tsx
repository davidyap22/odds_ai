import { getLiveMatches, getUpcomingMatches, getFinishedMatchesWithinYear } from '@/lib/api/matches'
import { getOverallProfitStats } from '@/lib/api/profit-summary'
import { MatchList } from '@/components/matches/MatchList'
import { Card, CardBody } from '@/components/ui/Card'
import { HeroStats } from '@/components/home/HeroStats'
import { PerformanceOverview } from '@/components/home/PerformanceOverview'
import Link from 'next/link'

export default async function Home() {
  const liveMatches = await getLiveMatches()
  const upcomingMatches = await getUpcomingMatches()
  const finishedMatches = await getFinishedMatchesWithinYear()
  const overallProfitStats = await getOverallProfitStats()

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Design */}
      <section className="relative border-b border-border bg-gradient-to-br from-primary/5 via-surface to-background overflow-hidden">
        {/* Football Field Pattern Background */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(59, 130, 246, 0.3) 50px, rgba(59, 130, 246, 0.3) 51px),
              repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(59, 130, 246, 0.3) 50px, rgba(59, 130, 246, 0.3) 51px)
            `
          }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary/30 rounded-full"></div>
        </div>

        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-warning/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>

        {/* Floating Football Icons */}
        <div className="absolute top-20 left-10 text-4xl opacity-10 animate-float">⚽</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>⚽</div>
        <div className="absolute bottom-32 left-1/4 text-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>⚽</div>
        <div className="absolute top-1/3 right-1/4 text-6xl opacity-5 animate-rotate-slow">⚽</div>

        {/* Trophy and Award Icons */}
        <div className="absolute top-1/4 left-1/3 text-3xl opacity-10 animate-bounce-subtle">🏆</div>
        <div className="absolute bottom-1/4 right-1/3 text-4xl opacity-10 animate-bounce-subtle" style={{ animationDelay: '1.5s' }}>🎯</div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Main Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
                Smart Football
                <span className="block text-primary">
                  Odds Analysis
                </span>
              </h1>

              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                Make data-driven decisions with AI-powered predictions. Track performance, analyze trends, and maximize your betting strategy.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                {liveMatches.length > 0 && (
                  <a
                    href="#live"
                    className="px-8 py-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/50"
                  >
                    🔴 View Live Matches
                  </a>
                )}
                <Link
                  href="/matches/upcoming"
                  className="px-8 py-4 rounded-lg bg-surface border-2 border-border text-text-primary font-semibold hover:bg-surface-hover hover:border-primary transition-all transform hover:scale-105"
                >
                  Upcoming Matches
                </Link>
              </div>

              {/* Mini Stats with Animation */}
              <HeroStats
                totalMatches={overallProfitStats.total_matches}
                totalBets={overallProfitStats.total_bets}
                roiPercentage={overallProfitStats.roi_percentage}
              />
            </div>

            {/* Right Side - Performance Dashboard with Animation */}
            <PerformanceOverview stats={overallProfitStats} />
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

      {/* Enhanced Quick Access Section */}
      <section className="py-16 bg-background relative overflow-hidden">
        {/* Decorative Football Elements */}
        <div className="absolute top-10 right-10 text-9xl opacity-[0.03] animate-rotate-slow">⚽</div>
        <div className="absolute bottom-10 left-10 text-7xl opacity-[0.03] animate-float">🏟️</div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-3">Explore Match Analysis</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Access comprehensive match data, AI predictions, and performance analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Upcoming Matches Card - Enhanced */}
            <Link href="/matches/upcoming" className="group">
              <Card hover className="h-full border-2 border-transparent hover:border-primary/50 transition-all relative overflow-hidden">
                {/* Decorative Football */}
                <div className="absolute -bottom-10 -right-10 text-9xl opacity-5 group-hover:scale-110 group-hover:rotate-45 transition-all duration-500">⚽</div>

                <CardBody className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-4xl">📅</span>
                    </div>
                    <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {upcomingMatches.length} Available
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                    Upcoming Matches
                  </h3>
                  <p className="text-text-secondary mb-6 leading-relaxed">
                    View upcoming fixtures with AI-powered predictions, real-time odds, and detailed match analysis for informed betting decisions.
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="space-y-1">
                      <div className="text-xs text-text-secondary">Features</div>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-surface text-text-primary">AI Predictions</span>
                        <span className="text-xs px-2 py-1 rounded bg-surface text-text-primary">Live Odds</span>
                      </div>
                    </div>
                    <div className="text-primary font-semibold group-hover:translate-x-2 transition-transform">
                      Explore →
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>

            {/* Match History Card - Enhanced */}
            <Link href="/matches/history" className="group">
              <Card hover className="h-full border-2 border-transparent hover:border-success/50 transition-all relative overflow-hidden">
                {/* Decorative Trophy */}
                <div className="absolute -top-10 -left-10 text-8xl opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">🏆</div>

                <CardBody className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-4xl">📊</span>
                    </div>
                    <div className="px-4 py-1 rounded-full bg-success/10 text-success text-sm font-semibold">
                      {finishedMatches.length} Tracked
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-success transition-colors">
                    Match History & Analytics
                  </h3>
                  <p className="text-text-secondary mb-6 leading-relaxed">
                    Comprehensive performance tracking with profit/loss analysis, win rate statistics, and visual trend charts to optimize your strategy.
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="space-y-1">
                      <div className="text-xs text-text-secondary">Includes</div>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-surface text-text-primary">P/L Charts</span>
                        <span className="text-xs px-2 py-1 rounded bg-surface text-text-primary">Analytics</span>
                      </div>
                    </div>
                    <div className="text-success font-semibold group-hover:translate-x-2 transition-transform">
                      View Stats →
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-b from-surface via-background to-surface border-y border-border relative overflow-hidden">
        {/* Football Stadium Atmosphere */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-7xl animate-bounce-subtle">⚽</div>
          <div className="absolute bottom-20 right-20 text-6xl animate-float">🥅</div>
          <div className="absolute top-1/2 left-1/4 text-5xl opacity-50 animate-pulse-glow">🏟️</div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Leverage cutting-edge technology and comprehensive analytics to make smarter betting decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Feature 1 */}
            <Card className="text-center border-2 border-transparent hover:border-primary/30 transition-all group glow-border relative overflow-hidden">
              <div className="absolute top-0 right-0 text-6xl opacity-5 -rotate-12 group-hover:rotate-12 transition-transform duration-700">⚽</div>
              <CardBody className="p-8 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform group-hover:animate-rotate-slow">
                  <span className="text-5xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">AI-Powered Predictions</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Advanced machine learning algorithms analyze historical data, team form, player statistics, and market trends to generate accurate predictions.
                </p>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Machine Learning</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Data-Driven</span>
                </div>
              </CardBody>
            </Card>

            {/* Feature 2 */}
            <Card className="text-center border-2 border-transparent hover:border-success/30 transition-all group glow-border relative overflow-hidden">
              <div className="absolute bottom-0 left-0 text-7xl opacity-5 rotate-45 group-hover:-rotate-45 transition-transform duration-700">🏆</div>
              <CardBody className="p-8 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-float" style={{ animationDelay: '1s' }}>
                  <span className="text-5xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">Complete Analytics</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Track every bet type - Moneyline, Handicap, and Over/Under. Visualize performance with interactive charts and detailed profit/loss breakdowns.
                </p>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">P/L Tracking</span>
                  <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">ROI Analysis</span>
                </div>
              </CardBody>
            </Card>

            {/* Feature 3 */}
            <Card className="text-center border-2 border-transparent hover:border-warning/30 transition-all group glow-border relative overflow-hidden">
              <div className="absolute top-1/2 right-0 -translate-y-1/2 text-8xl opacity-5 group-hover:scale-125 transition-transform duration-700">🎯</div>
              <CardBody className="p-8 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-pulse-glow">
                  <span className="text-5xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">Real-Time Updates</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Stay ahead with live match tracking, instant odds updates, and real-time score monitoring. Never miss a betting opportunity.
                </p>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold">Live Data</span>
                  <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold">Instant Updates</span>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-surface/50 border border-border">
              <div className="text-3xl font-bold text-primary mb-2">{overallProfitStats.total_bets}+</div>
              <div className="text-sm text-text-secondary">Total Bets Analyzed</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-surface/50 border border-border">
              <div className="text-3xl font-bold text-success mb-2">3</div>
              <div className="text-sm text-text-secondary">Bet Types Supported</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-surface/50 border border-border">
              <div className="text-3xl font-bold text-warning mb-2">24/7</div>
              <div className="text-sm text-text-secondary">Platform Availability</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-surface/50 border border-border">
              <div className="text-3xl font-bold text-purple-400 mb-2">{finishedMatches.length}+</div>
              <div className="text-sm text-text-secondary">Matches Tracked</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-success/5 overflow-hidden">
        {/* Football Stadium Scene */}
        <div className="absolute inset-0 opacity-5">
          {/* Stadium Lights */}
          <div className="absolute top-0 left-1/4 w-2 h-32 bg-gradient-to-b from-warning to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-2 h-32 bg-gradient-to-b from-warning to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>

          {/* Floating Footballs */}
          <div className="absolute top-1/4 left-10 text-6xl animate-float">⚽</div>
          <div className="absolute top-1/3 right-20 text-5xl animate-float" style={{ animationDelay: '1s' }}>⚽</div>
          <div className="absolute bottom-20 left-1/3 text-7xl animate-bounce-subtle">⚽</div>

          {/* Goal Posts */}
          <div className="absolute bottom-0 left-10 text-8xl opacity-30">🥅</div>
          <div className="absolute bottom-0 right-10 text-8xl opacity-30 scale-x-[-1]">🥅</div>

          {/* Celebration Icons */}
          <div className="absolute top-20 right-1/3 text-4xl animate-bounce-subtle" style={{ animationDelay: '0.8s' }}>🎉</div>
          <div className="absolute bottom-1/4 left-1/4 text-5xl animate-pulse-glow">🏆</div>
        </div>

        {/* Animated background blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-success/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 animate-bounce-subtle">
            Ready to Make Smarter Bets?
          </h2>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Start analyzing matches with AI-powered insights and track your performance with comprehensive analytics.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/matches/upcoming"
              className="px-10 py-5 rounded-xl bg-primary text-white text-lg font-bold hover:bg-primary-hover transition-all transform hover:scale-105 shadow-xl hover:shadow-primary/50 animate-shimmer"
            >
              Explore Upcoming Matches
            </Link>
            <Link
              href="/matches/history"
              className="px-10 py-5 rounded-xl bg-surface border-2 border-border text-text-primary text-lg font-bold hover:bg-surface-hover hover:border-primary transition-all transform hover:scale-105 glow-border"
            >
              View Performance Stats
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
