
import React from 'react';
import { cn } from '@/lib/utils';
import GlassmorphicCard from '../ui-custom/GlassmorphicCard';

interface ProfileCardProps {
  name: string;
  type: 'artist' | 'brand' | 'venue';
  image?: string;
  location?: string;
  tags?: string[];
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  type,
  image,
  location,
  tags = [],
  className,
}) => {
  const placeholderImage = '/placeholder.svg';
  
  const typeColor = {
    artist: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    brand: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    venue: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  }[type];
  
  const typeLabel = {
    artist: 'Artist',
    brand: 'Brand',
    venue: 'Venue',
  }[type];
  
  return (
    <GlassmorphicCard 
      className={cn('overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1', className)}
      intensity="light"
    >
      <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
        <img 
          src={image || placeholderImage} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{name}</h3>
          <span className={cn('text-xs px-2 py-1 rounded-full', typeColor)}>
            {typeLabel}
          </span>
        </div>
        
        {location && (
          <p className="text-sm text-muted-foreground mb-3">{location}</p>
        )}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-0.5 bg-secondary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </GlassmorphicCard>
  );
};

export default ProfileCard;
