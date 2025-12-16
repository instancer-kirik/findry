-- Fix: Remove auth.users exposure from user_profiles view
-- This view directly exposes auth.users which is a security vulnerability

-- First, drop the existing view
DROP VIEW IF EXISTS public.user_profiles;

-- Recreate the view without referencing auth.users
-- This view now only uses the public.profiles table
CREATE VIEW public.user_profiles AS
SELECT 
    p.id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.created_at
FROM profiles p;

-- Add comment explaining the change
COMMENT ON VIEW public.user_profiles IS 'User profiles view - does not expose auth.users for security';

-- Enable RLS on tables that have policies but RLS disabled
ALTER TABLE public.game_jam_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_jam_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_jam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_jam_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_jam_teams ENABLE ROW LEVEL SECURITY;

-- Enable RLS on loreum tables that have policies but RLS disabled
ALTER TABLE public.loreum_character_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_character_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_civilizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_enchantments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_governments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_ipsumarium_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_item_enchantments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_lore_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_magic_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_magic_progression_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_magic_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_multiverses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_powers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_star_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_tech_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_universes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loreum_worlds ENABLE ROW LEVEL SECURITY;