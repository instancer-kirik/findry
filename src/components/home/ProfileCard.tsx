
import React from 'react';
import { cn } from '@/lib/utils';
import { Users, Music, Building, Store, Bot, ArrowRight, Calendar, Briefcase } from 'lucide-react';
import { ProfileType } from '../auth/ProfileTypeSelector';

interface ProfileCardProps {
  id?: string;
  name: string;
  type: ProfileType;
  location: string;
  tags: string[];
  image?: string;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  type,
  location,
  tags,
  className
}) => {
  const getIcon = () => {
    switch (type) {
      case 'artist':
        return <Music className="h-5 w-5" />;
      case 'brand':
        return <Store className="h-5 w-5" />;
      case 'venue':
        return <Building className="h-5 w-5" />;
      case 'resource':
        return <Bot className="h-5 w-5" />;
      case 'community':
        return <Users className="h-5 w-5" />;
      case 'event':
        return <Calendar className="h-5 w-5" />;
      case 'project':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'artist':
        return 'Artist';
      case 'brand':
        return 'Brand';
      case 'venue':
        return 'Venue';
      case 'resource':
        return 'Resource';
      case 'community':
        return 'Community';
      case 'event':
        return 'Event';
      case 'project':
        return 'Project';
      default:
        return 'Profile';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'artist':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'brand':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'venue':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'resource':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'community':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'event':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
      case 'project':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className={cn(
      "bg-background rounded-lg p-5 border border-border shadow-sm hover:shadow-md transition-shadow", 
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center", getTypeColor())}>
          {getIcon()}
          <span className="ml-1">{getTypeLabel()}</span>
        </div>
      </div>
      
      <h3 className="font-medium text-lg mb-1">{name}</h3>
      <p className="text-muted-foreground text-sm mb-3">{location}</p>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {tags.map((tag, index) => (
          <span key={index} className="px-2 py-0.5 bg-secondary text-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>
      
      <button className="w-full mt-2 text-xs text-primary font-medium flex items-center justify-center">
        View Profile
        <ArrowRight className="ml-1 h-3 w-3" />
      </button>
    </div>
  );
};

export default ProfileCard;
