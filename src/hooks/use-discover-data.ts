import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentItemProps } from '@/types/content';
import { Artist } from '@/types/database';
import { generateUniqueId } from '@/utils/unique-id';

export const useFetchDiscoverContent = () => {
  const [content, setContent] = useState<ContentItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const { data: artists, error } = await supabase
          .from('artists')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        if (artists) {
          const mappedContent: ContentItemProps[] = artists.map(artist => {
            const { id, name, type, subtype, bio, location, tags, image_url } = artist;
            return {
              id,
              name,
              type: type || 'artist',
              subtype: subtype || 'musician',
              description: bio || '',
              location: location || '',
              tags: tags || [],
              image_url: image_url || '',
            };
          });
          setContent(mappedContent);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading, error };
};

export const useFetchArtists = () => {
  const [artists, setArtists] = useState<ContentItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('artists')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const artistContent: ContentItemProps[] = data.map(item => {
            const content: ContentItemProps = {
              id: item.id,
              name: item.name,
              type: 'artist',
              subtype: item.type || 'musician',
              description: item.bio || '',
              location: item.location || '',
              tags: item.tags || [],
              image_url: item.image_url || '',
            };
            return content;
          });
          setArtists(artistContent);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  return { artists, loading, error };
};

export const useDiscoverData = (
  activeTab: string,
  searchQuery: string,
  selectedTags: string[],
  resourceType: string,
  artistStyle: string,
  disciplinaryType: string,
  activeSubTab: string,
  selectedSubfilters: string[]
) => {
  const [items, setItems] = useState<ContentItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data: ContentItemProps[] = [];
        
        // Map activeTab to appropriate table - use literal types for better safety
        let table: 'artists' | 'venues' | 'resources' | 'projects' | 'brands' | 'communities' | 'shops';
        switch(activeTab) {
          case 'artists':
            table = 'artists';
            break;
          case 'venues':
            table = 'venues';
            break;
          case 'resources':
            table = 'resources';
            break;
          case 'projects':
            table = 'projects';
            break;
          case 'brands':
            table = 'brands';
            break;
          case 'communities':
            table = 'communities';
            break;
          case 'shops':
            table = 'shops';
            break;
          default:
            table = 'artists';
        }
        
        // Fetch data from Supabase
        const { data: responseData, error: responseError } = await supabase
          .from(table)
          .select('*');
        
        if (responseError) throw responseError;
        
        // Transform the data based on the table/type
        if (responseData && Array.isArray(responseData)) {
          data = responseData.map(item => {
            // Use type assertion to treat item as a generic object with any properties
            const typedItem = item as any;
            
            // Safely access properties
            const commonProps: ContentItemProps = {
              id: String(typedItem.id || ''),
              name: typedItem.name || 'Unnamed',
              type: activeTab.substring(0, activeTab.length - 1), // Remove 's' to get singular
              location: typedItem.location || 'Unknown location',
              description: typedItem.description || typedItem.bio || '',
              image_url: typedItem.image_url || typedItem.logo_url || typedItem.banner_image_url || '',
              tags: typedItem.tags || [],
              subtype: typedItem.subtype || typedItem.type || '',
            };
            
            // Add specific properties based on the type
            switch(activeTab) {
              case 'artists':
                return {
                  ...commonProps,
                  disciplines: typedItem.disciplines,
                  styles: typedItem.styles,
                  multidisciplinary: typedItem.multidisciplinary,
                } as ContentItemProps;
              case 'venues':
                return {
                  ...commonProps,
                  capacity: typedItem.capacity,
                  amenities: typedItem.amenities,
                } as ContentItemProps;
              case 'resources':
                return {
                  ...commonProps,
                  availability: typedItem.availability,
                } as ContentItemProps;
              case 'projects':
                return {
                  ...commonProps,
                  status: typedItem.status,
                  version: typedItem.version,
                  progress: typedItem.progress,
                  repoUrl: typedItem.repo_url,
                  budget: typedItem.budget,
                  timeline: typedItem.timeline,
                } as ContentItemProps;
              case 'brands':
                return commonProps;
              case 'communities':
                return {
                  ...commonProps,
                  category: typedItem.category,
                  created_by: typedItem.created_by,
                } as ContentItemProps;
              case 'shops':
                return {
                  ...commonProps,
                  website_url: typedItem.website_url,
                  logo_url: typedItem.logo_url,
                  banner_image_url: typedItem.banner_image_url,
                } as ContentItemProps;
              default:
                return commonProps;
            }
          });
        }
        
        setItems(data);
      } catch (err: any) {
        console.error('Error fetching discover data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, searchQuery, selectedTags, resourceType, artistStyle, disciplinaryType, activeSubTab, selectedSubfilters]);
  
  return { items, isLoading, error };
};
