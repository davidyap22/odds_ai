'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MatchWithOdds } from '@/types'

interface LeagueFilterProps {
  matches: MatchWithOdds[]
  onFilterChange: (filteredMatches: MatchWithOdds[]) => void
}

interface League {
  name: string
  logo: string | null | undefined
  count: number
}

export function LeagueFilter({ matches, onFilterChange }: LeagueFilterProps) {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null)

  // Define priority leagues that should always appear if they have matches
  const priorityLeagues = [
    'Premier League',
    'La Liga',
    'Serie A',
    'Bundesliga',
    'Ligue 1',
    'UEFA Champions League',
    'UEFA Europa League',
  ]

  // Top 5 leagues that should only show logo (no text)
  const logoOnlyLeagues = [
    'Premier League',
    'La Liga',
    'Serie A',
    'Bundesliga',
    'Ligue 1',
  ]

  // Extract unique leagues from matches
  const leaguesFromMatches = Array.from(
    matches.reduce((acc, match) => {
      if (!acc.has(match.league)) {
        acc.set(match.league, {
          name: match.league,
          logo: match.league_logo,
          count: 1
        })
      } else {
        const league = acc.get(match.league)!
        league.count++
      }
      return acc
    }, new Map<string, League>())
  ).map(([_, league]) => league)

  // Sort leagues: priority leagues first (in order), then alphabetically
  const leagues = leaguesFromMatches.sort((a, b) => {
    const aIndex = priorityLeagues.indexOf(a.name)
    const bIndex = priorityLeagues.indexOf(b.name)

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1

    return a.name.localeCompare(b.name)
  })

  // Debug: Log all leagues to console
  if (typeof window !== 'undefined') {
    console.log('All leagues:', leagues.map(l => ({ name: l.name, count: l.count })))
  }

  const handleLeagueClick = (leagueName: string) => {
    if (selectedLeague === leagueName) {
      // Deselect - show all matches
      setSelectedLeague(null)
      onFilterChange(matches)
    } else {
      // Select league - filter matches
      setSelectedLeague(leagueName)
      const filtered = matches.filter(match => match.league === leagueName)
      onFilterChange(filtered)
    }
  }

  const handleShowAll = () => {
    setSelectedLeague(null)
    onFilterChange(matches)
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {/* All button */}
        <button
          onClick={handleShowAll}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
            selectedLeague === null
              ? 'bg-primary border-white text-white shadow-lg'
              : 'bg-surface border-border text-text-secondary hover:border-primary hover:text-text-primary'
          }`}
        >
          <span className="text-sm font-medium">All Leagues</span>
          <span className="text-xs opacity-75">({matches.length})</span>
        </button>

        {/* League buttons */}
        {leagues.map((league) => {
          const isLogoOnly = logoOnlyLeagues.includes(league.name)

          return (
            <button
              key={league.name}
              onClick={() => handleLeagueClick(league.name)}
              className={`flex items-center justify-center rounded-lg border-2 transition-all whitespace-nowrap ${
                isLogoOnly
                  ? 'w-16 h-16 p-2'
                  : 'gap-2 px-4 py-2'
              } ${
                selectedLeague === league.name
                  ? 'bg-primary border-white text-white scale-105 shadow-lg'
                  : 'bg-surface border-border text-text-secondary hover:border-primary hover:text-text-primary hover:scale-105'
              }`}
              title={`${league.name} (${league.count})`}
            >
              {league.logo && isLogoOnly ? (
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Image
                    src={league.logo}
                    alt={league.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              ) : (
                <>
                  {league.logo && (
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <Image
                        src={league.logo}
                        alt={league.name}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-sm font-medium">{league.name}</span>
                  <span className="text-xs opacity-75">({league.count})</span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
