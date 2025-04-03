-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies for waitlist table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Everyone can add their email to the waitlist
CREATE POLICY "Anyone can add to waitlist" 
  ON waitlist 
  FOR INSERT 
  WITH CHECK (true);

-- Only authenticated users with admin role can view waitlist
CREATE POLICY "Only admins can view waitlist" 
  ON waitlist 
  FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )); 