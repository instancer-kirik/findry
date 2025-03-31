
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
}

const ProfileWizardSteps: React.FC<ProfileWizardStepsProps> = ({
  currentStep,
  selectedProfileTypes,
  setSelectedProfileTypes,
  profileData,
  handleProfileDataChange,
  handleRoleAttributeChange
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProfileTypesStep 
            selectedProfileTypes={selectedProfileTypes} 
            setSelectedProfileTypes={setSelectedProfileTypes} 
          />
        );
      case 1:
        return (
          <BasicInfoStep 
            profileData={profileData} 
            handleProfileDataChange={handleProfileDataChange} 
          />
        );
      case 2:
        return (
          <ProfileDetailsStep 
            selectedProfileTypes={selectedProfileTypes}
            roleAttributes={profileData.roleAttributes}
            handleRoleAttributeChange={handleRoleAttributeChange}
          />
        );
      case 3:
        return <PreferencesStep />;
      default:
        return null;
    }
  };

  return renderStepContent();
};

export default ProfileWizardSteps;
