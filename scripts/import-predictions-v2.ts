import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import { parse } from 'csv-parse/sync'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface MoneylineRow {
  id: string
  fixture_id: string
  bookmaker: string
  league_name: string
  home_name: string
  away_name: string
  moneyline_1x2_home: string
  moneyline_1x2_draw: string
  moneyline_1x2_away: string
  signal: string
  ai_model: string
  clock: string
  created_at: string
  stacking_quantity: string
  stacking_plan_description: string
  result_status: string
  score_home: string
  score_away: string
  selection: string
  market_analysis_trend_direction: string
  market_analysis_odds_check: string
  market_analysis_vig_status: string
  commentary_malaysia: string
  market_game: string
}

interface HandicapRow {
  id: string
  fixture_id: string
  bookmaker: string
  league_name: string
  home_name: string
  away_name: string
  line: string
  home_odds: string
  away_odds: string
  signal: string
  ai_model: string
  clock: string
  created_at: string
  stacking_quantity: string
  stacking_plan_description: string
  result_status: string
  score_home: string
  score_away: string
  selection: string
  market_analysis_trend_direction: string
  market_analysis_odds_check: string
  market_analysis_vig_status: string
  commentary_malaysia: string
  market_game: string
}

interface OverUnderRow {
  id: string
  fixture_id: string
  bookmaker: string
  league_name: string
  home_name: string
  away_name: string
  line: string
  over_odds: string
  under_odds: string
  signal: string
  ai_model: string
  clock: string
  created_at: string
  stacking_quantity: string
  stacking_plan_description: string
  result_status: string
  score_home: string
  score_away: string
  selection: string
  market_analysis_trend_direction: string
  market_analysis_odds_check: string
  market_analysis_vig_status: string
  commentary_malaysia: string
  market_game: string
}

async function importMoneyline(csvPath: string) {
  console.log('📊 Importing Moneyline predictions...')

  const fileContent = fs.readFileSync(csvPath, 'utf-8')
  const records: MoneylineRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  })

  console.log(`Found ${records.length} moneyline records`)

  for (const record of records) {
    const prediction = {
      id: parseInt(record.id),
      fixture_id: parseInt(record.fixture_id),
      prediction_type: 'moneyline',
      predicted_outcome: record.selection || null,
      signal: record.signal,
      ai_model: record.ai_model || 'gemini',
      ai_analysis: record.commentary_malaysia || '',
      clock: record.clock ? parseInt(record.clock) : null,
      stacking_quantity: record.stacking_quantity || null,
      stacking_plan_description: record.stacking_plan_description || null,
      market_analysis_trend_direction: record.market_analysis_trend_direction || null,
      market_analysis_odds_check: record.market_analysis_odds_check || null,
      market_analysis_vig_status: record.market_analysis_vig_status || null,
      odds_data: {
        home: parseFloat(record.moneyline_1x2_home),
        draw: parseFloat(record.moneyline_1x2_draw),
        away: parseFloat(record.moneyline_1x2_away),
      },
      created_at: record.created_at,
    }

    const { error } = await supabase
      .from('moneyline 1x2')
      .upsert(prediction, { onConflict: 'id' })

    if (error) {
      console.error(`Error importing moneyline record ${record.id}:`, error)
    }
  }

  console.log('✅ Moneyline import completed')
}

async function importHandicap(csvPath: string) {
  console.log('📊 Importing Handicap predictions...')

  const fileContent = fs.readFileSync(csvPath, 'utf-8')
  const records: HandicapRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  })

  console.log(`Found ${records.length} handicap records`)

  for (const record of records) {
    const prediction = {
      id: parseInt(record.id),
      fixture_id: parseInt(record.fixture_id),
      prediction_type: 'handicap',
      predicted_outcome: record.selection || null,
      signal: record.signal,
      ai_model: record.ai_model || 'gemini',
      ai_analysis: record.commentary_malaysia || '',
      clock: record.clock ? parseInt(record.clock) : null,
      stacking_quantity: record.stacking_quantity || null,
      stacking_plan_description: record.stacking_plan_description || null,
      market_analysis_trend_direction: record.market_analysis_trend_direction || null,
      market_analysis_odds_check: record.market_analysis_odds_check || null,
      market_analysis_vig_status: record.market_analysis_vig_status || null,
      odds_data: {
        line: parseFloat(record.line),
        home_odds: parseFloat(record.home_odds),
        away_odds: parseFloat(record.away_odds),
      },
      created_at: record.created_at,
    }

    const { error } = await supabase
      .from('Handicap')
      .upsert(prediction, { onConflict: 'id' })

    if (error) {
      console.error(`Error importing handicap record ${record.id}:`, error)
    }
  }

  console.log('✅ Handicap import completed')
}

async function importOverUnder(csvPath: string) {
  console.log('📊 Importing Over/Under predictions...')

  const fileContent = fs.readFileSync(csvPath, 'utf-8')
  const records: OverUnderRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  })

  console.log(`Found ${records.length} over/under records`)

  for (const record of records) {
    const prediction = {
      id: parseInt(record.id),
      fixture_id: parseInt(record.fixture_id),
      prediction_type: 'over_under',
      predicted_outcome: record.selection || null,
      signal: record.signal,
      ai_model: record.ai_model || 'gemini',
      ai_analysis: record.commentary_malaysia || '',
      clock: record.clock ? parseInt(record.clock) : null,
      stacking_quantity: record.stacking_quantity || null,
      stacking_plan_description: record.stacking_plan_description || null,
      market_analysis_trend_direction: record.market_analysis_trend_direction || null,
      market_analysis_odds_check: record.market_analysis_odds_check || null,
      market_analysis_vig_status: record.market_analysis_vig_status || null,
      odds_data: {
        line: parseFloat(record.line),
        over: parseFloat(record.over_odds),
        under: parseFloat(record.under_odds),
      },
      created_at: record.created_at,
    }

    const { error } = await supabase
      .from('OverUnder')
      .upsert(prediction, { onConflict: 'id' })

    if (error) {
      console.error(`Error importing over/under record ${record.id}:`, error)
    }
  }

  console.log('✅ Over/Under import completed')
}

async function main() {
  console.log('🚀 Starting predictions import...\n')

  const downloadsDir = '/Users/davidyap/Downloads'

  await importMoneyline(path.join(downloadsDir, 'moneyline 1x2_rows (2).csv'))
  await importHandicap(path.join(downloadsDir, 'Handicap_rows (2).csv'))
  await importOverUnder(path.join(downloadsDir, 'OverUnder_rows (2).csv'))

  console.log('\n✅ All predictions imported successfully!')
}

main().catch(console.error)
