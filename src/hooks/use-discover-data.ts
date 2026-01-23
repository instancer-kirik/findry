import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentItemProps } from '@/types/content';
import { 
  artists, 
  resources, 
  projects, 
  events, 
  venues, 
  communities, 
  brands, 
  albums, 
  songs, 
  artworks 
} from '@/components/discover/DiscoverData';

// Helper function to safely get a property
function safeProp<T, K extends keyof T>(obj: T, key: K, defaultValue: T[K]): T[K] {
  return (obj && obj[key] !== undefined && obj[key] !== null) ? obj[key] : defaultValue;
}

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
        
        // Map activeTab to appropriate data source
        switch(activeTab) {
          case 'artists':
            // Fetch from Supabase
            const { data: dbArtists, error: artistsError } = await supabase
              .from('artists')
              .select('*');
            
            if (artistsError) {
              console.error('Error fetching artists:', artistsError);
              data = [...artists]; // Fallback to demo data
            } else if (dbArtists && dbArtists.length > 0) {
              data = dbArtists.map(artist => ({
                id: artist.id,
                name: artist.name,
                type: 'artist',
                subtype: artist.subtype || artist.type || 'musician',
                description: artist.bio || '',
                location: artist.location || '',
                tags: artist.tags || [],
                image_url: artist.image_url || '',
                styles: artist.styles || [],
                disciplines: artist.disciplines || [],
              }));
            } else {
              data = [...artists]; // Fallback to demo data if DB is empty
            }
            break;
          case 'resources':
            data = [...resources];
            break;
          case 'events':
            data = [...events];
            break;
          case 'venues':
            data = [...venues];
            break;
          case 'communities':
            data = [...communities];
            break;
          case 'brands':
            data = [...brands];
            break;
          case 'projects':
            // Fetch from unified_projects view
            const { data: unifiedProjectsData, error: unifiedError } = await supabase
              .from('unified_projects')
              .select('*')
              .order('featured', { ascending: false })
              .order('updated_at', { ascending: false });
            
            if (unifiedError) {
              console.error('Error fetching unified projects:', unifiedError);
              data = [...projects]; // Fallback to demo data
            } else if (unifiedProjectsData && unifiedProjectsData.length > 0) {
              data = unifiedProjectsData.map(p => ({
                id: p.id,
                name: p.name,
                type: 'project',
                subtype: p.project_type || p.status || 'active',
                description: p.description || '',
                location: p.domain || '',
                tags: p.tech_stack || p.features || [],
                image_url: '',
                source_url: p.source_url,
                emoji: p.emoji,
                featured: p.featured,
              }));
            } else {
              data = [...projects]; // Fallback to demo data if DB is empty
            }
            break;
          case 'albums':
            data = [...albums];
            break;
          case 'songs':
            data = [...songs];
            break;
          case 'artworks':
            data = [...artworks];
            break;
          default:
            data = [];
        }
        
        // Apply search query if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          data = data.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.location.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query)) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) ||
            (item.artist_name && item.artist_name.toLowerCase().includes(query)) ||
            (item.album_name && item.album_name.toLowerCase().includes(query))
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
          data = data.filter(item => {
            if (resourceType === 'art_space') {
              return item.subtype === 'Art Space';
            } else if (resourceType === 'art_tools') {
              return item.subtype === 'Art Tools' || item.subtype === 'Art Supplier';
            } else {
              return item.type === resourceType || item.subtype === resourceType;
            }
          });
        }
        
        // Filter by album type
        if (activeTab === 'albums' && activeSubTab !== 'all') {
          data = data.filter(item => {
            switch(activeSubTab) {
              case 'full-length':
                return item.subtype === 'Album';
              case 'ep':
                return item.subtype === 'EP';
              case 'single':
                return item.subtype === 'Single';
              case 'compilation':
                return item.subtype === 'Compilation';
              case 'live':
                return item.subtype === 'Live';
              default:
                return true;
            }
          });
        }
        
        // Filter by song type
        if (activeTab === 'songs' && activeSubTab !== 'all') {
          data = data.filter(item => {
            const tags = item.tags || [];
            switch(activeSubTab) {
              case 'singles':
                return !item.album_id || tags.includes('Single');
              case 'album-tracks':
                return !!item.album_id;
              case 'unreleased':
                return tags.includes('Unreleased');
              case 'live':
                return tags.includes('Live');
              case 'remix':
                return tags.includes('Remix');
              default:
                return true;
            }
          });
        }
        
        // Filter by artwork type
        if (activeTab === 'artworks' && activeSubTab !== 'all') {
          data = data.filter(item => {
            switch(activeSubTab) {
              case 'paintings':
                return item.subtype === 'Painting';
              case 'sculptures':
                return item.subtype === 'Sculpture';
              case 'digital':
                return item.subtype === 'Digital';
              case 'installations':
                return item.subtype === 'Installation';
              case 'performances':
                return item.subtype === 'Performance';
              case 'photography':
                return item.subtype === 'Photography';
              case 'mixed-media':
                return item.subtype === 'Mixed Media';
              default:
                return true;
            }
          });
        }
        
        // Filter projects by status/type
        if (activeTab === 'projects' && activeSubTab !== 'all') {
          data = data.filter(item => {
            const subtype = (item.subtype || '').toLowerCase();
            const status = (item.status || '').toLowerCase();
            const filterValue = activeSubTab.toLowerCase();
            return subtype === filterValue || status === filterValue;
          });
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
            if (activeTab === 'projects') {
              // Filter by domain (stored in location field for projects)
              const domain = (item.location || '').toLowerCase();
              return selectedSubfilters.some(filter => domain.includes(filter.toLowerCase()));
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
  }, [
    activeTab, 
    searchQuery, 
    selectedTags, 
    resourceType, 
    artistStyle, 
    disciplinaryType, 
    activeSubTab, 
    selectedSubfilters
  ]);

  return { items, isLoading, error };
};
