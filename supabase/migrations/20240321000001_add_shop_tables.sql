-- Add shop to content_type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type') THEN
        CREATE TYPE content_type AS ENUM ('project', 'event', 'resource', 'community', 'shop');
    ELSE
        -- Check if 'shop' is already in the enum
        IF NOT EXISTS (
            SELECT 1
            FROM pg_enum
            WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'content_type')
            AND enumlabel = 'shop'
        ) THEN
            -- Add 'shop' to the enum
            ALTER TYPE content_type ADD VALUE 'shop';
        END IF;
    END IF;
END
$$;

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create content_ownership table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content_ownership (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type content_type NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (content_id, content_type)
);

-- Create shops table
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    website_url TEXT,
    banner_image_url TEXT,
    logo_url TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trigger for shops updated_at column
DROP TRIGGER IF EXISTS update_shops_updated_at ON public.shops;
CREATE TRIGGER update_shops_updated_at
BEFORE UPDATE ON public.shops
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for products updated_at column
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for content_ownership updated_at column
DROP TRIGGER IF EXISTS update_content_ownership_updated_at ON public.content_ownership;
CREATE TRIGGER update_content_ownership_updated_at
BEFORE UPDATE ON public.content_ownership
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shops_tags ON public.shops USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON public.products(shop_id);
CREATE INDEX IF NOT EXISTS idx_content_ownership_content ON public.content_ownership(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_content_ownership_owner ON public.content_ownership(owner_id);

-- Set up RLS for shops table
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Create policies for shops
DROP POLICY IF EXISTS "Allow all users to view shops" ON public.shops;
CREATE POLICY "Allow all users to view shops" ON public.shops
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to create shops" ON public.shops;
CREATE POLICY "Allow authenticated users to create shops" ON public.shops
    FOR INSERT TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow owners to update their shops" ON public.shops;
CREATE POLICY "Allow owners to update their shops" ON public.shops
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.content_ownership
            WHERE content_id = shops.id
            AND content_type = 'shop'
            AND owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Allow owners to delete their shops" ON public.shops;
CREATE POLICY "Allow owners to delete their shops" ON public.shops
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.content_ownership
            WHERE content_id = shops.id
            AND content_type = 'shop'
            AND owner_id = auth.uid()
        )
    );

-- Set up RLS for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
DROP POLICY IF EXISTS "Allow all users to view products" ON public.products;
CREATE POLICY "Allow all users to view products" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow shop owners to create products" ON public.products;
CREATE POLICY "Allow shop owners to create products" ON public.products
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.content_ownership
            WHERE content_id = products.shop_id
            AND content_type = 'shop'
            AND owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Allow shop owners to update their products" ON public.products;
CREATE POLICY "Allow shop owners to update their products" ON public.products
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.content_ownership
            WHERE content_id = products.shop_id
            AND content_type = 'shop'
            AND owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Allow shop owners to delete their products" ON public.products;
CREATE POLICY "Allow shop owners to delete their products" ON public.products
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.content_ownership
            WHERE content_id = products.shop_id
            AND content_type = 'shop'
            AND owner_id = auth.uid()
        )
    );

-- Set up RLS for content_ownership table
ALTER TABLE public.content_ownership ENABLE ROW LEVEL SECURITY;

-- Create policies for content_ownership
DROP POLICY IF EXISTS "Allow all users to view content ownership" ON public.content_ownership;
CREATE POLICY "Allow all users to view content ownership" ON public.content_ownership
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to create content ownership" ON public.content_ownership;
CREATE POLICY "Allow authenticated users to create content ownership" ON public.content_ownership
    FOR INSERT TO authenticated
    WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Allow owners to update their content ownership" ON public.content_ownership;
CREATE POLICY "Allow owners to update their content ownership" ON public.content_ownership
    FOR UPDATE TO authenticated
    USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Allow owners to delete their content ownership" ON public.content_ownership;
CREATE POLICY "Allow owners to delete their content ownership" ON public.content_ownership
    FOR DELETE TO authenticated
    USING (owner_id = auth.uid()); 