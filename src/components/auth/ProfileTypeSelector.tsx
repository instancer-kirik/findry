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
import { cn } from '@/lib/utils';

// Update the ProfileType to include all the types used in the application
export type ProfileType = 
  | 'artist' 
  | 'brand'
  | 'regular';

interface ProfileOption {
  id: ProfileType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface ProfileTypeSelectorProps {
  value: ProfileType[];
  onChange: (value: ProfileType[]) => void;
}

const ProfileTypeSelector: React.FC<ProfileTypeSelectorProps> = ({ value, onChange }) => {
  const profileOptions: ProfileOption[] = [
    {
      id: 'regular',
      label: 'Regular User',
      icon: <UserCircle className="h-5 w-5" />,
      description: 'Just exploring and connecting with the community'
    },
    {
      id: 'artist',
      label: 'Artist',
      icon: <Palette className="h-5 w-5" />,
      description: 'Creative professional, musician, photographer, writer, etc.'
    },
    {
      id: 'brand',
      label: 'Brand',
      icon: <Store className="h-5 w-5" />,
      description: 'Company, record label, or creative business looking to connect with artists'
    }
  ];

  const toggleOption = (id: string) => {
    if (value.includes(id as ProfileType)) {
      onChange(value.filter(v => v !== id as ProfileType));
    } else {
      onChange([...value, id as ProfileType]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {profileOptions.map((option) => (
        <Button
          key={option.id}
          type="button"
          variant={value.includes(option.id) ? "default" : "outline"}
          className={cn(
            "flex flex-col h-auto py-3 justify-start items-start text-left transition-colors",
            value.includes(option.id) 
              ? option.id === 'regular' 
                ? "bg-slate-100/50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800" 
                : option.id === 'artist'
                ? "bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
                : "bg-purple-50/50 hover:bg-purple-50 dark:bg-purple-900/20 dark:hover:bg-purple-900/30"
              : "hover:bg-muted"
          )}
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
