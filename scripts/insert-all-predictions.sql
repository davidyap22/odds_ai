-- Insert AI Predictions for ALL matches with fixture_id = 1379136
-- This will work for any match_id that corresponds to this fixture

-- First, verify the match exists and get its ID
SELECT
  'Match Info' as info,
  id as match_id,
  fixture_id,
  home_name,
  away_name,
  league_name
FROM prematches
WHERE fixture_id = 1379136;

-- Insert Gemini Moneyline Prediction
INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis, ai_model)
SELECT
  id,
  'moneyline',
  'Home Win',
  78,
  'Aiyoyo，比赛才开始罷了，盘口没动过，你急什么哦？庄家都还没开始 ''做工'' 咧！这种时候，Duk diam diam (坐静静) 看戏就好。不要手痒去碰，不然给庄家拿去买 kopi (咖啡) 了！',
  'gemini'
FROM prematches
WHERE fixture_id = 1379136
ON CONFLICT DO NOTHING;

-- Insert ChatGPT Over/Under Prediction
INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis, ai_model)
SELECT
  id,
  'over_under',
  'Over 2.5',
  89,
  'Aiya，比赛才刚踢，Over 2.5 就给到 2.03 这种水位，很靓仔咯！抽水又低，庄家也给面子。这个不是吃烂赔率，这个是吃好料！先下 1 Unit 试试水，好过等下时间跑了，水位跌了才来哭。Chup dulu！',
  'chatgpt'
FROM prematches
WHERE fixture_id = 1379136
ON CONFLICT DO NOTHING;

-- Insert Claude Handicap Prediction
INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis, ai_model)
SELECT
  id,
  'handicap',
  'Home -0.5',
  50,
  'Eh brader，比赛 baru start (刚开始) 哦！这个 1.88 的水位很 cantik (漂亮)，符合我们的最低要求，可以跟啦！Jangan kacau (不要搞事)，先进场 1 Unit 先，看下半场有什么 drama。',
  'claude'
FROM prematches
WHERE fixture_id = 1379136
ON CONFLICT DO NOTHING;

-- Verify insertion
SELECT
  'Inserted Predictions' as info,
  p.id,
  p.match_id,
  p.prediction_type,
  p.predicted_outcome,
  p.confidence_score,
  p.ai_model,
  pm.home_name || ' vs ' || pm.away_name as match_name
FROM predictions p
JOIN prematches pm ON p.match_id = pm.id
WHERE pm.fixture_id = 1379136
ORDER BY p.created_at DESC;
