-- Create feedback table for project-specific and general feedback
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  project_id UUID,
  category TEXT DEFAULT 'general',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Users can submit feedback
CREATE POLICY "Anyone can submit feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback" 
ON public.feedback 
FOR SELECT 
USING (user_id = auth.uid());

-- Admins can view all feedback (using correct has_role signature)
CREATE POLICY "Admins can view all feedback"
ON public.feedback
FOR SELECT
USING (public.has_role('admin'::user_role, auth.uid()));

-- Admins can update feedback status
CREATE POLICY "Admins can update feedback"
ON public.feedback
FOR UPDATE
USING (public.has_role('admin'::user_role, auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER update_feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for efficient queries
CREATE INDEX idx_feedback_status ON public.feedback(status);
CREATE INDEX idx_feedback_project_id ON public.feedback(project_id);
CREATE INDEX idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at DESC);