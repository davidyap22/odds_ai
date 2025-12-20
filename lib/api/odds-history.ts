import { createClient } from '@/lib/supabase/server'
import { OddsHistory, MatchType } from '@/types'

/**
 * Get the latest odds for a specific fixture
 * @param fixtureId - The fixture ID from prematches table
 * @returns Latest odds history record or null
 */
export async function getLatestOddsByFixtureId(fixtureId: number): Promise<OddsHistory | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('odds_history')
    .select('*')
    .eq('fixture_id', fixtureId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching latest odds:', error)
    return null
  }

  return data
}

/**
 * Get all odds history for a specific fixture (for charts/trends)
 * @param fixtureId - The fixture ID
 * @param limit - Number of records to fetch (default 50)
 * @returns Array of odds history records
 */
export async function getOddsHistoryByFixtureId(
  fixtureId: number,
  limit: number = 50
): Promise<OddsHistory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('odds_history')
    .select('*')
    .eq('fixture_id', fixtureId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching odds history:', error)
    return []
  }

  return data || []
}

// Re-export utility functions from odds-utils
export { shouldShowOdds, isMatchLive, getOddsLabel } from '@/lib/utils/odds-utils'
