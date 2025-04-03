import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/integrations/supabase/types';

interface CategoryItem {
  id: string;
  name: string;
  type: string;
  description: string;
  tags?: string[];
  imageUrl?: string;
  author: Profile;
}

interface CategoryItemsGridProps {
  items: CategoryItem[];
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
            {item.imageUrl && (
              <div className="aspect-video relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{item.type}</Badge>
              </div>
              <h3 className="font-semibold mt-2">{item.name}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
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
