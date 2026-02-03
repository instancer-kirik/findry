-- Drop conflicting policies on shopping_list
DROP POLICY IF EXISTS "Anyone can delete shopping items" ON public.shopping_list;
DROP POLICY IF EXISTS "Anyone can insert shopping items" ON public.shopping_list;
DROP POLICY IF EXISTS "Anyone can update shopping items" ON public.shopping_list;
DROP POLICY IF EXISTS "Anyone can view shopping items" ON public.shopping_list;
DROP POLICY IF EXISTS "Users can delete own shopping list items" ON public.shopping_list;
DROP POLICY IF EXISTS "Users can delete their own shopping list items" ON public.shopping_list;
DROP POLICY IF EXISTS "Users can insert own shopping list items" ON public.shopping_list;
DROP POLICY IF EXISTS "Users can insert their own shopping list items" ON public.shopping_list;
DROP POLICY IF EXISTS "Users can update own shopping list items" ON public.shopping_list;
DROP POLICY IF EXISTS "Users can update their own shopping list items" ON public.shopping_list;
DROP POLICY IF EXISTS "Users can view own shopping list" ON public.shopping_list;
DROP POLICY IF EXISTS "Users can view their own shopping list" ON public.shopping_list;

-- Add is_public column to allow sharing lists
ALTER TABLE public.shopping_list ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Create clean RLS policies

-- SELECT: Users can view their own items OR any public items
CREATE POLICY "Users can view own or public shopping items"
ON public.shopping_list
FOR SELECT
USING (
  auth.uid() = owner_id 
  OR owner_id IS NULL 
  OR is_public = true
);

-- INSERT: Only authenticated users can insert their own items
CREATE POLICY "Users can insert own shopping items"
ON public.shopping_list
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- UPDATE: Only owners can update their items
CREATE POLICY "Users can update own shopping items"
ON public.shopping_list
FOR UPDATE
USING (auth.uid() = owner_id);

-- DELETE: Only owners can delete their items
CREATE POLICY "Users can delete own shopping items"
ON public.shopping_list
FOR DELETE
USING (auth.uid() = owner_id);