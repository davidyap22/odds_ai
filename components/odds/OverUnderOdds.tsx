interface OverUnderOddsProps {
  line: number
  overOdds: number
  underOdds: number
  compact?: boolean
}

export function OverUnderOdds({ line, overOdds, underOdds, compact = false }: OverUnderOddsProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-text-secondary">O/U {line}:</span>
        <span className="font-mono text-text-primary font-medium">{overOdds.toFixed(2)}</span>
        <span className="text-text-secondary">/</span>
        <span className="font-mono text-text-primary font-medium">{underOdds.toFixed(2)}</span>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">Over/Under</h3>
      <div className="grid grid-cols-2 gap-2">
        <button className="p-3 rounded-lg bg-surface border border-border hover:border-success hover:bg-surface-hover transition-all group">
          <div className="text-xs text-text-secondary mb-1">Over {line}</div>
          <div className="font-mono text-lg font-bold text-text-primary group-hover:text-success">
            {overOdds.toFixed(2)}
          </div>
          <div className="text-xs text-text-secondary mt-1">More than {line} goals</div>
        </button>

        <button className="p-3 rounded-lg bg-surface border border-border hover:border-danger hover:bg-surface-hover transition-all group">
          <div className="text-xs text-text-secondary mb-1">Under {line}</div>
          <div className="font-mono text-lg font-bold text-text-primary group-hover:text-danger">
            {underOdds.toFixed(2)}
          </div>
          <div className="text-xs text-text-secondary mt-1">Less than {line} goals</div>
        </button>
      </div>
    </div>
  )
}
