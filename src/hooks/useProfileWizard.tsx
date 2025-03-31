
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

export const useProfileWizard = (onComplete?: () => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProfileTypes, setSelectedProfileTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepsCompleted, setStepsCompleted] = useState<Record<string, boolean>>({});
  
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    roleAttributes: {}
  });

  const steps: WizardStep[] = [
    {
      id: 'profile-types',
      title: 'Profile Types',
      description: 'Select the types of profiles you want to create'
    },
    {
      id: 'basics',
      title: 'Basic Information',
      description: 'Let\'s start with your profile basics'
    },
    {
      id: 'details',
      title: 'Profile Details',
      description: 'Tell us more about your work and interests'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Set your preferences and customize your experience'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setStepsCompleted(prev => ({
        ...prev,
        [steps[currentStep].id]: true
      }));
      
      setCurrentStep(prev => prev + 1);
      
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleProfileDataChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleAttributeChange = (role: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      roleAttributes: {
        ...prev.roleAttributes,
        [role]: {
          ...(prev.roleAttributes[role] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      setStepsCompleted(prev => ({
        ...prev,
        [steps[currentStep].id]: true
      }));
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      const submitData = {
        id: user.id,
        username: profileData.displayName.toLowerCase().replace(/\s+/g, '_'),
        full_name: profileData.displayName,
        bio: profileData.bio,
        profile_types: selectedProfileTypes,
        role_attributes: profileData.roleAttributes,
        updated_at: new Date().toISOString()
      };
      
      const operation = existingProfile 
        ? supabase.from('profiles').update(submitData).eq('id', user.id)
        : supabase.from('profiles').insert([submitData]);
        
      const { error: updateError } = await operation;
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: 'Profile setup complete!',
        description: 'Your profile has been successfully set up.',
      });
      
      if (onComplete) {
        onComplete();
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error completing profile setup:', error);
      toast({
        title: 'Error',
        description: 'There was a problem setting up your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error || !profile) return;
        
        if (profile.full_name) {
          setProfileData(prev => ({
            ...prev,
            displayName: profile.full_name || '',
            bio: profile.bio || '',
          }));
        }
        
        if (profile.profile_types && Array.isArray(profile.profile_types)) {
          setSelectedProfileTypes(profile.profile_types);
        }
        
        if (profile.role_attributes) {
          setProfileData(prev => ({
            ...prev,
            roleAttributes: profile.role_attributes as Record<string, RoleAttribute>
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, []);

  return {
    currentStep,
    steps,
    stepsCompleted,
    selectedProfileTypes,
    profileData,
    isSubmitting,
    handleNext,
    handlePrevious,
    handleProfileDataChange,
    handleRoleAttributeChange,
    handleSubmit,
    setSelectedProfileTypes
  };
};
