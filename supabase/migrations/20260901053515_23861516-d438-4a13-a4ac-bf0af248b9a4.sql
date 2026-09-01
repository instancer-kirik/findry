CREATE TABLE public.creator_survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  contact_email TEXT,
  country TEXT,
  role TEXT,
  role_other TEXT,
  collaboration_types TEXT,
  finding_opportunities TEXT,
  process TEXT,
  tools TEXT,
  fell_through TEXT,
  hardest_part TEXT,
  issue_frequency TEXT,
  discoverability TEXT,
  values_most TEXT,
  instant_yes TEXT,
  trust_platforms TEXT,
  trust_requirements TEXT,
  paid_tools TEXT,
  willing_to_pay TEXT,
  one_change TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.creator_survey_responses TO anon;
GRANT SELECT, INSERT ON public.creator_survey_responses TO authenticated;
GRANT ALL ON public.creator_survey_responses TO service_role;

ALTER TABLE public.creator_survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a survey response"
ON public.creator_survey_responses FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can view their own survey responses"
ON public.creator_survey_responses FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all survey responses"
ON public.creator_survey_responses FOR SELECT
TO authenticated
USING (public.has_role('admin'::public.user_role, auth.uid()));

CREATE TRIGGER update_creator_survey_responses_updated_at
BEFORE UPDATE ON public.creator_survey_responses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();