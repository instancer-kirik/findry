
CREATE TABLE public.lyrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'complete')),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  key_signature TEXT,
  tempo_bpm INTEGER,
  mood TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lyrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lyrics are viewable by everyone"
  ON public.lyrics FOR SELECT USING (true);

CREATE POLICY "Users can create their own lyrics"
  ON public.lyrics FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lyrics"
  ON public.lyrics FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lyrics"
  ON public.lyrics FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_lyrics_updated_at
  BEFORE UPDATE ON public.lyrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_lyrics_user_id ON public.lyrics(user_id);
CREATE INDEX idx_lyrics_project_id ON public.lyrics(project_id);
CREATE INDEX idx_lyrics_tags ON public.lyrics USING GIN(tags);
