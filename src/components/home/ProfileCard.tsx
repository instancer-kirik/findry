import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/types/profile';

interface ProfileCardProps {
  id: string;
  name: string;
  type: string;
  location: string;
  tags?: string[];
  imageUrl?: string;
  onView?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  name,
  type,
  location,
  tags = [],
  imageUrl,
  onView
}) => {
  return (
    <Card className="overflow-hidden">
      {imageUrl && (
        <div className="aspect-video relative">
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{location}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{type}</Badge>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onView}>
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
