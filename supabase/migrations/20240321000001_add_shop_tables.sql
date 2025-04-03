-- Create shops table
CREATE TABLE shops (
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
CREATE TABLE products (
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

-- Add triggers for updated_at
CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all shops"
  ON shops FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create shops"
  ON shops FOR INSERT
  TO authenticated
  WITH CHECK (true);

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
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

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

-- Create indexes for better performance
CREATE INDEX idx_products_shop_id ON products(shop_id); 