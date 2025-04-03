import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Profile } from '@/types/profile';

interface ProfileTabsProps {
  profile: Profile;
  children: React.ReactNode;
  isOwnProfile?: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile, children, isOwnProfile = false }) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="connections">Connections</TabsTrigger>
      </TabsList>

      {children}
    </Tabs>
  );
};

export default ProfileTabs;
