
-- Create a function to check if a table exists
CREATE OR REPLACE FUNCTION public.get_table_definition(table_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result text;
BEGIN
  -- Check if the table exists in the pg_tables view
  SELECT tablename INTO result
  FROM pg_tables
  WHERE schemaname = 'public' AND tablename = table_name;
  
  -- If the table doesn't exist, raise an exception
  IF result IS NULL THEN
    RAISE EXCEPTION 'Table % does not exist', table_name;
  END IF;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Re-raise the exception
    RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_table_definition(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_table_definition(text) TO anon;
