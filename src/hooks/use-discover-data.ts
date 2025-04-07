
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
        let mockData: ContentItemProps[] = [];
        
        if (activeTab === 'artists') {
          mockData = [
            {
              id: generateUniqueId('artist'),
              name: 'DJ Soundwave',
              type: 'artist',
              subtype: 'musician',
              description: 'Electronic music producer and DJ with a unique sound',
              location: 'Los Angeles, CA',
              tags: ['electronic', 'dj', 'producer'],
              image_url: 'https://source.unsplash.com/random/800x600/?dj'
              // Removed author property as it's optional
            },
            {
              id: generateUniqueId('artist'),
              name: 'The Harmonics',
              type: 'artist',
              subtype: 'band',
              description: 'Indie rock band known for their energetic performances',
              location: 'Austin, TX',
              tags: ['indie', 'rock', 'band'],
              image_url: 'https://source.unsplash.com/random/800x600/?band'
            }
          ];
        } else if (activeTab === 'venues') {
          mockData = [
            {
              id: generateUniqueId('venue'),
              name: 'The Echo Chamber',
              type: 'venue',
              subtype: 'gallery',
              description: 'Contemporary art gallery featuring emerging artists',
              location: 'New York, NY',
              tags: ['gallery', 'contemporary', 'art'],
              image_url: 'https://source.unsplash.com/random/800x600/?gallery'
            },
            {
              id: generateUniqueId('venue'),
              name: 'Starfield Arena',
              type: 'venue',
              subtype: 'outdoor',
              description: 'Open-air venue perfect for large concerts and festivals',
              location: 'Nashville, TN',
              tags: ['outdoor', 'concert', 'festival'],
              image_url: 'https://source.unsplash.com/random/800x600/?concert'
            }
          ];
        } else if (activeTab === 'resources') {
          mockData = [
            {
              id: generateUniqueId('resource'),
              name: 'Professional Audio Equipment',
              type: 'resource',
              subtype: 'equipment',
              description: 'High-quality audio equipment available for rent',
              location: 'Chicago, IL',
              tags: ['audio', 'equipment', 'rental'],
              image_url: 'https://source.unsplash.com/random/800x600/?audio'
            },
            {
              id: generateUniqueId('resource'),
              name: 'Photography Studio',
              type: 'resource',
              subtype: 'equipment',
              description: 'Fully equipped photography studio available for booking',
              location: 'Miami, FL',
              tags: ['photography', 'studio', 'booking'],
              image_url: 'https://source.unsplash.com/random/800x600/?photography'
            }
          ];
        } else if (activeTab === 'brands') {
          mockData = [
            {
              id: generateUniqueId('brand'),
              name: 'Creative Minds',
              type: 'brand',
              subtype: 'sponsor',
              description: 'Agency supporting creative projects and events',
              location: 'Seattle, WA',
              tags: ['agency', 'sponsor', 'creative'],
              image_url: 'https://source.unsplash.com/random/800x600/?agency'
            },
            {
              id: generateUniqueId('brand'),
              name: 'Sound Innovations',
              type: 'brand',
              subtype: 'partner',
              description: 'Music technology company partnering with artists',
              location: 'San Francisco, CA',
              tags: ['technology', 'music', 'innovation'],
              image_url: 'https://source.unsplash.com/random/800x600/?technology'
            }
          ];
        } else if (activeTab === 'communities') {
          mockData = [
            {
              id: generateUniqueId('community'),
              name: 'Digital Artists Collective',
              type: 'community',
              subtype: 'community',
              description: 'A community of digital artists sharing resources and opportunities',
              location: 'Online',
              tags: ['digital', 'artists', 'collective'],
              image_url: 'https://source.unsplash.com/random/800x600/?digital-art'
            },
            {
              id: generateUniqueId('community'),
              name: 'Musicians Network',
              type: 'community',
              subtype: 'community',
              description: 'Professional network for musicians to connect and collaborate',
              location: 'Online / Various Locations',
              tags: ['musicians', 'network', 'collaboration'],
              image_url: 'https://source.unsplash.com/random/800x600/?musicians'
            }
          ];
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          mockData = mockData.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.description?.toLowerCase().includes(query) ||
            item.tags?.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        if (selectedTags.length > 0) {
          mockData = mockData.filter(item => 
            item.tags && selectedTags.some(tag => item.tags?.includes(tag))
          );
        }
        
        setItems(mockData);
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
