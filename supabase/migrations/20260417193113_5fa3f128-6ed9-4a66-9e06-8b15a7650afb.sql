DO $$
DECLARE
  src_id UUID := '361c3e2f-90a0-4ea4-8ce2-66690135cc2f'; -- kirik@instance.select
  dst_id UUID := '2603d9b1-82cb-4ced-99a3-ce194b30c7c7'; -- instance.select@gmail.com
BEGIN
  UPDATE public.projects SET owner_id = dst_id WHERE owner_id = src_id;
  UPDATE public.projects SET created_by = dst_id WHERE created_by = src_id;
  UPDATE public.content_ownership SET owner_id = dst_id WHERE owner_id = src_id;
  UPDATE public.feedback SET user_id = dst_id WHERE user_id = src_id;
END $$;