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

async function insertPredictions() {
  console.log('🚀 Inserting predictions for Newcastle vs Chelsea...\n');

  // The predictions data from CSV
  const predictions = [
    {
      match_id: 353, // Newcastle vs Chelsea
      prediction_type: 'moneyline',
      predicted_outcome: 'Home Win',
      confidence_score: 78,
      ai_analysis: 'Aiyoyo，比赛才开始罷了，盘口没动过，你急什么哦？庄家都还没开始 \'做工\' 咧！这种时候，Duk diam diam (坐静静) 看戏就好。不要手痒去碰，不然给庄家拿去买 kopi (咖啡) 了！',
      ai_model: 'gemini'
    },
    {
      match_id: 353,
      prediction_type: 'over_under',
      predicted_outcome: 'Over 2.5',
      confidence_score: 89,
      ai_analysis: 'Aiya，比赛才刚踢，Over 2.5 就给到 2.03 这种水位，很靓仔咯！抽水又低，庄家也给面子。这个不是吃烂赔率，这个是吃好料！先下 1 Unit 试试水，好过等下时间跑了，水位跌了才来哭。Chup dulu！',
      ai_model: 'chatgpt'
    },
    {
      match_id: 353,
      prediction_type: 'handicap',
      predicted_outcome: 'Home -0.5',
      confidence_score: 50,
      ai_analysis: 'Eh brader，比赛 baru start (刚开始) 哦！这个 1.88 的水位很 cantik (漂亮)，符合我们的最低要求，可以跟啦！Jangan kacau (不要搞事)，先进场 1 Unit 先，看下半场有什么 drama。',
      ai_model: 'claude'
    }
  ];

  console.log(`📊 Preparing to insert ${predictions.length} predictions...\n`);

  // Insert predictions
  const { data, error } = await supabase
    .from('predictions')
    .insert(predictions)
    .select();

  if (error) {
    console.error('❌ Error inserting predictions:', error);
    process.exit(1);
  }

  console.log('✅ Successfully inserted predictions!\n');
  console.log('Inserted predictions:');
  data.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.ai_model.toUpperCase()}: ${p.prediction_type} → ${p.predicted_outcome} (${p.confidence_score}%)`);
  });

  // Verify by querying back
  console.log('\n🔍 Verifying predictions in database...');
  const { data: verified } = await supabase
    .from('predictions')
    .select('*')
    .eq('match_id', 353);

  console.log(`✅ Found ${verified.length} predictions for match 353\n`);

  console.log('🎉 Done! Refresh your webpage to see the predictions!');
}

insertPredictions().catch(console.error);
