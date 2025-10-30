-- Create service_requests table for Fiverr-like service requests
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  delivery_days INTEGER,
  skills_needed TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  requirements TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all service requests"
  ON public.service_requests
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own service requests"
  ON public.service_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service requests"
  ON public.service_requests
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own service requests"
  ON public.service_requests
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for better query performance
CREATE INDEX idx_service_requests_user_id ON public.service_requests(user_id);
CREATE INDEX idx_service_requests_category ON public.service_requests(category);
CREATE INDEX idx_service_requests_status ON public.service_requests(status);