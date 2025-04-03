
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Music, Pencil, Building, Store, MapPin, Users } from 'lucide-react';

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
    { id: 'artist', name: 'Artist', icon: <Music className="h-5 w-5 mr-2" />, description: 'Showcase your work and connect with venues and opportunities' },
    { id: 'creator', name: 'Creator', icon: <Pencil className="h-5 w-5 mr-2" />, description: 'Share content and build a following around your creative work' },
    { id: 'venue', name: 'Venue', icon: <Building className="h-5 w-5 mr-2" />, description: 'List your space and connect with artists for events' },
    { id: 'brand', name: 'Brand', icon: <Store className="h-5 w-5 mr-2" />, description: 'Discover creators for collaborations and partnerships' },
    { id: 'resource', name: 'Resource Provider', icon: <MapPin className="h-5 w-5 mr-2" />, description: 'Offer space, equipment, or services to the creative community' },
    { id: 'community', name: 'Community', icon: <Users className="h-5 w-5 mr-2" />, description: 'Connect with like-minded people around shared interests' }
  ];
  
  const toggleProfileType = (typeId: string) => {
    if (selectedProfileTypes.includes(typeId)) {
      setSelectedProfileTypes(selectedProfileTypes.filter(id => id !== typeId));
    } else {
      setSelectedProfileTypes([...selectedProfileTypes, typeId]);
    }
  };
  
  const canContinue = selectedProfileTypes.length > 0;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profileTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedProfileTypes.includes(type.id) ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => toggleProfileType(type.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    {type.icon}
                    <h3 className="font-medium">{type.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {type.description}
                  </p>
                </div>
                {selectedProfileTypes.includes(type.id) && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={!canContinue || isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? 'Processing...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileTypesStep;
