
-- Create share_views table for curated shareable project collections
CREATE TABLE public.share_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  share_key TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  tags TEXT[] DEFAULT '{}',
  labels TEXT[] DEFAULT '{}',
  pinned_project_ids UUID[] DEFAULT '{}',
  excluded_project_ids UUID[] DEFAULT '{}',
  theme TEXT DEFAULT 'default',
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.share_views ENABLE ROW LEVEL SECURITY;

-- Anyone can view active share views (public links)
CREATE POLICY "Anyone can view active share views"
  ON public.share_views FOR SELECT
  USING (is_active = true OR auth.uid() = owner_id);

-- Only owner can create
CREATE POLICY "Users can create their own share views"
  ON public.share_views FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Only owner can update
CREATE POLICY "Users can update their own share views"
  ON public.share_views FOR UPDATE
  USING (auth.uid() = owner_id);

-- Only owner can delete
CREATE POLICY "Users can delete their own share views"
  ON public.share_views FOR DELETE
  USING (auth.uid() = owner_id);

-- Index for fast lookups by share_key
CREATE INDEX idx_share_views_share_key ON public.share_views (share_key);
CREATE INDEX idx_share_views_owner ON public.share_views (owner_id);

-- Auto-update timestamp
CREATE TRIGGER update_share_views_updated_at
  BEFORE UPDATE ON public.share_views
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
