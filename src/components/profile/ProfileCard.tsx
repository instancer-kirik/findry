import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/integrations/supabase/types';
import { Link } from 'react-router-dom';

interface ProfileCardProps {
  profile: Profile;
  type?: string;
}

export const ProfileCard = ({ profile, type }: ProfileCardProps) => {
  const initials = profile.full_name
    ? profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
    : profile.username?.[0] || 'U';

  return (
    <Link to={`/profile/${profile.username}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">
              {profile.full_name || profile.username}
            </CardTitle>
            {type && (
              <Badge variant="secondary" className="mt-1">
                {type}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {profile.bio || 'No bio available'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}; 