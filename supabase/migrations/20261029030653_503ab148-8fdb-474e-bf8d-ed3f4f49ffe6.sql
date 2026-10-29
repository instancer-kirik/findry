DROP POLICY IF EXISTS "Admins can add space tools" ON public.space_tools;
DROP POLICY IF EXISTS "Admins can edit space tools" ON public.space_tools;
CREATE POLICY "Admins and managers can add space tools" ON public.space_tools FOR INSERT TO authenticated
  WITH CHECK (public.has_role(_role => 'admin', _user_id => auth.uid()) OR public.has_role(_role => 'moderator', _user_id => auth.uid()));
CREATE POLICY "Admins and managers can edit space tools" ON public.space_tools FOR UPDATE TO authenticated
  USING (public.has_role(_role => 'admin', _user_id => auth.uid()) OR public.has_role(_role => 'moderator', _user_id => auth.uid()));