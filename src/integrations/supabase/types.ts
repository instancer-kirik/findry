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
          parent_brand_id: string | null
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
          parent_brand_id?: string | null
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
          parent_brand_id?: string | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_parent_brand_id_fkey"
            columns: ["parent_brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
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
      companies: {
        Row: {
          avg_rating: number | null
          created_at: string | null
          description: string | null
          id: string
          industry: string | null
          logo: string | null
          name: string
          parent_company_id: string | null
          trending_direction: string | null
          trending_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          avg_rating?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo?: string | null
          name: string
          parent_company_id?: string | null
          trending_direction?: string | null
          trending_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_rating?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo?: string | null
          name?: string
          parent_company_id?: string | null
          trending_direction?: string | null
          trending_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_comments: {
        Row: {
          author_id: string | null
          author_name: string | null
          company_id: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          text: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          text: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_comments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_controversies: {
        Row: {
          company_id: string
          created_at: string | null
          date: string | null
          id: string
          source: string | null
          title: string
          url: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          date?: string | null
          id?: string
          source?: string | null
          title: string
          url?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          date?: string | null
          id?: string
          source?: string | null
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_controversies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_ratings: {
        Row: {
          comment: string | null
          company_id: string
          created_at: string | null
          ethics: number | null
          id: string
          labor_practices: number | null
          overall_vibes: number | null
          sustainability: number | null
          transparency: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          company_id: string
          created_at?: string | null
          ethics?: number | null
          id?: string
          labor_practices?: number | null
          overall_vibes?: number | null
          sustainability?: number | null
          transparency?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          company_id?: string
          created_at?: string | null
          ethics?: number | null
          id?: string
          labor_practices?: number | null
          overall_vibes?: number | null
          sustainability?: number | null
          transparency?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_ratings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
        Relationships: [
          {
            foreignKeyName: "content_ownership_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cookie_phrases: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          phrase: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          phrase: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          phrase?: string
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
          created_by: string | null
          description: string | null
          end_date: string | null
          featured_artists: Json | null
          gallery_items: Json | null
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
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          featured_artists?: Json | null
          gallery_items?: Json | null
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
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          featured_artists?: Json | null
          gallery_items?: Json | null
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
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_jam_resources: {
        Row: {
          created_at: string
          description: string | null
          game_jam_id: string
          id: string
          name: string
          type: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          game_jam_id: string
          id?: string
          name: string
          type: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          game_jam_id?: string
          id?: string
          name?: string
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_jam_resources_game_jam_id_fkey"
            columns: ["game_jam_id"]
            isOneToOne: false
            referencedRelation: "game_jams"
            referencedColumns: ["id"]
          },
        ]
      }
      game_jam_roles: {
        Row: {
          created_at: string
          description: string | null
          game_jam_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          game_jam_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          game_jam_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_jam_roles_game_jam_id_fkey"
            columns: ["game_jam_id"]
            isOneToOne: false
            referencedRelation: "game_jams"
            referencedColumns: ["id"]
          },
        ]
      }
      game_jam_submissions: {
        Row: {
          created_at: string
          description: string | null
          game_jam_id: string
          id: string
          score: number | null
          status: string
          submitted_at: string | null
          team_id: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          game_jam_id: string
          id?: string
          score?: number | null
          status?: string
          submitted_at?: string | null
          team_id: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          game_jam_id?: string
          id?: string
          score?: number | null
          status?: string
          submitted_at?: string | null
          team_id?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_jam_submissions_game_jam_id_fkey"
            columns: ["game_jam_id"]
            isOneToOne: false
            referencedRelation: "game_jams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_jam_submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "game_jam_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      game_jam_team_members: {
        Row: {
          created_at: string
          id: string
          member_id: string
          member_name: string
          roles: string[] | null
          team_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          member_name: string
          roles?: string[] | null
          team_id: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          member_name?: string
          roles?: string[] | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_jam_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "game_jam_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      game_jam_teams: {
        Row: {
          created_at: string
          game_jam_id: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          game_jam_id: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          game_jam_id?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_jam_teams_game_jam_id_fkey"
            columns: ["game_jam_id"]
            isOneToOne: false
            referencedRelation: "game_jams"
            referencedColumns: ["id"]
          },
        ]
      }
      game_jams: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          name: string
          start_date: string
          status: Database["public"]["Enums"]["game_jam_status"]
          theme: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          name: string
          start_date: string
          status?: Database["public"]["Enums"]["game_jam_status"]
          theme: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["game_jam_status"]
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string
          id: string
          player_id: string
          score: number
          updated_at: string
          words_played: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          player_id: string
          score: number
          updated_at?: string
          words_played?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          player_id?: string
          score?: number
          updated_at?: string
          words_played?: string[] | null
        }
        Relationships: []
      }
      names: {
        Row: {
          aliases: string[] | null
          created_at: string
          id: string
          name: string
          tags: string[] | null
          type: string
          user_id: string
        }
        Insert: {
          aliases?: string[] | null
          created_at?: string
          id?: string
          name: string
          tags?: string[] | null
          type: string
          user_id: string
        }
        Update: {
          aliases?: string[] | null
          created_at?: string
          id?: string
          name?: string
          tags?: string[] | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "names_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string | null
          date: string
          excerpt: string | null
          id: string
          image: string | null
          slug: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string | null
          date: string
          excerpt?: string | null
          id?: string
          image?: string | null
          slug?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string | null
          date?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          slug?: string | null
          title?: string
          updated_at?: string | null
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
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          component_id: string | null
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
          component_id?: string | null
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
          component_id?: string | null
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
            foreignKeyName: "project_tasks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "project_components"
            referencedColumns: ["id"]
          },
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
          category: Database["public"]["Enums"]["project_category"] | null
          created_at: string
          description: string | null
          documentation_references: Json | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          progress: number | null
          repo_url: string | null
          source_control_details: Json | null
          status: string | null
          system_environment_info: Json | null
          tags: string[] | null
          timeline: string | null
          type: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          budget?: string | null
          category?: Database["public"]["Enums"]["project_category"] | null
          created_at?: string
          description?: string | null
          documentation_references?: Json | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          progress?: number | null
          repo_url?: string | null
          source_control_details?: Json | null
          status?: string | null
          system_environment_info?: Json | null
          tags?: string[] | null
          timeline?: string | null
          type?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          budget?: string | null
          category?: Database["public"]["Enums"]["project_category"] | null
          created_at?: string
          description?: string | null
          documentation_references?: Json | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          progress?: number | null
          repo_url?: string | null
          source_control_details?: Json | null
          status?: string | null
          system_environment_info?: Json | null
          tags?: string[] | null
          timeline?: string | null
          type?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      redirect_sources: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          source_key: string
          source_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          source_key: string
          source_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          source_key?: string
          source_name?: string
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
      snack_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          snack_id: string
          status: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          snack_id: string
          status?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          snack_id?: string
          status?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "snack_ratings_snack_id_fkey"
            columns: ["snack_id"]
            isOneToOne: false
            referencedRelation: "snacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snack_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      snacks: {
        Row: {
          brand_id: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          brand_id?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          brand_id?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "snacks_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snacks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      topshelf_faves: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          notes: string | null
          pairings: string[] | null
          snack_id: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          pairings?: string[] | null
          snack_id: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          pairings?: string[] | null
          snack_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topshelf_faves_snack_id_fkey"
            columns: ["snack_id"]
            isOneToOne: false
            referencedRelation: "snacks"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      words: {
        Row: {
          added_by: string | null
          added_by_username: string | null
          created_at: string
          definition: string | null
          id: string
          updated_at: string
          word: string
        }
        Insert: {
          added_by?: string | null
          added_by_username?: string | null
          created_at?: string
          definition?: string | null
          id?: string
          updated_at?: string
          word: string
        }
        Update: {
          added_by?: string | null
          added_by_username?: string | null
          created_at?: string
          definition?: string | null
          id?: string
          updated_at?: string
          word?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string | null
          username: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_company_avg_rating: {
        Args: { company_id: string }
        Returns: number
      }
      get_average_rating: {
        Args: { snack_id: string }
        Returns: number
      }
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
          component_id: string | null
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
          component_id: string | null
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
          component_id: string | null
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
      game_jam_status: "upcoming" | "active" | "completed"
      project_category:
        | "web_application"
        | "mobile_application"
        | "desktop_application"
        | "game"
        | "library_or_framework"
        | "api_service"
        | "hardware_or_iot"
        | "data_science_or_ml"
        | "creative_asset_blender"
        | "creative_asset_other"
        | "script_or_utility"
        | "documentation"
        | "research"
        | "other"
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
      game_jam_status: ["upcoming", "active", "completed"],
      project_category: [
        "web_application",
        "mobile_application",
        "desktop_application",
        "game",
        "library_or_framework",
        "api_service",
        "hardware_or_iot",
        "data_science_or_ml",
        "creative_asset_blender",
        "creative_asset_other",
        "script_or_utility",
        "documentation",
        "research",
        "other",
      ],
      user_role: ["admin", "moderator", "user"],
    },
  },
} as const
