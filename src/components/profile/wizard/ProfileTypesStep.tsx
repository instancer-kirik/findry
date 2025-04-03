
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ProfileTypesStepProps {
  selectedProfileTypes: string[];
  setSelectedProfileTypes: (types: string[]) => void;
  onNext: () => void;
  isSubmitting: boolean;
}

const ProfileTypesStep: React.FC<ProfileTypesStepProps> = ({
  selectedProfileTypes,
  setSelectedProfileTypes,
  onNext,
  isSubmitting
}) => {
  const profileTypes = [
    { id: 'artist', name: 'Artist', description: 'Create and showcase your art' },
    { id: 'venue', name: 'Venue', description: 'Manage a space for events and exhibitions' },
    { id: 'curator', name: 'Curator', description: 'Organize exhibitions and events' },
    { id: 'collector', name: 'Collector', description: 'Collect and showcase artwork' },
    { id: 'organization', name: 'Organization', description: 'Represent an arts organization' }
  ];

  const toggleProfileType = (typeId: string) => {
    if (selectedProfileTypes.includes(typeId)) {
      setSelectedProfileTypes(selectedProfileTypes.filter(id => id !== typeId));
    } else {
      setSelectedProfileTypes([...selectedProfileTypes, typeId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all ${
              selectedProfileTypes.includes(type.id) 
                ? 'border-primary shadow-md' 
                : 'border-muted'
            }`}
            onClick={() => toggleProfileType(type.id)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 ${
                selectedProfileTypes.includes(type.id) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'border border-muted-foreground'
              }`}>
                {selectedProfileTypes.includes(type.id) && <Check className="h-3 w-3" />}
              </div>
              <div>
                <h3 className="font-medium">{type.name}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
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
