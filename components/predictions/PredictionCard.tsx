import { Card, CardBody } from '@/components/ui/Card'
import { Prediction } from '@/types'

interface PredictionCardProps {
  prediction: Prediction
  homeTeam: string
  awayTeam: string
  league: string
  matchStatus?: string
  matchType?: string
}

const predictionTypeLabels = {
  moneyline: 'Moneyline',
  over_under: 'Over/Under',
  handicap: 'Handicap',
}

const AI_MODEL_INFO: Record<string, { name: string; colors: string; icon: string }> = {
  gemini: {
    name: 'Gemini',
    colors: 'from-blue-500 to-purple-600',
    icon: '🤖'
  },
  chatgpt: {
    name: 'ChatGPT',
    colors: 'from-emerald-500 to-teal-600',
    icon: '🧠'
  },
  claude: {
    name: 'Claude',
    colors: 'from-orange-500 to-amber-600',
    icon: '⚡'
  },
  'aggressive model': {
    name: 'Aggressive',
    colors: 'from-red-500 to-pink-600',
    icon: '🔥'
  }
}

const SIGNAL_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  '🟢': { label: '进场', color: 'text-success', bg: 'bg-success/10' },
  '🟡': { label: '观望', color: 'text-warning', bg: 'bg-warning/10' },
  '🔴': { label: '避开', color: 'text-danger', bg: 'bg-danger/10' },
  '🔥': { label: '倍投', color: 'text-red-500', bg: 'bg-red-500/10' },
  '🔵': { label: '持仓', color: 'text-blue-500', bg: 'bg-blue-500/10' },
}

