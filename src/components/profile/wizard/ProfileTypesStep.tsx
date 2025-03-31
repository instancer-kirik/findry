
import React from 'react';
import ProfileTypeSelector from '../../auth/ProfileTypeSelector';

interface ProfileTypesStepProps {
  selectedProfileTypes: string[];
  setSelectedProfileTypes: (types: string[]) => void;
}

const ProfileTypesStep: React.FC<ProfileTypesStepProps> = ({ 
  selectedProfileTypes, 
  setSelectedProfileTypes 
}) => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-4">
        Select the types of profiles you want to create. You can select multiple types if needed.
      </p>
      <ProfileTypeSelector 
        value={selectedProfileTypes} 
        onChange={setSelectedProfileTypes} 
      />
    </div>
  );
};

export default ProfileTypesStep;
