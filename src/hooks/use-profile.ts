
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { Profile } from '@/types/profile';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        // Convert role_attributes from Json to Record<string, any>
        const profileData = {
          ...data,
          role_attributes: data.role_attributes || {}
        };
        setProfile(profileData as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) {
        return { error };
      } else if (data) {
        // Convert role_attributes from Json to Record<string, any>
        const profileData = {
          ...data,
          role_attributes: data.role_attributes || {}
        };
        setProfile(profileData as Profile);
        return { data: profileData };
      }
      return { error: new Error('Failed to update profile') };
    } catch (error) {
      return { error };
    }
  };

  return { profile, loading, updateProfile, refreshProfile: fetchProfile };
}
