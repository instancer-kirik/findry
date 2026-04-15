import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export interface Lyric {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  content: string;
  status: string;
  notes: string | null;
  tags: string[] | null;
  key_signature: string | null;
  tempo_bpm: number | null;
  mood: string | null;
  created_at: string;
  updated_at: string;
}

export function useLyrics(projectId?: string) {
  const { user } = useAuth();
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLyrics = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('lyrics').select('*').order('updated_at', { ascending: false });
      if (projectId) {
        query = query.eq('project_id', projectId);
      } else if (user) {
        query = query.eq('user_id', user.id);
      }
      const { data, error: err } = await query;
      if (err) throw err;
      setLyrics(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createLyric = async (lyric: Partial<Lyric>) => {
    if (!user) throw new Error('Must be logged in');
    const { data, error } = await supabase
      .from('lyrics')
      .insert({ ...lyric, user_id: user.id, title: lyric.title || 'Untitled' })
      .select()
      .single();
    if (error) throw error;
    setLyrics(prev => [data, ...prev]);
    return data;
  };

  const updateLyric = async (id: string, updates: Partial<Lyric>) => {
    const { data, error } = await supabase
      .from('lyrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setLyrics(prev => prev.map(l => l.id === id ? data : l));
    return data;
  };

  const deleteLyric = async (id: string) => {
    const { error } = await supabase.from('lyrics').delete().eq('id', id);
    if (error) throw error;
    setLyrics(prev => prev.filter(l => l.id !== id));
  };

  useEffect(() => {
    fetchLyrics();
  }, [user, projectId]);

  return { lyrics, loading, error, createLyric, updateLyric, deleteLyric, refetch: fetchLyrics };
}
