import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

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
      case 'regular':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can always add profile types later from your account settings.
            </p>
          </div>
        );

      case 'artist':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-discipline`}>Primary Discipline</Label>
              <Select
                value={roleAttributes[role]?.discipline || ''}
                onValueChange={(value) => handleRoleAttributeChange(role, 'discipline', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary discipline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="visual_art">Visual Art</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="film">Film</SelectItem>
                  <SelectItem value="dance">Dance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-styles`}>Artistic Styles</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "contemporary", label: "Contemporary" },
                  { value: "traditional", label: "Traditional" },
                  { value: "experimental", label: "Experimental" },
                  { value: "minimalist", label: "Minimalist" },
                  { value: "abstract", label: "Abstract" },
                  { value: "realistic", label: "Realistic" },
                  { value: "surrealist", label: "Surrealist" },
                  { value: "urban", label: "Urban" },
                  { value: "folk", label: "Folk" }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${role}-styles-${option.value}`}
                      checked={roleAttributes[role]?.styles?.includes(option.value) || false}
                      onCheckedChange={(checked) => {
                        const currentValues = roleAttributes[role]?.styles || [];
                        const newValues = checked
                          ? [...currentValues, option.value]
                          : currentValues.filter(v => v !== option.value);
                        handleRoleAttributeChange(role, 'styles', newValues);
                      }}
                    />
                    <Label htmlFor={`${role}-styles-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-multidisciplinary`}>Multidisciplinary</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${role}-multidisciplinary`}
                  checked={roleAttributes[role]?.multidisciplinary || false}
                  onCheckedChange={(checked) => handleRoleAttributeChange(role, 'multidisciplinary', checked)}
                />
                <Label htmlFor={`${role}-multidisciplinary`}>I work across multiple disciplines</Label>
              </div>
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
              <Label htmlFor={`${role}-brand-archetype`}>Brand Archetype</Label>
              <Select
                value={roleAttributes[role]?.brand_archetype || ''}
                onValueChange={(value) => handleRoleAttributeChange(role, 'brand_archetype', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your brand archetype" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="innovator">Innovator</SelectItem>
                  <SelectItem value="curator">Curator</SelectItem>
                  <SelectItem value="patron">Patron</SelectItem>
                  <SelectItem value="collaborator">Collaborator</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-industry`}>Industry</Label>
              <Select
                value={roleAttributes[role]?.industry || ''}
                onValueChange={(value) => handleRoleAttributeChange(role, 'industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-brand-type`}>Brand Type</Label>
              <Select
                value={roleAttributes[role]?.brand_type || ''}
                onValueChange={(value) => handleRoleAttributeChange(role, 'brand_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your brand type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="record_label">Record Label</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-brand-values`}>Brand Values</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "innovation", label: "Innovation" },
                  { value: "sustainability", label: "Sustainability" },
                  { value: "community", label: "Community" },
                  { value: "authenticity", label: "Authenticity" },
                  { value: "excellence", label: "Excellence" },
                  { value: "diversity", label: "Diversity" },
                  { value: "creativity", label: "Creativity" },
                  { value: "collaboration", label: "Collaboration" }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${role}-brand-values-${option.value}`}
                      checked={roleAttributes[role]?.brand_values?.includes(option.value) || false}
                      onCheckedChange={(checked) => {
                        const currentValues = roleAttributes[role]?.brand_values || [];
                        const newValues = checked
                          ? [...currentValues, option.value]
                          : currentValues.filter(v => v !== option.value);
                        handleRoleAttributeChange(role, 'brand_values', newValues);
                      }}
                    />
                    <Label htmlFor={`${role}-brand-values-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-sponsorship`}>Sponsorship Available</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${role}-sponsorship`}
                  checked={roleAttributes[role]?.sponsorship_available || false}
                  onCheckedChange={(checked) => handleRoleAttributeChange(role, 'sponsorship_available', checked)}
                />
                <Label htmlFor={`${role}-sponsorship`}>I offer sponsorship opportunities</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-collaboration`}>Collaboration Types</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "sponsorship", label: "Sponsorship" },
                  { value: "partnership", label: "Partnership" },
                  { value: "commission", label: "Commission" },
                  { value: "residency", label: "Residency" },
                  { value: "exhibition", label: "Exhibition" },
                  { value: "performance", label: "Performance" },
                  { value: "workshop", label: "Workshop" },
                  { value: "other", label: "Other" }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${role}-collaboration-${option.value}`}
                      checked={roleAttributes[role]?.collaboration_types?.includes(option.value) || false}
                      onCheckedChange={(checked) => {
                        const currentValues = roleAttributes[role]?.collaboration_types || [];
                        const newValues = checked
                          ? [...currentValues, option.value]
                          : currentValues.filter(v => v !== option.value);
                        handleRoleAttributeChange(role, 'collaboration_types', newValues);
                      }}
                    />
                    <Label htmlFor={`${role}-collaboration-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Profile Details</h3>
      
      {selectedProfileTypes.length === 0 ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You can proceed as a regular user or go back to select profile types.
          </p>
          <Button 
            onClick={onNext}
            disabled={isSubmitting}
            className="w-full"
          >
            Continue as Regular User
          </Button>
        </div>
      ) : (
        <>
          {selectedProfileTypes.map((type, index) => (
            <div key={type} className="space-y-4">
              {index > 0 && <Separator className="my-6" />}
              <h4 className="text-md font-medium capitalize">{type} Profile Details</h4>
              {renderRoleFields(type)}
            </div>
          ))}

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
        </>
      )}
    </div>
  );
};

export default ProfileDetailsStep;
