-- Create predictions table if it doesn't exist
CREATE TABLE IF NOT EXISTS predictions (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('moneyline', 'over_under', 'handicap')),
  predicted_outcome TEXT NOT NULL,
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  ai_analysis TEXT NOT NULL,
  ai_model TEXT CHECK (ai_model IN ('gemini', 'chatgpt', 'claude')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (match_id) REFERENCES prematches(id) ON DELETE CASCADE
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at);

-- Display table info
SELECT
  'predictions table created successfully' as message,
  COUNT(*) as existing_predictions
FROM predictions;
