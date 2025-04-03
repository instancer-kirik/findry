import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/types/profile';
import ContentCard, { ContentItemProps } from '../marketplace/ContentCard';

export interface CategoryItemsGridProps {
  items: ContentItemProps[];
  title?: string;
  onSelectItem?: (item: ContentItemProps) => void;
  selectedItems?: ContentItemProps[];
}

const CategoryItemsGrid: React.FC<CategoryItemsGridProps> = ({ 
  items, 
  title,
  onSelectItem,
  selectedItems = []
}) => {
  const isItemSelected = (item: ContentItemProps) => {
    return selectedItems.some(selectedItem => selectedItem.id === item.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ContentCard 
            key={item.id} 
            {...item} 
            onClick={onSelectItem ? () => onSelectItem(item) : undefined}
            isSelected={isItemSelected(item)}
            selectionMode={!!onSelectItem}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryItemsGrid;
