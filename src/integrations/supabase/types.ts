export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      context_drops: {
        Row: {
          annotation_count: number | null
          annotations: Json | null
          conversation_context: string | null
          created_at: string
          description: string | null
          id: string
          message_count: number | null
          metadata: Json
          name: string
          participant_count: number | null
          participants: string[]
          raw_content: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          annotation_count?: number | null
          annotations?: Json | null
          conversation_context?: string | null
          created_at?: string
          description?: string | null
          id?: string
          message_count?: number | null
          metadata?: Json
          name: string
          participant_count?: number | null
          participants?: string[]
          raw_content: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          annotation_count?: number | null
          annotations?: Json | null
          conversation_context?: string | null
          created_at?: string
          description?: string | null
          id?: string
          message_count?: number | null
          metadata?: Json
          name?: string
          participant_count?: number | null
          participants?: string[]
          raw_content?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
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
      ingredients: {
        Row: {
          alternatives: string[] | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_common: boolean | null
          name: string
          snack_id: string | null
          updated_at: string | null
        }
        Insert: {
          alternatives?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_common?: boolean | null
          name: string
          snack_id?: string | null
          updated_at?: string | null
        }
        Update: {
          alternatives?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_common?: boolean | null
          name?: string
          snack_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_snack_id_fkey"
            columns: ["snack_id"]
            isOneToOne: false
            referencedRelation: "snacks"
            referencedColumns: ["id"]
          },
        ]
      }
      item_pairings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          item1_id: string | null
          item2_id: string | null
          notes: string | null
          occasion: string | null
          pairing_type: string | null
          rating: number | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
          would_recommend: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          item1_id?: string | null
          item2_id?: string | null
          notes?: string | null
          occasion?: string | null
          pairing_type?: string | null
          rating?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          would_recommend?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          item1_id?: string | null
          item2_id?: string | null
          notes?: string | null
          occasion?: string | null
          pairing_type?: string | null
          rating?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "item_pairings_item1_id_fkey"
            columns: ["item1_id"]
            isOneToOne: false
            referencedRelation: "snacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_pairings_item2_id_fkey"
            columns: ["item2_id"]
            isOneToOne: false
            referencedRelation: "snacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_pairings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_character_abilities: {
        Row: {
          ability_source_id: string | null
          ability_source_type: string
          acquired_year: number | null
          character_id: string
          created_at: string | null
          id: string
          notes: string | null
          proficiency_level: number
          updated_at: string | null
        }
        Insert: {
          ability_source_id?: string | null
          ability_source_type: string
          acquired_year?: number | null
          character_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          proficiency_level?: number
          updated_at?: string | null
        }
        Update: {
          ability_source_id?: string | null
          ability_source_type?: string
          acquired_year?: number | null
          character_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          proficiency_level?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_character_abilities_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "loreum_characters"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_character_instances: {
        Row: {
          character_id: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          timeline_id: string
          updated_at: string | null
          variation_notes: string | null
        }
        Insert: {
          character_id: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          timeline_id: string
          updated_at?: string | null
          variation_notes?: string | null
        }
        Update: {
          character_id?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          timeline_id?: string
          updated_at?: string | null
          variation_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_character_instances_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "loreum_characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_character_instances_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "loreum_timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_characters: {
        Row: {
          abilities: string[] | null
          affiliations: string[] | null
          birth_year: number
          created_at: string | null
          death_year: number | null
          description: string
          equipment: string[] | null
          id: string
          name: string
          narrative_roles: string[] | null
          relationships: Json | null
          species: string
          tags: string[] | null
          updated_at: string | null
          voice_profile: Json | null
        }
        Insert: {
          abilities?: string[] | null
          affiliations?: string[] | null
          birth_year: number
          created_at?: string | null
          death_year?: number | null
          description: string
          equipment?: string[] | null
          id?: string
          name: string
          narrative_roles?: string[] | null
          relationships?: Json | null
          species: string
          tags?: string[] | null
          updated_at?: string | null
          voice_profile?: Json | null
        }
        Update: {
          abilities?: string[] | null
          affiliations?: string[] | null
          birth_year?: number
          created_at?: string | null
          death_year?: number | null
          description?: string
          equipment?: string[] | null
          id?: string
          name?: string
          narrative_roles?: string[] | null
          relationships?: Json | null
          species?: string
          tags?: string[] | null
          updated_at?: string | null
          voice_profile?: Json | null
        }
        Relationships: []
      }
      loreum_civilizations: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          population_dynamics: Json | null
          updated_at: string | null
          world_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          population_dynamics?: Json | null
          updated_at?: string | null
          world_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          population_dynamics?: Json | null
          updated_at?: string | null
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_civilizations_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "loreum_worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_creative_sessions: {
        Row: {
          activity_type: string
          breakthrough_moments: string | null
          created_at: string | null
          flow_state_rating: number | null
          id: string
          mood_rating: number | null
          productivity_rating: number | null
          session_end: string | null
          session_notes: string | null
          session_start: string | null
          starting_word_count: number | null
          updated_at: string | null
          words_edited: number | null
          words_written: number | null
          work_id: string
        }
        Insert: {
          activity_type?: string
          breakthrough_moments?: string | null
          created_at?: string | null
          flow_state_rating?: number | null
          id?: string
          mood_rating?: number | null
          productivity_rating?: number | null
          session_end?: string | null
          session_notes?: string | null
          session_start?: string | null
          starting_word_count?: number | null
          updated_at?: string | null
          words_edited?: number | null
          words_written?: number | null
          work_id: string
        }
        Update: {
          activity_type?: string
          breakthrough_moments?: string | null
          created_at?: string | null
          flow_state_rating?: number | null
          id?: string
          mood_rating?: number | null
          productivity_rating?: number | null
          session_end?: string | null
          session_notes?: string | null
          session_start?: string | null
          starting_word_count?: number | null
          updated_at?: string | null
          words_edited?: number | null
          words_written?: number | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_creative_sessions_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "loreum_creative_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_sessions_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "loreum_discoverable_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_sessions_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "loreum_creative_sessions_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "loreum_creative_sessions_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "loreum_writing_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_creative_works: {
        Row: {
          collection: string | null
          content: string | null
          content_format: string | null
          created_at: string | null
          creative_type: string
          description: string | null
          external_links: Json | null
          featured_characters: string[] | null
          genre: string | null
          id: string
          is_public: boolean | null
          mood: string | null
          notes: Json | null
          outline: string | null
          parent_work_id: string | null
          pov_character_id: string | null
          primary_location_id: string | null
          referenced_cultures: string[] | null
          referenced_events: string[] | null
          referenced_locations: string[] | null
          sequence_number: number | null
          status: string | null
          style_notes: string | null
          summary: string | null
          tags: string[] | null
          target_word_count: number | null
          themes: string[] | null
          timeline_id: string | null
          title: string
          tone: string | null
          updated_at: string | null
          word_count: number | null
          world_id: string | null
        }
        Insert: {
          collection?: string | null
          content?: string | null
          content_format?: string | null
          created_at?: string | null
          creative_type: string
          description?: string | null
          external_links?: Json | null
          featured_characters?: string[] | null
          genre?: string | null
          id?: string
          is_public?: boolean | null
          mood?: string | null
          notes?: Json | null
          outline?: string | null
          parent_work_id?: string | null
          pov_character_id?: string | null
          primary_location_id?: string | null
          referenced_cultures?: string[] | null
          referenced_events?: string[] | null
          referenced_locations?: string[] | null
          sequence_number?: number | null
          status?: string | null
          style_notes?: string | null
          summary?: string | null
          tags?: string[] | null
          target_word_count?: number | null
          themes?: string[] | null
          timeline_id?: string | null
          title: string
          tone?: string | null
          updated_at?: string | null
          word_count?: number | null
          world_id?: string | null
        }
        Update: {
          collection?: string | null
          content?: string | null
          content_format?: string | null
          created_at?: string | null
          creative_type?: string
          description?: string | null
          external_links?: Json | null
          featured_characters?: string[] | null
          genre?: string | null
          id?: string
          is_public?: boolean | null
          mood?: string | null
          notes?: Json | null
          outline?: string | null
          parent_work_id?: string | null
          pov_character_id?: string | null
          primary_location_id?: string | null
          referenced_cultures?: string[] | null
          referenced_events?: string[] | null
          referenced_locations?: string[] | null
          sequence_number?: number | null
          status?: string | null
          style_notes?: string | null
          summary?: string | null
          tags?: string[] | null
          target_word_count?: number | null
          themes?: string[] | null
          timeline_id?: string | null
          title?: string
          tone?: string | null
          updated_at?: string | null
          word_count?: number | null
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_creative_works_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_creative_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_discoverable_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "loreum_creative_works_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "loreum_creative_works_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_writing_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_pov_character_id_fkey"
            columns: ["pov_character_id"]
            isOneToOne: false
            referencedRelation: "loreum_characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_primary_location_id_fkey"
            columns: ["primary_location_id"]
            isOneToOne: false
            referencedRelation: "loreum_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "loreum_timelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "loreum_worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_culture_instances: {
        Row: {
          created_at: string | null
          dominant_species: string[] | null
          historical_evolution: Json | null
          id: string
          influential_regions: string[] | null
          population_influence: number | null
          primary_civilization_id: string | null
          regional_variations: Json | null
          template_instance_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dominant_species?: string[] | null
          historical_evolution?: Json | null
          id?: string
          influential_regions?: string[] | null
          population_influence?: number | null
          primary_civilization_id?: string | null
          regional_variations?: Json | null
          template_instance_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dominant_species?: string[] | null
          historical_evolution?: Json | null
          id?: string
          influential_regions?: string[] | null
          population_influence?: number | null
          primary_civilization_id?: string | null
          regional_variations?: Json | null
          template_instance_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_culture_instances_primary_civilization_id_fkey"
            columns: ["primary_civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_culture_instances_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_culture_instances_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances_with_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_enchantments: {
        Row: {
          associated_magic_system: string | null
          created_at: string | null
          description: string
          effect: Json | null
          id: string
          item_tags: string[] | null
          name: string
          updated_at: string | null
        }
        Insert: {
          associated_magic_system?: string | null
          created_at?: string | null
          description: string
          effect?: Json | null
          id?: string
          item_tags?: string[] | null
          name: string
          updated_at?: string | null
        }
        Update: {
          associated_magic_system?: string | null
          created_at?: string | null
          description?: string
          effect?: Json | null
          id?: string
          item_tags?: string[] | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_enchantments_associated_magic_system_fkey"
            columns: ["associated_magic_system"]
            isOneToOne: false
            referencedRelation: "loreum_magic_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_governments: {
        Row: {
          civilization_id: string
          created_at: string | null
          description: string
          end_year: number | null
          id: string
          leaders: string[] | null
          name: string
          start_year: number
          structure: string
          type: string
          updated_at: string | null
        }
        Insert: {
          civilization_id: string
          created_at?: string | null
          description: string
          end_year?: number | null
          id?: string
          leaders?: string[] | null
          name: string
          start_year: number
          structure: string
          type: string
          updated_at?: string | null
        }
        Update: {
          civilization_id?: string
          created_at?: string | null
          description?: string
          end_year?: number | null
          id?: string
          leaders?: string[] | null
          name?: string
          start_year?: number
          structure?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_governments_civilization_id_fkey"
            columns: ["civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_instance_usage_tracking: {
        Row: {
          access_timestamp: string | null
          accessed_by: string | null
          id: string
          template_instance_id: string
          usage_context: string | null
          usage_type: string
        }
        Insert: {
          access_timestamp?: string | null
          accessed_by?: string | null
          id?: string
          template_instance_id: string
          usage_context?: string | null
          usage_type: string
        }
        Update: {
          access_timestamp?: string | null
          accessed_by?: string | null
          id?: string
          template_instance_id?: string
          usage_context?: string | null
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_instance_usage_tracking_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_instance_usage_tracking_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances_with_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_ipsumarium_templates: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_deprecated: boolean | null
          metadata: Json | null
          name: string
          parent_template_id: string | null
          tags: string[] | null
          template_category: string | null
          type: string
          updated_at: string | null
          version: number | null
          version_notes: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_deprecated?: boolean | null
          metadata?: Json | null
          name: string
          parent_template_id?: string | null
          tags?: string[] | null
          template_category?: string | null
          type: string
          updated_at?: string | null
          version?: number | null
          version_notes?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_deprecated?: boolean | null
          metadata?: Json | null
          name?: string
          parent_template_id?: string | null
          tags?: string[] | null
          template_category?: string | null
          type?: string
          updated_at?: string | null
          version?: number | null
          version_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_ipsumarium_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "loreum_ipsumarium_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_ipsumarium_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_discovery"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_item_enchantments: {
        Row: {
          applied_by: string | null
          applied_year: number | null
          conditions: Json | null
          created_at: string | null
          enchantment_id: string
          id: string
          item_id: string
          strength_modifier: number | null
          updated_at: string | null
        }
        Insert: {
          applied_by?: string | null
          applied_year?: number | null
          conditions?: Json | null
          created_at?: string | null
          enchantment_id: string
          id?: string
          item_id: string
          strength_modifier?: number | null
          updated_at?: string | null
        }
        Update: {
          applied_by?: string | null
          applied_year?: number | null
          conditions?: Json | null
          created_at?: string | null
          enchantment_id?: string
          id?: string
          item_id?: string
          strength_modifier?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_item_enchantments_applied_by_fkey"
            columns: ["applied_by"]
            isOneToOne: false
            referencedRelation: "loreum_characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_item_enchantments_enchantment_id_fkey"
            columns: ["enchantment_id"]
            isOneToOne: false
            referencedRelation: "loreum_enchantments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_item_enchantments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "loreum_items"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_item_instances: {
        Row: {
          applied_enchantments: string[] | null
          condition_rating: number | null
          created_at: string | null
          created_by_civilization_id: string | null
          current_location: string | null
          current_owner_character_id: string | null
          current_owner_civilization_id: string | null
          id: string
          ownership_history: Json | null
          physical_modifications: string[] | null
          quantity: number | null
          template_instance_id: string
          updated_at: string | null
        }
        Insert: {
          applied_enchantments?: string[] | null
          condition_rating?: number | null
          created_at?: string | null
          created_by_civilization_id?: string | null
          current_location?: string | null
          current_owner_character_id?: string | null
          current_owner_civilization_id?: string | null
          id?: string
          ownership_history?: Json | null
          physical_modifications?: string[] | null
          quantity?: number | null
          template_instance_id: string
          updated_at?: string | null
        }
        Update: {
          applied_enchantments?: string[] | null
          condition_rating?: number | null
          created_at?: string | null
          created_by_civilization_id?: string | null
          current_location?: string | null
          current_owner_character_id?: string | null
          current_owner_civilization_id?: string | null
          id?: string
          ownership_history?: Json | null
          physical_modifications?: string[] | null
          quantity?: number | null
          template_instance_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_item_instances_created_by_civilization_id_fkey"
            columns: ["created_by_civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_item_instances_current_owner_character_id_fkey"
            columns: ["current_owner_character_id"]
            isOneToOne: false
            referencedRelation: "loreum_characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_item_instances_current_owner_civilization_id_fkey"
            columns: ["current_owner_civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_item_instances_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_item_instances_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances_with_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_items: {
        Row: {
          associated_tech: string | null
          created_at: string | null
          description: string
          enchantments: Json | null
          id: string
          name: string
          tags: string[] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          associated_tech?: string | null
          created_at?: string | null
          description: string
          enchantments?: Json | null
          id?: string
          name: string
          tags?: string[] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          associated_tech?: string | null
          created_at?: string | null
          description?: string
          enchantments?: Json | null
          id?: string
          name?: string
          tags?: string[] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_items_associated_tech_fkey"
            columns: ["associated_tech"]
            isOneToOne: false
            referencedRelation: "loreum_tech_trees"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_lore_nodes: {
        Row: {
          causality: Json | null
          connections: Json | null
          created_at: string | null
          description: string
          id: string
          name: string
          type: string
          updated_at: string | null
          world_id: string | null
          year: number | null
        }
        Insert: {
          causality?: Json | null
          connections?: Json | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          type: string
          updated_at?: string | null
          world_id?: string | null
          year?: number | null
        }
        Update: {
          causality?: Json | null
          connections?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
          world_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_lore_nodes_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "loreum_worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_magic_abilities: {
        Row: {
          ability_level: number
          cost_structure: Json | null
          created_at: string | null
          description: string
          effects: Json | null
          id: string
          magic_system_id: string
          name: string
          prerequisites: Json | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          ability_level?: number
          cost_structure?: Json | null
          created_at?: string | null
          description: string
          effects?: Json | null
          id?: string
          magic_system_id: string
          name: string
          prerequisites?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          ability_level?: number
          cost_structure?: Json | null
          created_at?: string | null
          description?: string
          effects?: Json | null
          id?: string
          magic_system_id?: string
          name?: string
          prerequisites?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_magic_abilities_magic_system_id_fkey"
            columns: ["magic_system_id"]
            isOneToOne: false
            referencedRelation: "loreum_magic_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_magic_progression_rules: {
        Row: {
          advancement_rules: Json | null
          created_at: string | null
          description: string
          id: string
          level_requirements: Json | null
          magic_system_id: string
          name: string
          progression_type: string
          updated_at: string | null
        }
        Insert: {
          advancement_rules?: Json | null
          created_at?: string | null
          description: string
          id?: string
          level_requirements?: Json | null
          magic_system_id: string
          name: string
          progression_type: string
          updated_at?: string | null
        }
        Update: {
          advancement_rules?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          level_requirements?: Json | null
          magic_system_id?: string
          name?: string
          progression_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_magic_progression_rules_magic_system_id_fkey"
            columns: ["magic_system_id"]
            isOneToOne: false
            referencedRelation: "loreum_magic_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_magic_system_instances: {
        Row: {
          associated_characters: string[] | null
          created_at: string | null
          cultural_integration_level: string | null
          id: string
          local_rules_modifications: Json | null
          power_level: number | null
          practitioner_population: number | null
          primary_civilization_id: string | null
          template_instance_id: string
          updated_at: string | null
        }
        Insert: {
          associated_characters?: string[] | null
          created_at?: string | null
          cultural_integration_level?: string | null
          id?: string
          local_rules_modifications?: Json | null
          power_level?: number | null
          practitioner_population?: number | null
          primary_civilization_id?: string | null
          template_instance_id: string
          updated_at?: string | null
        }
        Update: {
          associated_characters?: string[] | null
          created_at?: string | null
          cultural_integration_level?: string | null
          id?: string
          local_rules_modifications?: Json | null
          power_level?: number | null
          practitioner_population?: number | null
          primary_civilization_id?: string | null
          template_instance_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_magic_system_instances_primary_civilization_id_fkey"
            columns: ["primary_civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_magic_system_instances_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_magic_system_instances_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances_with_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_magic_systems: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          rules: Json | null
          source: string
          structure: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          rules?: Json | null
          source: string
          structure: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          rules?: Json | null
          source?: string
          structure?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loreum_multiverses: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      loreum_plot_thread_works: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          plot_thread_id: string
          relationship_type: string
          significance: number | null
          updated_at: string | null
          work_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          plot_thread_id: string
          relationship_type: string
          significance?: number | null
          updated_at?: string | null
          work_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          plot_thread_id?: string
          relationship_type?: string
          significance?: number | null
          updated_at?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_plot_thread_works_plot_thread_id_fkey"
            columns: ["plot_thread_id"]
            isOneToOne: false
            referencedRelation: "loreum_plot_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_thread_works_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "loreum_creative_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_thread_works_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "loreum_discoverable_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_thread_works_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "loreum_plot_thread_works_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "loreum_plot_thread_works_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "loreum_writing_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_plot_threads: {
        Row: {
          created_at: string | null
          description: string
          id: string
          obstacles: Json | null
          primary_work_id: string | null
          priority: number | null
          related_characters: string[] | null
          related_events: string[] | null
          related_locations: string[] | null
          resolution_notes: string | null
          resolves_in_work_id: string | null
          stakes: Json | null
          starts_in_work_id: string | null
          status: string | null
          thread_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          obstacles?: Json | null
          primary_work_id?: string | null
          priority?: number | null
          related_characters?: string[] | null
          related_events?: string[] | null
          related_locations?: string[] | null
          resolution_notes?: string | null
          resolves_in_work_id?: string | null
          stakes?: Json | null
          starts_in_work_id?: string | null
          status?: string | null
          thread_type?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          obstacles?: Json | null
          primary_work_id?: string | null
          priority?: number | null
          related_characters?: string[] | null
          related_events?: string[] | null
          related_locations?: string[] | null
          resolution_notes?: string | null
          resolves_in_work_id?: string | null
          stakes?: Json | null
          starts_in_work_id?: string | null
          status?: string | null
          thread_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_plot_threads_primary_work_id_fkey"
            columns: ["primary_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_creative_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_primary_work_id_fkey"
            columns: ["primary_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_discoverable_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_primary_work_id_fkey"
            columns: ["primary_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_primary_work_id_fkey"
            columns: ["primary_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_primary_work_id_fkey"
            columns: ["primary_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_writing_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_resolves_in_work_id_fkey"
            columns: ["resolves_in_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_creative_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_resolves_in_work_id_fkey"
            columns: ["resolves_in_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_discoverable_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_resolves_in_work_id_fkey"
            columns: ["resolves_in_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_resolves_in_work_id_fkey"
            columns: ["resolves_in_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_resolves_in_work_id_fkey"
            columns: ["resolves_in_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_writing_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_starts_in_work_id_fkey"
            columns: ["starts_in_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_creative_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_starts_in_work_id_fkey"
            columns: ["starts_in_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_discoverable_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_starts_in_work_id_fkey"
            columns: ["starts_in_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_starts_in_work_id_fkey"
            columns: ["starts_in_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "loreum_plot_threads_starts_in_work_id_fkey"
            columns: ["starts_in_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_writing_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_powers: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          power_type: string
          requirements: Json | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          power_type: string
          requirements?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          power_type?: string
          requirements?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loreum_regions: {
        Row: {
          area: number
          climate: string
          coordinates: Json | null
          created_at: string | null
          description: string
          id: string
          name: string
          resources: Json | null
          terrain: Json | null
          updated_at: string | null
          world_id: string
        }
        Insert: {
          area: number
          climate: string
          coordinates?: Json | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          resources?: Json | null
          terrain?: Json | null
          updated_at?: string | null
          world_id: string
        }
        Update: {
          area?: number
          climate?: string
          coordinates?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          resources?: Json | null
          terrain?: Json | null
          updated_at?: string | null
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_regions_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "loreum_worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_species: {
        Row: {
          average_lifespan: number
          biology: string
          civilization_id: string | null
          created_at: string | null
          description: string
          id: string
          intelligence: number
          name: string
          physical_capabilities: Json | null
          reproduction_method: string
          social_structure: string
          traits: string[] | null
          updated_at: string | null
        }
        Insert: {
          average_lifespan: number
          biology: string
          civilization_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          intelligence: number
          name: string
          physical_capabilities?: Json | null
          reproduction_method: string
          social_structure: string
          traits?: string[] | null
          updated_at?: string | null
        }
        Update: {
          average_lifespan?: number
          biology?: string
          civilization_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          intelligence?: number
          name?: string
          physical_capabilities?: Json | null
          reproduction_method?: string
          social_structure?: string
          traits?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_species_civilization_id_fkey"
            columns: ["civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_species_instances: {
        Row: {
          adaptation_traits: string[] | null
          created_at: string | null
          cultural_modifications: string[] | null
          environmental_adaptations: Json | null
          homeworld_region_id: string | null
          id: string
          local_population: number | null
          primary_civilization_id: string | null
          template_instance_id: string
          updated_at: string | null
        }
        Insert: {
          adaptation_traits?: string[] | null
          created_at?: string | null
          cultural_modifications?: string[] | null
          environmental_adaptations?: Json | null
          homeworld_region_id?: string | null
          id?: string
          local_population?: number | null
          primary_civilization_id?: string | null
          template_instance_id: string
          updated_at?: string | null
        }
        Update: {
          adaptation_traits?: string[] | null
          created_at?: string | null
          cultural_modifications?: string[] | null
          environmental_adaptations?: Json | null
          homeworld_region_id?: string | null
          id?: string
          local_population?: number | null
          primary_civilization_id?: string | null
          template_instance_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_species_instances_homeworld_region_id_fkey"
            columns: ["homeworld_region_id"]
            isOneToOne: false
            referencedRelation: "loreum_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_species_instances_primary_civilization_id_fkey"
            columns: ["primary_civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_species_instances_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_species_instances_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances_with_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_star_systems: {
        Row: {
          controlling_faction: string | null
          coordinates: Json | null
          created_at: string | null
          description: string
          id: string
          name: string
          planets: Json | null
          star_type: string
          travel_routes: Json | null
          universe_id: string
          updated_at: string | null
        }
        Insert: {
          controlling_faction?: string | null
          coordinates?: Json | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          planets?: Json | null
          star_type: string
          travel_routes?: Json | null
          universe_id: string
          updated_at?: string | null
        }
        Update: {
          controlling_faction?: string | null
          coordinates?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          planets?: Json | null
          star_type?: string
          travel_routes?: Json | null
          universe_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_star_systems_universe_id_fkey"
            columns: ["universe_id"]
            isOneToOne: false
            referencedRelation: "loreum_universes"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_tech_trees: {
        Row: {
          civilization_id: string | null
          created_at: string | null
          description: string
          domains: Json | null
          id: string
          is_magical: boolean | null
          magic_domains: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          civilization_id?: string | null
          created_at?: string | null
          description: string
          domains?: Json | null
          id?: string
          is_magical?: boolean | null
          magic_domains?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          civilization_id?: string | null
          created_at?: string | null
          description?: string
          domains?: Json | null
          id?: string
          is_magical?: boolean | null
          magic_domains?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_tech_trees_civilization_id_fkey"
            columns: ["civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_technology_instances: {
        Row: {
          created_at: string | null
          developed_by_civilization_id: string | null
          development_level: number | null
          efficiency_rating: number | null
          id: string
          implementation_date: number | null
          local_modifications: string[] | null
          prerequisite_tech_instances: string[] | null
          template_instance_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          developed_by_civilization_id?: string | null
          development_level?: number | null
          efficiency_rating?: number | null
          id?: string
          implementation_date?: number | null
          local_modifications?: string[] | null
          prerequisite_tech_instances?: string[] | null
          template_instance_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          developed_by_civilization_id?: string | null
          development_level?: number | null
          efficiency_rating?: number | null
          id?: string
          implementation_date?: number | null
          local_modifications?: string[] | null
          prerequisite_tech_instances?: string[] | null
          template_instance_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_technology_instances_developed_by_civilization_id_fkey"
            columns: ["developed_by_civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_technology_instances_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_technology_instances_template_instance_id_fkey"
            columns: ["template_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances_with_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_template_analytics: {
        Row: {
          context_data: Json | null
          id: string
          metric_type: string
          metric_value: number | null
          recorded_at: string | null
          template_id: string
          user_identifier: string | null
        }
        Insert: {
          context_data?: Json | null
          id?: string
          metric_type: string
          metric_value?: number | null
          recorded_at?: string | null
          template_id: string
          user_identifier?: string | null
        }
        Update: {
          context_data?: Json | null
          id?: string
          metric_type?: string
          metric_value?: number | null
          recorded_at?: string | null
          template_id?: string
          user_identifier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_template_analytics_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "loreum_ipsumarium_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_analytics_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_discovery"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_template_collection_memberships: {
        Row: {
          collection_id: string
          created_at: string | null
          id: string
          membership_role: string | null
          notes: string | null
          sort_order: number | null
          template_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          id?: string
          membership_role?: string | null
          notes?: string | null
          sort_order?: number | null
          template_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          id?: string
          membership_role?: string | null
          notes?: string | null
          sort_order?: number | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_template_collection_memberships_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_collection_memberships_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "loreum_ipsumarium_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_collection_memberships_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_discovery"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_template_collections: {
        Row: {
          collection_type: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          name: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          collection_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          collection_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loreum_template_instance_relationships: {
        Row: {
          created_at: string | null
          description: string | null
          established_year: number | null
          id: string
          relationship_strength: number | null
          relationship_type: string
          source_instance_id: string
          target_instance_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          id?: string
          relationship_strength?: number | null
          relationship_type: string
          source_instance_id: string
          target_instance_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          id?: string
          relationship_strength?: number | null
          relationship_type?: string
          source_instance_id?: string
          target_instance_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_template_instance_relationships_source_instance_id_fkey"
            columns: ["source_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instance_relationships_source_instance_id_fkey"
            columns: ["source_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances_with_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instance_relationships_target_instance_id_fkey"
            columns: ["target_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instance_relationships_target_instance_id_fkey"
            columns: ["target_instance_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_instances_with_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_template_instances: {
        Row: {
          civilization_id: string | null
          created_at: string | null
          created_by_character_id: string | null
          discovered_year: number | null
          id: string
          instance_description: string | null
          instance_name: string
          local_variations: Json | null
          multiverse_id: string | null
          notes: string | null
          origin_location: string | null
          override_metadata: Json | null
          status: string | null
          tags: string[] | null
          template_id: string
          timeline_id: string | null
          universe_id: string | null
          updated_at: string | null
          world_id: string | null
        }
        Insert: {
          civilization_id?: string | null
          created_at?: string | null
          created_by_character_id?: string | null
          discovered_year?: number | null
          id?: string
          instance_description?: string | null
          instance_name: string
          local_variations?: Json | null
          multiverse_id?: string | null
          notes?: string | null
          origin_location?: string | null
          override_metadata?: Json | null
          status?: string | null
          tags?: string[] | null
          template_id: string
          timeline_id?: string | null
          universe_id?: string | null
          updated_at?: string | null
          world_id?: string | null
        }
        Update: {
          civilization_id?: string | null
          created_at?: string | null
          created_by_character_id?: string | null
          discovered_year?: number | null
          id?: string
          instance_description?: string | null
          instance_name?: string
          local_variations?: Json | null
          multiverse_id?: string | null
          notes?: string | null
          origin_location?: string | null
          override_metadata?: Json | null
          status?: string | null
          tags?: string[] | null
          template_id?: string
          timeline_id?: string | null
          universe_id?: string | null
          updated_at?: string | null
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_template_instances_civilization_id_fkey"
            columns: ["civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_created_by_character_id_fkey"
            columns: ["created_by_character_id"]
            isOneToOne: false
            referencedRelation: "loreum_characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_multiverse_id_fkey"
            columns: ["multiverse_id"]
            isOneToOne: false
            referencedRelation: "loreum_multiverses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "loreum_ipsumarium_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_discovery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "loreum_timelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_universe_id_fkey"
            columns: ["universe_id"]
            isOneToOne: false
            referencedRelation: "loreum_universes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "loreum_worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_template_relationships: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_bidirectional: boolean | null
          relationship_strength: number | null
          relationship_type: string
          source_template_id: string
          target_template_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_bidirectional?: boolean | null
          relationship_strength?: number | null
          relationship_type: string
          source_template_id: string
          target_template_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_bidirectional?: boolean | null
          relationship_strength?: number | null
          relationship_type?: string
          source_template_id?: string
          target_template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_template_relationships_source_template_id_fkey"
            columns: ["source_template_id"]
            isOneToOne: false
            referencedRelation: "loreum_ipsumarium_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_relationships_source_template_id_fkey"
            columns: ["source_template_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_discovery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_relationships_target_template_id_fkey"
            columns: ["target_template_id"]
            isOneToOne: false
            referencedRelation: "loreum_ipsumarium_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_relationships_target_template_id_fkey"
            columns: ["target_template_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_discovery"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_timelines: {
        Row: {
          created_at: string | null
          description: string
          end_year: number | null
          fork_point: Json | null
          id: string
          name: string
          start_year: number
          universe_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          end_year?: number | null
          fork_point?: Json | null
          id?: string
          name: string
          start_year: number
          universe_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          end_year?: number | null
          fork_point?: Json | null
          id?: string
          name?: string
          start_year?: number
          universe_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_timelines_universe_id_fkey"
            columns: ["universe_id"]
            isOneToOne: false
            referencedRelation: "loreum_universes"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_universes: {
        Row: {
          created_at: string | null
          description: string
          id: string
          multiverse_id: string
          name: string
          physical_laws: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          multiverse_id: string
          name: string
          physical_laws?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          multiverse_id?: string
          name?: string
          physical_laws?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_universes_multiverse_id_fkey"
            columns: ["multiverse_id"]
            isOneToOne: false
            referencedRelation: "loreum_multiverses"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_work_discovery: {
        Row: {
          all_tags: string[] | null
          child_count: number | null
          completed_child_count: number | null
          completion_percentage: number | null
          created_at: string | null
          creative_type: string
          depth: number
          direct_word_count: number | null
          full_path: string
          has_outline: boolean | null
          has_summary: boolean | null
          id: string
          last_modified: string | null
          last_session: string | null
          parent_work_id: string | null
          root_work_id: string | null
          searchable_content: string | null
          session_count: number | null
          title: string
          total_word_count: number | null
          total_writing_time_hours: number | null
          updated_at: string | null
          work_id: string
          work_length: string | null
          work_medium: string | null
          work_status: string
        }
        Insert: {
          all_tags?: string[] | null
          child_count?: number | null
          completed_child_count?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          creative_type: string
          depth?: number
          direct_word_count?: number | null
          full_path: string
          has_outline?: boolean | null
          has_summary?: boolean | null
          id?: string
          last_modified?: string | null
          last_session?: string | null
          parent_work_id?: string | null
          root_work_id?: string | null
          searchable_content?: string | null
          session_count?: number | null
          title: string
          total_word_count?: number | null
          total_writing_time_hours?: number | null
          updated_at?: string | null
          work_id: string
          work_length?: string | null
          work_medium?: string | null
          work_status: string
        }
        Update: {
          all_tags?: string[] | null
          child_count?: number | null
          completed_child_count?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          creative_type?: string
          depth?: number
          direct_word_count?: number | null
          full_path?: string
          has_outline?: boolean | null
          has_summary?: boolean | null
          id?: string
          last_modified?: string | null
          last_session?: string | null
          parent_work_id?: string | null
          root_work_id?: string | null
          searchable_content?: string | null
          session_count?: number | null
          title?: string
          total_word_count?: number | null
          total_writing_time_hours?: number | null
          updated_at?: string | null
          work_id?: string
          work_length?: string | null
          work_medium?: string | null
          work_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_work_discovery_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_creative_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_discoverable_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_writing_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_root_work_id_fkey"
            columns: ["root_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_creative_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_root_work_id_fkey"
            columns: ["root_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_discoverable_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_root_work_id_fkey"
            columns: ["root_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_root_work_id_fkey"
            columns: ["root_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_root_work_id_fkey"
            columns: ["root_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_writing_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: true
            referencedRelation: "loreum_creative_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: true
            referencedRelation: "loreum_discoverable_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: true
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: true
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "loreum_work_discovery_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: true
            referencedRelation: "loreum_writing_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_worlds: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          timeline_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          timeline_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          timeline_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_worlds_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "loreum_timelines"
            referencedColumns: ["id"]
          },
        ]
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
      pockets_bumpers: {
        Row: {
          cdn_url: string | null
          channel_id: string
          content: string
          created_at: string | null
          file_url: string
          id: string
          last_played_at: string | null
          priority: number | null
          sequence_group: string | null
          sequence_order: number | null
          sort_order: number | null
          time_restrictions: string | null
          trigger_type: string
          trigger_value: number | null
          updated_at: string | null
          voice: string
          weather_dependent: boolean | null
          weight: number | null
        }
        Insert: {
          cdn_url?: string | null
          channel_id: string
          content: string
          created_at?: string | null
          file_url: string
          id?: string
          last_played_at?: string | null
          priority?: number | null
          sequence_group?: string | null
          sequence_order?: number | null
          sort_order?: number | null
          time_restrictions?: string | null
          trigger_type: string
          trigger_value?: number | null
          updated_at?: string | null
          voice: string
          weather_dependent?: boolean | null
          weight?: number | null
        }
        Update: {
          cdn_url?: string | null
          channel_id?: string
          content?: string
          created_at?: string | null
          file_url?: string
          id?: string
          last_played_at?: string | null
          priority?: number | null
          sequence_group?: string | null
          sequence_order?: number | null
          sort_order?: number | null
          time_restrictions?: string | null
          trigger_type?: string
          trigger_value?: number | null
          updated_at?: string | null
          voice?: string
          weather_dependent?: boolean | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pockets_bumpers_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "pockets_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      pockets_channels: {
        Row: {
          banned_tags: string[] | null
          channel_type: string | null
          created_at: string | null
          description: string
          energy_curve: Json | null
          id: string
          is_active: boolean | null
          min_delay_between_replays: number | null
          name: string
          preferred_tags: string[] | null
          theme_data: Json
          theme_type: string
          track_pool_filter: Json | null
          updated_at: string | null
        }
        Insert: {
          banned_tags?: string[] | null
          channel_type?: string | null
          created_at?: string | null
          description: string
          energy_curve?: Json | null
          id?: string
          is_active?: boolean | null
          min_delay_between_replays?: number | null
          name: string
          preferred_tags?: string[] | null
          theme_data?: Json
          theme_type: string
          track_pool_filter?: Json | null
          updated_at?: string | null
        }
        Update: {
          banned_tags?: string[] | null
          channel_type?: string | null
          created_at?: string | null
          description?: string
          energy_curve?: Json | null
          id?: string
          is_active?: boolean | null
          min_delay_between_replays?: number | null
          name?: string
          preferred_tags?: string[] | null
          theme_data?: Json
          theme_type?: string
          track_pool_filter?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pockets_episodes: {
        Row: {
          cdn_url: string | null
          channel_id: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          episode_number: number
          file_url: string
          guest_info: Json | null
          id: string
          published_at: string | null
          show_notes: string | null
          tags: string[] | null
          title: string
          transcript: string | null
          updated_at: string | null
        }
        Insert: {
          cdn_url?: string | null
          channel_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          episode_number: number
          file_url: string
          guest_info?: Json | null
          id?: string
          published_at?: string | null
          show_notes?: string | null
          tags?: string[] | null
          title: string
          transcript?: string | null
          updated_at?: string | null
        }
        Update: {
          cdn_url?: string | null
          channel_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          episode_number?: number
          file_url?: string
          guest_info?: Json | null
          id?: string
          published_at?: string | null
          show_notes?: string | null
          tags?: string[] | null
          title?: string
          transcript?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pockets_episodes_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "pockets_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      pockets_playlists: {
        Row: {
          channel_id: string
          current_index: number | null
          exclusive_to_channel: string | null
          is_reservoir: boolean | null
          repeat: boolean | null
          shuffle: boolean | null
          source_channels: string[] | null
          updated_at: string | null
        }
        Insert: {
          channel_id: string
          current_index?: number | null
          exclusive_to_channel?: string | null
          is_reservoir?: boolean | null
          repeat?: boolean | null
          shuffle?: boolean | null
          source_channels?: string[] | null
          updated_at?: string | null
        }
        Update: {
          channel_id?: string
          current_index?: number | null
          exclusive_to_channel?: string | null
          is_reservoir?: boolean | null
          repeat?: boolean | null
          shuffle?: boolean | null
          source_channels?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pockets_playlists_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: true
            referencedRelation: "pockets_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pockets_playlists_exclusive_to_channel_fkey"
            columns: ["exclusive_to_channel"]
            isOneToOne: false
            referencedRelation: "pockets_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      pockets_rotation_logs: {
        Row: {
          bumper_id: string | null
          channel_id: string | null
          created_at: string | null
          id: string
          played_at: string | null
          session_id: string | null
          track_id: string | null
          user_fingerprint: string | null
        }
        Insert: {
          bumper_id?: string | null
          channel_id?: string | null
          created_at?: string | null
          id?: string
          played_at?: string | null
          session_id?: string | null
          track_id?: string | null
          user_fingerprint?: string | null
        }
        Update: {
          bumper_id?: string | null
          channel_id?: string | null
          created_at?: string | null
          id?: string
          played_at?: string | null
          session_id?: string | null
          track_id?: string | null
          user_fingerprint?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pockets_rotation_logs_bumper_id_fkey"
            columns: ["bumper_id"]
            isOneToOne: false
            referencedRelation: "pockets_bumpers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pockets_rotation_logs_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "pockets_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pockets_rotation_logs_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "pockets_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      pockets_tracks: {
        Row: {
          access_count: number | null
          album: string | null
          artist: string | null
          blocklist: string[] | null
          cdn_url: string | null
          channel_id: string
          content_type: string | null
          created_at: string | null
          duration: number
          file_size: number | null
          file_url: string
          genre: string | null
          id: string
          is_verified: boolean | null
          last_played_at: string | null
          sort_order: number | null
          tags: string | null
          title: string
          updated_at: string | null
          upload_date: string | null
          uploaded_by: string | null
          weight: number | null
          year: number | null
        }
        Insert: {
          access_count?: number | null
          album?: string | null
          artist?: string | null
          blocklist?: string[] | null
          cdn_url?: string | null
          channel_id: string
          content_type?: string | null
          created_at?: string | null
          duration: number
          file_size?: number | null
          file_url: string
          genre?: string | null
          id?: string
          is_verified?: boolean | null
          last_played_at?: string | null
          sort_order?: number | null
          tags?: string | null
          title: string
          updated_at?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
          weight?: number | null
          year?: number | null
        }
        Update: {
          access_count?: number | null
          album?: string | null
          artist?: string | null
          blocklist?: string[] | null
          cdn_url?: string | null
          channel_id?: string
          content_type?: string | null
          created_at?: string | null
          duration?: number
          file_size?: number | null
          file_url?: string
          genre?: string | null
          id?: string
          is_verified?: boolean | null
          last_played_at?: string | null
          sort_order?: number | null
          tags?: string | null
          title?: string
          updated_at?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
          weight?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pockets_tracks_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "pockets_channels"
            referencedColumns: ["id"]
          },
        ]
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
          assigned_to: string | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          project_id: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          project_id: string
          status: string
          type: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
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
            foreignKeyName: "project_tasks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "project_components_with_metrics"
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
          created_by: string | null
          description: string | null
          documentation_references: Json | null
          featured: boolean | null
          has_custom_landing: boolean
          id: string
          image_url: string | null
          is_public: boolean | null
          landing_page: Json | null
          like_count: number | null
          location: string | null
          name: string
          owner_id: string | null
          owner_type: string | null
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
          view_count: number | null
        }
        Insert: {
          budget?: string | null
          category?: Database["public"]["Enums"]["project_category"] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          documentation_references?: Json | null
          featured?: boolean | null
          has_custom_landing?: boolean
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          landing_page?: Json | null
          like_count?: number | null
          location?: string | null
          name: string
          owner_id?: string | null
          owner_type?: string | null
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
          view_count?: number | null
        }
        Update: {
          budget?: string | null
          category?: Database["public"]["Enums"]["project_category"] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          documentation_references?: Json | null
          featured?: boolean | null
          has_custom_landing?: boolean
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          landing_page?: Json | null
          like_count?: number | null
          location?: string | null
          name?: string
          owner_id?: string | null
          owner_type?: string | null
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
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      radio_channels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      radio_tracks: {
        Row: {
          album: string | null
          artist: string
          cdn_url: string
          channel_id: string
          created_at: string
          duration: number | null
          file_url: string
          genre: string | null
          id: string
          tags: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
          year: number | null
        }
        Insert: {
          album?: string | null
          artist: string
          cdn_url: string
          channel_id: string
          created_at?: string
          duration?: number | null
          file_url: string
          genre?: string | null
          id?: string
          tags?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          year?: number | null
        }
        Update: {
          album?: string | null
          artist?: string
          cdn_url?: string
          channel_id?: string
          created_at?: string
          duration?: number | null
          file_url?: string
          genre?: string | null
          id?: string
          tags?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "radio_tracks_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "radio_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string | null
          ingredient_name: string
          is_optional: boolean | null
          notes: string | null
          preparation_notes: string | null
          quantity: number
          recipe_id: string | null
          recipe_version_id: string | null
          sort_order: number | null
          unit: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          ingredient_name: string
          is_optional?: boolean | null
          notes?: string | null
          preparation_notes?: string | null
          quantity: number
          recipe_id?: string | null
          recipe_version_id?: string | null
          sort_order?: number | null
          unit: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          ingredient_name?: string
          is_optional?: boolean | null
          notes?: string | null
          preparation_notes?: string | null
          quantity?: number
          recipe_id?: string | null
          recipe_version_id?: string | null
          sort_order?: number | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_latest_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_version_id_fkey"
            columns: ["recipe_version_id"]
            isOneToOne: false
            referencedRelation: "recipe_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_version_id_fkey"
            columns: ["recipe_version_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_latest_version"
            referencedColumns: ["latest_version_id"]
          },
        ]
      }
      recipe_ratings: {
        Row: {
          authenticity_rating: number | null
          created_at: string | null
          difficulty_assessment: string | null
          ease_rating: number | null
          id: string
          modifications: string | null
          overall_rating: number
          presentation_rating: number | null
          recipe_id: string | null
          recipe_version_id: string | null
          review: string | null
          serving_context: string | null
          taste_rating: number | null
          updated_at: string | null
          user_id: string | null
          would_make_again: boolean | null
        }
        Insert: {
          authenticity_rating?: number | null
          created_at?: string | null
          difficulty_assessment?: string | null
          ease_rating?: number | null
          id?: string
          modifications?: string | null
          overall_rating: number
          presentation_rating?: number | null
          recipe_id?: string | null
          recipe_version_id?: string | null
          review?: string | null
          serving_context?: string | null
          taste_rating?: number | null
          updated_at?: string | null
          user_id?: string | null
          would_make_again?: boolean | null
        }
        Update: {
          authenticity_rating?: number | null
          created_at?: string | null
          difficulty_assessment?: string | null
          ease_rating?: number | null
          id?: string
          modifications?: string | null
          overall_rating?: number
          presentation_rating?: number | null
          recipe_id?: string | null
          recipe_version_id?: string | null
          review?: string | null
          serving_context?: string | null
          taste_rating?: number | null
          updated_at?: string | null
          user_id?: string | null
          would_make_again?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_latest_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ratings_recipe_version_id_fkey"
            columns: ["recipe_version_id"]
            isOneToOne: false
            referencedRelation: "recipe_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ratings_recipe_version_id_fkey"
            columns: ["recipe_version_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_latest_version"
            referencedColumns: ["latest_version_id"]
          },
          {
            foreignKeyName: "recipe_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_steps: {
        Row: {
          created_at: string | null
          duration_amount: number | null
          duration_unit: string | null
          id: string
          image_url: string | null
          instruction: string
          notes: string | null
          recipe_id: string | null
          recipe_version_id: string | null
          step_number: number
          technique: string | null
          temperature: number | null
          temperature_unit: string | null
          tips: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_amount?: number | null
          duration_unit?: string | null
          id?: string
          image_url?: string | null
          instruction: string
          notes?: string | null
          recipe_id?: string | null
          recipe_version_id?: string | null
          step_number: number
          technique?: string | null
          temperature?: number | null
          temperature_unit?: string | null
          tips?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_amount?: number | null
          duration_unit?: string | null
          id?: string
          image_url?: string | null
          instruction?: string
          notes?: string | null
          recipe_id?: string | null
          recipe_version_id?: string | null
          step_number?: number
          technique?: string | null
          temperature?: number | null
          temperature_unit?: string | null
          tips?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_latest_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_steps_recipe_version_id_fkey"
            columns: ["recipe_version_id"]
            isOneToOne: false
            referencedRelation: "recipe_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_steps_recipe_version_id_fkey"
            columns: ["recipe_version_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_latest_version"
            referencedColumns: ["latest_version_id"]
          },
        ]
      }
      recipe_versions: {
        Row: {
          changes_from_previous: string | null
          created_at: string | null
          description: string | null
          id: string
          is_preferred: boolean | null
          rating: number | null
          recipe_id: string | null
          test_notes: string | null
          updated_at: string | null
          user_id: string | null
          version_name: string | null
          version_number: number
        }
        Insert: {
          changes_from_previous?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_preferred?: boolean | null
          rating?: number | null
          recipe_id?: string | null
          test_notes?: string | null
          updated_at?: string | null
          user_id?: string | null
          version_name?: string | null
          version_number: number
        }
        Update: {
          changes_from_previous?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_preferred?: boolean | null
          rating?: number | null
          recipe_id?: string | null
          test_notes?: string | null
          updated_at?: string | null
          user_id?: string | null
          version_name?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_versions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_versions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_latest_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_versions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          is_original: boolean | null
          is_public: boolean | null
          item_id: string | null
          name: string
          notes: string | null
          prep_time_minutes: number | null
          source_attribution: string | null
          source_url: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
          yield_amount: number | null
          yield_unit: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_original?: boolean | null
          is_public?: boolean | null
          item_id?: string | null
          name: string
          notes?: string | null
          prep_time_minutes?: number | null
          source_attribution?: string | null
          source_url?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          yield_amount?: number | null
          yield_unit?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_original?: boolean | null
          is_public?: boolean | null
          item_id?: string | null
          name?: string
          notes?: string | null
          prep_time_minutes?: number | null
          source_attribution?: string | null
          source_url?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          yield_amount?: number | null
          yield_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "snacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          capacity: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          price_per_hour: number | null
          size_sqft: number | null
          specifications: Json | null
          subtype: string | null
          tags: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          availability?: Json | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          price_per_hour?: number | null
          size_sqft?: number | null
          specifications?: Json | null
          subtype?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          availability?: Json | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          price_per_hour?: number | null
          size_sqft?: number | null
          specifications?: Json | null
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
          has_recipe: boolean | null
          id: string
          image_url: string | null
          item_subtype: string | null
          item_type: string | null
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
          has_recipe?: boolean | null
          id?: string
          image_url?: string | null
          item_subtype?: string | null
          item_type?: string | null
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
          has_recipe?: boolean | null
          id?: string
          image_url?: string | null
          item_subtype?: string | null
          item_type?: string | null
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
      context_drops_enhanced: {
        Row: {
          annotation_count: number | null
          annotations: Json | null
          content_length: number | null
          conversation_context: string | null
          created_at: string | null
          description: string | null
          entity_count: number | null
          id: string | null
          linked_entities: number | null
          message_count: number | null
          metadata: Json | null
          name: string | null
          participant_count: number | null
          participants: string[] | null
          raw_content: string | null
          searchable_content: string | null
          source: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          annotation_count?: number | null
          annotations?: Json | null
          content_length?: never
          conversation_context?: string | null
          created_at?: string | null
          description?: string | null
          entity_count?: never
          id?: string | null
          linked_entities?: never
          message_count?: number | null
          metadata?: Json | null
          name?: string | null
          participant_count?: number | null
          participants?: string[] | null
          raw_content?: string | null
          searchable_content?: never
          source?: never
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          annotation_count?: number | null
          annotations?: Json | null
          content_length?: never
          conversation_context?: string | null
          created_at?: string | null
          description?: string | null
          entity_count?: never
          id?: string | null
          linked_entities?: never
          message_count?: number | null
          metadata?: Json | null
          name?: string | null
          participant_count?: number | null
          participants?: string[] | null
          raw_content?: string | null
          searchable_content?: never
          source?: never
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      item_pairings_with_details: {
        Row: {
          created_at: string | null
          creator_username: string | null
          description: string | null
          id: string | null
          is_public: boolean | null
          item1_description: string | null
          item1_id: string | null
          item1_image_url: string | null
          item1_name: string | null
          item1_subtype: string | null
          item1_type: string | null
          item2_description: string | null
          item2_id: string | null
          item2_image_url: string | null
          item2_name: string | null
          item2_subtype: string | null
          item2_type: string | null
          notes: string | null
          occasion: string | null
          pairing_category: string | null
          pairing_type: string | null
          rating: number | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
          would_recommend: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "item_pairings_item1_id_fkey"
            columns: ["item1_id"]
            isOneToOne: false
            referencedRelation: "snacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_pairings_item2_id_fkey"
            columns: ["item2_id"]
            isOneToOne: false
            referencedRelation: "snacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_pairings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_creative_work_tree: {
        Row: {
          creative_type: string | null
          depth: number | null
          id: string | null
          parent_work_id: string | null
          path: number[] | null
          root_title: string | null
          sequence_number: number | null
          status: string | null
          target_word_count: number | null
          title: string | null
          word_count: number | null
        }
        Relationships: []
      }
      loreum_discoverable_works: {
        Row: {
          collection: string | null
          completion_percentage: number | null
          component_count: number | null
          content: string | null
          content_format: string | null
          created_at: string | null
          creative_type: string | null
          description: string | null
          external_links: Json | null
          featured_characters: string[] | null
          genre: string | null
          id: string | null
          is_public: boolean | null
          mood: string | null
          notes: Json | null
          outline: string | null
          parent_work_id: string | null
          pov_character_id: string | null
          primary_location_id: string | null
          referenced_cultures: string[] | null
          referenced_events: string[] | null
          referenced_locations: string[] | null
          sequence_number: number | null
          status: string | null
          style_notes: string | null
          summary: string | null
          tags: string[] | null
          target_word_count: number | null
          themes: string[] | null
          timeline_id: string | null
          title: string | null
          tone: string | null
          total_word_count: number | null
          updated_at: string | null
          word_count: number | null
          world_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_creative_works_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_creative_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_discoverable_works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "loreum_creative_works_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_works_with_components"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "loreum_creative_works_parent_work_id_fkey"
            columns: ["parent_work_id"]
            isOneToOne: false
            referencedRelation: "loreum_writing_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_pov_character_id_fkey"
            columns: ["pov_character_id"]
            isOneToOne: false
            referencedRelation: "loreum_characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_primary_location_id_fkey"
            columns: ["primary_location_id"]
            isOneToOne: false
            referencedRelation: "loreum_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "loreum_timelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_creative_works_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "loreum_worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_recent_creative_activity: {
        Row: {
          activity_type: string | null
          creative_type: string | null
          id: string | null
          mood_rating: number | null
          productivity_rating: number | null
          session_end: string | null
          session_hours: number | null
          session_notes: string | null
          session_start: string | null
          words_written: number | null
          work_title: string | null
        }
        Relationships: []
      }
      loreum_template_discovery: {
        Row: {
          collection_memberships: number | null
          collection_names: string[] | null
          created_at: string | null
          description: string | null
          id: string | null
          incoming_relationships: number | null
          instance_count: number | null
          instance_tags: string[] | null
          is_deprecated: boolean | null
          last_instanced: string | null
          metadata: Json | null
          name: string | null
          outgoing_relationships: number | null
          parent_template_id: string | null
          tags: string[] | null
          template_category: string | null
          type: string | null
          updated_at: string | null
          version: number | null
          version_notes: string | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_ipsumarium_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "loreum_ipsumarium_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_ipsumarium_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_discovery"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_template_instances_with_templates: {
        Row: {
          civilization_id: string | null
          civilization_name: string | null
          created_at: string | null
          created_by_character_id: string | null
          discovered_year: number | null
          id: string | null
          instance_description: string | null
          instance_name: string | null
          local_variations: Json | null
          multiverse_id: string | null
          multiverse_name: string | null
          notes: string | null
          origin_location: string | null
          override_metadata: Json | null
          status: string | null
          tags: string[] | null
          template_description: string | null
          template_id: string | null
          template_metadata: Json | null
          template_name: string | null
          template_tags: string[] | null
          template_type: string | null
          timeline_id: string | null
          timeline_name: string | null
          universe_id: string | null
          universe_name: string | null
          updated_at: string | null
          world_id: string | null
          world_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loreum_template_instances_civilization_id_fkey"
            columns: ["civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_created_by_character_id_fkey"
            columns: ["created_by_character_id"]
            isOneToOne: false
            referencedRelation: "loreum_characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_multiverse_id_fkey"
            columns: ["multiverse_id"]
            isOneToOne: false
            referencedRelation: "loreum_multiverses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "loreum_ipsumarium_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "loreum_template_discovery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "loreum_timelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_universe_id_fkey"
            columns: ["universe_id"]
            isOneToOne: false
            referencedRelation: "loreum_universes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loreum_template_instances_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "loreum_worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      loreum_work_hierarchy: {
        Row: {
          creative_type: string | null
          depth: number | null
          id: string | null
          parent_work_id: string | null
          path: string | null
          root_id: string | null
          root_title: string | null
          root_type: string | null
          sequence_number: number | null
          status: string | null
          title: string | null
          word_count: number | null
        }
        Relationships: []
      }
      loreum_works_with_components: {
        Row: {
          collection: string | null
          component_content: string | null
          component_id: string | null
          component_sequence: number | null
          component_status: string | null
          component_summary: string | null
          component_title: string | null
          component_type: string | null
          component_word_count: number | null
          genre: string | null
          work_description: string | null
          work_direct_words: number | null
          work_id: string | null
          work_status: string | null
          work_tags: string[] | null
          work_target: number | null
          work_title: string | null
          work_type: string | null
        }
        Relationships: []
      }
      loreum_writing_progress: {
        Row: {
          child_count: number | null
          completed_children: number | null
          completion_percentage: number | null
          creative_type: string | null
          id: string | null
          last_session: string | null
          sessions_this_week: number | null
          status: string | null
          target_word_count: number | null
          title: string | null
          total_child_words: number | null
          updated_at: string | null
          word_count: number | null
        }
        Relationships: []
      }
      project_components_with_metrics: {
        Row: {
          assigned_to: string | null
          completed_tasks: number | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string | null
          in_progress_tasks: number | null
          name: string | null
          pending_tasks: number | null
          project_id: string | null
          status: string | null
          task_completion_percentage: number | null
          total_tasks: number | null
          type: string | null
          updated_at: string | null
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
      recipes_with_latest_version: {
        Row: {
          average_rating: number | null
          created_at: string | null
          creator_username: string | null
          description: string | null
          difficulty: string | null
          id: string | null
          is_original: boolean | null
          is_public: boolean | null
          item_id: string | null
          item_image_url: string | null
          item_name: string | null
          item_subtype: string | null
          item_type: string | null
          latest_version_changes: string | null
          latest_version_description: string | null
          latest_version_id: string | null
          latest_version_name: string | null
          latest_version_notes: string | null
          latest_version_number: number | null
          latest_version_rating: number | null
          name: string | null
          notes: string | null
          prep_time_minutes: number | null
          rating_count: number | null
          source_attribution: string | null
          source_url: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
          yield_amount: number | null
          yield_unit: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "snacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      user_recipe_ratings: {
        Row: {
          authenticity_rating: number | null
          combined_rating: number | null
          created_at: string | null
          difficulty_assessment: string | null
          ease_rating: number | null
          id: string | null
          item_id: string | null
          item_image_url: string | null
          item_name: string | null
          item_type: string | null
          modifications: string | null
          overall_rating: number | null
          presentation_rating: number | null
          recipe_id: string | null
          recipe_name: string | null
          recipe_version_id: string | null
          review: string | null
          serving_context: string | null
          taste_rating: number | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          version_name: string | null
          version_number: number | null
          would_make_again: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_latest_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ratings_recipe_version_id_fkey"
            columns: ["recipe_version_id"]
            isOneToOne: false
            referencedRelation: "recipe_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ratings_recipe_version_id_fkey"
            columns: ["recipe_version_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_latest_version"
            referencedColumns: ["latest_version_id"]
          },
          {
            foreignKeyName: "recipe_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "snacks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_company_avg_rating: {
        Args: { company_id: string }
        Returns: number
      }
      calculate_component_progress: {
        Args: { component_id_param: string }
        Returns: number
      }
      cleanup_old_rotation_logs: { Args: never; Returns: undefined }
      create_template_instance: {
        Args: {
          p_civilization_id?: string
          p_created_by_character_id?: string
          p_discovered_year?: number
          p_instance_description?: string
          p_instance_name: string
          p_local_variations?: Json
          p_multiverse_id?: string
          p_notes?: string
          p_origin_location?: string
          p_override_metadata?: Json
          p_tags?: string[]
          p_template_id: string
          p_timeline_id?: string
          p_universe_id?: string
          p_world_id?: string
        }
        Returns: {
          civilization_id: string
          created_at: string
          created_by_character_id: string
          discovered_year: number
          id: string
          instance_description: string
          instance_name: string
          local_variations: Json
          multiverse_id: string
          notes: string
          origin_location: string
          override_metadata: Json
          status: string
          tags: string[]
          template_id: string
          timeline_id: string
          universe_id: string
          updated_at: string
          world_id: string
        }[]
      }
      create_template_instance_with_relationships: {
        Args: {
          p_auto_resolve_requirements?: boolean
          p_context_id: string
          p_context_level: string
          p_instance_name: string
          p_template_id: string
          p_variations?: Json
        }
        Returns: {
          created_instances: Json
          instance_id: string
          warnings: string[]
        }[]
      }
      get_average_rating: { Args: { snack_id: string }; Returns: number }
      get_community_member_count: {
        Args: { community_id: string }
        Returns: number
      }
      get_community_post_count: {
        Args: { community_id: string }
        Returns: number
      }
      get_component_tasks: {
        Args: { component_id_param: string }
        Returns: {
          assigned_to: string
          component_id: string
          created_at: string
          description: string
          due_date: string
          id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }[]
      }
      get_context_drop_entities: {
        Args: { drop_id: string }
        Returns: {
          color: string
          end_pos: number
          entity_id: string
          entity_type: string
          id: string
          notes: string
          start_pos: number
          text: string
        }[]
      }
      get_context_drops_by_context: {
        Args: { context_name: string; limit_count?: number }
        Returns: {
          annotation_count: number | null
          annotations: Json | null
          conversation_context: string | null
          created_at: string
          description: string | null
          id: string
          message_count: number | null
          metadata: Json
          name: string
          participant_count: number | null
          participants: string[]
          raw_content: string
          tags: string[]
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "context_drops"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_instance_context_hierarchy: {
        Args: { instance_id: string }
        Returns: {
          civilization_id: string
          civilization_name: string
          multiverse_id: string
          multiverse_name: string
          timeline_id: string
          timeline_name: string
          universe_id: string
          universe_name: string
          world_id: string
          world_name: string
        }[]
      }
      get_project_components: {
        Args: { p_project_id: string }
        Returns: {
          assigned_to: string | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          project_id: string
          status: string
          type: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "project_components"
          isOneToOne: false
          isSetofReturn: true
        }
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
        SetofOptions: {
          from: "*"
          to: "project_tasks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_rating_count: { Args: { snack_id: string }; Returns: number }
      get_reading_order: {
        Args: { root_work_id: string }
        Returns: {
          creative_type: string
          depth: number
          reading_order: number
          sequence_number: number
          title: string
          work_id: string
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
      get_template_instances: {
        Args: never
        Returns: {
          civilization_id: string
          civilization_name: string
          created_at: string
          created_by_character_id: string
          discovered_year: number
          id: string
          instance_description: string
          instance_name: string
          local_variations: Json
          multiverse_id: string
          multiverse_name: string
          notes: string
          origin_location: string
          override_metadata: Json
          status: string
          tags: string[]
          template_description: string
          template_id: string
          template_metadata: Json
          template_name: string
          template_tags: string[]
          template_type: string
          timeline_id: string
          timeline_name: string
          universe_id: string
          universe_name: string
          updated_at: string
          world_id: string
          world_name: string
        }[]
      }
      get_template_instances_by_context: {
        Args: {
          p_civilization_id?: string
          p_multiverse_id?: string
          p_timeline_id?: string
          p_universe_id?: string
          p_world_id?: string
        }
        Returns: {
          civilization_id: string
          civilization_name: string
          created_at: string
          created_by_character_id: string
          discovered_year: number
          id: string
          instance_description: string
          instance_name: string
          local_variations: Json
          multiverse_id: string
          multiverse_name: string
          notes: string
          origin_location: string
          override_metadata: Json
          status: string
          tags: string[]
          template_description: string
          template_id: string
          template_metadata: Json
          template_name: string
          template_tags: string[]
          template_type: string
          timeline_id: string
          timeline_name: string
          universe_id: string
          universe_name: string
          updated_at: string
          world_id: string
          world_name: string
        }[]
      }
      get_template_instances_by_template: {
        Args: { p_template_id: string }
        Returns: {
          civilization_id: string
          civilization_name: string
          created_at: string
          created_by_character_id: string
          discovered_year: number
          id: string
          instance_description: string
          instance_name: string
          local_variations: Json
          multiverse_id: string
          multiverse_name: string
          notes: string
          origin_location: string
          override_metadata: Json
          status: string
          tags: string[]
          template_description: string
          template_id: string
          template_metadata: Json
          template_name: string
          template_tags: string[]
          template_type: string
          timeline_id: string
          timeline_name: string
          universe_id: string
          universe_name: string
          updated_at: string
          world_id: string
          world_name: string
        }[]
      }
      get_template_relationships: {
        Args: {
          p_include_bidirectional?: boolean
          p_relationship_types?: string[]
          p_template_id: string
        }
        Returns: {
          description: string
          is_outgoing: boolean
          related_template_id: string
          related_template_name: string
          relationship_id: string
          relationship_strength: number
          relationship_type: string
        }[]
      }
      get_template_version_history: {
        Args: { p_template_id: string }
        Returns: {
          created_at: string
          is_current: boolean
          name: string
          template_id: string
          version: number
          version_notes: string
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
          p_dependencies: string[]
          p_description: string
          p_name: string
          p_project_id: string
          p_status: string
          p_type: string
        }
        Returns: {
          assigned_to: string | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          project_id: string
          status: string
          type: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_components"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      insert_project_task: {
        Args: {
          p_assigned_to: string
          p_description: string
          p_due_date: string
          p_priority: string
          p_project_id: string
          p_status: string
          p_title: string
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
        SetofOptions: {
          from: "*"
          to: "project_tasks"
          isOneToOne: true
          isSetofReturn: false
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
      record_template_analytics: {
        Args: {
          p_context_data?: Json
          p_metric_type: string
          p_metric_value?: number
          p_template_id: string
          p_user_identifier?: string
        }
        Returns: undefined
      }
      refresh_work_discovery: { Args: never; Returns: undefined }
      search_context_drops: {
        Args: {
          limit_count?: number
          offset_count?: number
          search_term: string
        }
        Returns: {
          annotation_count: number
          conversation_context: string
          created_at: string
          description: string
          id: string
          message_count: number
          name: string
          search_rank: number
        }[]
      }
      search_discover_content: {
        Args: {
          content_type: string
          search_query?: string
          tag_filters?: string[]
        }
        Returns: Json
      }
      search_templates: {
        Args: {
          p_categories?: string[]
          p_collection_id?: string
          p_include_deprecated?: boolean
          p_limit?: number
          p_min_instances?: number
          p_offset?: number
          p_search_tags?: string[]
          p_search_text?: string
          p_template_types?: string[]
        }
        Returns: {
          description: string
          id: string
          instance_count: number
          metadata: Json
          name: string
          relevance_score: number
          tags: string[]
          template_category: string
          type: string
          version: number
          view_count: number
        }[]
      }
      table_exists: {
        Args: { schema_name: string; table_name: string }
        Returns: boolean
      }
      update_project_component: {
        Args: {
          p_dependencies: string[]
          p_description: string
          p_id: string
          p_name: string
          p_status: string
          p_type: string
        }
        Returns: {
          assigned_to: string | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          project_id: string
          status: string
          type: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_components"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_project_task: {
        Args: {
          p_assigned_to: string
          p_description: string
          p_due_date: string
          p_id: string
          p_priority: string
          p_status: string
          p_title: string
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
        SetofOptions: {
          from: "*"
          to: "project_tasks"
          isOneToOne: true
          isSetofReturn: false
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
