
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import BasicInfoStep from './wizard/BasicInfoStep';
import ProfileDetailsStep from './wizard/ProfileDetailsStep';
import ProfileTypesStep from './wizard/ProfileTypesStep';
import PreferencesStep from './wizard/PreferencesStep';
import StepIndicator, { WizardStep } from './wizard/StepIndicator';
import { ProfileFormValues } from '@/types/profile';

interface ProfileWizardProps {
  initialValues?: Partial<ProfileFormValues>;
  onComplete: (values: ProfileFormValues) => void;
  isSubmitting?: boolean;
}

const steps: WizardStep[] = [
  {
    id: "basic-info",
    title: "Basic Info",
    description: "Let's start with your basic information"
  },
  {
    id: "profile-types",
    title: "Profile Types",
    description: "Select the types of profiles you want to create"
  },
  {
    id: "profile-details",
    title: "Profile Details",
    description: "Add more details to your profile"
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Set your preferences and notification settings"
  }
];

export const ProfileWizard: React.FC<ProfileWizardProps> = ({
  initialValues = {},
  onComplete,
  isSubmitting = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<Record<string, boolean>>({});
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    username: initialValues.username || '',
    full_name: initialValues.full_name || '',
    avatar_url: initialValues.avatar_url || '',
    bio: initialValues.bio || '',
    profile_types: initialValues.profile_types || [],
    role_attributes: initialValues.role_attributes || {}
  });
  
  // New profile data state for BasicInfoStep
  const [profileData, setProfileData] = useState({
    displayName: initialValues.full_name || '',
    bio: initialValues.bio || '',
    location: '',
    website: ''
  });

  const handleProfileDataChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleNext = () => {
    // Mark current step as completed
    setStepsCompleted(prev => ({
      ...prev,
      [steps[currentStep].id]: true
    }));
    
    // Update form values based on step
    if (currentStep === 0) {
      setFormValues(prev => ({
        ...prev,
        full_name: profileData.displayName,
        bio: profileData.bio
      }));
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formValues);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRoleAttributeChange = (role: string, field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      role_attributes: {
        ...prev.role_attributes,
        [role]: {
          ...(prev.role_attributes[role] || {}),
          [field]: value
        }
      }
    }));
  };
  
  const handlePreferencesChange = (field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      role_attributes: {
        ...prev.role_attributes,
        preferences: {
          ...(prev.role_attributes.preferences || {}),
          [field]: value
        }
      }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            profileData={profileData}
            handleProfileDataChange={handleProfileDataChange}
            onNext={handleNext}
            onPrevious={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      case 1:
        return (
          <ProfileTypesStep
            selectedTypes={formValues.profile_types}
            onSelectType={(type) => {
              const types = formValues.profile_types.includes(type)
                ? formValues.profile_types.filter(t => t !== type)
                : [...formValues.profile_types, type];
              setFormValues(prev => ({ ...prev, profile_types: types }));
            }}
          />
        );
      case 2:
        return (
          <ProfileDetailsStep
            selectedProfileTypes={formValues.profile_types}
            roleAttributes={formValues.role_attributes}
            handleRoleAttributeChange={handleRoleAttributeChange}
            onNext={handleNext}
            onPrevious={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return (
          <PreferencesStep
            preferences={formValues.role_attributes.preferences}
            handlePreferencesChange={handlePreferencesChange}
            onComplete={handleNext}
            onPrevious={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>Tell us a bit about yourself to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onChange={(index) => setCurrentStep(index)}
            stepsCompleted={stepsCompleted}
          />
        </div>
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* Navigation buttons are now rendered within each step */}
      </CardFooter>
    </Card>
  );
};

export default ProfileWizard;
