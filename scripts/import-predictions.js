const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
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

// Map AI model type to our system
function mapAIModel(index) {
  const models = ['gemini', 'chatgpt', 'claude'];
  return models[index % 3];
}

// Clean and format predicted outcome
function formatPredictedOutcome(selection, predictionType) {
  if (!selection) return 'No prediction';

  if (predictionType === 'moneyline') {
    if (selection === 'Home') return 'Home Win';
    if (selection === 'Away') return 'Away Win';
    if (selection === 'Draw') return 'Draw';
  }

  return selection;
}

async function getMatchIdByFixtureId(fixtureId) {
  const { data, error } = await supabase
    .from('prematches')
    .select('id')
    .eq('fixture_id', fixtureId)
    .single();

  if (error || !data) {
    console.error(`No match found for fixture_id ${fixtureId}`);
    return null;
  }

  return data.id; // Return as integer
}

async function importPredictions() {
  console.log('🚀 Starting predictions import...\n');

  // Read CSV files
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

  console.log(`🎯 Unique fixtures:`);
  console.log(`   - Moneyline: ${Object.keys(groupedMoneyline).length}`);
  console.log(`   - Over/Under: ${Object.keys(groupedOverUnder).length}`);
  console.log(`   - Handicap: ${Object.keys(groupedHandicap).length}\n`);

  // Prepare predictions to insert
  const predictions = [];
  let modelIndex = 0;

  // Process Moneyline
  for (const [fixtureId, row] of Object.entries(groupedMoneyline)) {
    const matchId = await getMatchIdByFixtureId(fixtureId);
    if (!matchId) continue;

    predictions.push({
      match_id: matchId,
      prediction_type: 'moneyline',
      predicted_outcome: formatPredictedOutcome(row.selection, 'moneyline'),
      confidence_score: getConfidenceScore(row.signal),
      ai_analysis: row.commentary_malaysia || 'AI analysis based on market signals and odds movement.',
      ai_model: mapAIModel(modelIndex++)
    });
  }

  // Process Over/Under
  for (const [fixtureId, row] of Object.entries(groupedOverUnder)) {
    const matchId = await getMatchIdByFixtureId(fixtureId);
    if (!matchId) continue;

    predictions.push({
      match_id: matchId,
      prediction_type: 'over_under',
      predicted_outcome: formatPredictedOutcome(row.selection, 'over_under'),
      confidence_score: getConfidenceScore(row.signal),
      ai_analysis: row.commentary_malaysia || 'Over/Under analysis based on scoring trends and market movement.',
      ai_model: mapAIModel(modelIndex++)
    });
  }

  // Process Handicap
  for (const [fixtureId, row] of Object.entries(groupedHandicap)) {
    const matchId = await getMatchIdByFixtureId(fixtureId);
    if (!matchId) continue;

    predictions.push({
      match_id: matchId,
      prediction_type: 'handicap',
      predicted_outcome: formatPredictedOutcome(row.selection, 'handicap'),
      confidence_score: getConfidenceScore(row.signal),
      ai_analysis: row.commentary_malaysia || 'Handicap analysis based on team strength differential.',
      ai_model: mapAIModel(modelIndex++)
    });
  }

  console.log(`✅ Prepared ${predictions.length} predictions\n`);

  // Insert into database
  if (predictions.length > 0) {
    console.log('💾 Inserting into database...');

    const { data, error } = await supabase
      .from('predictions')
      .insert(predictions);

    if (error) {
      console.error('❌ Error inserting predictions:', error);
    } else {
      console.log(`✅ Successfully inserted ${predictions.length} predictions!`);
    }
  }

  console.log('\n🎉 Import completed!');
}

// Run the import
importPredictions().catch(console.error);
