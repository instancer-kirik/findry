export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          bio: string | null
          created_at: string
          disciplines: string[] | null
          id: string
          image_url: string | null
          location: string | null
          multidisciplinary: boolean | null
          name: string
          social_links: string[] | null
          styles: string[] | null
          subtype: string | null
          tags: string[] | null
          type: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          disciplines?: string[] | null
          id?: string
          image_url?: string | null
          location?: string | null
          multidisciplinary?: boolean | null
          name: string
          social_links?: string[] | null
          styles?: string[] | null
          subtype?: string | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          disciplines?: string[] | null
          id?: string
          image_url?: string | null
          location?: string | null
          multidisciplinary?: boolean | null
          name?: string
          social_links?: string[] | null
          styles?: string[] | null
          subtype?: string | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          tags: string[] | null
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          community_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          community_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          community_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_ownership: {
        Row: {
          content_id: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          id: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          content_id: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          id?: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          content_id?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          id?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_community_relationships: {
        Row: {
          community_id: string
          created_at: string | null
          created_by: string | null
          event_id: string
          id: string
        }
        Insert: {
          community_id: string
          created_at?: string | null
          created_by?: string | null
          event_id: string
          id?: string
        }
        Update: {
          community_id?: string
          created_at?: string | null
          created_by?: string | null
          event_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_community_relationships_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_community_relationships_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_community_relationships_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          requested_items: Json | null
          slots: Json | null
          start_date: string | null
          subtype: string | null
          tags: string[] | null
          type: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          requested_items?: Json | null
          slots?: Json | null
          start_date?: string | null
          subtype?: string | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          requested_items?: Json | null
          slots?: Json | null
          start_date?: string | null
          subtype?: string | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          shop_id: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number
          shop_id: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          shop_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          profile_types: string[] | null
          role_attributes: Json | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          profile_types?: string[] | null
          role_attributes?: Json | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          profile_types?: string[] | null
          role_attributes?: Json | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_components: {
        Row: {
          created_at: string
          dependencies: string[] | null
          description: string | null
          id: string
          name: string
          project_id: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          id?: string
          name: string
          project_id: string
          status: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          id?: string
          name?: string
          project_id?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_components_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          progress: number | null
          repo_url: string | null
          status: string | null
          tags: string[] | null
          timeline: string | null
          type: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          progress?: number | null
          repo_url?: string | null
          status?: string | null
          tags?: string[] | null
          timeline?: string | null
          type?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          progress?: number | null
          repo_url?: string | null
          status?: string | null
          tags?: string[] | null
          timeline?: string | null
          type?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          availability: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          size_sqft: number | null
          subtype: string | null
          tags: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          availability?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          size_sqft?: number | null
          subtype?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          availability?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          size_sqft?: number | null
          subtype?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      shops: {
        Row: {
          banner_image_url: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          logo_url: string | null
          name: string
          tags: string[] | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name: string
          tags?: string[] | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name?: string
          tags?: string[] | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      user_artist_relationships: {
        Row: {
          artist_id: string | null
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_artist_relationships_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_artist_relationships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_brand_relationships: {
        Row: {
          brand_id: string | null
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_brand_relationships_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_brand_relationships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_integrations: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string | null
          id: string
          integration_type: string
          is_active: boolean
          metadata: Json | null
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          integration_type: string
          is_active?: boolean
          metadata?: Json | null
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean
          metadata?: Json | null
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          amenities: string[] | null
          capacity: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          tags: string[] | null
          type: string | null
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: number
          message: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: never
          message?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: never
          message?: string | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_community_member_count: {
        Args: { community_id: string }
        Returns: number
      }
      get_community_post_count: {
        Args: { community_id: string }
        Returns: number
      }
      get_project_components: {
        Args: { p_project_id: string }
        Returns: {
          created_at: string
          dependencies: string[] | null
          description: string | null
          id: string
          name: string
          project_id: string
          status: string
          type: string
          updated_at: string
        }[]
      }
      get_project_tasks: {
        Args: { p_project_id: string }
        Returns: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }[]
      }
      get_table_definition: {
        Args: { table_name: string }
        Returns: {
          column_name: string
          data_type: string
          is_nullable: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id?: string
        }
        Returns: boolean
      }
      insert_project_component: {
        Args: {
          p_project_id: string
          p_name: string
          p_description: string
          p_status: string
          p_type: string
          p_dependencies: string[]
        }
        Returns: {
          created_at: string
          dependencies: string[] | null
          description: string | null
          id: string
          name: string
          project_id: string
          status: string
          type: string
          updated_at: string
        }
      }
      insert_project_task: {
        Args: {
          p_project_id: string
          p_title: string
          p_description: string
          p_status: string
          p_priority: string
          p_assigned_to: string
          p_due_date: string
        }
        Returns: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }
      }
      is_content_owner: {
        Args: {
          _content_id: string
          _content_type: Database["public"]["Enums"]["content_type"]
          _user_id?: string
        }
        Returns: boolean
      }
      search_discover_content: {
        Args: {
          content_type: string
          search_query?: string
          tag_filters?: string[]
        }
        Returns: Json
      }
      table_exists: {
        Args: { schema_name: string; table_name: string }
        Returns: boolean
      }
      update_project_component: {
        Args: {
          p_id: string
          p_name: string
          p_description: string
          p_status: string
          p_type: string
          p_dependencies: string[]
        }
        Returns: {
          created_at: string
          dependencies: string[] | null
          description: string | null
          id: string
          name: string
          project_id: string
          status: string
          type: string
          updated_at: string
        }
      }
      update_project_task: {
        Args: {
          p_id: string
          p_title: string
          p_description: string
          p_status: string
          p_priority: string
          p_assigned_to: string
          p_due_date: string
        }
        Returns: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }
      }
    }
    Enums: {
      content_type:
        | "project"
        | "event"
        | "resource"
        | "community"
        | "artist"
        | "venue"
        | "brand"
        | "shop"
      user_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_type: [
        "project",
        "event",
        "resource",
        "community",
        "artist",
        "venue",
        "brand",
        "shop",
      ],
      user_role: ["admin", "moderator", "user"],
    },
  },
} as const
