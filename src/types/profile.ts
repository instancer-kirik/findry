
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
  role_attributes: Record<string, any>;
  profile_types: string[];
}
