import { Json } from './types';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          capabilities: string[]
          created_at: string
          updated_at: string
          role_attributes: Json | null
          profile_types: string[] | null
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          capabilities?: string[]
          created_at?: string
          updated_at?: string
          role_attributes?: Json | null
          profile_types?: string[] | null
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          capabilities?: string[]
          created_at?: string
          updated_at?: string
          role_attributes?: Json | null
          profile_types?: string[] | null
        }
      }
      artists: {
        Row: {
          id: string
          name: string
          image_url: string | null
          location: string | null
          disciplines: string[] | null
          styles: string[] | null
          tags: string[] | null
          type: string | null
          subtype: string | null
          multidisciplinary: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url?: string | null
          location?: string | null
          disciplines?: string[] | null
          styles?: string[] | null
          tags?: string[] | null
          type?: string | null
          subtype?: string | null
          multidisciplinary?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string | null
          location?: string | null
          disciplines?: string[] | null
          styles?: string[] | null
          tags?: string[] | null
          type?: string | null
          subtype?: string | null
          multidisciplinary?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          image_url: string | null
          location: string | null
          description: string | null
          tags: string[] | null
          type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url?: string | null
          location?: string | null
          description?: string | null
          tags?: string[] | null
          type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string | null
          location?: string | null
          description?: string | null
          tags?: string[] | null
          type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      communities: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          category: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          category?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          category?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      community_members: {
        Row: {
          id: string
          community_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          community_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          community_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          community_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      content_ownership: {
        Row: {
          id: string
          content_id: string
          content_type: string
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content_id: string
          content_type: string
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content_id?: string
          content_type?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          location: string | null
          capacity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          location?: string | null
          capacity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          location?: string | null
          capacity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          name: string
          description: string | null
          url: string | null
          type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          url?: string | null
          type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          url?: string | null
          type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number | null
          duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price?: number | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_artist_relationships: {
        Row: {
          id: string
          user_id: string
          artist_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          artist_id: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          artist_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_brand_relationships: {
        Row: {
          id: string
          user_id: string
          brand_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_id: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      venues: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          location: string | null
          capacity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          location?: string | null
          capacity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          location?: string | null
          capacity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      shops: {
        Row: {
          id: string
          name: string
          description: string | null
          location: string | null
          website_url: string | null
          banner_image_url: string | null
          logo_url: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          location?: string | null
          website_url?: string | null
          banner_image_url?: string | null
          logo_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          location?: string | null
          website_url?: string | null
          banner_image_url?: string | null
          logo_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          shop_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      waitlist: {
        Row: {
          id: string
          email: string
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          source?: string | null
          created_at?: string
        }
      }
      project_components: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          type: string | null;
          status: string | null;
          assigned_to: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
          dependencies: string[] | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          type?: string | null;
          status?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
          dependencies?: string[] | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          description?: string | null;
          type?: string | null;
          status?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
          dependencies?: string[] | null;
        };
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums = {
  // ... existing enums ...
  content_type: 'project' | 'event' | 'resource' | 'community' | 'shop'
}
