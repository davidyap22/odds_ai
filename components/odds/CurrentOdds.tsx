import { OddsHistory, MatchType } from '@/types'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getOddsLabel, shouldShowOdds, isMatchLive } from '@/lib/utils/odds-utils'

interface CurrentOddsProps {
  latestOdds: OddsHistory | null
  matchType: MatchType | null
  homeTeam: string
  awayTeam: string
}

export function CurrentOdds({ latestOdds, matchType, homeTeam, awayTeam }: CurrentOddsProps) {
  // Check if odds should be displayed based on match type
  if (!shouldShowOdds(matchType) || !latestOdds) {
    let message = 'No odds available'

    if (matchType === 'Finished') {
      message = 'Match has finished - odds no longer available'
    } else if (matchType === 'Postponed') {
      message = 'Match postponed - odds not available'
    } else if (matchType === 'Abandoned') {
      message = 'Match abandoned - odds not available'
    } else if (matchType === 'Not Played') {
      message = 'Match not played - odds not available'
    } else if (matchType === 'Scheduled' || matchType === 'In Play') {
      message = 'No odds available for this match'
    }

    return (
      <Card>
        <CardBody className="py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-6xl opacity-20">📊</div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-text-primary mb-2">No Odds Available</h3>
              <p className="text-sm text-text-secondary max-w-md">
                {message}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  const isLive = isMatchLive(matchType)
  const oddsLabel = getOddsLabel(matchType)

  // Format odds to 2 decimal places
  const formatOdds = (odds: number) => odds.toFixed(2)

  // Format the odds timestamp (Malaysia Time)
  const oddsDate = new Date(latestOdds.created_at)
  const formattedDate = oddsDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Kuala_Lumpur'
  })
  const formattedTime = oddsDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kuala_Lumpur'
  })

  return (
    <div className="space-y-6">
      {/* Header with badge and date */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-text-primary">{oddsLabel}</h2>
            {isLive && (
              <div className="px-3 py-1 bg-red-500 rounded-full text-xs font-bold text-white animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                LIVE
              </div>
            )}
            {matchType === 'Scheduled' && (
              <div className="px-3 py-1 bg-blue-500 rounded-full text-xs font-bold text-white">
                Scheduled
              </div>
            )}
            {(matchType === 'Finished' || matchType === 'Postponed' || matchType === 'Abandoned' || matchType === 'Not Played') && (
              <div className="px-3 py-1 bg-gray-500 rounded-full text-xs font-bold text-white">
                Finished
              </div>
            )}
          </div>
          <div className="text-sm text-text-secondary">
            Bookmaker: <span className="font-semibold text-text-primary">{latestOdds.bookmaker}</span>
          </div>
        </div>

        {/* Prominent date/time display */}
        <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-surface border border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">📅</span>
            <span className="text-sm font-medium text-text-primary">{formattedDate}</span>
          </div>
          <div className="w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">🕒</span>
            <span className="text-sm font-medium text-text-primary">{formattedTime} MYT</span>
          </div>
          {isLive && (
            <>
              <div className="w-px h-4 bg-border"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-success">⚡ Live Update</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Moneyline Odds (1X2) */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Moneyline (1X2)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-surface border border-border hover:border-primary transition-colors">
              <div className="text-sm text-text-secondary mb-2">Home Win</div>
              <div className="text-xl font-bold text-text-primary mb-1">
                {formatOdds(latestOdds.moneyline_1x2_home)}
              </div>
              <div className="text-xs text-text-secondary truncate">{homeTeam}</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-surface border border-border hover:border-primary transition-colors">
              <div className="text-sm text-text-secondary mb-2">Draw</div>
              <div className="text-xl font-bold text-text-primary mb-1">
                {formatOdds(latestOdds.moneyline_1x2_draw)}
              </div>
              <div className="text-xs text-text-secondary">X</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-surface border border-border hover:border-primary transition-colors">
              <div className="text-sm text-text-secondary mb-2">Away Win</div>
              <div className="text-xl font-bold text-text-primary mb-1">
                {formatOdds(latestOdds.moneyline_1x2_away)}
              </div>
              <div className="text-xs text-text-secondary truncate">{awayTeam}</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Over/Under (Total Points) */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Over/Under (Total Goals)
          </h3>
          <div className="text-center mb-4">
            <span className="text-sm text-text-secondary">Line: </span>
            <span className="text-lg font-bold text-primary">
              {formatOdds(latestOdds.totalpoints_main_line)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-surface border border-border hover:border-success transition-colors">
              <div className="text-sm text-text-secondary mb-2">Over</div>
              <div className="text-2xl font-bold text-success">
                {formatOdds(latestOdds.totalpoints_over)}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-surface border border-border hover:border-danger transition-colors">
              <div className="text-sm text-text-secondary mb-2">Under</div>
              <div className="text-2xl font-bold text-danger">
                {formatOdds(latestOdds.totalpoints_under)}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Handicap */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Handicap</h3>
          <div className="text-center mb-4">
            <span className="text-sm text-text-secondary">Line: </span>
            <span className="text-lg font-bold text-primary">
              {latestOdds.handicap_main_line > 0 ? '+' : ''}
              {formatOdds(latestOdds.handicap_main_line)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-surface border border-border hover:border-primary transition-colors">
              <div className="text-sm text-text-secondary mb-2 truncate">{homeTeam}</div>
              <div className="text-2xl font-bold text-text-primary">
                {formatOdds(latestOdds.handicap_home)}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-surface border border-border hover:border-primary transition-colors">
              <div className="text-sm text-text-secondary mb-2 truncate">{awayTeam}</div>
              <div className="text-2xl font-bold text-text-primary">
                {formatOdds(latestOdds.handicap_away)}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

    </div>
  )
}
