
import React from 'react';
import { Button } from '@/components/ui/button';
import ProfileTypeSelector from '../../auth/ProfileTypeSelector';

interface ProfileTypesStepProps {
  selectedProfileTypes: string[];
  setSelectedProfileTypes: (types: string[]) => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

const ProfileTypesStep: React.FC<ProfileTypesStepProps> = ({ 
  selectedProfileTypes, 
  setSelectedProfileTypes,
  onNext,
  isSubmitting = false
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
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={onNext}
          disabled={selectedProfileTypes.length === 0 || isSubmitting}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProfileTypesStep;
