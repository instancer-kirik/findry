
import { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  profile_types: string[] | null;
  role_attributes: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormValues {
  username: string;
  full_name: string;
  avatar_url?: string;
  bio: string;
  profile_types: string[];
  role_attributes: Record<string, any>;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
}
