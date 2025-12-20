const path = require('path');
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

async function debug() {
  console.log('🔍 Debugging predictions...\n');

  // 1. Check if predictions table exists
  console.log('1️⃣ Checking predictions table...');
  const { data: predictions, error: predError } = await supabase
    .from('predictions')
    .select('*')
    .limit(5);

  if (predError) {
    console.error('❌ Error accessing predictions table:', predError.message);
    console.log('\n⚠️  The predictions table might not exist yet!');
    return;
  }

  console.log(`✅ Predictions table exists. Total records: ${predictions.length}\n`);
  if (predictions.length > 0) {
    console.log('Sample predictions:');
    predictions.forEach(p => {
      console.log(`  - ID: ${p.id}, Match: ${p.match_id}, Type: ${p.prediction_type}, Model: ${p.ai_model}`);
    });
  }

  // 2. Check the Newcastle vs Chelsea match
  console.log('\n2️⃣ Looking for Newcastle vs Chelsea match...');
  const { data: matches, error: matchError } = await supabase
    .from('prematches')
    .select('id, fixture_id, home_name, away_name, league_name')
    .or('home_name.ilike.%newcastle%,away_name.ilike.%newcastle%')
    .limit(5);

  if (matchError) {
    console.error('❌ Error:', matchError.message);
    return;
  }

  if (matches.length === 0) {
    console.log('❌ No Newcastle matches found!');
    return;
  }

  console.log(`✅ Found ${matches.length} Newcastle matches:`);
  matches.forEach(m => {
    console.log(`  - Match ID: ${m.id}, Fixture ID: ${m.fixture_id}`);
    console.log(`    ${m.home_name} vs ${m.away_name} (${m.league_name})`);
  });

  // 3. Check predictions for each match
  console.log('\n3️⃣ Checking predictions for these matches...');
  for (const match of matches) {
    const { data: matchPreds } = await supabase
      .from('predictions')
      .select('*')
      .eq('match_id', match.id);

    console.log(`  Match ${match.id} (${match.home_name} vs ${match.away_name}): ${matchPreds?.length || 0} predictions`);
    if (matchPreds && matchPreds.length > 0) {
      matchPreds.forEach(p => {
        console.log(`    - ${p.ai_model}: ${p.prediction_type} -> ${p.predicted_outcome} (${p.confidence_score}%)`);
      });
    }
  }

  // 4. Try to insert a test prediction
  console.log('\n4️⃣ Testing prediction insert for match ID:', matches[0].id);
  const { data: inserted, error: insertError } = await supabase
    .from('predictions')
    .insert({
      match_id: matches[0].id,
      prediction_type: 'moneyline',
      predicted_outcome: 'Test Prediction',
      confidence_score: 75,
      ai_analysis: 'This is a test prediction to verify insert works.',
      ai_model: 'gemini'
    })
    .select();

  if (insertError) {
    console.error('❌ Insert failed:', insertError.message);
    console.log('\n💡 Possible issues:');
    console.log('  - predictions table might not exist');
    console.log('  - Foreign key constraint issue');
    console.log('  - Permission issue');
  } else {
    console.log('✅ Test prediction inserted successfully!');
    console.log('  ID:', inserted[0].id);

    // Clean up test
    await supabase.from('predictions').delete().eq('id', inserted[0].id);
    console.log('  (Test prediction cleaned up)');
  }
}

debug().catch(console.error);
