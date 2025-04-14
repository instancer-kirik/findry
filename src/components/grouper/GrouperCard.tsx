
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, Plus, ArrowRight, Users, Calendar, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GroupItem {
  id: string;
  name: string;
  type: 'resource' | 'event' | 'community' | 'artist' | 'venue' | 'brand';
  count?: number;
  createdAt: string;
}

interface GrouperCardProps {
  title: string;
  description?: string;
  items: GroupItem[];
  onViewAll?: () => void;
}

const GrouperCard: React.FC<GrouperCardProps> = ({
  title,
  description,
  items = [],
  onViewAll
}) => {
  const navigate = useNavigate();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'resource':
        return <Box className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'community':
        return <Users className="h-4 w-4" />;
      default:
        return <Folder className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.slice(0, 5).map(item => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-2 rounded-md border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/grouper/${item.type}s/${item.id}`)}
              >
                <div className="flex items-center gap-2">
                  {getTypeIcon(item.type)}
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="outline" className="capitalize">
                    {item.type}
                  </Badge>
                </div>
                {item.count !== undefined && (
                  <Badge variant="secondary">{item.count} items</Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Folder className="h-12 w-12 mx-auto opacity-30 mb-2" />
            <p>No saved groups yet</p>
            <p className="text-sm">Create your first group to see it here</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Create New Group
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GrouperCard;
