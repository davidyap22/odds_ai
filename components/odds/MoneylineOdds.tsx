interface MoneylineOddsProps {
  homeTeam: string
  awayTeam: string
  homeOdds: number
  drawOdds: number
  awayOdds: number
  compact?: boolean
}

export function MoneylineOdds({
  homeTeam,
  awayTeam,
  homeOdds,
  drawOdds,
  awayOdds,
  compact = false,
}: MoneylineOddsProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-mono text-text-primary font-medium">{homeOdds.toFixed(2)}</span>
        <span className="text-text-secondary">·</span>
        <span className="font-mono text-text-primary font-medium">{drawOdds.toFixed(2)}</span>
        <span className="text-text-secondary">·</span>
        <span className="font-mono text-text-primary font-medium">{awayOdds.toFixed(2)}</span>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">Moneyline (1X2)</h3>
      <div className="grid grid-cols-3 gap-2">
        <button className="p-3 rounded-lg bg-surface border border-border hover:border-primary hover:bg-surface-hover transition-all group">
          <div className="text-xs text-text-secondary mb-1">Home</div>
          <div className="font-mono text-lg font-bold text-text-primary group-hover:text-primary">
            {homeOdds.toFixed(2)}
          </div>
          <div className="text-xs text-text-secondary mt-1 truncate">{homeTeam}</div>
        </button>

        <button className="p-3 rounded-lg bg-surface border border-border hover:border-primary hover:bg-surface-hover transition-all group">
          <div className="text-xs text-text-secondary mb-1">Draw</div>
          <div className="font-mono text-lg font-bold text-text-primary group-hover:text-primary">
            {drawOdds.toFixed(2)}
          </div>
          <div className="text-xs text-text-secondary mt-1">X</div>
        </button>

        <button className="p-3 rounded-lg bg-surface border border-border hover:border-primary hover:bg-surface-hover transition-all group">
          <div className="text-xs text-text-secondary mb-1">Away</div>
          <div className="font-mono text-lg font-bold text-text-primary group-hover:text-primary">
            {awayOdds.toFixed(2)}
          </div>
          <div className="text-xs text-text-secondary mt-1 truncate">{awayTeam}</div>
        </button>
      </div>
    </div>
  )
}
