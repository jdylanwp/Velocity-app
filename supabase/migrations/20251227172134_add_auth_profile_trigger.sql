/*
  # Add Authentication Profile Auto-Creation

  1. Changes
    - Creates a trigger function to automatically create a profile when a new user signs up
    - Adds a trigger on auth.users that calls this function
    - Ensures every authenticated user gets a profile record
  
  2. Security
    - Function runs with security definer privileges to bypass RLS
    - Only creates profile if one doesn't already exist
*/

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
