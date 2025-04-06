import { useEffect, useState } from 'react';
import { ContentItemProps } from '@/components/marketplace/ContentCard';

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
        // Determine which data to fetch based on category
        // For demonstration, we're using sample data
        let result: ContentItemProps[] = [];

        // Add project sample data that simulates a Meta Project Tracker
        const projectsSampleData: ContentItemProps[] = [
          {
            id: 'meta-project-tracker',
            name: 'Meta Project Tracker',
            type: 'project',
            subtype: 'development',
            location: 'Global',
            tags: ['react', 'typescript', 'project-management'],
            image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          },
          {
            id: 'components-library',
            name: 'Components Library',
            type: 'project',
            subtype: 'ui',
            location: 'Frontend',
            tags: ['ui', 'components', 'shadcn'],
            image_url: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          },
          {
            id: 'artist-platform',
            name: 'Artist Platform',
            type: 'project',
            subtype: 'application',
            location: 'Online',
            tags: ['artists', 'portfolio', 'marketplace'],
            image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          }
        ];

        // Simulate fetching data based on category
        if (category === 'artists') {
          // Fetch artists data
          result = [
            {
              id: 'artist1',
              name: 'John Doe',
              type: 'artist',
              location: 'New York',
              tags: ['music', 'pop'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
            {
              id: 'artist2',
              name: 'Jane Smith',
              type: 'artist',
              location: 'Los Angeles',
              tags: ['art', 'painting'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
          ];
        } else if (category === 'resources') {
          // Fetch resources data
          result = [
            {
              id: 'resource1',
              name: 'Studio A',
              type: 'resource',
              location: 'New York',
              tags: ['studio', 'music'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
            {
              id: 'resource2',
              name: 'Gallery B',
              type: 'resource',
              location: 'Los Angeles',
              tags: ['gallery', 'art'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
          ];
        } else if (category === 'events') {
          // Fetch events data
          result = [
            {
              id: 'event1',
              name: 'Concert',
              type: 'event',
              location: 'New York',
              tags: ['music', 'live'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
            {
              id: 'event2',
              name: 'Exhibition',
              type: 'event',
              location: 'Los Angeles',
              tags: ['art', 'gallery'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
          ];
        } else if (category === 'venues') {
          // Fetch venues data
          result = [
            {
              id: 'venue1',
              name: 'The Venue',
              type: 'venue',
              location: 'New York',
              tags: ['music', 'live'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
            {
              id: 'venue2',
              name: 'The Gallery',
              type: 'venue',
              location: 'Los Angeles',
              tags: ['art', 'gallery'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
          ];
        } else if (category === 'communities') {
          // Fetch communities data
          result = [
            {
              id: 'community1',
              name: 'The Community',
              type: 'community',
              location: 'New York',
              tags: ['music', 'live'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
            {
              id: 'community2',
              name: 'The Art Collective',
              type: 'community',
              location: 'Los Angeles',
              tags: ['art', 'gallery'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
          ];
        } else if (category === 'brands') {
          // Fetch brands data
          result = [
            {
              id: 'brand1',
              name: 'The Brand',
              type: 'brand',
              location: 'New York',
              tags: ['music', 'live'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
            {
              id: 'brand2',
              name: 'The Art Brand',
              type: 'brand',
              location: 'Los Angeles',
              tags: ['art', 'gallery'],
              image_url: 'https://images.unsplash.com/photo-1543968536-c825e4aa6a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            },
          ];
        }

        // Add in the project data if category is projects
        if (category === 'projects') {
          result = [...projectsSampleData];
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
          result = result.filter(item => item.disciplines?.includes(disciplinaryType));
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
