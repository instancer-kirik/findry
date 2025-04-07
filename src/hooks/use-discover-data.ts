
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
        let table = '';
        
        // Map activeTab to appropriate table
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
        let query = supabase.from(table).select('*');
        
        // Apply search filter if provided
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        // Apply tag filter if selected
        if (selectedTags.length > 0 && table !== 'communities') {
          // For tags stored as arrays
          query = query.contains('tags', selectedTags);
        }
        
        const { data: responseData, error: responseError } = await query;
        
        if (responseError) throw responseError;
        
        // Transform the data based on the table/type
        if (responseData) {
          data = responseData.map(item => {
            const commonProps = {
              id: item.id,
              name: item.name,
              type: activeTab.substring(0, activeTab.length - 1), // Remove 's' to get singular
              location: item.location || 'Unknown location', // Ensure location is not null
              description: item.description || item.bio || '',
              image_url: item.image_url || item.logo_url || item.banner_image_url || '',
              tags: item.tags || [],
            };
            
            // Add specific properties based on the type
            switch(activeTab) {
              case 'artists':
                return {
                  ...commonProps,
                  subtype: item.subtype || 'musician',
                  disciplines: item.disciplines,
                  styles: item.styles,
                  multidisciplinary: item.multidisciplinary
                };
              case 'venues':
                return {
                  ...commonProps,
                  subtype: item.type || 'venue',
                  capacity: item.capacity,
                  amenities: item.amenities
                };
              case 'resources':
                return {
                  ...commonProps,
                  subtype: item.subtype || 'equipment',
                  availability: item.availability
                };
              case 'projects':
                return {
                  ...commonProps,
                  status: item.status,
                  version: item.version,
                  progress: item.progress,
                  repoUrl: item.repo_url,
                  budget: item.budget,
                  timeline: item.timeline
                };
              case 'brands':
                return {
                  ...commonProps,
                  subtype: item.type || 'brand'
                };
              case 'communities':
                return {
                  ...commonProps,
                  category: item.category,
                  created_by: item.created_by
                };
              case 'shops':
                return {
                  ...commonProps,
                  website_url: item.website_url,
                  logo_url: item.logo_url,
                  banner_image_url: item.banner_image_url
                };
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
