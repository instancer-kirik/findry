
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileCard } from '@/components/home/ProfileCard';
import { ProfileType } from '../auth/ProfileTypeSelector';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
}

interface ProfileTabsProps {
  profile: Profile;
  isOwnProfile: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile, isOwnProfile }) => {
  // Example data - in a real app, you would fetch this data from the backend
  const sampleProjects = [
    {
      id: "1",
      name: "Jazz Album Production",
      type: "project" as ProfileType,
      location: "New York, NY",
      tags: ["Music Production", "Jazz", "Collaboration"]
    },
    {
      id: "2",
      name: "Art Exhibition",
      type: "project" as ProfileType,
      location: "Los Angeles, CA",
      tags: ["Visual Art", "Exhibition", "Contemporary"]
    }
  ];

  return (
    <Tabs defaultValue="portfolio" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        {isOwnProfile && <TabsTrigger value="saved">Saved</TabsTrigger>}
      </TabsList>

      <TabsContent value="portfolio" className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        {sampleProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProjects.map((project) => (
              <ProfileCard
                key={project.id}
                id={project.id}
                name={project.name}
                type={project.type}
                location={project.location}
                tags={project.tags}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No projects to display</p>
            {isOwnProfile && (
              <p className="mt-2">
                <a href="/projects/create" className="text-primary hover:underline">
                  Create your first project
                </a>
              </p>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="collaborations">
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No collaborations to display yet</p>
        </div>
      </TabsContent>

      <TabsContent value="events">
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No events to display yet</p>
        </div>
      </TabsContent>

      {isOwnProfile && (
        <TabsContent value="saved">
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No saved items to display yet</p>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ProfileTabs;
