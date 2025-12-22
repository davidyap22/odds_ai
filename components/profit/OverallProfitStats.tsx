import { Card, CardBody } from '@/components/ui/Card'
import { OverallProfitStats } from '@/lib/api/profit-summary'
import { formatProfitLoss, formatCurrency, formatPercentage } from '@/lib/utils/format'

interface OverallProfitStatsProps {
  stats: OverallProfitStats
}

export function OverallProfitStatsDisplay({ stats }: OverallProfitStatsProps) {
  const isProfit = stats.total_profit > 0
  const mlWinRate = stats.bets_moneyline > 0
    ? ((stats.wins_moneyline / stats.bets_moneyline) * 100).toFixed(1)
    : '0.0'
  const ouWinRate = stats.bets_ou > 0
    ? ((stats.wins_ou / stats.bets_ou) * 100).toFixed(1)
    : '0.0'
  const hdpWinRate = stats.bets_handicap > 0
    ? ((stats.wins_handicap / stats.bets_handicap) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-text-primary">Overall Performance</h2>
        <div className="text-sm text-text-secondary">
          {stats.total_matches} matches tracked
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Moneyline Stats */}
        <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-xl">⚽</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">Moneyline</h3>
              </div>
            </div>

            {/* Profit/Loss */}
            <div className="mb-4">
              <div className="text-xs text-text-secondary mb-1">Profit/Loss</div>
              <div className={`text-3xl font-bold ${stats.profit_moneyline >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatProfitLoss(stats.profit_moneyline)}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface/50">
                <div className="text-xs text-text-secondary mb-1">Total Bets</div>
                <div className="text-lg font-bold text-text-primary">{stats.bets_moneyline}</div>
              </div>
              <div className="p-3 rounded-lg bg-surface/50">
                <div className="text-xs text-text-secondary mb-1">Wins</div>
                <div className="text-lg font-bold text-success">{stats.wins_moneyline}</div>
              </div>
            </div>

            {/* Win Rate */}
            <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">Win Rate</span>
                <span className="text-xl font-bold text-blue-400">{mlWinRate}%</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Over/Under Stats */}
        <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">Over/Under</h3>
              </div>
            </div>

            {/* Profit/Loss */}
            <div className="mb-4">
              <div className="text-xs text-text-secondary mb-1">Profit/Loss</div>
              <div className={`text-3xl font-bold ${stats.profit_ou >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatProfitLoss(stats.profit_ou)}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface/50">
                <div className="text-xs text-text-secondary mb-1">Total Bets</div>
                <div className="text-lg font-bold text-text-primary">{stats.bets_ou}</div>
              </div>
              <div className="p-3 rounded-lg bg-surface/50">
                <div className="text-xs text-text-secondary mb-1">Wins</div>
                <div className="text-lg font-bold text-success">{stats.wins_ou}</div>
              </div>
            </div>

            {/* Win Rate */}
            <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">Win Rate</span>
                <span className="text-xl font-bold text-purple-400">{ouWinRate}%</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Handicap Stats */}
        <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">Handicap</h3>
              </div>
            </div>

            {/* Profit/Loss */}
            <div className="mb-4">
              <div className="text-xs text-text-secondary mb-1">Profit/Loss</div>
              <div className={`text-3xl font-bold ${stats.profit_handicap >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatProfitLoss(stats.profit_handicap)}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface/50">
                <div className="text-xs text-text-secondary mb-1">Total Bets</div>
                <div className="text-lg font-bold text-text-primary">{stats.bets_handicap}</div>
              </div>
              <div className="p-3 rounded-lg bg-surface/50">
                <div className="text-xs text-text-secondary mb-1">Wins</div>
                <div className="text-lg font-bold text-success">{stats.wins_handicap}</div>
              </div>
            </div>

            {/* Win Rate */}
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">Win Rate</span>
                <span className="text-xl font-bold text-amber-400">{hdpWinRate}%</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Overall Summary Bar */}
      <Card className={`mt-6 border-2 ${isProfit ? 'border-success/50' : 'border-danger/50'}`}>
        <CardBody className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-sm text-text-secondary mb-2">Total P/L</div>
              <div className={`text-3xl font-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
                {formatProfitLoss(stats.total_profit)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-text-secondary mb-2">ROI</div>
              <div className={`text-3xl font-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
                {formatPercentage(stats.roi_percentage)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-text-secondary mb-2">Total Invested</div>
              <div className="text-3xl font-bold text-text-primary">
                {formatCurrency(stats.total_invested)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-text-secondary mb-2">Total Bets</div>
              <div className="text-3xl font-bold text-primary">
                {stats.total_bets.toLocaleString('en-US')}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
