
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

export const useProfileWizard = (onComplete?: () => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Steps for the wizard
  const steps: WizardStep[] = [
    {
      id: 'profile-type',
      title: 'What do you want to use Findry for?',
      description: 'Select one or more profile types to get started.'
    },
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Tell us a bit about yourself.'
    },
    {
      id: 'profile-details',
      title: 'Profile Details',
      description: 'Add more specific information based on your profile type.'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Almost done! Let us know your preferences to tailor your experience.'
    }
  ];

  // State for tracking wizard progress
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<Record<string, boolean>>({
    'profile-type': false,
    'basic-info': false,
    'profile-details': false,
    'preferences': false
  });
  
  // Profile data
  const [selectedProfileTypes, setSelectedProfileTypes] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    roleAttributes: {}
  });
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Effect to create initial role attributes based on selected profile types
  useEffect(() => {
    const newRoleAttributes = { ...profileData.roleAttributes };
    
    selectedProfileTypes.forEach(type => {
      if (!newRoleAttributes[type]) {
        // Initialize with default empty values based on profile type
        switch (type) {
          case 'artist':
            newRoleAttributes[type] = {
              genres: [],
              skills: []
            };
            break;
          case 'venue':
            newRoleAttributes[type] = {
              capacity: '',
              amenities: []
            };
            break;
          case 'brand':
            newRoleAttributes[type] = {
              industry: '',
              products: []
            };
            break;
          default:
            newRoleAttributes[type] = {};
        }
      }
    });
    
    // Remove attributes for unselected profile types
    Object.keys(newRoleAttributes).forEach(key => {
      if (!selectedProfileTypes.includes(key)) {
        delete newRoleAttributes[key];
      }
    });
    
    setProfileData(prev => ({
      ...prev,
      roleAttributes: newRoleAttributes
    }));
  }, [selectedProfileTypes]);
  
  // Update completion status when moving between steps
  useEffect(() => {
    if (currentStep > 0) {
      setStepsCompleted(prev => ({
        ...prev,
        [steps[currentStep - 1].id]: true
      }));
    }
  }, [currentStep, steps]);
  
  // Handle moving to next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Handle moving to previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Handle profile data changes
  const handleProfileDataChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle role-specific attribute changes
  const handleRoleAttributeChange = (role: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      roleAttributes: {
        ...prev.roleAttributes,
        [role]: {
          ...prev.roleAttributes[role],
          [field]: value
        }
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to save profile data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success toast
      toast({
        title: "Profile created successfully",
        description: "Your profile has been set up and is ready to use."
      });
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      
      toast({
        title: "Error creating profile",
        description: "There was a problem setting up your profile. Please try again.",
        variant: "destructive"
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
