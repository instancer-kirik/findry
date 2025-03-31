
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface RoleAttribute {
  [key: string]: any;
}

interface ProfileDetailsStepProps {
  selectedProfileTypes: string[];
  roleAttributes: Record<string, RoleAttribute>;
  handleRoleAttributeChange: (role: string, field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

const ProfileDetailsStep: React.FC<ProfileDetailsStepProps> = ({ 
  selectedProfileTypes,
  roleAttributes,
  handleRoleAttributeChange,
  onNext,
  onPrevious,
  isSubmitting
}) => {
  const renderRoleFields = (role: string) => {
    switch (role) {
      case 'creative':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-creative-types`}>Creative Fields</Label>
              <Input 
                id={`${role}-creative-types`}
                className="w-full"
                placeholder="e.g., Digital Art, Music, Writing"
                value={(roleAttributes[role]?.creative_types || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'creative_types', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-portfolio-links`}>Portfolio Links</Label>
              <Input 
                id={`${role}-portfolio-links`}
                className="w-full"
                placeholder="e.g., https://behance.net/yourname"
                value={(roleAttributes[role]?.portfolio_links || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'portfolio_links', e.target.value)}
              />
            </div>
          </div>
        );
      case 'brand':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-brand-name`}>Brand Name</Label>
              <Input 
                id={`${role}-brand-name`}
                className="w-full"
                placeholder="Your brand name"
                value={(roleAttributes[role]?.brand_name || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'brand_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-industry`}>Industry</Label>
              <Input 
                id={`${role}-industry`}
                className="w-full"
                placeholder="e.g., Fashion, Music, Technology"
                value={(roleAttributes[role]?.industry || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'industry', e.target.value)}
              />
            </div>
          </div>
        );
      case 'organization':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-org-name`}>Organization Name</Label>
              <Input 
                id={`${role}-org-name`}
                className="w-full"
                placeholder="Your organization name"
                value={(roleAttributes[role]?.org_name || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'org_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-org-type`}>Organization Type</Label>
              <Input 
                id={`${role}-org-type`}
                className="w-full"
                placeholder="e.g., Non-profit, Collective, Institution"
                value={(roleAttributes[role]?.org_type || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'org_type', e.target.value)}
              />
            </div>
          </div>
        );
      case 'service':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-service-type`}>Service Type</Label>
              <Input 
                id={`${role}-service-type`}
                className="w-full"
                placeholder="e.g., Consulting, Design, Marketing"
                value={(roleAttributes[role]?.service_type || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'service_type', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-expertise`}>Areas of Expertise</Label>
              <Input 
                id={`${role}-expertise`}
                className="w-full"
                placeholder="e.g., Branding, Strategy, Production"
                value={(roleAttributes[role]?.expertise || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'expertise', e.target.value)}
              />
            </div>
          </div>
        );
      case 'event':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-event-types`}>Event Types</Label>
              <Input 
                id={`${role}-event-types`}
                className="w-full"
                placeholder="e.g., Exhibitions, Workshops, Performances"
                value={(roleAttributes[role]?.event_types || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'event_types', e.target.value)}
              />
            </div>
          </div>
        );
      case 'user':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-interests`}>Main Interests</Label>
              <Input 
                id={`${role}-interests`}
                className="w-full"
                placeholder="e.g., Art, Music, Design, Technology"
                value={(roleAttributes[role]?.interests || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'interests', e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Profile Details for Selected Types</h3>
      
      {selectedProfileTypes.length === 0 ? (
        <p className="text-muted-foreground">
          No profile types selected. Go back to step 1 to select profile types.
        </p>
      ) : (
        selectedProfileTypes.map((type, index) => (
          <div key={type} className="space-y-4">
            {index > 0 && <Separator className="my-6" />}
            <h4 className="text-md font-medium capitalize">{type} Profile Details</h4>
            {renderRoleFields(type)}
          </div>
        ))
      )}

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Back
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={isSubmitting}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProfileDetailsStep;
