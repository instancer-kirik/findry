import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/types';

interface SearchResult {
  id: string;
  name: string;
  type: string;
  description: string;
  tags?: string[];
  imageUrl?: string;
  author: Profile;
  createdAt?: string;
}

interface UseSearchProps {
  initialQuery?: string;
  initialType?: string;
}

export const useSearch = ({ initialQuery = '', initialType = 'all' }: UseSearchProps = {}) => {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);

    try {
      let queryBuilder;
      
      if (type === 'all' || type === 'profile') {
        queryBuilder = supabase
          .from('profiles')
          .select('*');

        if (query) {
          queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,username.ilike.%${query}%`);
        }

        if (type !== 'all') {
          queryBuilder = queryBuilder.eq('type', type);
        }

        const { data: profiles, error: profileError } = await queryBuilder;
        if (profileError) throw profileError;

        const profileResults = profiles?.map(item => ({
          id: item.id,
          name: item.full_name || item.username,
          type: item.type || 'user',
          description: item.bio || '',
          imageUrl: item.avatar_url,
          author: item,
          createdAt: item.created_at
        })) || [];

        setResults(profileResults);
      } else if (type === 'event') {
        queryBuilder = supabase
          .from('events')
          .select('*, profiles(*)');

        if (query) {
          queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        }

        const { data: events, error: eventError } = await queryBuilder;
        if (eventError) throw eventError;

        const eventResults = events?.map(item => ({
          id: item.id,
          name: item.name,
          type: 'event',
          description: item.description,
          imageUrl: item.image_url,
          author: item.profiles,
          createdAt: item.created_at
        })) || [];

        setResults(eventResults);
      } else if (type === 'content') {
        queryBuilder = supabase
          .from('content')
          .select('*, profiles(*)');

        if (query) {
          queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
        }

        const { data: content, error: contentError } = await queryBuilder;
        if (contentError) throw contentError;

        const contentResults = content?.map(item => ({
          id: item.id,
          name: item.title,
          type: 'content',
          description: item.description,
          imageUrl: item.image_url,
          author: item.profiles,
          createdAt: item.created_at
        })) || [];

        setResults(contentResults);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return {
    query,
    setQuery,
    type,
    setType,
    results,
    loading,
    error,
    search,
    clearResults
  };
}; 