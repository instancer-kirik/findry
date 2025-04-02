-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  profile_types TEXT[],
  role_attributes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY "Users can insert their own profile" ON profiles;
DROP POLICY "Users can view all profiles" ON profiles;
DROP POLICY "Users can update their own profile" ON profiles;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function for updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);

-- Add function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  username TEXT;
  counter INTEGER;
  is_unique BOOLEAN;
BEGIN
  -- Generate base username from email or full_name
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );
  
  -- Convert to lowercase and replace spaces with underscores
  base_username := lower(replace(base_username, ' ', '_'));
  
  -- Initialize variables for unique username generation
  username := base_username;
  counter := 1;
  is_unique := false;
  
  -- Try to find a unique username
  WHILE NOT is_unique LOOP
    -- Check if username exists
    IF EXISTS (
      SELECT 1 FROM profiles WHERE username = username
    ) THEN
      -- If exists, try with counter
      username := base_username || '_' || counter;
      counter := counter + 1;
    ELSE
      is_unique := true;
    END IF;
  END LOOP;
  
  -- Insert the new profile
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    TIMEZONE('utc'::text, NOW()),
    TIMEZONE('utc'::text, NOW())
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (this will appear in the Supabase logs)
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    -- Still return NEW to allow the user creation to succeed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 