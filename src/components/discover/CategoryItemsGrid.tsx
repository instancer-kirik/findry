
import React from 'react';
import { ContentItemProps } from '../marketplace/ContentCard';
import ContentCard from '../marketplace/ContentCard';
import AnimatedSection from '../ui-custom/AnimatedSection';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryItemsGridProps {
  items: ContentItemProps[];
  isLoading?: boolean;
}

const CategoryItemsGrid: React.FC<CategoryItemsGridProps> = ({ items, isLoading = false }) => {
  const renderLoadingSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="h-[320px]">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    ));
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
          <ContentCard item={item} />
        </AnimatedSection>
      ))}
    </div>
  );
};

export default CategoryItemsGrid;
