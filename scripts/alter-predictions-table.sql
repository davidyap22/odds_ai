-- Add new columns to predictions table for complete signal information

ALTER TABLE predictions
ADD COLUMN IF NOT EXISTS signal TEXT,
ADD COLUMN IF NOT EXISTS clock INTEGER,
ADD COLUMN IF NOT EXISTS bookmaker TEXT,
ADD COLUMN IF NOT EXISTS stacking_quantity TEXT,
ADD COLUMN IF NOT EXISTS stacking_plan_description TEXT,
ADD COLUMN IF NOT EXISTS market_analysis_trend_direction TEXT,
ADD COLUMN IF NOT EXISTS market_analysis_odds_check TEXT,
ADD COLUMN IF NOT EXISTS market_analysis_vig_status TEXT,
ADD COLUMN IF NOT EXISTS odds_data JSONB;

-- Comment explaining the odds_data structure
COMMENT ON COLUMN predictions.odds_data IS 'JSON containing odds information specific to prediction type:
- moneyline: {home, draw, away}
- over_under: {line, over, under}
- handicap: {line, home_odds, away_odds}';

-- Verify the new structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'predictions'
ORDER BY ordinal_position;
