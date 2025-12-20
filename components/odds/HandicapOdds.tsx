interface HandicapOddsProps {
  homeTeam: string
  awayTeam: string
  line: number
  homeOdds: number
  awayOdds: number
  compact?: boolean
}

export function HandicapOdds({
  homeTeam,
  awayTeam,
  line,
  homeOdds,
  awayOdds,
  compact = false,
}: HandicapOddsProps) {
  const homeHandicap = line >= 0 ? `+${line}` : line.toString()
  const awayHandicap = line >= 0 ? (-line).toString() : `+${Math.abs(line)}`

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-text-secondary">Handicap:</span>
        <span className="font-mono text-text-primary font-medium">{homeOdds.toFixed(2)}</span>
        <span className="text-text-secondary">/</span>
        <span className="font-mono text-text-primary font-medium">{awayOdds.toFixed(2)}</span>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">Asian Handicap</h3>
      <div className="grid grid-cols-2 gap-2">
        <button className="p-3 rounded-lg bg-surface border border-border hover:border-primary hover:bg-surface-hover transition-all group">
          <div className="text-xs text-text-secondary mb-1">{homeTeam}</div>
          <div className="flex items-center justify-center gap-2 my-1">
            <span className="text-xs font-medium text-warning">{homeHandicap}</span>
            <span className="font-mono text-lg font-bold text-text-primary group-hover:text-primary">
              {homeOdds.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-text-secondary mt-1">Home {homeHandicap}</div>
        </button>

        <button className="p-3 rounded-lg bg-surface border border-border hover:border-primary hover:bg-surface-hover transition-all group">
          <div className="text-xs text-text-secondary mb-1">{awayTeam}</div>
          <div className="flex items-center justify-center gap-2 my-1">
            <span className="text-xs font-medium text-warning">{awayHandicap}</span>
            <span className="font-mono text-lg font-bold text-text-primary group-hover:text-primary">
              {awayOdds.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-text-secondary mt-1">Away {awayHandicap}</div>
        </button>
      </div>
    </div>
  )
}
