import { MatchType } from '@/types'

/**
 * Determine if odds should be displayed based on match type
 * @param matchType - The type of match (Scheduled, In Play, etc.)
 * @returns Boolean indicating if odds should be shown
 */
export function shouldShowOdds(matchType: MatchType | null): boolean {
  if (!matchType) return false

  // Show odds for Scheduled and In Play matches
  // Don't show for Finished, Postponed, Abandoned, Not Played
  return matchType === 'Scheduled' || matchType === 'In Play'
}

/**
 * Check if a match is currently live (In Play)
 * @param matchType - The type of match
 * @returns Boolean indicating if match is live
 */
export function isMatchLive(matchType: MatchType | null): boolean {
  return matchType === 'In Play'
}

/**
 * Get the appropriate odds label based on match type
 * @param matchType - The type of match
 * @returns String label for the odds section
 */
export function getOddsLabel(matchType: MatchType | null): string {
  if (matchType === 'In Play') return 'Live Odds'
  if (matchType === 'Scheduled') return 'Pre-Match Odds'
  return 'Odds Not Available'
}
