-- Step 1: Add ai_model column if it doesn't exist
ALTER TABLE predictions ADD COLUMN IF NOT EXISTS ai_model TEXT;

-- Step 2: Insert sample AI predictions for upcoming matches
-- This will create predictions for the first 20 upcoming matches (status = 'NS')

WITH upcoming_matches AS (
  SELECT id, home_name, away_name, league_name
  FROM prematches
  WHERE status_short = 'NS'
  ORDER BY start_date_msia
  LIMIT 20
)
INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis, ai_model)
SELECT
  id::text,
  'moneyline',
  CASE
    WHEN random() < 0.5 THEN home_name || ' Win'
    WHEN random() < 0.8 THEN 'Draw'
    ELSE away_name || ' Win'
  END,
  (60 + random() * 30)::int,
  'AI analysis based on recent form, head-to-head records, and statistical models.',
  'gemini'
FROM upcoming_matches
ON CONFLICT DO NOTHING;

-- Insert ChatGPT predictions (Over/Under)
WITH upcoming_matches AS (
  SELECT id, home_name, away_name
  FROM prematches
  WHERE status_short = 'NS'
  ORDER BY start_date_msia
  LIMIT 20
)
INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis, ai_model)
SELECT
  id::text,
  'over_under',
  CASE
    WHEN random() < 0.6 THEN 'Over 2.5'
    ELSE 'Under 2.5'
  END,
  (55 + random() * 35)::int,
  'Based on both teams attacking and defensive statistics from recent matches.',
  'chatgpt'
FROM upcoming_matches
ON CONFLICT DO NOTHING;

-- Insert Claude predictions (Handicap)
WITH upcoming_matches AS (
  SELECT id, home_name, away_name
  FROM prematches
  WHERE status_short = 'NS'
  ORDER BY start_date_msia
  LIMIT 20
)
INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis, ai_model)
SELECT
  id::text,
  'handicap',
  CASE
    WHEN random() < 0.5 THEN home_name || ' -1'
    ELSE away_name || ' +1'
  END,
  (58 + random() * 32)::int,
  'Handicap analysis considering team strength differential and home advantage.',
  'claude'
FROM upcoming_matches
ON CONFLICT DO NOTHING;

-- Verify the insert
SELECT COUNT(*) as total_predictions, ai_model
FROM predictions
GROUP BY ai_model;
