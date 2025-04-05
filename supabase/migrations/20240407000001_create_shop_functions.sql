
-- Create functions to safely work with shops and products

-- Function to get all shops
CREATE OR REPLACE FUNCTION get_all_shops()
RETURNS SETOF shops
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT * FROM shops ORDER BY created_at DESC;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE LOG 'Error in get_all_shops: %', SQLERRM;
    RETURN;
END;
$$;

-- Function to get a shop by id
CREATE OR REPLACE FUNCTION get_shop_by_id(shop_id UUID)
RETURNS SETOF shops
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT * FROM shops WHERE id = shop_id;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE LOG 'Error in get_shop_by_id: %', SQLERRM;
    RETURN;
END;
$$;

-- Function to get products by shop id
CREATE OR REPLACE FUNCTION get_products_by_shop_id(shop_id UUID)
RETURNS SETOF products
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT * FROM products WHERE shop_id = get_products_by_shop_id.shop_id ORDER BY created_at DESC;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE LOG 'Error in get_products_by_shop_id: %', SQLERRM;
    RETURN;
END;
$$;

-- Function to get a product by id
CREATE OR REPLACE FUNCTION get_product_by_id(product_id UUID)
RETURNS SETOF products
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT * FROM products WHERE id = product_id;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE LOG 'Error in get_product_by_id: %', SQLERRM;
    RETURN;
END;
$$;

-- Function to check shop ownership
CREATE OR REPLACE FUNCTION check_shop_ownership(shop_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM content_ownership
    WHERE content_id = shop_id
    AND content_type = 'shop'
    AND owner_id = user_id
  );
EXCEPTION 
  WHEN OTHERS THEN
    RAISE LOG 'Error in check_shop_ownership: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Function to create a shop and ownership
CREATE OR REPLACE FUNCTION create_shop(
  shop_name TEXT,
  shop_description TEXT,
  shop_location TEXT,
  shop_website_url TEXT,
  shop_banner_image_url TEXT,
  shop_logo_url TEXT,
  shop_tags TEXT[],
  owner_id UUID
)
RETURNS shops
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_shop shops;
BEGIN
  -- Insert the shop
  INSERT INTO shops (
    name, 
    description, 
    location, 
    website_url, 
    banner_image_url, 
    logo_url, 
    tags
  ) VALUES (
    shop_name,
    shop_description,
    shop_location,
    shop_website_url,
    shop_banner_image_url,
    shop_logo_url,
    shop_tags
  )
  RETURNING * INTO new_shop;
  
  -- Create ownership record
  INSERT INTO content_ownership (
    content_id, 
    content_type, 
    owner_id
  ) VALUES (
    new_shop.id,
    'shop',
    owner_id
  );
  
  RETURN new_shop;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE LOG 'Error in create_shop: %', SQLERRM;
    RAISE;
END;
$$;

-- Function to delete a product
CREATE OR REPLACE FUNCTION delete_product(product_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM products WHERE id = product_id;
  RETURN FOUND;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE LOG 'Error in delete_product: %', SQLERRM;
    RETURN FALSE;
END;
$$;
