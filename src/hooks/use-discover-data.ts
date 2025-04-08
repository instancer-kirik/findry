
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
        const table = activeTab as 'artists' | 'venues' | 'resources' | 'projects' | 'brands' | 'communities' | 'shops';
        
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
              type: activeTab.substring(0, activeTab.length - 1), // Remove 's' to get singular
              location: item.location || 'Unknown location',
              description: item.description || item.bio || '',
              image_url: item.image_url || item.logo_url || item.banner_image_url || '',
              tags: item.tags || [],
              subtype: item.subtype || item.type || '',
            };
            
            // Add specific properties based on the type
            switch(activeTab) {
              case 'artists':
                return {
                  ...commonProps,
                  disciplines: item.disciplines,
                  styles: item.styles,
                  multidisciplinary: item.multidisciplinary,
                } as ContentItemProps;
              case 'venues':
                return {
                  ...commonProps,
                  capacity: item.capacity,
                  amenities: item.amenities,
                } as ContentItemProps;
              case 'resources':
                return {
                  ...commonProps,
                  availability: item.availability,
                } as ContentItemProps;
              case 'projects':
                return {
                  ...commonProps,
                  status: item.status,
                  version: item.version,
                  progress: item.progress,
                  repoUrl: item.repo_url,
                  budget: item.budget,
                  timeline: item.timeline,
                } as ContentItemProps;
              case 'brands':
                return commonProps;
              case 'communities':
                return {
                  ...commonProps,
                  category: item.category,
                  created_by: item.created_by,
                } as ContentItemProps;
              case 'shops':
                return {
                  ...commonProps,
                  website_url: item.website_url,
                  logo_url: item.logo_url,
                  banner_image_url: item.banner_image_url,
                } as ContentItemProps;
              default:
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
