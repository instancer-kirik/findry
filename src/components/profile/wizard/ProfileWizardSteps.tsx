
import React from 'react';
import ProfileTypesStep from './ProfileTypesStep';
import BasicInfoStep from './BasicInfoStep';
import ProfileDetailsStep from './ProfileDetailsStep';
import PreferencesStep from './PreferencesStep';

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

interface ProfileWizardStepsProps {
  currentStep: number;
  selectedProfileTypes: string[];
  setSelectedProfileTypes: (types: string[]) => void;
  profileData: ProfileData;
  handleProfileDataChange: (field: string, value: string) => void;
  handleRoleAttributeChange: (role: string, field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  isSubmitting: boolean;
}

const ProfileWizardSteps: React.FC<ProfileWizardStepsProps> = ({
  currentStep,
  selectedProfileTypes,
  setSelectedProfileTypes,
  profileData,
  handleProfileDataChange,
  handleRoleAttributeChange,
  onNext,
  onPrevious,
  onComplete,
  isSubmitting
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProfileTypesStep 
            selectedProfileTypes={selectedProfileTypes} 
            setSelectedProfileTypes={setSelectedProfileTypes}
            onNext={onNext}
            isSubmitting={isSubmitting}
          />
        );
      case 1:
        return (
          <BasicInfoStep 
            profileData={profileData} 
            handleProfileDataChange={handleProfileDataChange}
            onNext={onNext}
            onPrevious={onPrevious}
            isSubmitting={isSubmitting}
          />
        );
      case 2:
        return (
          <ProfileDetailsStep 
            selectedProfileTypes={selectedProfileTypes}
            roleAttributes={profileData.roleAttributes}
            handleRoleAttributeChange={handleRoleAttributeChange}
            onNext={onNext}
            onPrevious={onPrevious}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return (
          <PreferencesStep 
            onPrevious={onPrevious}
            onComplete={onComplete}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return renderStepContent();
};

export default ProfileWizardSteps;
