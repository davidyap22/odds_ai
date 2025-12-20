const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Map signal to confidence score
function getConfidenceScore(signal) {
  if (signal.includes('🟢')) {
    if (signal.includes('坚决') || signal.includes('追')) {
      return Math.floor(Math.random() * 15) + 75; // 75-90
    }
    return Math.floor(Math.random() * 15) + 70; // 70-85
  }
  if (signal.includes('🟡')) {
    return Math.floor(Math.random() * 15) + 50; // 50-65
  }
  if (signal.includes('🔴')) {
    return Math.floor(Math.random() * 10) + 40; // 40-50
  }
  return 60;
}

// Map AI model type
function mapAIModel(aiModel) {
  if (aiModel && aiModel.toLowerCase().includes('aggressive')) {
    return 'gemini'; // aggressive model -> Gemini
  }
  return ['chatgpt', 'claude'][Math.floor(Math.random() * 2)];
}

// Format predicted outcome
function formatPredictedOutcome(selection, predictionType) {
  if (!selection) return 'No prediction';

  if (predictionType === 'moneyline') {
    if (selection === 'Home') return 'Home Win';
    if (selection === 'Away') return 'Away Win';
    if (selection === 'Draw') return 'Draw';
  }

  return selection;
}

async function importFullPredictions() {
  console.log('🚀 Starting full predictions import with all fields...\n');

  // Step 1: First delete existing predictions to avoid duplicates
  console.log('🗑️  Deleting existing predictions...');
  await supabase.from('predictions').delete().neq('id', 0);
  console.log('✅ Cleared existing predictions\n');

  // Read CSV files
  console.log('📂 Reading CSV files...');
  const moneylineData = parse(fs.readFileSync('/Users/davidyap/Downloads/moneyline 1x2_rows.csv'), {
    columns: true,
    skip_empty_lines: true
  });

  const overUnderData = parse(fs.readFileSync('/Users/davidyap/Downloads/OverUnder_rows.csv'), {
    columns: true,
    skip_empty_lines: true
  });

  const handicapData = parse(fs.readFileSync('/Users/davidyap/Downloads/Handicap_rows.csv'), {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`📊 Loaded data:`);
  console.log(`   - Moneyline: ${moneylineData.length} rows`);
  console.log(`   - Over/Under: ${overUnderData.length} rows`);
  console.log(`   - Handicap: ${handicapData.length} rows\n`);

  // Group by fixture_id and get latest record for each
  const groupedMoneyline = {};
  const groupedOverUnder = {};
  const groupedHandicap = {};

  moneylineData.forEach(row => {
    const fixtureId = row.fixture_id;
    if (!groupedMoneyline[fixtureId] || row.id > groupedMoneyline[fixtureId].id) {
      groupedMoneyline[fixtureId] = row;
    }
  });

  overUnderData.forEach(row => {
    const fixtureId = row.fixture_id;
    if (!groupedOverUnder[fixtureId] || row.id > groupedOverUnder[fixtureId].id) {
      groupedOverUnder[fixtureId] = row;
    }
  });

  handicapData.forEach(row => {
    const fixtureId = row.fixture_id;
    if (!groupedHandicap[fixtureId] || row.id > groupedHandicap[fixtureId].id) {
      groupedHandicap[fixtureId] = row;
    }
  });

  const predictions = [];

  // Process Moneyline
  console.log('💰 Processing Moneyline predictions...');
  for (const [fixtureId, row] of Object.entries(groupedMoneyline)) {
    // Get match_id from prematches
    const { data: match } = await supabase
      .from('prematches')
      .select('id')
      .eq('fixture_id', fixtureId)
      .single();

    if (!match) continue;

    predictions.push({
      match_id: match.id,
      prediction_type: 'moneyline',
      predicted_outcome: formatPredictedOutcome(row.selection, 'moneyline'),
      confidence_score: getConfidenceScore(row.signal),
      ai_analysis: row.commentary_malaysia || 'AI analysis based on market signals.',
      ai_model: mapAIModel(row.ai_model),
      signal: row.signal,
      clock: parseInt(row.clock) || null,
      bookmaker: row.bookmaker || 'bet365',
      stacking_quantity: row.stacking_quantity || null,
      stacking_plan_description: row.stacking_plan_description || null,
      market_analysis_trend_direction: row.market_analysis_trend_direction || null,
      market_analysis_odds_check: row.market_analysis_odds_check || null,
      market_analysis_vig_status: row.market_analysis_vig_status || null,
      odds_data: {
        home: parseFloat(row.moneyline_1x2_home) || null,
        draw: parseFloat(row.moneyline_1x2_draw) || null,
        away: parseFloat(row.moneyline_1x2_away) || null
      }
    });
  }

  // Process Over/Under
  console.log('📊 Processing Over/Under predictions...');
  for (const [fixtureId, row] of Object.entries(groupedOverUnder)) {
    const { data: match } = await supabase
      .from('prematches')
      .select('id')
      .eq('fixture_id', fixtureId)
      .single();

    if (!match) continue;

    predictions.push({
      match_id: match.id,
      prediction_type: 'over_under',
      predicted_outcome: formatPredictedOutcome(row.selection, 'over_under'),
      confidence_score: getConfidenceScore(row.signal),
      ai_analysis: row.commentary_malaysia || 'Over/Under analysis based on scoring trends.',
      ai_model: mapAIModel(row.ai_model),
      signal: row.signal,
      clock: parseInt(row.clock) || null,
      bookmaker: row.bookmaker || 'bet365',
      stacking_quantity: row.stacking_quantity || null,
      stacking_plan_description: row.stacking_plan_description || null,
      market_analysis_trend_direction: row.market_analysis_trend_direction || null,
      market_analysis_odds_check: row.market_analysis_odds_check || null,
      market_analysis_vig_status: row.market_analysis_vig_status || null,
      odds_data: {
        line: parseFloat(row.line) || null,
        over: parseFloat(row.over) || null,
        under: parseFloat(row.under) || null
      }
    });
  }

  // Process Handicap
  console.log('🎯 Processing Handicap predictions...');
  for (const [fixtureId, row] of Object.entries(groupedHandicap)) {
    const { data: match } = await supabase
      .from('prematches')
      .select('id')
      .eq('fixture_id', fixtureId)
      .single();

    if (!match) continue;

    predictions.push({
      match_id: match.id,
      prediction_type: 'handicap',
      predicted_outcome: formatPredictedOutcome(row.selection, 'handicap'),
      confidence_score: getConfidenceScore(row.signal),
      ai_analysis: row.commentary_malaysia || 'Handicap analysis based on team strength.',
      ai_model: mapAIModel(row.ai_model),
      signal: row.signal,
      clock: parseInt(row.clock) || null,
      bookmaker: row.bookmaker || 'bet365',
      stacking_quantity: row.stacking_quantity || null,
      stacking_plan_description: row.stacking_plan_description || null,
      market_analysis_trend_direction: row.market_analysis_trend_direction || null,
      market_analysis_odds_check: row.market_analysis_odds_check || null,
      market_analysis_vig_status: row.market_analysis_vig_status || null,
      odds_data: {
        line: parseFloat(row.line) || null,
        home_odds: parseFloat(row.home_odds) || null,
        away_odds: parseFloat(row.away_odds) || null
      }
    });
  }

  console.log(`\n✅ Prepared ${predictions.length} predictions\n`);

  // Insert into database
  if (predictions.length > 0) {
    console.log('💾 Inserting into database...');

    const { data, error } = await supabase
      .from('predictions')
      .insert(predictions)
      .select();

    if (error) {
      console.error('❌ Error inserting predictions:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data.length} predictions!\n`);
    console.log('Sample predictions:');
    data.slice(0, 3).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.signal || '🔵'} ${p.ai_model?.toUpperCase() || 'AI'}: ${p.prediction_type} → ${p.predicted_outcome}`);
      console.log(`     Clock: ${p.clock}' | Bookmaker: ${p.bookmaker} | Confidence: ${p.confidence_score}%`);
    });
  }

  console.log('\n🎉 Import completed! Refresh your webpage to see all predictions with full details!');
}

importFullPredictions().catch(console.error);
