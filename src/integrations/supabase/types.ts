import { type Database } from './database.types';

export type { Database };

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// Core types
export type Profile = Tables<'profiles'>;
export type Artist = Tables<'artists'>;
export type Brand = Tables<'brands'>;
export type Community = Tables<'communities'>;
export type CommunityMember = Tables<'community_members'>;
export type CommunityPost = Tables<'community_posts'>;
export type ContentOwnership = Tables<'content_ownership'>;
export type Event = Tables<'events'>;
export type Project = Tables<'projects'>;
export type Resource = Tables<'resources'>;
export type Service = Tables<'services'>;
export type UserArtistRelationship = Tables<'user_artist_relationships'>;
export type UserBrandRelationship = Tables<'user_brand_relationships'>;
export type Venue = Tables<'venues'>; 