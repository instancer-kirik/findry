
import { useState, useEffect } from 'react';
import { ContentItemProps } from '../components/marketplace/ContentCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  artists, 
  resources, 
  projects, 
  events, 
  venues, 
  communities, 
  brands 
} from '../components/discover/DiscoverData';

// Use a local Json interface to avoid conflicts
interface LocalJson {
  [key: string]: any;
}

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300); // Debounce for search input
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedTags, resourceType, artistStyle, disciplinaryType, activeSubTab, activeTab, selectedSubfilters]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase.rpc('search_discover_content', {
        content_type: activeTab,
        search_query: searchQuery,
        tag_filters: selectedTags.length > 0 ? selectedTags : null
      });
      
      if (error) {
        console.error('Error fetching data from Supabase:', error);
        // Fall back to mock data if Supabase fails
        useFallbackData();
      } else if (data && Array.isArray(data) && data.length > 0) {
        let filteredItems = processData(data);
        setItems(filteredItems);
      } else {
        console.warn('No data returned from Supabase, using fallback data');
        useFallbackData();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      // Fall back to mock data on any error
      useFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  const useFallbackData = () => {
    console.log('Using fallback data for', activeTab);
    // Use mock data from DiscoverData.ts
    let mockData: ContentItemProps[] = [];
    
    switch (activeTab) {
      case 'artists':
        mockData = artists;
        break;
      case 'resources':
        mockData = resources;
        break;
      case 'projects':
        mockData = projects;
        break;
      case 'events':
        mockData = events;
        break;
      case 'venues':
        mockData = venues;
        break;
      case 'communities':
        mockData = communities;
        break;
      case 'brands':
        mockData = brands;
        break;
      default:
        mockData = [];
    }
    
    let filteredItems = processData(mockData);
    setItems(filteredItems);
  };

  const processData = (data: any[]): ContentItemProps[] => {
    // Map any data format to ContentItemProps
    let itemsData = data.map((item: LocalJson) => ({
      id: item.id,
      name: item.name,
      subtitle: item.subtype || item.type || '',
      location: item.location || 'Location not specified',
      tags: Array.isArray(item.tags) ? item.tags : [],
      type: item.type || '',
      image_url: item.image_url || '/placeholder.svg',
      multidisciplinary: item.multidisciplinary || false,
      styles: item.styles || [],
      disciplines: item.disciplines || [],
      // Add empty author that can be populated later if needed
      author: item.author
    })) as ContentItemProps[];
    
    // Apply additional filters
    if (activeTab === 'resources' && resourceType !== 'all') {
      itemsData = itemsData.filter(item => 
        item.type?.toLowerCase() === resourceType.toLowerCase()
      );
    }
    
    if (activeTab === 'artists') {
      if (artistStyle !== 'all') {
        itemsData = itemsData.filter(item => 
          item.styles && item.styles.some((style: string) => 
            style.toLowerCase() === artistStyle.toLowerCase()
          )
        );
      }
      
      if (disciplinaryType !== 'all') {
        itemsData = itemsData.filter(item => 
          (disciplinaryType === 'multi' && item.multidisciplinary) || 
          (disciplinaryType === 'single' && !item.multidisciplinary)
        );
      }
    }
    
    // Apply subtab filtering
    if (activeSubTab !== 'all') {
      itemsData = itemsData.filter(item => 
        (item.subtitle && item.subtitle.toLowerCase() === activeSubTab.toLowerCase()) || 
        (item.type && item.type.toLowerCase() === activeSubTab.toLowerCase())
      );
    }
    
    // Apply multi-select subfilters
    if (selectedSubfilters.length > 0) {
      itemsData = itemsData.filter(item => 
        selectedSubfilters.some(filter => {
          if (item.tags?.includes(filter)) return true;
          if (item.type?.toLowerCase() === filter.toLowerCase()) return true;
          if (item.subtitle?.toLowerCase() === filter.toLowerCase()) return true;
          if (item.styles && item.styles.some((style: string) => 
            style.toLowerCase() === filter.toLowerCase()
          )) return true;
          return false;
        })
      );
    }
    
    return itemsData;
  };

  return { items, isLoading, fetchData };
};
