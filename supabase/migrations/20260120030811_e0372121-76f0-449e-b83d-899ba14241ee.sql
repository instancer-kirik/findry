-- Fix the handle_new_user function with proper variable naming
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  new_username TEXT;
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
  
  -- Remove any non-alphanumeric characters except underscores
  base_username := regexp_replace(base_username, '[^a-z0-9_]', '', 'g');
  
  -- Ensure it's not empty
  IF base_username = '' OR base_username IS NULL THEN
    base_username := 'user';
  END IF;
  
  -- Initialize variables for unique username generation
  new_username := base_username;
  counter := 1;
  is_unique := false;
  
  -- Try to find a unique username
  WHILE NOT is_unique LOOP
    -- Check if username exists (properly compare column to variable)
    IF EXISTS (
      SELECT 1 FROM profiles p WHERE p.username = new_username
    ) THEN
      -- If exists, try with counter
      new_username := base_username || '_' || counter;
      counter := counter + 1;
    ELSE
      is_unique := true;
    END IF;
    
    -- Safety limit to prevent infinite loop
    IF counter > 1000 THEN
      new_username := base_username || '_' || floor(random() * 1000000)::text;
      is_unique := true;
    END IF;
  END LOOP;
  
  -- Insert the new profile
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    profile_types,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    new_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    ARRAY['regular']::text[],
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
$$;