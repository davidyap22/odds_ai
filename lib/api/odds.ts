import { createClient } from '@/lib/supabase/server'
import { Odds } from '@/types'

export async function getOddsByMatchId(matchId: string): Promise<Odds | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('odds')
    .select('*')
    .eq('match_id', matchId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching odds:', error)
    return null
  }

  return data
}

export async function getOddsHistoryByMatchId(matchId: string): Promise<Odds[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('odds')
    .select('*')
    .eq('match_id', matchId)
    .order('timestamp', { ascending: true })

  if (error) {
    console.error('Error fetching odds history:', error)
    return []
  }

  return data || []
}
