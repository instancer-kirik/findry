
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';

interface Step {
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
  
  // Define steps
  const steps: Step[] = [
    {
      title: "What do you do?",
      description: "Select the roles that best describe you"
    },
    {
      title: "Basic Information",
      description: "Tell us about yourself"
    },
    {
      title: "Role-specific Details",
      description: "Add details relevant to your selected roles"
    },
    {
      title: "Almost Done",
      description: "Set your preferences and finish setup"
    }
  ];
  
  // Setup state
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<number[]>([]);
  const [selectedProfileTypes, setSelectedProfileTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile data state with default values
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    roleAttributes: {}
  });
  
  // Navigation functions
  const handleNext = () => {
    const newCompletedSteps = [...stepsCompleted];
    if (!newCompletedSteps.includes(currentStep)) {
      newCompletedSteps.push(currentStep);
    }
    setStepsCompleted(newCompletedSteps);
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  // Data handling functions
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
  
  // Submit function
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.displayName,
          bio: profileData.bio,
          profile_types: selectedProfileTypes,
          role_attributes: profileData.roleAttributes
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Call completion handler if provided
      if (onComplete) {
        onComplete();
      } else {
        navigate('/profile');
      }
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    currentStep,
    steps,
    stepsCompleted,
    selectedProfileTypes,
    setSelectedProfileTypes,
    profileData,
    isSubmitting,
    handleNext,
    handlePrevious,
    handleProfileDataChange,
    handleRoleAttributeChange,
    handleSubmit
  };
};
