import { Card, CardBody } from '@/components/ui/Card'
import { Prediction } from '@/types'

interface PredictionCardSummaryProps {
  prediction: Prediction
  homeTeam: string
  awayTeam: string
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

export function PredictionCardSummary({ prediction, homeTeam, awayTeam }: PredictionCardSummaryProps) {
  const modelInfo = (prediction.ai_model && AI_MODEL_INFO[prediction.ai_model])
    ? AI_MODEL_INFO[prediction.ai_model]
    : AI_MODEL_INFO.gemini
  const oddsData = prediction.odds_data as any

  // Get signal style and clean text
  const signalEmoji = prediction.signal?.match(/[🟢🟡🔴🔥🔵]/)?.[0] || '🟢'
  const signalStyle = SIGNAL_STYLES[signalEmoji] || SIGNAL_STYLES['🟢']
  const signalText = prediction.signal?.replace(/[🟢🟡🔴🔥🔵？?！!。.，,]/g, '').trim() || '信号'

  return (
    <Card className="overflow-hidden border border-border/50 hover:border-primary/30 transition-all">
      <CardBody className="p-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Signal & Type */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${signalStyle.bg}`}>
              <span className="text-lg">{signalEmoji}</span>
              <span className={`text-xs font-bold ${signalStyle.color} whitespace-nowrap`}>{signalText}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs opacity-60">{modelInfo.icon}</span>
              <span className="text-sm font-semibold text-text-primary truncate">
                {prediction.predicted_outcome}
              </span>
            </div>
          </div>

          {/* Center: Odds Display (Compact) */}
          {oddsData && (
            <div className="flex items-center gap-2">
              {prediction.prediction_type === 'moneyline' && oddsData.home && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-text-secondary">Odds:</span>
                  <span className="font-mono font-bold text-primary">{oddsData.home}</span>
                </div>
              )}

              {prediction.prediction_type === 'over_under' && oddsData.line && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-text-secondary">Line:</span>
                  <span className="font-mono font-bold text-primary">{oddsData.line}</span>
                </div>
              )}

              {prediction.prediction_type === 'handicap' && oddsData.line !== undefined && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-text-secondary">Line:</span>
                  <span className="font-mono font-bold text-primary">
                    {oddsData.line > 0 ? '+' : ''}{oddsData.line}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Right: Clock & Timestamp */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {prediction.clock !== null && (
              <div className="flex items-center gap-1">
                <span className="text-sm">⏱️</span>
                <span className="text-sm font-bold text-text-primary">'{prediction.clock}</span>
              </div>
            )}

            {prediction.created_at && (
              <div className="text-xs text-text-secondary whitespace-nowrap">
                {new Date(prediction.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
