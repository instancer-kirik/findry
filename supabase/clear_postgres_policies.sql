-- First ensure waitlist table exists
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Remove any existing RLS policies
DROP POLICY IF EXISTS "Anyone can add to waitlist" ON waitlist;
DROP POLICY IF EXISTS "Only admins can view waitlist" ON waitlist;
DROP POLICY IF EXISTS "Insert to waitlist" ON waitlist;
DROP POLICY IF EXISTS "Read waitlist" ON waitlist;

-- Turn off RLS first to ensure we don't lock ourselves out
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- Create better policies
-- Enable RLS but with correct permissions
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users and anonymous users to insert
CREATE POLICY "Insert to waitlist" 
  ON waitlist 
  FOR INSERT 
  TO authenticated, anon
  WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Read waitlist" 
  ON waitlist 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Grant permissions to the anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE public.waitlist TO authenticated;
GRANT INSERT ON TABLE public.waitlist TO anon;

-- Ownership
ALTER TABLE public.waitlist OWNER TO postgres; 