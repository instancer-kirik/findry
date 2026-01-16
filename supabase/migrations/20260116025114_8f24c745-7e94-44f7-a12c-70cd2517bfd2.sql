-- Create privacy level enum for garages
CREATE TYPE public.privacy_level AS ENUM ('public', 'friends_only', 'private', 'invite_only');

-- Create garages table
CREATE TABLE public.garages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  address TEXT,
  coordinates JSONB, -- { lat: number, lng: number }
  image_url TEXT,
  
  -- Features
  has_lift BOOLEAN DEFAULT false,
  lift_capacity_lbs INTEGER,
  has_storage BOOLEAN DEFAULT false,
  storage_sqft INTEGER,
  has_tools BOOLEAN DEFAULT false,
  has_electricity BOOLEAN DEFAULT true,
  has_air_compressor BOOLEAN DEFAULT false,
  has_welding BOOLEAN DEFAULT false,
  bay_count INTEGER DEFAULT 1,
  
  -- Privacy
  privacy_level public.privacy_level DEFAULT 'private',
  
  -- Availability
  is_available_for_rent BOOLEAN DEFAULT false,
  hourly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user blocks table for mutual invisibility
CREATE TABLE public.user_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- Create garage access invites for invite_only garages
CREATE TABLE public.garage_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id UUID NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(garage_id, invited_user_id)
);

-- Enable RLS
ALTER TABLE public.garages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garage_invites ENABLE ROW LEVEL SECURITY;

-- Function to check if users are blocking each other (mutual invisibility)
CREATE OR REPLACE FUNCTION public.users_can_see_each_other(user_a UUID, user_b UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.user_blocks
    WHERE (blocker_id = user_a AND blocked_id = user_b)
       OR (blocker_id = user_b AND blocked_id = user_a)
  )
$$;

-- Function to check if user has garage access
CREATE OR REPLACE FUNCTION public.can_view_garage(viewer_id UUID, garage_owner_id UUID, garage_privacy public.privacy_level, garage_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      -- Owner can always view their own
      WHEN viewer_id = garage_owner_id THEN true
      -- Check mutual blocking first
      WHEN NOT public.users_can_see_each_other(viewer_id, garage_owner_id) THEN false
      -- Public garages visible to all
      WHEN garage_privacy = 'public' THEN true
      -- Private only to owner
      WHEN garage_privacy = 'private' THEN false
      -- Invite only - check invites table
      WHEN garage_privacy = 'invite_only' THEN EXISTS (
        SELECT 1 FROM public.garage_invites 
        WHERE garage_invites.garage_id = can_view_garage.garage_id 
        AND invited_user_id = viewer_id 
        AND status = 'accepted'
      )
      -- Friends only - would need friends table, for now treat as invite_only
      WHEN garage_privacy = 'friends_only' THEN EXISTS (
        SELECT 1 FROM public.garage_invites 
        WHERE garage_invites.garage_id = can_view_garage.garage_id 
        AND invited_user_id = viewer_id 
        AND status = 'accepted'
      )
      ELSE false
    END
$$;

-- Garages RLS Policies
CREATE POLICY "Users can view garages based on privacy and blocks"
ON public.garages FOR SELECT
USING (
  public.can_view_garage(auth.uid(), owner_id, privacy_level, id)
);

CREATE POLICY "Users can create their own garages"
ON public.garages FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own garages"
ON public.garages FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own garages"
ON public.garages FOR DELETE
USING (auth.uid() = owner_id);

-- User Blocks RLS Policies
CREATE POLICY "Users can view their own blocks"
ON public.user_blocks FOR SELECT
USING (auth.uid() = blocker_id OR auth.uid() = blocked_id);

CREATE POLICY "Users can create blocks"
ON public.user_blocks FOR INSERT
WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete their own blocks"
ON public.user_blocks FOR DELETE
USING (auth.uid() = blocker_id);

-- Garage Invites RLS Policies
CREATE POLICY "Users can view invites they sent or received"
ON public.garage_invites FOR SELECT
USING (auth.uid() = invited_user_id OR auth.uid() = invited_by);

CREATE POLICY "Garage owners can create invites"
ON public.garage_invites FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.garages WHERE id = garage_id AND owner_id = auth.uid())
);

CREATE POLICY "Invited users can update invite status"
ON public.garage_invites FOR UPDATE
USING (auth.uid() = invited_user_id);

CREATE POLICY "Garage owners can delete invites"
ON public.garage_invites FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.garages WHERE id = garage_id AND owner_id = auth.uid())
);

-- Triggers for updated_at
CREATE TRIGGER update_garages_updated_at
BEFORE UPDATE ON public.garages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();