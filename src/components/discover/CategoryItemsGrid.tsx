import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/types/profile';
import { ContentItemProps } from '../marketplace/ContentCard';

interface CategoryItemsGridProps {
  items: ContentItemProps[];
  title: string;
  description?: string;
}

const CategoryItemsGrid: React.FC<CategoryItemsGridProps> = ({
  items,
  title,
  description
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.image_url && (
              <div className="aspect-video relative">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{item.type}</Badge>
                {item.subtype && item.subtype !== item.type && (
                  <Badge variant="outline">{item.subtype}</Badge>
                )}
              </div>
              <h3 className="font-semibold mt-2">{item.name}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {item.location}
              </p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline">+{item.tags.length - 3} more</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryItemsGrid;
