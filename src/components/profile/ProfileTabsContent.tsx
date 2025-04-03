import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Profile } from '@/types/profile';
import ProfileCalendar from './ProfileCalendar';

interface ProfileTabsContentProps {
  profile: Profile;
  isOwnProfile: boolean;
}

const ProfileTabsContent: React.FC<ProfileTabsContentProps> = ({
  profile,
  isOwnProfile
}) => {
  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No overview content to display yet</p>
          {isOwnProfile && (
            <p className="mt-2">
              <a href="/profile/edit" className="text-primary hover:underline">
                Add some content to your profile
              </a>
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="content">
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No content to display yet</p>
          {isOwnProfile && (
            <p className="mt-2">
              <a href="/content/create" className="text-primary hover:underline">
                Create your first content
              </a>
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="events">
        <ProfileCalendar events={[]} isOwnProfile={isOwnProfile} />
      </TabsContent>

      <TabsContent value="connections">
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No connections to display yet</p>
          {isOwnProfile && (
            <p className="mt-2">
              <a href="/connections" className="text-primary hover:underline">
                View your connections
              </a>
            </p>
          )}
        </div>
      </TabsContent>
    </>
  );
};

export default ProfileTabsContent;
