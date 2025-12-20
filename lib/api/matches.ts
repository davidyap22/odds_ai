import { createClient } from '@/lib/supabase/server'
import { Match, MatchStatus, MatchWithOdds, MatchDetail, MatchType } from '@/types'
import { getLatestOddsByFixtureId } from './odds-history'
import { getPredictionsByFixtureId } from './predictions'

export async function getAllMatches(): Promise<Match[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('prematches')
    .select('*')
    .order('start_date_msia', { ascending: true })

  if (error) {
    console.error('Error fetching matches:', error)
    return []
  }

  // Transform prematches data to Match format
  return (data || []).map(prematch => ({
    id: prematch.id.toString(),
    home_team: prematch.home_name || '',
    away_team: prematch.away_name || '',
    league: prematch.league_name || '',
    match_date: prematch.start_date_msia,
    status: mapStatusShort(prematch.status_short),
    home_score: prematch.score_fulltime_home ?? null,
    away_score: prematch.score_fulltime_away ?? null,
    home_logo: prematch.home_logo || null,
    away_logo: prematch.away_logo || null,
    league_logo: prematch.league_logo || null,
    created_at: prematch.created_at || new Date().toISOString()
  }))
}

// Map status_short to our status format
function mapStatusShort(statusShort: string): MatchStatus {
  // NS = Not Started, 1H/2H = First/Second Half (Live), HT = Half Time, FT = Full Time
  if (statusShort === 'FT' || statusShort === 'AET' || statusShort === 'PEN') {
    return 'finished'
  }
  if (statusShort === '1H' || statusShort === '2H' || statusShort === 'HT' || statusShort === 'LIVE') {
    return 'live'
  }
  return 'upcoming' // NS or any other status
}

export async function getMatchesByStatus(status: MatchStatus): Promise<MatchWithOdds[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('prematches')
    .select('*')
    .order('start_date_msia', { ascending: true })
    .limit(50)

  if (error) {
    console.error('Error fetching matches by status:', error)
    return []
  }

  // Transform and filter by status
  const matches = (data || []).map(prematch => {
    const matchStatus = mapStatusShort(prematch.status_short)
    return {
      id: prematch.id.toString(),
      home_team: prematch.home_name || '',
      away_team: prematch.away_name || '',
      league: prematch.league_name || '',
      match_date: prematch.start_date_msia,
      status: matchStatus,
      home_score: prematch.score_fulltime_home ?? null,
      away_score: prematch.score_fulltime_away ?? null,
      home_logo: prematch.home_logo || null,
      away_logo: prematch.away_logo || null,
      league_logo: prematch.league_logo || null,
      created_at: prematch.created_at || new Date().toISOString(),
      odds: null,
      predictions: []
    }
  }).filter(match => match.status === status)

  // Note: We don't fetch predictions for the list view to improve performance
  // Predictions will be fetched on the match detail page

  return matches
}

export async function getMatchById(id: string): Promise<MatchDetail | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('prematches')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching match:', error)
    return null
  }

  if (!data) return null

  // Get fixture_id and type from prematches
  const fixtureId = data.fixture_id
  const matchType: MatchType | null = data.type || null

  // Fetch latest odds from odds_history if fixture_id exists
  let latestOdds = null

  if (fixtureId) {
    latestOdds = await getLatestOddsByFixtureId(fixtureId)
  }

  // Fetch predictions for this match using fixture_id from three tables
  const predictionsData = fixtureId ? await getPredictionsByFixtureId(fixtureId) : []

  return {
    id: data.id.toString(),
    home_team: data.home_name || '',
    away_team: data.away_name || '',
    league: data.league_name || '',
    match_date: data.start_date_msia,
    status: mapStatusShort(data.status_short),
    home_score: data.score_fulltime_home ?? null,
    away_score: data.score_fulltime_away ?? null,
    home_logo: data.home_logo || null,
    away_logo: data.away_logo || null,
    league_logo: data.league_logo || null,
    fixture_id: fixtureId || null,
    created_at: data.created_at || new Date().toISOString(),
    odds: null,
    predictions: predictionsData,
    latestOdds,
    matchType
  }
}

export async function getLiveMatches(): Promise<MatchWithOdds[]> {
  return getMatchesByStatus('live')
}

export async function getUpcomingMatches(): Promise<MatchWithOdds[]> {
  return getMatchesByStatus('upcoming')
}

export async function getFinishedMatches(): Promise<MatchWithOdds[]> {
  return getMatchesByStatus('finished')
}
