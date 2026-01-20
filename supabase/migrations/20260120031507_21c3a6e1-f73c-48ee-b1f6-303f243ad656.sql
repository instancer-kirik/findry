-- Drop the problematic trigger that references user_roles table
DROP TRIGGER IF EXISTS add_default_user_role_trigger ON auth.users;

-- Drop the function as well
DROP FUNCTION IF EXISTS add_default_user_role();

-- Also make sure user_roles table exists for future use
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role text NOT NULL DEFAULT 'user',
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all roles" ON public.user_roles;
CREATE POLICY "Service role can manage all roles"
    ON public.user_roles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);