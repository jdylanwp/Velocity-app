/*
  # Add Analytics Columns to Trends Table

  1. New Columns
    - `velocity_score` (float) - Proprietary 0-100 score measuring trend momentum
    - `forecast_status` (text) - Prediction indicator: 'bullish', 'bearish', 'neutral'
    - `prediction_confidence` (float) - Algorithm confidence level (0-1 scale)

  2. Purpose
    These columns support the predictive analytics engine that calculates
    trend trajectory and provides forecasting capabilities for Pro users.

  3. Constraints
    - velocity_score defaults to 0, no specific range constraint (allows negative for declining)
    - forecast_status must be one of: 'bullish', 'bearish', 'neutral'
    - prediction_confidence defaults to 0, represents 0-100% confidence

  4. Notes
    - All columns are nullable to support gradual backfill by scraper
    - Indexes added for filtering by forecast status and sorting by velocity score
*/

-- Add velocity_score column (0-100 proprietary momentum score)
ALTER TABLE trends 
ADD COLUMN IF NOT EXISTS velocity_score float DEFAULT 0;

-- Add forecast_status column with constraint
ALTER TABLE trends 
ADD COLUMN IF NOT EXISTS forecast_status text DEFAULT 'neutral' 
CHECK (forecast_status IN ('bullish', 'bearish', 'neutral'));

-- Add prediction_confidence column (0-1 scale)
ALTER TABLE trends 
ADD COLUMN IF NOT EXISTS prediction_confidence float DEFAULT 0 
CHECK (prediction_confidence >= 0 AND prediction_confidence <= 1);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trends_velocity_score 
ON trends(velocity_score DESC);

CREATE INDEX IF NOT EXISTS idx_trends_forecast_status 
ON trends(forecast_status);

CREATE INDEX IF NOT EXISTS idx_trends_confidence 
ON trends(prediction_confidence DESC);
