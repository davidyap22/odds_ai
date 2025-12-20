-- Check if predictions table has data
SELECT
  p.id,
  p.match_id,
  p.prediction_type,
  p.predicted_outcome,
  p.confidence_score,
  p.ai_model,
  pm.fixture_id,
  pm.home_name,
  pm.away_name
FROM predictions p
LEFT JOIN prematches pm ON p.match_id = pm.id
ORDER BY p.created_at DESC
LIMIT 10;

-- Check if the match exists
SELECT id, fixture_id, home_name, away_name
FROM prematches
WHERE fixture_id = 1379136;

-- Count total predictions
SELECT COUNT(*) as total_predictions FROM predictions;
