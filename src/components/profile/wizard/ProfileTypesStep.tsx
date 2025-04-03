
import React from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PROFILE_TYPE_OPTIONS } from '@/types/profile';

interface ProfileTypesStepProps {
  selectedTypes: string[];
  onSelectType: (type: string) => void;
}

const ProfileTypesStep = ({
  selectedTypes,
  onSelectType,
}: ProfileTypesStepProps) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Choose Your Profile Types</h3>
        <p className="text-muted-foreground">
          Select one or more roles that represent you in the community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROFILE_TYPE_OPTIONS.map((option) => (
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
              const option = PROFILE_TYPE_OPTIONS.find((o) => o.id === type);
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
