
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
import { BasicInfoStep } from './wizard/BasicInfoStep';
import { ProfileDetailsStep } from './wizard/ProfileDetailsStep';
import { ProfileTypesStep } from './wizard/ProfileTypesStep';
import { PreferencesStep } from './wizard/PreferencesStep';
import { StepIndicator } from './wizard/StepIndicator';
import { ProfileFormValues } from '@/types/profile';

interface ProfileWizardProps {
  initialValues?: Partial<ProfileFormValues>;
  onComplete: (values: ProfileFormValues) => void;
  isSubmitting?: boolean;
}

interface Step {
  id: string;
  title: string;
  description: string;
}

const steps: Step[] = [
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
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    username: initialValues.username || '',
    full_name: initialValues.full_name || '',
    avatar_url: initialValues.avatar_url || '',
    bio: initialValues.bio || '',
    profile_types: initialValues.profile_types || [],
    role_attributes: initialValues.role_attributes || {}
  });
  
  const handleNext = () => {
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

  const updateFormValues = (values: Partial<ProfileFormValues>) => {
    setFormValues(prev => ({
      ...prev,
      ...values
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            username={formValues.username}
            fullName={formValues.full_name}
            onChange={(values) => updateFormValues({
              username: values.username,
              full_name: values.fullName
            })}
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
              updateFormValues({ profile_types: types });
            }}
          />
        );
      case 2:
        return (
          <ProfileDetailsStep
            bio={formValues.bio}
            avatarUrl={formValues.avatar_url}
            onChange={(values) => updateFormValues({
              bio: values.bio,
              avatar_url: values.avatarUrl
            })}
          />
        );
      case 3:
        return (
          <PreferencesStep
            preferences={formValues.role_attributes || {}}
            onChange={(preferences) => updateFormValues({
              role_attributes: preferences
            })}
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
            onStepClick={(index) => setCurrentStep(index)}
          />
        </div>
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {currentStep === steps.length - 1 ? (isSubmitting ? 'Saving...' : 'Complete') : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileWizard;
