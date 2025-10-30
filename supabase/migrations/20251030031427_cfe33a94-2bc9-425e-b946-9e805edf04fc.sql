-- Create user_connections table for networking/following
CREATE TABLE IF NOT EXISTS public.user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  connection_type TEXT DEFAULT 'follow' CHECK (connection_type IN ('follow', 'collaborate', 'friend')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create offers table for collaboration offers
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_proposals table for responding to service requests
CREATE TABLE IF NOT EXISTS public.service_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  proposal_text TEXT NOT NULL,
  estimated_price DECIMAL(10,2),
  estimated_days INTEGER,
  portfolio_links TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meeting_schedules table for scheduling
CREATE TABLE IF NOT EXISTS public.meeting_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  participants UUID[] DEFAULT '{}',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  meeting_url TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_schedules ENABLE ROW LEVEL SECURITY;

-- Policies for user_connections
CREATE POLICY "Users can view all connections"
  ON public.user_connections FOR SELECT USING (true);

CREATE POLICY "Users can create connections"
  ON public.user_connections FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own connections"
  ON public.user_connections FOR DELETE
  USING (auth.uid() = follower_id);

CREATE POLICY "Users can update their own connections"
  ON public.user_connections FOR UPDATE
  USING (auth.uid() = follower_id);

-- Policies for offers
CREATE POLICY "Users can view their offers"
  ON public.offers FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create offers"
  ON public.offers FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Senders can update their offers"
  ON public.offers FOR UPDATE
  USING (auth.uid() = sender_id);

CREATE POLICY "Receivers can accept/decline offers"
  ON public.offers FOR UPDATE
  USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete their sent offers"
  ON public.offers FOR DELETE
  USING (auth.uid() = sender_id);

-- Policies for service_proposals
CREATE POLICY "Users can view proposals for their requests"
  ON public.service_proposals FOR SELECT
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM service_requests 
      WHERE service_requests.id = service_proposals.service_request_id 
      AND service_requests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create proposals"
  ON public.service_proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own proposals"
  ON public.service_proposals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own proposals"
  ON public.service_proposals FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for meeting_schedules
CREATE POLICY "Participants can view meetings"
  ON public.meeting_schedules FOR SELECT
  USING (auth.uid() = organizer_id OR auth.uid() = ANY(participants));

CREATE POLICY "Users can create meetings"
  ON public.meeting_schedules FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update meetings"
  ON public.meeting_schedules FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete meetings"
  ON public.meeting_schedules FOR DELETE
  USING (auth.uid() = organizer_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_connections_updated_at
  BEFORE UPDATE ON public.user_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_proposals_updated_at
  BEFORE UPDATE ON public.service_proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meeting_schedules_updated_at
  BEFORE UPDATE ON public.meeting_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_user_connections_follower ON public.user_connections(follower_id);
CREATE INDEX idx_user_connections_following ON public.user_connections(following_id);
CREATE INDEX idx_offers_sender ON public.offers(sender_id);
CREATE INDEX idx_offers_receiver ON public.offers(receiver_id);
CREATE INDEX idx_offers_status ON public.offers(status);
CREATE INDEX idx_service_proposals_request ON public.service_proposals(service_request_id);
CREATE INDEX idx_service_proposals_user ON public.service_proposals(user_id);
CREATE INDEX idx_meeting_schedules_organizer ON public.meeting_schedules(organizer_id);
CREATE INDEX idx_meeting_schedules_start_time ON public.meeting_schedules(start_time);