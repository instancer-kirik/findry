import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Profile } from '@/types/profile';
import { Settings } from 'lucide-react';

interface ProfileTabsProps {
  profile: Profile;
  children: React.ReactNode;
  isOwnProfile?: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile, children, isOwnProfile = false }) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className={`grid w-full grid-cols-2 ${isOwnProfile ? 'lg:grid-cols-6' : 'lg:grid-cols-5'}`}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="connections">Connections</TabsTrigger>
        {isOwnProfile && (
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        )}
      </TabsList>

      {children}
    </Tabs>
  );
};

export default ProfileTabs;
