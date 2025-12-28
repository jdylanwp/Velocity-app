/*
  # Add Seed Management Features
  
  1. Schema Changes
    - Add `seed_id` column to `trends` table to link trends back to their originating seed
  
  2. Security Changes
    - Add admin policies for seeds table (INSERT, UPDATE, DELETE)
    - Admins identified by specific email addresses
    - Pro users can INSERT their own seeds (limited to 3)
    - Pro users can DELETE their own seeds
  
  3. Important Notes
    - Admin email will be hardcoded in policies
    - Pro users get 3 "Hunter Slots" for custom niches
    - Free users have no write access to seeds
*/

-- Add seed_id to trends table to track which seed generated each trend
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trends' AND column_name = 'seed_id'
  ) THEN
    ALTER TABLE trends ADD COLUMN seed_id bigint REFERENCES seeds(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_trends_seed_id ON trends(seed_id);
  END IF;
END $$;

-- Admin helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  -- Hardcoded admin emails (replace with actual admin email)
  RETURN user_email = ANY(ARRAY['admin@velocity.com', 'your-email@example.com']);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user's email
CREATE OR REPLACE FUNCTION get_user_email()
RETURNS text AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user is pro
CREATE OR REPLACE FUNCTION is_pro_user()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND subscription_tier = 'pro'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to count user's seeds
CREATE OR REPLACE FUNCTION user_seed_count()
RETURNS bigint AS $$
  SELECT COUNT(*) FROM seeds WHERE added_by_user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Seeds Policies (Update existing and add new)
DROP POLICY IF EXISTS "Admins can view seeds" ON seeds;
DROP POLICY IF EXISTS "Admins can insert seeds" ON seeds;
DROP POLICY IF EXISTS "Admins can update seeds" ON seeds;
DROP POLICY IF EXISTS "Admins can delete seeds" ON seeds;
DROP POLICY IF EXISTS "Pro users can view own seeds" ON seeds;
DROP POLICY IF EXISTS "Pro users can insert own seeds" ON seeds;
DROP POLICY IF EXISTS "Pro users can delete own seeds" ON seeds;

-- Admins can do everything with seeds
CREATE POLICY "Admins can view seeds" 
  ON seeds FOR SELECT 
  TO authenticated 
  USING (is_admin(get_user_email()));

CREATE POLICY "Admins can insert seeds" 
  ON seeds FOR INSERT 
  TO authenticated 
  WITH CHECK (is_admin(get_user_email()));

CREATE POLICY "Admins can update seeds" 
  ON seeds FOR UPDATE 
  TO authenticated 
  USING (is_admin(get_user_email()))
  WITH CHECK (is_admin(get_user_email()));

CREATE POLICY "Admins can delete seeds" 
  ON seeds FOR DELETE 
  TO authenticated 
  USING (is_admin(get_user_email()));

-- Pro users can view their own seeds
CREATE POLICY "Pro users can view own seeds" 
  ON seeds FOR SELECT 
  TO authenticated 
  USING (
    is_pro_user() AND added_by_user_id = auth.uid()
  );

-- Pro users can insert seeds (limited to 3 via application logic)
CREATE POLICY "Pro users can insert own seeds" 
  ON seeds FOR INSERT 
  TO authenticated 
  WITH CHECK (
    is_pro_user() 
    AND added_by_user_id = auth.uid()
    AND user_seed_count() < 3
  );

-- Pro users can delete their own seeds
CREATE POLICY "Pro users can delete own seeds" 
  ON seeds FOR DELETE 
  TO authenticated 
  USING (
    is_pro_user() AND added_by_user_id = auth.uid()
  );