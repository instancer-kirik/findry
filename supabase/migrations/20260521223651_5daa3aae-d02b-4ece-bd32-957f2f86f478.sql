INSERT INTO public.lyrics (user_id, title, content, status, mood, tags, notes)
SELECT '2603d9b1-82cb-4ced-99a3-ce194b30c7c7', title, content, status, mood, tags, notes
FROM public.lyrics
WHERE id = '7426d0b4-50f2-4391-b19e-b0399a3d113c'
AND NOT EXISTS (
  SELECT 1 FROM public.lyrics WHERE user_id = '2603d9b1-82cb-4ced-99a3-ce194b30c7c7' AND title = 'Drawing Board (Jack Daniels rewrite WIP)'
);