
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Artist, Building, Camera, Calendar, Users, Briefcase, User, Mic2 } from 'lucide-react';

interface ProfileTypeOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

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
  const profileTypes: ProfileTypeOption[] = [
    {
      id: 'artist',
      label: 'Artist',
      description: 'Creative professionals such as musicians, painters, actors, etc.',
      icon: <Artist className="h-8 w-8" />
    },
    {
      id: 'venue',
      label: 'Venue',
      description: 'Performance spaces, galleries, or other hosting locations',
      icon: <Building className="h-8 w-8" />
    },
    {
      id: 'brand',
      label: 'Brand',
      description: 'Companies, labels, or commercial entities',
      icon: <Briefcase className="h-8 w-8" />
    },
    {
      id: 'creative',
      label: 'Creative',
      description: 'Individual creators and innovators',
      icon: <Camera className="h-8 w-8" />
    },
    {
      id: 'event',
      label: 'Event Organizer',
      description: 'Individuals or groups that organize events',
      icon: <Calendar className="h-8 w-8" />
    },
    {
      id: 'community',
      label: 'Community',
      description: 'Groups, collectives, or organizations',
      icon: <Users className="h-8 w-8" />
    },
    {
      id: 'resource',
      label: 'Resource Provider',
      description: 'Offering equipment, spaces, or services',
      icon: <Mic2 className="h-8 w-8" />
    },
    {
      id: 'user',
      label: 'User',
      description: 'Regular user account for fans and attendees',
      icon: <User className="h-8 w-8" />
    }
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
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">What best describes you?</h2>
        <p className="text-muted-foreground">
          Select all that apply. You can change this later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedProfileTypes.includes(type.id) 
                ? 'border-2 border-primary bg-primary/5' 
                : ''
            }`}
            onClick={() => toggleProfileType(type.id)}
          >
            <CardContent className="p-4 flex items-start space-x-4">
              <div className="mt-1 text-primary">
                {type.icon}
              </div>
              <div>
                <h3 className="font-medium">{type.label}</h3>
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
          className="w-full md:w-auto"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileTypesStep;
