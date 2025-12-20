import { Prediction } from '@/types'

interface AIPredictionBadgeProps {
  prediction: Prediction
  compact?: boolean
}

const AI_MODEL_INFO = {
  gemini: {
    name: 'Gemini',
    colors: 'from-blue-500 to-purple-500',
    icon: '✨'
  },
  chatgpt: {
    name: 'ChatGPT',
    colors: 'from-emerald-500 to-teal-500',
    icon: '🤖'
  },
  claude: {
    name: 'Claude',
    colors: 'from-orange-500 to-amber-500',
    icon: '🧠'
  }
}

export function AIPredictionBadge({ prediction, compact = false }: AIPredictionBadgeProps) {
  const modelInfo = prediction.ai_model ? AI_MODEL_INFO[prediction.ai_model] : null

  if (!modelInfo) {
    return null
  }

  const predictionTypeLabel = {
    moneyline: 'Win',
    over_under: 'O/U',
    handicap: 'Handicap'
  }[prediction.prediction_type]

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border">
        <span className="text-sm">{modelInfo.icon}</span>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-text-primary">
            {prediction.predicted_outcome}
          </span>
          <span className="text-[10px] text-text-secondary">
            {Math.round(prediction.confidence_score)}% • {modelInfo.name}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${modelInfo.colors} p-[1px]`}>
      <div className="bg-surface rounded-lg p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{modelInfo.icon}</span>
            <div>
              <div className="text-xs font-medium text-text-secondary">{modelInfo.name} AI</div>
              <div className="text-[10px] text-text-secondary">{predictionTypeLabel}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-success">{Math.round(prediction.confidence_score)}%</div>
            <div className="text-[10px] text-text-secondary">confidence</div>
          </div>
        </div>
        <div className="text-sm font-bold text-text-primary">
          {prediction.predicted_outcome}
        </div>
      </div>
    </div>
  )
}
