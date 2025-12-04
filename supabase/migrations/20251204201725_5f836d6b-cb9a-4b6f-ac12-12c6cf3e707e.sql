-- Create UGC content table
CREATE TABLE public.ugc_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('image', 'video', 'embed')),
  title TEXT,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Associations
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  
  -- Visibility
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create UGC likes table
CREATE TABLE public.ugc_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.ugc_content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_id, user_id)
);

-- Create UGC comments table
CREATE TABLE public.ugc_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.ugc_content(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ugc_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ugc_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ugc_comments ENABLE ROW LEVEL SECURITY;

-- UGC Content policies
CREATE POLICY "Public content is viewable by everyone" 
ON public.ugc_content FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can view their own content" 
ON public.ugc_content FOR SELECT 
USING (auth.uid() = author_id);

CREATE POLICY "Users can create their own content" 
ON public.ugc_content FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own content" 
ON public.ugc_content FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own content" 
ON public.ugc_content FOR DELETE 
USING (auth.uid() = author_id);

-- UGC Likes policies
CREATE POLICY "Likes are viewable by everyone" 
ON public.ugc_likes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can like" 
ON public.ugc_likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes" 
ON public.ugc_likes FOR DELETE 
USING (auth.uid() = user_id);

-- UGC Comments policies
CREATE POLICY "Comments are viewable by everyone" 
ON public.ugc_comments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can comment" 
ON public.ugc_comments FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" 
ON public.ugc_comments FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" 
ON public.ugc_comments FOR DELETE 
USING (auth.uid() = author_id);

-- Create indexes
CREATE INDEX idx_ugc_content_author ON public.ugc_content(author_id);
CREATE INDEX idx_ugc_content_created ON public.ugc_content(created_at DESC);
CREATE INDEX idx_ugc_content_tags ON public.ugc_content USING GIN(tags);
CREATE INDEX idx_ugc_content_type ON public.ugc_content(content_type);
CREATE INDEX idx_ugc_likes_content ON public.ugc_likes(content_id);
CREATE INDEX idx_ugc_comments_content ON public.ugc_comments(content_id);

-- Create storage bucket for UGC
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ugc-media', 
  'ugc-media', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Storage policies for UGC bucket
CREATE POLICY "UGC media is publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'ugc-media');

CREATE POLICY "Authenticated users can upload UGC media" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'ugc-media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own UGC media" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'ugc-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own UGC media" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'ugc-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger for updated_at
CREATE TRIGGER update_ugc_content_updated_at
BEFORE UPDATE ON public.ugc_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ugc_comments_updated_at
BEFORE UPDATE ON public.ugc_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();