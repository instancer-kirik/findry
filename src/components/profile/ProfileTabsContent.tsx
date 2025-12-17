import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile } from '@/types/profile';
import { Plus, MapPin, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import ProfileCalendar from './ProfileCalendar';
import LinkedAccounts from './LinkedAccounts';

interface ProfileTabsContentProps {
  profile: Profile;
  isOwnProfile: boolean;
}

const ProfileTabsContent: React.FC<ProfileTabsContentProps> = ({
  profile,
  isOwnProfile
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    if (isOwnProfile && user) {
      fetchUserResources();
    }
  }, [isOwnProfile, user]);

  const fetchUserResources = async () => {
    if (!user) return;
    
    setLoadingResources(true);
    try {
      // Get resource IDs from content_ownership
      const { data: ownership, error: ownershipError } = await supabase
        .from('content_ownership')
        .select('content_id')
        .eq('owner_id', user.id)
        .eq('content_type', 'resource');

      if (ownershipError) throw ownershipError;

      if (ownership && ownership.length > 0) {
        const resourceIds = ownership.map(o => o.content_id);
        
        // Fetch actual resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('*')
          .in('id', resourceIds);

        if (resourcesError) throw resourcesError;
        setResources(resourcesData || []);
      }
    } catch (error) {
      console.error('Error fetching user resources:', error);
    } finally {
      setLoadingResources(false);
    }
  };

  // Tabs component should wrap TabsContent, but it's already in the parent component (ProfileTabs)
  // Just return the TabsContent elements which will be used within a Tabs parent
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

      <TabsContent value="resources">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Resources</h3>
            {isOwnProfile && (
              <Button onClick={() => navigate('/create-resource')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Resource
              </Button>
            )}
          </div>
          
          {loadingResources ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading resources...</p>
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/resources/${resource.id}`)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{resource.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {resource.type} {resource.subtype && `- ${resource.subtype}`}
                        </CardDescription>
                      </div>
                      {resource.image_url && (
                        <img 
                          src={resource.image_url} 
                          alt={resource.name}
                          className="h-16 w-16 object-cover rounded-lg ml-4"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {resource.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {resource.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {resource.location}
                        </div>
                      )}
                      {resource.size_sqft && (
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {resource.size_sqft} sq ft
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No resources to display yet</p>
              {isOwnProfile && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/create-resource')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first resource
                </Button>
              )}
            </div>
          )}
        </div>
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

      {isOwnProfile && (
        <TabsContent value="settings" className="space-y-6">
          <LinkedAccounts />
        </TabsContent>
      )}
    </>
  );
};

export default ProfileTabsContent;
