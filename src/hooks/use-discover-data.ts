
import { useState, useEffect } from 'react';
import { ContentItemProps } from '../components/marketplace/ContentCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Json {
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
      const { data, error } = await supabase.rpc('search_discover_content', {
        content_type: activeTab,
        search_query: searchQuery,
        tag_filters: selectedTags.length > 0 ? selectedTags : null
      });
      
      if (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem fetching the content",
          variant: "destructive"
        });
        setItems([]);
      } else {
        let filteredItems: ContentItemProps[] = [];
        
        if (data && Array.isArray(data)) {
          // Map the data to ContentItemProps format
          filteredItems = data.map((item: Json) => ({
            id: item.id,
            name: item.name,
            subtitle: item.subtype || item.type || '',
            location: item.location || 'Location not specified',
            tags: Array.isArray(item.tags) ? item.tags : [],
            type: item.type || '',
            image_url: item.image_url || '/placeholder.svg',
            multidisciplinary: item.multidisciplinary || false,
            styles: item.styles || [],
            disciplines: item.disciplines || []
          }));
          
          // Apply additional filters
          if (activeTab === 'resources' && resourceType !== 'all') {
            filteredItems = filteredItems.filter(item => 
              item.type.toLowerCase() === resourceType.toLowerCase()
            );
          }
          
          if (activeTab === 'artists') {
            if (artistStyle !== 'all') {
              filteredItems = filteredItems.filter(item => 
                item.styles && item.styles.some((style: string) => 
                  style.toLowerCase() === artistStyle.toLowerCase()
                )
              );
            }
            
            if (disciplinaryType !== 'all') {
              filteredItems = filteredItems.filter(item => 
                (disciplinaryType === 'multi' && item.multidisciplinary) || 
                (disciplinaryType === 'single' && !item.multidisciplinary)
              );
            }
          }
          
          // Apply subtab filtering
          if (activeSubTab !== 'all') {
            filteredItems = filteredItems.filter(item => 
              (item.subtype && item.subtype.toLowerCase() === activeSubTab.toLowerCase()) || 
              (item.type && item.type.toLowerCase() === activeSubTab.toLowerCase())
            );
          }
          
          // Apply multi-select subfilters
          if (selectedSubfilters.length > 0) {
            filteredItems = filteredItems.filter(item => 
              selectedSubfilters.some(filter => {
                if (item.tags.includes(filter)) return true;
                if (item.type.toLowerCase() === filter.toLowerCase()) return true;
                if (item.subtype && item.subtype.toLowerCase() === filter.toLowerCase()) return true;
                if (item.styles && item.styles.some((style: string) => 
                  style.toLowerCase() === filter.toLowerCase()
                )) return true;
                return false;
              })
            );
          }
        }
        
        setItems(filteredItems);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error loading data",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { items, isLoading, fetchData };
};
