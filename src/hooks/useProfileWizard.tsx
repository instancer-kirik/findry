import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/types';

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

interface RoleAttribute {
  [key: string]: any;
}

interface ProfileData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  roleAttributes: Record<string, RoleAttribute>;
}

interface UseProfileWizardProps {
  userId: string;
}

export const useProfileWizard = ({ userId }: UseProfileWizardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data);
          setFormData({
            username: data.username || '',
            full_name: data.full_name || '',
            bio: data.bio || '',
            avatar_url: data.avatar_url || ''
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return {
    profile,
    loading,
    error,
    step,
    formData,
    setFormData,
    updateProfile,
    nextStep,
    prevStep
  };
};
