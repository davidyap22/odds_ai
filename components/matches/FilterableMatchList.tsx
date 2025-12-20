'use client'

import { useState } from 'react'
import { MatchWithOdds } from '@/types'
import { MatchList } from './MatchList'
import { LeagueFilter } from './LeagueFilter'

interface FilterableMatchListProps {
  matches: MatchWithOdds[]
  title?: string
  emptyMessage?: string
}

export function FilterableMatchList({ matches, title, emptyMessage }: FilterableMatchListProps) {
  const [filteredMatches, setFilteredMatches] = useState(matches)

  return (
    <div>
      {title && <h2 className="text-2xl font-bold text-text-primary mb-6">{title}</h2>}

      {matches.length > 0 && (
        <LeagueFilter matches={matches} onFilterChange={setFilteredMatches} />
      )}

      <MatchList
        matches={filteredMatches}
        emptyMessage={emptyMessage || 'No matches found'}
      />
    </div>
  )
}
