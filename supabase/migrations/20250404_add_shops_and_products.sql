
-- Create shops table
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  website_url TEXT,
  banner_image_url TEXT,
  logo_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add updated_at trigger for shops table
CREATE TRIGGER update_shops_updated_at
BEFORE UPDATE ON public.shops
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for products table
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update content_type enum to include 'shop'
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'shop';

-- Add RLS policies for shops table
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Shop owners can do anything with their shops
CREATE POLICY "Shop owners can do anything" 
ON public.shops 
FOR ALL 
USING (is_content_owner(id, 'shop'::content_type));

-- Anyone can view shops
CREATE POLICY "Anyone can view shops" 
ON public.shops 
FOR SELECT 
USING (true);

-- Add RLS policies for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Shop owners can do anything with their products
CREATE POLICY "Shop owners can do anything with products" 
ON public.products 
FOR ALL 
USING (is_content_owner(shop_id, 'shop'::content_type));

-- Anyone can view products
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

-- Add bio and social_links columns to artists table
ALTER TABLE public.artists 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS social_links TEXT[];
