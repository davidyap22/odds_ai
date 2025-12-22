import { Card, CardBody } from '@/components/ui/Card'
import { ProfitSummary } from '@/lib/api/profit-summary'
import { formatProfitLoss, formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/format'

interface ProfitSummaryDisplayProps {
  profitSummary: ProfitSummary
  homeTeam: string
  awayTeam: string
}

const BET_TYPE_LABELS = {
  ML: 'Moneyline',
  OU: 'Over/Under',
  HDP: 'Handicap'
}

const STATUS_STYLES = {
  WIN: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/30',
    label: 'WIN'
  },
  LOSS: {
    bg: 'bg-danger/10',
    text: 'text-danger',
    border: 'border-danger/30',
    label: 'LOSS'
  },
  PUSH: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/30',
    label: 'PUSH'
  }
}

export function ProfitSummaryDisplay({ profitSummary, homeTeam, awayTeam }: ProfitSummaryDisplayProps) {
  const isProfit = profitSummary.total_profit > 0

  // Calculate stats by type
  const betsByType = {
    ML: profitSummary.bets.filter(b => b.type === 'ML'),
    OU: profitSummary.bets.filter(b => b.type === 'OU'),
    HDP: profitSummary.bets.filter(b => b.type === 'HDP')
  }

  const winsByType = {
    ML: betsByType.ML.filter(b => b.status === 'WIN').length,
    OU: betsByType.OU.filter(b => b.status === 'WIN').length,
    HDP: betsByType.HDP.filter(b => b.status === 'WIN').length
  }

  return (
    <div className="space-y-6">
      {/* Overall Summary Card */}
      <Card className={`border-2 ${isProfit ? 'border-success/50' : 'border-danger/50'}`}>
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-primary">Profit & Loss Summary</h3>
            <div className="text-sm text-text-secondary">
              {homeTeam} {profitSummary.home_score} - {profitSummary.away_score} {awayTeam}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Total Profit/Loss */}
            <div className={`p-4 rounded-lg ${isProfit ? 'bg-success/10' : 'bg-danger/10'}`}>
              <div className="text-xs text-text-secondary mb-1">Total P/L</div>
              <div className={`text-2xl font-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(profitSummary.total_profit)}
              </div>
            </div>

            {/* ROI */}
            <div className="p-4 rounded-lg bg-surface">
              <div className="text-xs text-text-secondary mb-1">ROI</div>
              <div className={`text-2xl font-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
                {formatPercentage(profitSummary.roi_percentage)}
              </div>
            </div>

            {/* Total Invested */}
            <div className="p-4 rounded-lg bg-surface">
              <div className="text-xs text-text-secondary mb-1">Total Invested</div>
              <div className="text-2xl font-bold text-text-primary">
                {formatCurrency(profitSummary.total_invested)}
              </div>
            </div>

            {/* Total Bets */}
            <div className="p-4 rounded-lg bg-surface">
              <div className="text-xs text-text-secondary mb-1">Total Bets</div>
              <div className="text-2xl font-bold text-text-primary">
                {profitSummary.total_bets.toLocaleString('en-US')}
              </div>
            </div>
          </div>

          {/* Profit by Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-surface border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-text-primary">Moneyline</span>
                <span className="text-xs text-text-secondary">{betsByType.ML.length} bets</span>
              </div>
              <div className={`text-xl font-bold ${profitSummary.profit_moneyline >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(profitSummary.profit_moneyline)}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {winsByType.ML} wins / {betsByType.ML.length} total
              </div>
            </div>

            <div className="p-4 rounded-lg bg-surface border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-text-primary">Handicap</span>
                <span className="text-xs text-text-secondary">{betsByType.HDP.length} bets</span>
              </div>
              <div className={`text-xl font-bold ${profitSummary.profit_handicap >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(profitSummary.profit_handicap)}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {winsByType.HDP} wins / {betsByType.HDP.length} total
              </div>
            </div>

            <div className="p-4 rounded-lg bg-surface border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-text-primary">Over/Under</span>
                <span className="text-xs text-text-secondary">{betsByType.OU.length} bets</span>
              </div>
              <div className={`text-xl font-bold ${profitSummary.profit_ou >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(profitSummary.profit_ou)}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {winsByType.OU} wins / {betsByType.OU.length} total
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Detailed Bets Table */}
      <Card>
        <CardBody className="p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Bet History ({profitSummary.bets.length} bets)</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-text-secondary">
                  <th className="text-left py-3 px-2">Time</th>
                  <th className="text-left py-3 px-2">Type</th>
                  <th className="text-left py-3 px-2">Selection</th>
                  <th className="text-right py-3 px-2">Line</th>
                  <th className="text-right py-3 px-2">Odds</th>
                  <th className="text-right py-3 px-2">Stake</th>
                  <th className="text-right py-3 px-2">P/L</th>
                  <th className="text-center py-3 px-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {profitSummary.bets.map((bet) => {
                  const statusStyle = STATUS_STYLES[bet.status]
                  return (
                    <tr key={bet.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                      <td className="py-3 px-2 text-text-secondary">
                        {bet.clock ? `'${bet.clock}` : 'Pre'}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold">
                          {BET_TYPE_LABELS[bet.type]}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-text-primary font-medium">
                        {bet.selection}
                      </td>
                      <td className="py-3 px-2 text-right text-text-secondary">
                        {bet.line !== 0 ? (bet.line > 0 ? `+${bet.line}` : bet.line) : '-'}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-text-primary">
                        {bet.odds.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right text-text-secondary">
                        {formatCurrency(bet.stake_money, 0)}
                      </td>
                      <td className={`py-3 px-2 text-right font-bold ${bet.profit > 0 ? 'text-success' : bet.profit < 0 ? 'text-danger' : 'text-text-secondary'}`}>
                        {formatProfitLoss(bet.profit)}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex justify-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                            {statusStyle.label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
