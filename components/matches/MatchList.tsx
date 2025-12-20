import { MatchCard } from './MatchCard'
import { MatchWithOdds } from '@/types'

interface MatchListProps {
  matches: MatchWithOdds[]
  title?: string
  emptyMessage?: string
}

export function MatchList({ matches, title, emptyMessage = 'No matches found' }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div>
      {title && <h2 className="text-2xl font-bold text-text-primary mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}
