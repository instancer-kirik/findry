
export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  profile_types: string[] | null;
  role_attributes?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}
