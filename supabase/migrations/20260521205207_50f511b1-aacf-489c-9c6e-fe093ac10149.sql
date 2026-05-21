-- Bridge: communities <-> share_views
CREATE TABLE public.community_share_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  share_view_id UUID NOT NULL REFERENCES public.share_views(id) ON DELETE CASCADE,
  featured BOOLEAN NOT NULL DEFAULT false,
  added_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (community_id, share_view_id)
);

CREATE INDEX idx_community_share_views_community ON public.community_share_views(community_id);
CREATE INDEX idx_community_share_views_view ON public.community_share_views(share_view_id);

ALTER TABLE public.community_share_views ENABLE ROW LEVEL SECURITY;

-- Anyone can read links (the underlying share view is already public via share_key)
CREATE POLICY "Community share views are viewable by everyone"
ON public.community_share_views FOR SELECT USING (true);

-- Only community admins OR the share view owner can attach
CREATE POLICY "Community admins or view owners can attach"
ON public.community_share_views FOR INSERT
WITH CHECK (
  auth.uid() = added_by AND (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_share_views.community_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM public.communities c
      WHERE c.id = community_share_views.community_id AND c.created_by = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.share_views sv
      WHERE sv.id = community_share_views.share_view_id AND sv.owner_id = auth.uid()
    )
  )
);

CREATE POLICY "Community admins or view owners can detach"
ON public.community_share_views FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.community_members cm
    WHERE cm.community_id = community_share_views.community_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.communities c
    WHERE c.id = community_share_views.community_id AND c.created_by = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.share_views sv
    WHERE sv.id = community_share_views.share_view_id AND sv.owner_id = auth.uid()
  )
);

CREATE POLICY "Admins can update featured flag"
ON public.community_share_views FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.community_members cm
    WHERE cm.community_id = community_share_views.community_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.communities c
    WHERE c.id = community_share_views.community_id AND c.created_by = auth.uid()
  )
);