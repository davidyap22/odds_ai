import { createClient } from '@/lib/supabase/server'
import { Prediction } from '@/types'

export async function getPredictionsByFixtureId(fixtureId: number): Promise<Prediction[]> {
  const supabase = await createClient()
  const predictions: Prediction[] = []

  // Fetch from moneyline 1x2 table
  const { data: moneylineData } = await supabase
    .from('moneyline 1x2')
    .select('*')
    .eq('fixture_id', fixtureId)
    .order('id', { ascending: false })

  if (moneylineData) {
    moneylineData.forEach(row => {
      predictions.push({
        id: row.id,
        match_id: fixtureId.toString(),
        prediction_type: 'moneyline',
        predicted_outcome: row.selection || '',
        confidence_score: 0,
        signal: row.signal || null,
        ai_model: row.ai_model || 'gemini',
        ai_analysis: row.commentary_malaysia || '',
        bookmaker: row.bookmaker || '',
        clock: row.clock || null,
        stacking_quantity: row.stacking_quantity || null,
        stacking_plan_description: row.stacking_plan_description || null,
        market_analysis_trend_direction: row.market_analysis_trend_direction || null,
        market_analysis_odds_check: row.market_analysis_odds_check || null,
        market_analysis_vig_status: row.market_analysis_vig_status || null,
        odds_data: {
          home: parseFloat(row.moneyline_1x2_home) || 0,
          draw: parseFloat(row.moneyline_1x2_draw) || 0,
          away: parseFloat(row.moneyline_1x2_away) || 0,
        },
        created_at: row.created_at,
      } as any)
    })
  }

  // Fetch from Handicap table
  const { data: handicapData } = await supabase
    .from('Handicap')
    .select('*')
    .eq('fixture_id', fixtureId)
    .order('id', { ascending: false })

  if (handicapData) {
    handicapData.forEach(row => {
      predictions.push({
        id: row.id,
        match_id: fixtureId.toString(),
        prediction_type: 'handicap',
        predicted_outcome: row.selection || null,
        signal: row.signal || null,
        ai_model: row.ai_model || 'gemini',
        ai_analysis: row.commentary_malaysia || '',
        clock: row.clock || null,
        stacking_quantity: row.stacking_quantity || null,
        stacking_plan_description: row.stacking_plan_description || null,
        market_analysis_trend_direction: row.market_analysis_trend_direction || null,
        market_analysis_odds_check: row.market_analysis_odds_check || null,
        market_analysis_vig_status: row.market_analysis_vig_status || null,
        odds_data: {
          line: parseFloat(row.line) || 0,
          home_odds: parseFloat(row.home_odds) || 0,
          away_odds: parseFloat(row.away_odds) || 0,
        },
        created_at: row.created_at,
      } as any)
    })
  }

  // Fetch from OverUnder table
  const { data: overUnderData } = await supabase
    .from('OverUnder')
    .select('*')
    .eq('fixture_id', fixtureId)
    .order('id', { ascending: false })

  if (overUnderData) {
    overUnderData.forEach(row => {
      predictions.push({
        id: row.id,
        match_id: fixtureId.toString(),
        prediction_type: 'over_under',
        predicted_outcome: row.selection || null,
        signal: row.signal || null,
        ai_model: row.ai_model || 'gemini',
        ai_analysis: row.commentary_malaysia || '',
        clock: row.clock || null,
        stacking_quantity: row.stacking_quantity || null,
        stacking_plan_description: row.stacking_plan_description || null,
        market_analysis_trend_direction: row.market_analysis_trend_direction || null,
        market_analysis_odds_check: row.market_analysis_odds_check || null,
        market_analysis_vig_status: row.market_analysis_vig_status || null,
        odds_data: {
          line: parseFloat(row.line) || 0,
          over: parseFloat(row.over_odds) || 0,
          under: parseFloat(row.under_odds) || 0,
        },
        created_at: row.created_at,
      } as any)
    })
  }

  // Sort by ID descending (newest first)
  return predictions.sort((a, b) => Number(b.id) - Number(a.id))
}
