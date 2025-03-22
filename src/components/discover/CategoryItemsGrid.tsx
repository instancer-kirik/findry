
import React from 'react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import ContentCard, { ContentItemProps } from '../marketplace/ContentCard';

interface CategoryItemsGridProps {
  items: ContentItemProps[];
}

const CategoryItemsGrid: React.FC<CategoryItemsGridProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <p className="text-muted-foreground">No items found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <AnimatedSection 
          key={item.id} 
          animation="fade-in-up" 
          delay={100 * index}
        >
          <ContentCard item={item} />
        </AnimatedSection>
      ))}
    </div>
  );
};

export default CategoryItemsGrid;
