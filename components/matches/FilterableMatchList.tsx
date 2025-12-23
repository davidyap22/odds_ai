'use client'

import { useState, useMemo, useRef } from 'react'
import { MatchWithOdds } from '@/types'
import { MatchCard } from './MatchCard'
import { FinishedMatchCard } from './FinishedMatchCard'
import { UpcomingMatchCard } from './UpcomingMatchCard'
import { LeagueFilter } from './LeagueFilter'
import { Pagination } from '@/components/ui/Pagination'

interface FilterableMatchListProps {
  matches: MatchWithOdds[]
  title?: string
  emptyMessage?: string
  useFinishedLayout?: boolean
  useUpcomingLayout?: boolean
}

const ITEMS_PER_PAGE = 10

export function FilterableMatchList({
  matches,
  title,
  emptyMessage,
  useFinishedLayout = false,
  useUpcomingLayout = false
}: FilterableMatchListProps) {
  const [filteredMatches, setFilteredMatches] = useState(matches)
  const [currentPage, setCurrentPage] = useState(1)
  const titleRef = useRef<HTMLHeadingElement>(null)

  // Calculate pagination
  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE)
  const paginatedMatches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredMatches.slice(startIndex, endIndex)
  }, [filteredMatches, currentPage])

  // Reset to page 1 when filters change
  const handleFilterChange = (newMatches: MatchWithOdds[]) => {
    setFilteredMatches(newMatches)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to title of match list
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (filteredMatches.length === 0) {
    return (
      <div>
        {title && <h2 className="text-2xl font-bold text-text-primary mb-6">{title}</h2>}
        {matches.length > 0 && (
          <LeagueFilter matches={matches} onFilterChange={handleFilterChange} />
        )}
        <div className="text-center py-12">
          <p className="text-text-secondary">{emptyMessage || 'No matches found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {title && <h2 ref={titleRef} className="text-2xl font-bold text-text-primary mb-6">{title}</h2>}

      {matches.length > 0 && (
        <LeagueFilter matches={matches} onFilterChange={handleFilterChange} />
      )}

      {/* Match Grid */}
      <div className={useFinishedLayout || useUpcomingLayout
        ? "grid grid-cols-1 md:grid-cols-2 gap-4"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      }>
        {paginatedMatches.map((match) => {
          if (useFinishedLayout) {
            return <FinishedMatchCard key={match.id} match={match} />
          } else if (useUpcomingLayout) {
            return <UpcomingMatchCard key={match.id} match={match} />
          } else {
            return <MatchCard key={match.id} match={match} />
          }
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Results Info */}
      {filteredMatches.length > ITEMS_PER_PAGE && (
        <div className="text-center mt-4 text-sm text-text-secondary">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredMatches.length)} of {filteredMatches.length} matches
        </div>
      )}
    </div>
  )
}
