
import React from 'react';
import { ContentItemProps } from '../marketplace/ContentCard';
import ContentCard from '../marketplace/ContentCard';
import AnimatedSection from '../ui-custom/AnimatedSection';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Music, Building, Store, Bot, Calendar, Briefcase } from 'lucide-react';
import { ProfileType } from '../auth/ProfileTypeSelector';
import { useNavigate } from 'react-router-dom';

interface CategoryItemsGridProps {
  items: ContentItemProps[];
  isLoading?: boolean;
}

const CategoryItemsGrid: React.FC<CategoryItemsGridProps> = ({ items, isLoading = false }) => {
  const navigate = useNavigate();

  const renderLoadingSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="h-[320px]">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    ));
  };

  const getProfileType = (type: string): ProfileType => {
    switch (type.toLowerCase()) {
      case 'artist':
      case 'artists':
        return 'artist';
      case 'venue':
      case 'venues':
        return 'venue';
      case 'resource':
      case 'resources':
        return 'resource';
      case 'community':
      case 'communities':
        return 'community';
      case 'brand':
      case 'brands':
        return 'brand';
      case 'event':
      case 'events':
        return 'event';
      case 'project':
      case 'projects':
        return 'project';
      default:
        return 'artist';
    }
  };

  const getProfileIcon = (type: string) => {
    const profileType = getProfileType(type);
    switch (profileType) {
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

  const getTypeColor = (type: string) => {
    const profileType = getProfileType(type);
    switch (profileType) {
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

  const handleViewProfile = (item: ContentItemProps) => {
    // In a real app, navigate to the profile page
    console.log('Navigating to profile:', item.id);
    // navigate(`/profile/${item.id}`);
    
    // For now, just show a toast or alert
    alert(`Viewing profile for ${item.title}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderLoadingSkeletons()}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <AnimatedSection animation="fade-in-up" delay={250}>
        <div className="p-8 text-center border border-dashed rounded-lg">
          <h3 className="text-xl font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <AnimatedSection
          key={item.id}
          animation="fade-in-up"
          delay={150 + index * 50}
          className="h-full"
        >
          <div className="bg-background rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
            <ContentCard item={item} />
            <div className="p-4 pt-0 mt-auto">
              <div className="flex items-center justify-between">
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getTypeColor(item.type)}`}>
                  {getProfileIcon(item.type)}
                  <span className="ml-1">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary/80"
                  onClick={() => handleViewProfile(item)}
                >
                  View Profile
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default CategoryItemsGrid;
