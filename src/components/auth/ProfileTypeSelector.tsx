
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Music, 
  Building, 
  Bot, 
  Store, 
  Calendar, 
  Briefcase 
} from 'lucide-react';

// Update the ProfileType to include all possible types
export type ProfileType = 'artist' | 'community' | 'venue' | 'resource' | 'brand' | 'event' | 'project';

interface ProfileOption {
  id: ProfileType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface ProfileTypeSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const ProfileTypeSelector: React.FC<ProfileTypeSelectorProps> = ({ value, onChange }) => {
  const profileOptions: ProfileOption[] = [
    {
      id: 'artist',
      label: 'Artist',
      icon: <Music className="h-5 w-5" />,
      description: 'Creator, musician, performer, etc.'
    },
    {
      id: 'venue',
      label: 'Venue',
      icon: <Building className="h-5 w-5" />,
      description: 'Performance or exhibition space'
    },
    {
      id: 'resource',
      label: 'Resource',
      icon: <Bot className="h-5 w-5" />,
      description: 'Service provider, educator, or tool'
    },
    {
      id: 'community',
      label: 'Community',
      icon: <Users className="h-5 w-5" />,
      description: 'Group, collective, or organization'
    },
    {
      id: 'brand',
      label: 'Brand',
      icon: <Store className="h-5 w-5" />,
      description: 'Company, business, or commercial entity'
    },
    {
      id: 'event',
      label: 'Event',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Organizer of shows, festivals, or gatherings'
    },
    {
      id: 'project',
      label: 'Project',
      icon: <Briefcase className="h-5 w-5" />,
      description: 'Creative or collaborative initiative'
    }
  ];

  const toggleOption = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {profileOptions.map((option) => (
        <Button
          key={option.id}
          type="button"
          variant={value.includes(option.id) ? "default" : "outline"}
          className="flex flex-col h-auto py-3 justify-start items-start text-left"
          onClick={() => toggleOption(option.id)}
        >
          <div className="flex items-center mb-1">
            {option.icon}
            <span className="ml-2 font-medium">{option.label}</span>
          </div>
          <span className="text-xs font-normal opacity-80">{option.description}</span>
        </Button>
      ))}
    </div>
  );
};

export default ProfileTypeSelector;
