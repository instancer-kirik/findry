import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Profile } from '@/integrations/supabase/types';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile = false,
  onEditProfile
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
        <AvatarFallback>
          {profile.full_name?.charAt(0) || profile.username.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
        {profile.bio && <p className="text-muted-foreground mt-2">{profile.bio}</p>}
      </div>

      {isOwnProfile && onEditProfile && (
        <Button variant="outline" onClick={onEditProfile}>
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;
