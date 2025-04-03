-- Create user_artist_relationships table
CREATE TABLE IF NOT EXISTS public.user_artist_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create user_brand_relationships table
CREATE TABLE IF NOT EXISTS public.user_brand_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.user_artist_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_brand_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies for user_artist_relationships
CREATE POLICY "Public artist relationships are viewable by everyone"
  ON public.user_artist_relationships FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own artist relationships"
  ON public.user_artist_relationships
  USING (auth.uid() = user_id);

-- Create policies for user_brand_relationships
CREATE POLICY "Public brand relationships are viewable by everyone"
  ON public.user_brand_relationships FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own brand relationships"
  ON public.user_brand_relationships
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS user_artist_relationships_user_id_idx ON public.user_artist_relationships (user_id);
CREATE INDEX IF NOT EXISTS user_artist_relationships_artist_id_idx ON public.user_artist_relationships (artist_id);
CREATE INDEX IF NOT EXISTS user_brand_relationships_user_id_idx ON public.user_brand_relationships (user_id);
CREATE INDEX IF NOT EXISTS user_brand_relationships_brand_id_idx ON public.user_brand_relationships (brand_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_user_artist_relationships_updated_at
  BEFORE UPDATE ON public.user_artist_relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_brand_relationships_updated_at
  BEFORE UPDATE ON public.user_brand_relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 