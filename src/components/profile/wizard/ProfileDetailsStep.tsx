
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface RoleAttribute {
  [key: string]: any;
}

interface ProfileDetailsStepProps {
  selectedProfileTypes: string[];
  roleAttributes: Record<string, RoleAttribute>;
  handleRoleAttributeChange: (role: string, field: string, value: any) => void;
}

const ProfileDetailsStep: React.FC<ProfileDetailsStepProps> = ({ 
  selectedProfileTypes,
  roleAttributes,
  handleRoleAttributeChange
}) => {
  const renderRoleFields = (role: string) => {
    switch (role) {
      case 'artist':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-art-styles`}>Art Styles</Label>
              <Input 
                id={`${role}-art-styles`}
                className="w-full"
                placeholder="e.g., Digital, Illustration, Oil Painting"
                value={(roleAttributes[role]?.art_styles || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'art_styles', e.target.value)}
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
      case 'venue':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-venue-name`}>Venue Name</Label>
              <Input 
                id={`${role}-venue-name`}
                className="w-full"
                placeholder="Your venue name"
                value={(roleAttributes[role]?.venue_name || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'venue_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-capacity`}>Capacity</Label>
              <Input 
                id={`${role}-capacity`}
                type="number"
                className="w-full"
                placeholder="Maximum capacity"
                value={(roleAttributes[role]?.capacity || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'capacity', e.target.value)}
              />
            </div>
          </div>
        );
      case 'resource':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-resource-type`}>Resource Type</Label>
              <Input 
                id={`${role}-resource-type`}
                className="w-full"
                placeholder="e.g., Studio, Equipment, Service"
                value={(roleAttributes[role]?.resource_type || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'resource_type', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-availability`}>Availability</Label>
              <Input 
                id={`${role}-availability`}
                className="w-full"
                placeholder="e.g., Weekdays, Evenings, By appointment"
                value={(roleAttributes[role]?.availability || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'availability', e.target.value)}
              />
            </div>
          </div>
        );
      case 'community':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-community-focus`}>Community Focus</Label>
              <Input 
                id={`${role}-community-focus`}
                className="w-full"
                placeholder="e.g., Digital Art, Sustainability, Education"
                value={(roleAttributes[role]?.community_focus || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'community_focus', e.target.value)}
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
      case 'project':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-project-focus`}>Project Focus</Label>
              <Input 
                id={`${role}-project-focus`}
                className="w-full"
                placeholder="e.g., Film, Publication, Research"
                value={(roleAttributes[role]?.project_focus || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'project_focus', e.target.value)}
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
    </div>
  );
};

export default ProfileDetailsStep;
