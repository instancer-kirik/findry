import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentItemProps } from '@/types/content';

// Helper function to safely access a property with type checking
const safeProp = <T, K extends string>(obj: T, key: K, defaultValue: any = ''): any => {
  return obj && Object.prototype.hasOwnProperty.call(obj, key) 
    ? (obj as any)[key] 
    : defaultValue;
};

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
        
        // Map activeTab to appropriate table
        const table = activeTab as 'artists' | 'venues' | 'resources' | 'projects' | 'brands' | 'communities' | 'shops' | 'events';
        
        // Fetch data from Supabase
        const { data: responseData, error: responseError } = await supabase
          .from(table)
          .select('*');
        
        if (responseError) throw responseError;
        
        // Transform the data based on the table/type
        if (responseData && Array.isArray(responseData)) {
          data = responseData.map(item => {
            // Basic common properties
            const commonProps: ContentItemProps = {
              id: String(item.id || ''),
              name: item.name || 'Unnamed',
              type: activeTab === 'events' ? 'event' : activeTab.substring(0, activeTab.length - 1), // Special case for events
              location: safeProp(item, 'location', 'Unknown location'),
              description: safeProp(item, 'description', safeProp(item, 'bio', '')),
              image_url: safeProp(item, 'image_url', 
                safeProp(item, 'logo_url', 
                  safeProp(item, 'banner_image_url', ''))),
              tags: safeProp(item, 'tags', []),
              subtype: safeProp(item, 'subtype', safeProp(item, 'type', '')),
            };
            
            // Add specific properties based on the type
            if (activeTab === 'artists') {
              return {
                ...commonProps,
                disciplines: safeProp(item, 'disciplines', []),
                styles: safeProp(item, 'styles', []),
                multidisciplinary: safeProp(item, 'multidisciplinary', false),
              } as ContentItemProps;
            } 
            else if (activeTab === 'venues') {
              return {
                ...commonProps,
                capacity: safeProp(item, 'capacity', null),
                amenities: safeProp(item, 'amenities', []),
              } as ContentItemProps;
            }
            else if (activeTab === 'resources') {
              return {
                ...commonProps,
                availability: safeProp(item, 'availability', null),
              } as ContentItemProps;
            }
            else if (activeTab === 'projects') {
              return {
                ...commonProps,
                status: safeProp(item, 'status', ''),
                version: safeProp(item, 'version', ''),
                progress: safeProp(item, 'progress', 0),
                repo_url: safeProp(item, 'repo_url', ''),
                budget: safeProp(item, 'budget', ''),
                timeline: safeProp(item, 'timeline', ''),
              } as ContentItemProps;
            }
            else if (activeTab === 'events') {
              return {
                ...commonProps,
                start_date: safeProp(item, 'start_date', ''),
                end_date: safeProp(item, 'end_date', ''),
                capacity: safeProp(item, 'capacity', null),
              } as ContentItemProps;
            }
            else if (activeTab === 'communities') {
              return {
                ...commonProps,
                category: safeProp(item, 'category', ''),
                created_by: safeProp(item, 'created_by', ''),
              } as ContentItemProps;
            }
            else if (activeTab === 'shops') {
              return {
                ...commonProps,
                website_url: safeProp(item, 'website_url', ''),
                logo_url: safeProp(item, 'logo_url', ''),
                banner_image_url: safeProp(item, 'banner_image_url', ''),
              } as ContentItemProps;
            }
            else {
              return commonProps;
            }
          });
        }
        
        // Filter results by search query
        if (searchQuery) {
          data = data.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        
        // Filter by tags if selected
        if (selectedTags.length > 0) {
          data = data.filter(item => 
            item.tags && item.tags.some(tag => selectedTags.includes(tag))
          );
        }
        
        // Apply additional filters based on the active tab
        if (activeTab === 'artists') {
          // Filter by style if selected
          if (artistStyle && artistStyle !== 'all') {
            data = data.filter(item => 
              item.styles && item.styles.includes(artistStyle)
            );
          }
          
          // Filter by disciplinary type if selected
          if (disciplinaryType && disciplinaryType !== 'all') {
            data = data.filter(item => 
              item.disciplines && item.disciplines.includes(disciplinaryType)
            );
          }
        }
        
        // Filter by resource type if selected
        if (activeTab === 'resources' && resourceType && resourceType !== 'all') {
          data = data.filter(item => item.subtype === resourceType);
        }
        
        // Filter by subfilters if any are selected
        if (selectedSubfilters.length > 0) {
          data = data.filter(item => {
            // Check different properties based on the tab
            if (activeTab === 'artists' && item.disciplines) {
              return selectedSubfilters.some(filter => item.disciplines?.includes(filter));
            }
            if (activeTab === 'resources' && item.subtype) {
              return selectedSubfilters.includes(item.subtype);
            }
            if (activeTab === 'venues' && item.subtype) {
              return selectedSubfilters.includes(item.subtype);
            }
            return false;
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
