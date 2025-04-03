
import React from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProfileTypeOption {
  id: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface ProfileTypesStepProps {
  selectedTypes: string[];
  onSelectType: (type: string) => void;
}

const profileTypeOptions: ProfileTypeOption[] = [
  {
    id: 'artist',
    label: 'Artist',
    description: 'Create a profile for your artistic work and identity',
  },
  {
    id: 'venue',
    label: 'Venue',
    description: 'Manage a performance or exhibition space',
  },
  {
    id: 'organizer',
    label: 'Organizer',
    description: 'Create and manage events and community activities',
  },
  {
    id: 'brand',
    label: 'Brand',
    description: 'Manage your brand or company presence in the community',
  },
  {
    id: 'collector',
    label: 'Collector',
    description: 'Build a collection of art and creative works',
  },
];

export const ProfileTypesStep: React.FC<ProfileTypesStepProps> = ({
  selectedTypes,
  onSelectType,
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Choose Your Profile Types</h3>
        <p className="text-muted-foreground">
          Select one or more roles that represent you in the community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileTypeOptions.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all ${
              selectedTypes.includes(option.id)
                ? 'border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSelectType(option.id)}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div className="space-y-1">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
              </div>
              <div>
                {selectedTypes.includes(option.id) ? (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full border border-muted" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTypes.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Selected Profiles:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((type) => {
              const option = profileTypeOptions.find((o) => o.id === type);
              return (
                <Badge key={type} variant="secondary">
                  {option?.label || type}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectType(type);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTypesStep;
