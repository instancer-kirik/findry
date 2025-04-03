-- Add 'shop' to the content_type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type') THEN
        CREATE TYPE content_type AS ENUM (
            'project',
            'event',
            'resource',
            'community',
            'shop'
        );
    ELSE
        -- If the type already exists, make sure 'shop' is in it
        BEGIN
            ALTER TYPE content_type ADD VALUE 'shop' IF NOT EXISTS;
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END$$;

-- Create content_ownership table if it doesn't exist
CREATE TABLE IF NOT EXISTS content_ownership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL,
  content_type content_type NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(content_id, content_type)
);

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  website_url TEXT,
  banner_image_url TEXT,
  logo_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to automatically set updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_content_ownership_updated_at ON content_ownership;
CREATE TRIGGER update_content_ownership_updated_at
  BEFORE UPDATE ON content_ownership
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shops_updated_at ON shops;
CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_content_ownership_owner_id ON content_ownership(owner_id);
CREATE INDEX IF NOT EXISTS idx_content_ownership_content_id ON content_ownership(content_id);
CREATE INDEX IF NOT EXISTS idx_content_ownership_content_type ON content_ownership(content_type);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);

-- Add RLS policies
ALTER TABLE content_ownership ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow users to view any content ownership
DROP POLICY IF EXISTS "Users can view any content ownership" ON content_ownership;
CREATE POLICY "Users can view any content ownership"
  ON content_ownership FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own content ownership
DROP POLICY IF EXISTS "Users can insert their own content ownership" ON content_ownership;
CREATE POLICY "Users can insert their own content ownership"
  ON content_ownership FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own content ownership
DROP POLICY IF EXISTS "Users can update their own content ownership" ON content_ownership;
CREATE POLICY "Users can update their own content ownership"
  ON content_ownership FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Allow users to delete their own content ownership
DROP POLICY IF EXISTS "Users can delete their own content ownership" ON content_ownership;
CREATE POLICY "Users can delete their own content ownership"
  ON content_ownership FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Shop policies
DROP POLICY IF EXISTS "Users can view all shops" ON shops;
CREATE POLICY "Users can view all shops"
  ON shops FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can create shops" ON shops;
CREATE POLICY "Users can create shops"
  ON shops FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own shops" ON shops;
CREATE POLICY "Users can update their own shops"
  ON shops FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = shops.id
      AND content_type = 'shop'
      AND owner_id = auth.uid()
    )
  )
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete their own shops" ON shops;
CREATE POLICY "Users can delete their own shops"
  ON shops FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = shops.id
      AND content_type = 'shop'
      AND owner_id = auth.uid()
    )
  );

-- Product policies
DROP POLICY IF EXISTS "Users can view all products" ON products;
CREATE POLICY "Users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can create products for their shops" ON products;
CREATE POLICY "Users can create products for their shops"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM content_ownership co
      JOIN shops s ON co.content_id = s.id
      WHERE s.id = products.shop_id
      AND co.content_type = 'shop'
      AND co.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update products for their shops" ON products;
CREATE POLICY "Users can update products for their shops"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership co
      JOIN shops s ON co.content_id = s.id
      WHERE s.id = products.shop_id
      AND co.content_type = 'shop'
      AND co.owner_id = auth.uid()
    )
  )
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete products from their shops" ON products;
CREATE POLICY "Users can delete products from their shops"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership co
      JOIN shops s ON co.content_id = s.id
      WHERE s.id = products.shop_id
      AND co.content_type = 'shop'
      AND co.owner_id = auth.uid()
    )
  ); 