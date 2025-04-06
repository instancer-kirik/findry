
-- This file registers our custom functions with the Supabase type system
-- so TypeScript knows about them

-- First drop any existing functions that might cause conflicts
DO $$
BEGIN
  -- Drop table_exists function (we'll replace it)
  DROP FUNCTION IF EXISTS public.table_exists(text, text);
  
  -- Drop any existing shop/product functions
  DROP FUNCTION IF EXISTS public.get_all_shops();
  DROP FUNCTION IF EXISTS public.get_shop_by_id(uuid);
  DROP FUNCTION IF EXISTS public.get_products_by_shop_id(uuid);
  DROP FUNCTION IF EXISTS public.get_product_by_id(uuid);
  DROP FUNCTION IF EXISTS public.check_shop_ownership(uuid, uuid);
  DROP FUNCTION IF EXISTS public.create_shop(text, text, text, text, text, text, text[], uuid);
  DROP FUNCTION IF EXISTS public.delete_product(uuid);
END
$$;

-- Create the table_exists function
CREATE OR REPLACE FUNCTION public.table_exists(schema_name text, table_name text) 
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = schema_name
    AND table_name = table_name
  );
END;
$$;

-- Now register the functions in Supabase's type system
COMMENT ON FUNCTION public.table_exists(text, text) IS 'Checks if a table exists in the specified schema';
COMMENT ON FUNCTION public.get_all_shops() IS 'Returns all shops';
COMMENT ON FUNCTION public.get_shop_by_id(uuid) IS 'Returns a shop by ID';
COMMENT ON FUNCTION public.get_products_by_shop_id(uuid) IS 'Returns products for a specific shop';
COMMENT ON FUNCTION public.get_product_by_id(uuid) IS 'Returns a product by ID';
COMMENT ON FUNCTION public.check_shop_ownership(uuid, uuid) IS 'Checks if a user owns a shop';
COMMENT ON FUNCTION public.create_shop(text, text, text, text, text, text, text[], uuid) IS 'Creates a new shop';
COMMENT ON FUNCTION public.delete_product(uuid) IS 'Deletes a product';
