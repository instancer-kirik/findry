
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Music, 
  Building, 
  Bot, 
  Store, 
  Calendar, 
  Briefcase,
  UserCircle,
  Palette,
  Camera,
  Mic,
  BookOpen,
  Code,
  MapPin
} from 'lucide-react';

// Update the ProfileType to include all the types used in the application
export type ProfileType = 
  | 'creative' 
  | 'organization' 
  | 'service' 
  | 'brand' 
  | 'event' 
  | 'user'
  | 'artist'
  | 'venue'
  | 'resource'
  | 'community'
  | 'project';

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
      id: 'user',
      label: 'Individual',
      icon: <UserCircle className="h-5 w-5" />,
      description: 'Personal account for browsing and connecting'
    },
    {
      id: 'creative',
      label: 'Creative',
      icon: <Palette className="h-5 w-5" />,
      description: 'Artist, musician, photographer, writer, etc.'
    },
    {
      id: 'organization',
      label: 'Organization',
      icon: <Users className="h-5 w-5" />,
      description: 'Collective, non-profit, or cultural institution'
    },
    {
      id: 'service',
      label: 'Service Provider',
      icon: <Bot className="h-5 w-5" />,
      description: 'Offering professional services to creatives'
    },
    {
      id: 'brand',
      label: 'Brand',
      icon: <Store className="h-5 w-5" />,
      description: 'Company, business, or commercial entity'
    },
    {
      id: 'event',
      label: 'Event Organizer',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Manage exhibitions, performances, or festivals'
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