export function PredictionCard({ prediction, homeTeam, awayTeam, league, matchStatus, matchType }: PredictionCardProps) {
  const modelInfo = (prediction.ai_model && AI_MODEL_INFO[prediction.ai_model])
    ? AI_MODEL_INFO[prediction.ai_model]
    : AI_MODEL_INFO.gemini
  const oddsData = prediction.odds_data as any

  // Get signal style and clean text
  const signalEmoji = prediction.signal?.match(/[🟢🟡🔴🔥🔵]/)?.[0] || '🟢'
  const signalStyle = SIGNAL_STYLES[signalEmoji] || SIGNAL_STYLES['🟢']
  // Remove emoji, question marks, and all special punctuation
  const signalText = prediction.signal?.replace(/[🟢🟡🔴🔥🔵？?！!。.，,]/g, '').trim() || '信号'

  // Get border color class based on signal
  const getBorderColor = () => {
    if (signalEmoji === '🟢') return 'border-success/30'
    if (signalEmoji === '🟡') return 'border-warning/30'
    if (signalEmoji === '🔴') return 'border-danger/30'
    if (signalEmoji === '🔥') return 'border-red-500/30'
    if (signalEmoji === '🔵') return 'border-blue-500/30'
    return 'border-success/30'
  }

  // Determine match status for display
  const isLive = matchType === 'In Play'
  const isScheduled = matchType === 'Scheduled'
  const isFinished = matchType === 'Finished' || matchType === 'Postponed' || matchType === 'Abandoned' || matchType === 'Not Played'

  return (
    <Card className="overflow-hidden border border-primary/20 h-full">
      {/* Header with gradient and status indicator */}
      <div className={`bg-gradient-to-r ${modelInfo.colors} px-4 py-3`}>
        <div className="flex items-center justify-between text-white">
          {/* Left: Status Badge */}
          <div className="flex items-center gap-2 min-w-[80px]">
            <span className="text-2xl">{modelInfo.icon}</span>
            {isLive && (
              <div className="inline-flex px-2 py-0.5 bg-red-500 rounded-full text-[10px] font-bold text-white animate-pulse items-center gap-1">
                <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
                LIVE
              </div>
            )}
            {isScheduled && (
              <div className="inline-flex px-2 py-0.5 bg-blue-500 rounded-full text-[10px] font-bold text-white">
                Scheduled
              </div>
            )}
            {isFinished && (
              <div className="inline-flex px-2 py-0.5 bg-gray-500 rounded-full text-[10px] font-bold text-white">
                Finished
              </div>
            )}
          </div>

          {/* Center: Prediction Type (Large) */}
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold">{predictionTypeLabels[prediction.prediction_type]}</div>
            <div className="text-xs opacity-90 mt-0.5">({prediction.ai_model || 'AI'})</div>
          </div>

          {/* Right: Clock */}
          {prediction.clock !== null && (
            <div className="flex items-center gap-1.5 min-w-[80px] justify-end">
              <span className="text-lg">⏱️</span>
              <div className="text-2xl font-bold leading-none">'{prediction.clock}</div>
            </div>
          )}
        </div>
      </div>

      <CardBody className="p-3 space-y-2.5">
        {/* Signal + Recommended Bet in 2 columns */}
        <div className="grid grid-cols-2 gap-2">
          {/* Strategy Signal */}
          <div className={`p-2 rounded-lg ${signalStyle.bg} border ${getBorderColor()}`}>
            <div className="text-xs text-text-secondary mb-1">Strategy Signal</div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{signalEmoji}</span>
              <span className={`text-sm font-bold ${signalStyle.color}`}>{signalText}</span>
            </div>
          </div>

          {/* Recommended Bet */}
          <div className="bg-gradient-to-r from-primary/10 to-success/10 p-2 rounded-lg border border-primary/30">
            <div className="text-xs text-text-secondary mb-1">Recommended</div>
            <div className="text-sm font-bold text-primary truncate">{prediction.predicted_outcome}</div>
          </div>
        </div>

        {/* Odds Display */}
        {oddsData && (
          <div className="bg-surface p-2 rounded-lg border border-border">
            <div className="text-xs text-text-secondary mb-1.5 font-semibold">📈 Signal Odds</div>

            {prediction.prediction_type === 'moneyline' && oddsData.home && (
              <div className="grid grid-cols-3 gap-1.5">
                <div className="text-center p-1.5 rounded bg-background">
                  <div className="text-[10px] text-text-secondary mb-0.5">Home</div>
                  <div className="text-sm font-bold text-text-primary">{oddsData.home}</div>
                </div>
                <div className="text-center p-1.5 rounded bg-background">
                  <div className="text-[10px] text-text-secondary mb-0.5">Draw</div>
                  <div className="text-sm font-bold text-text-primary">{oddsData.draw || '-'}</div>
                </div>
                <div className="text-center p-1.5 rounded bg-background">
                  <div className="text-[10px] text-text-secondary mb-0.5">Away</div>
                  <div className="text-sm font-bold text-text-primary">{oddsData.away}</div>
                </div>
              </div>
            )}

            {prediction.prediction_type === 'over_under' && oddsData.line && (
              <div className="space-y-1.5">
                <div className="text-center bg-primary/10 py-0.5 rounded">
                  <span className="text-xs text-text-secondary">Line: </span>
                  <span className="text-sm font-bold text-primary">{oddsData.line}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="text-center p-1.5 rounded bg-success/10 border border-success/30">
                    <div className="text-[10px] text-text-secondary mb-0.5">Over</div>
                    <div className="text-sm font-bold text-success">{oddsData.over}</div>
                  </div>
                  <div className="text-center p-1.5 rounded bg-danger/10 border border-danger/30">
                    <div className="text-[10px] text-text-secondary mb-0.5">Under</div>
                    <div className="text-sm font-bold text-danger">{oddsData.under}</div>
                  </div>
                </div>
              </div>
            )}

            {prediction.prediction_type === 'handicap' && oddsData.line !== undefined && (
              <div className="space-y-1.5">
                <div className="text-center bg-primary/10 py-0.5 rounded">
                  <span className="text-xs text-text-secondary">Line: </span>
                  <span className="text-sm font-bold text-primary">{oddsData.line > 0 ? '+' : ''}{oddsData.line}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="text-center p-1.5 rounded bg-background">
                    <div className="text-[10px] text-text-secondary mb-0.5">Home</div>
                    <div className="text-sm font-bold text-text-primary">{oddsData.home_odds}</div>
                  </div>
                  <div className="text-center p-1.5 rounded bg-background">
                    <div className="text-[10px] text-text-secondary mb-0.5">Away</div>
                    <div className="text-sm font-bold text-text-primary">{oddsData.away_odds}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3 Column Layout: Staking Plan, AI Analysis, Market Analysis */}
        <div className="grid grid-cols-3 gap-2">
          {/* Staking Plan */}
          {(prediction.stacking_quantity || prediction.stacking_plan_description) ? (
            <div className="bg-gradient-to-r from-warning/10 to-success/10 p-2.5 rounded-lg border-l-2 border-warning">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">💰</span>
                <span className="text-xs font-semibold text-text-secondary">Staking</span>
              </div>
              {prediction.stacking_quantity && (
                <div className="text-xs font-bold text-warning mb-1.5">
                  {prediction.stacking_quantity}
                </div>
              )}
              {prediction.stacking_plan_description && (
                <div className="text-xs text-text-secondary leading-relaxed">
                  {prediction.stacking_plan_description}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface/50 p-2.5 rounded-lg border border-border/30">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">💰</span>
                <span className="text-xs font-semibold text-text-secondary">Staking</span>
              </div>
              <div className="text-xs text-text-secondary/50">No plan</div>
            </div>
          )}

          {/* AI Analysis */}
          <div className="bg-surface p-2.5 rounded-lg border-l-2 border-primary">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">💡</span>
              <span className="text-xs font-semibold text-text-secondary">AI Analysis</span>
            </div>
            <div className="text-xs text-text-primary leading-relaxed">
              {prediction.ai_analysis}
            </div>
          </div>

          {/* Market Analysis */}
          {(prediction.market_analysis_trend_direction ||
            prediction.market_analysis_odds_check ||
            prediction.market_analysis_vig_status) ? (
            <div className="bg-surface p-2.5 rounded-lg border border-border">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">📊</span>
                <span className="text-xs font-semibold text-text-secondary">Market</span>
              </div>
              <div className="space-y-1.5">
                {prediction.market_analysis_trend_direction && (
                  <div className="text-xs">
                    <div className="text-text-secondary font-semibold mb-0.5">Trend:</div>
                    <div className="text-text-primary leading-relaxed">{prediction.market_analysis_trend_direction}</div>
                  </div>
                )}
                {prediction.market_analysis_odds_check && (
                  <div className="text-xs">
                    <div className="text-text-secondary font-semibold mb-0.5">Move:</div>
                    <div className="text-text-primary leading-relaxed">{prediction.market_analysis_odds_check}</div>
                  </div>
                )}
                {prediction.market_analysis_vig_status && (
                  <div className="text-xs">
                    <div className="text-text-secondary font-semibold mb-0.5">Vig:</div>
                    <div className="text-success leading-relaxed">{prediction.market_analysis_vig_status}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-surface/50 p-2.5 rounded-lg border border-border/30">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">📊</span>
                <span className="text-xs font-semibold text-text-secondary">Market</span>
              </div>
              <div className="text-xs text-text-secondary/50">No data</div>
            </div>
          )}
        </div>

        {/* Footer with timestamp */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <div className="text-[10px] text-text-secondary italic">
            ⚠️ AI signals for reference only
          </div>
          {prediction.created_at && (
            <div className="text-[10px] text-text-secondary">
              {new Date(prediction.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
