-- Sample AI Predictions for Football Matches
-- Make sure to replace the match_id values with actual IDs from your prematches table

-- First, check if predictions table exists and has the ai_model column
-- If not, add it:
-- ALTER TABLE predictions ADD COLUMN IF NOT EXISTS ai_model TEXT;

-- Sample predictions for upcoming matches
-- Replace [MATCH_ID_1], [MATCH_ID_2], etc. with actual match IDs from your prematches table

-- Example: If you have a match between Arsenal vs Chelsea (match_id = 123):
INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis, ai_model)
VALUES
  -- Match 1 predictions (replace match_id with actual ID)
  ('123', 'moneyline', 'Arsenal Win', 72, 'Arsenal shows strong home form with 5 consecutive wins. Chelsea struggling with injuries to key defenders.', 'gemini'),
  ('123', 'over_under', 'Over 2.5', 68, 'Both teams average over 3 goals per game in recent matches. Expect an attacking display.', 'chatgpt'),
  ('123', 'handicap', 'Arsenal -1', 65, 'Arsenal''s superior form suggests they should win by multiple goals. Handicap offers value.', 'claude'),

  -- Match 2 predictions (replace match_id with actual ID)
  ('124', 'moneyline', 'Liverpool Win', 78, 'Liverpool dominant at Anfield with 90% win rate. Opponent has poor away record.', 'chatgpt'),
  ('124', 'over_under', 'Over 3.5', 71, 'Liverpool averaging 3.2 goals at home. High-scoring match expected.', 'gemini'),

  -- Match 3 predictions
  ('125', 'moneyline', 'Draw', 58, 'Evenly matched teams with similar recent form. Draw is most likely outcome.', 'claude'),
  ('125', 'over_under', 'Under 2.5', 64, 'Both teams have strong defensive records. Low-scoring affair expected.', 'chatgpt'),

  -- Match 4 predictions
  ('126', 'moneyline', 'Man City Win', 85, 'Man City unbeaten in 12 games with best attack in league. Should dominate.', 'gemini'),
  ('126', 'handicap', 'Man City -2', 70, 'City''s quality suggests comfortable victory. Handicap offers good value.', 'claude'),
  ('126', 'over_under', 'Over 3.5', 75, 'City averaging 4 goals per game at home. Expect high-scoring match.', 'chatgpt')
ON CONFLICT (id) DO NOTHING;

-- To use this script:
-- 1. Find actual match IDs from your prematches table
-- 2. Replace the match_id values (123, 124, 125, 126) with real IDs
-- 3. Run this SQL in your Supabase SQL Editor
-- 4. Predictions will appear on the match cards automatically
