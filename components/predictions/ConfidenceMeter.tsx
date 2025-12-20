interface ConfidenceMeterProps {
  score: number
}

export function ConfidenceMeter({ score }: ConfidenceMeterProps) {
  const getColor = (score: number) => {
    if (score >= 75) return 'success'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  const color = getColor(score)
  const colorClasses = {
    success: 'text-success border-success bg-success/10',
    warning: 'text-warning border-warning bg-warning/10',
    danger: 'text-danger border-danger bg-danger/10',
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="transform -rotate-90" width="64" height="64">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-surface"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - score / 100)}`}
            className={`${color === 'success' ? 'text-success' : color === 'warning' ? 'text-warning' : 'text-danger'} transition-all duration-500`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-text-primary">{score}%</span>
        </div>
      </div>

      <div>
        <div className="text-xs text-text-secondary mb-1">AI Confidence</div>
        <div className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${colorClasses[color]}`}>
          {score >= 75 ? 'High' : score >= 60 ? 'Medium' : 'Low'}
        </div>
      </div>
    </div>
  )
}
