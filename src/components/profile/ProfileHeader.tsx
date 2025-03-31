
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Edit, Settings } from 'lucide-react';
import { ProfileType } from '../auth/ProfileTypeSelector';
import { Link, useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
}

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isOwnProfile }) => {
  const navigate = useNavigate();
  const avatarInitials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.username.substring(0, 2).toUpperCase();

  const handleEditProfile = () => {
    navigate('/profile-setup');
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <Avatar className="h-24 w-24 border-4 border-background">
          <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
          <AvatarFallback className="text-2xl">{avatarInitials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">{profile.full_name}</h1>
          <p className="text-muted-foreground mb-2">@{profile.username}</p>
          
          {profile.bio && (
            <p className="text-foreground/80 mt-2 max-w-2xl">{profile.bio}</p>
          )}
        </div>
        
        {isOwnProfile ? (
          <div className="flex gap-2 self-end md:self-start mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleEditProfile}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 self-end md:self-start mt-4 md:mt-0">
            <Button variant="default" size="sm">
              Connect
            </Button>
            <Button variant="outline" size="sm">
              Message
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileHeader;
