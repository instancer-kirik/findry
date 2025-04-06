import { useEffect, useState } from 'react';
import { ContentItemProps } from '@/components/marketplace/ContentCard';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for the various data types
interface ProfileData {
  id: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
  profile_types?: string[] | null;
  bio?: string | null;
}

interface ResourceData {
  id: string;
  name: string;
  type?: string;
  location?: string;
  tags?: string[];
  image_url?: string;
}

interface EventData {
  id: string;
  name: string;
  title?: string;
  type?: string;
  location?: string;
  tags?: string[];
  image_url?: string;
}

interface VenueData {
  id: string;
  name: string;
  type?: string;
  location?: string;
  tags?: string[];
  image_url?: string;
}

interface CommunityData {
  id: string;
  name: string;
  type?: string;
  location?: string;
  tags?: string[];
  image_url?: string;
}

interface BrandData {
  id: string;
  name: string;
  type?: string;
  location?: string;
  tags?: string[];
  image_url?: string;
}

export const useDiscoverData = (
  category: string,
  searchQuery: string = '',
  tags: string[] = [],
  resourceType: string = 'all',
  artistStyle: string = 'all',
  disciplinaryType: string = 'all',
  subTab: string = 'all',
  subfilters: string[] = []
) => {
  const [items, setItems] = useState<ContentItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let result: ContentItemProps[] = [];

        // Fetch data from Supabase based on category
        if (category === 'projects') {
          // Fetch projects
          const { data, error } = await supabase
            .from('projects')
            .select('*');

          if (error) throw error;

          // Transform the data to match ContentItemProps format
          result = data.map(project => ({
            id: project.id,
            name: project.name,
            type: 'project',
            subtype: (project as any).status || 'development',
            location: project.location || 'Global',
            tags: project.tags || [],
            image_url: project.image_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          }));
        } else if (category === 'artists') {
          // Fixing the artists query based on correct profile structure
          let { data, error } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, profile_types, bio');
          
          if (error) throw error;

          // Filter profiles that have 'artist' in their profile_types array
          const artistsData = data?.filter(profile => 
            profile.profile_types && profile.profile_types.includes('artist')
          ) || [];
          
          // Transform the data to match ContentItemProps format
          result = artistsData.map(profile => ({
            id: profile.id,
            name: profile.full_name || profile.username || 'Unknown Artist',
            type: 'artist',
            subtype: 'creator', // Default subtype
            location: 'Unknown', // Location isn't in profiles table
            tags: [], // Tags aren't in profiles table currently
            image_url: profile.avatar_url || 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            styles: [],
            disciplines: [],
            multidisciplinary: false
          }));
        } else if (category === 'resources') {
          // Fetch resources data
          const { data, error } = await supabase
            .from('resources')
            .select('*');

          if (error) throw error;

          // Transform the data to match ContentItemProps format
          result = (data as any[]).map(resource => ({
            id: resource.id,
            name: resource.name,
            type: 'resource',
            subtype: resource.type || 'space',
            location: resource.location || 'Unknown',
            tags: resource.tags || [],
            image_url: resource.image_url || 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          }));
        } else if (category === 'events') {
          // Fetch events data
          const { data, error } = await supabase
            .from('events')
            .select('*');

          if (error) throw error;

          // Transform the data to match ContentItemProps format
          result = (data as any[]).map(event => ({
            id: event.id,
            name: event.title || event.name,
            type: 'event',
            subtype: event.type || 'other',
            location: event.location || 'Unknown',
            tags: event.tags || [],
            image_url: event.image_url || 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          }));
        } else if (category === 'venues') {
          // Fetch venues data
          const { data, error } = await supabase
            .from('venues')
            .select('*');

          if (error) throw error;

          // Transform the data to match ContentItemProps format
          result = (data as VenueData[]).map(venue => ({
            id: venue.id,
            name: venue.name,
            type: 'venue',
            subtype: venue.type || 'other',
            location: venue.location || 'Unknown',
            tags: venue.tags || [],
            image_url: venue.image_url || 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          }));
        } else if (category === 'communities') {
          // Fetch communities data
          const { data, error } = await supabase
            .from('communities')
            .select('*');

          if (error) throw error;

          // Transform the data to match ContentItemProps format
          result = (data as CommunityData[]).map(community => ({
            id: community.id,
            name: community.name,
            type: 'community',
            subtype: community.type || 'group',
            location: community.location || 'Online',
            tags: community.tags || [],
            image_url: community.image_url || 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          }));
        } else if (category === 'brands') {
          // Fetch brands data
          const { data, error } = await supabase
            .from('brands')
            .select('*');

          if (error) throw error;

          // Transform the data to match ContentItemProps format
          result = (data as BrandData[]).map(brand => ({
            id: brand.id,
            name: brand.name,
            type: 'brand',
            subtype: brand.type || 'business',
            location: brand.location || 'Global',
            tags: brand.tags || [],
            image_url: brand.image_url || 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          }));
        } else {
          // If the category doesn't match any of our tables, use this fallback
          result = [
            {
              id: 'default1',
              name: `Default ${category} 1`,
              type: category,
              location: 'Unknown',
              tags: ['sample'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
            {
              id: 'default2',
              name: `Default ${category} 2`,
              type: category,
              location: 'Unknown',
              tags: ['sample'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            }
          ];
        }

        // Filter by search query
        if (searchQuery) {
          result = result.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Filter by tags
        if (tags.length > 0) {
          result = result.filter(item =>
            tags.every(tag => item.tags?.includes(tag))
          );
        }

        // Filter by resource type
        if (resourceType !== 'all' && category === 'resources') {
          result = result.filter(item => item.subtype === resourceType);
        }

        // Filter by artist style
        if (artistStyle !== 'all' && category === 'artists') {
          result = result.filter(item => item.styles?.includes(artistStyle));
        }

        // Filter by disciplinary type
        if (disciplinaryType !== 'all' && category === 'artists') {
          if (disciplinaryType === 'multi') {
            result = result.filter(item => item.multidisciplinary);
          } else {
            result = result.filter(item => !item.multidisciplinary);
          }
        }

        // Handle any relevant subfilters
        if (subfilters.length > 0) {
          result = result.filter(item => {
            // Different logic based on the category
            if (category === 'artists' && item.subtype) {
              return subfilters.includes(item.subtype.toLowerCase());
            }
            // Add more category-specific filters as needed
            return true;
          });
        }

        setItems(result);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [
    category,
    searchQuery,
    tags.join(','),
    resourceType,
    artistStyle,
    disciplinaryType,
    subTab,
    subfilters.join(','),
  ]);

  return { items, isLoading, error };
};
