import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import DashboardCard from '@/components/home/DashboardCard';
import RecentActivity, { ActivityItem } from '@/components/home/RecentActivity';
import UnifiedCalendar from '@/components/home/UnifiedCalendar';
import { Bell, Calendar, User, Briefcase, FileText, MessageSquare, Music, Users, Clock, Star, Globe, Home, Plus, TrendingUp, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
  profile_types?: string[];
}

const dummyActivities = [
  {
    id: '1',
    title: 'New collaboration request',
    type: 'offer',
    description: 'Jane Smith wants to collaborate on your project',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: 'pending'
  },
  {
    id: '2',
    title: 'Project milestone completed',
    type: 'project',
    description: 'Album artwork design phase completed',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    status: 'completed'
  },
  {
    id: '3',
    title: 'New booking request',
    type: 'item',
    description: 'Studio booking request for next Monday',
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    status: 'active'
  }
];

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    title: "Project Milestone Achieved",
    type: "project",
    description: "The Findry Platform Core reached 75% completion",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "completed"
  },
  {
    id: "2",
    title: "New Resource Available",
    type: "item",
    description: "Recording Studio on 5th Ave added to available resources",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: "active"
  },
  {
    id: "3",
    title: "Collaboration Opportunity",
    type: "offer",
    description: "Producer seeking vocalist for electronic track",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "pending"
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    events: 0,
    communities: 0,
    offers: 0,
    messages: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to landing page if not authenticated
        navigate('/');
        return;
      }
      
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        setUserProfile(profileData);
        
        // Fetch user stats
        const userId = session.user.id;
        
        // Projects count
        const { count: projectsCount } = await supabase
          .from('content_ownership')
          .select('content_id', { count: 'exact', head: true })
          .eq('owner_id', userId)
          .eq('content_type', 'project');
          
        // Events count
        const { count: eventsCount } = await supabase
          .from('content_ownership')
          .select('content_id', { count: 'exact', head: true })
          .eq('owner_id', userId)
          .eq('content_type', 'event');
          
        // Communities count
        const { count: communitiesCount } = await supabase
          .from('content_ownership')
          .select('content_id', { count: 'exact', head: true })
          .eq('owner_id', userId)
          .eq('content_type', 'community');
          
        // Unread messages count (placeholder - needs actual implementation)
        const messagesCount = 2;
        
        // Active offers count (placeholder - needs actual implementation)
        const offersCount = 3;
        
        setStats({
          projects: projectsCount || 0,
          events: eventsCount || 0,
          communities: communitiesCount || 0,
          offers: offersCount,
          messages: messagesCount
        });
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 p-8">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                <AvatarImage src={userProfile?.avatar_url || undefined} alt={userProfile?.display_name || 'User'} />
                <AvatarFallback className="text-2xl">{userProfile?.display_name?.[0] || userProfile?.full_name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1">{userProfile?.display_name || userProfile?.full_name || 'Welcome Back'}</h1>
                <p className="text-muted-foreground mb-3">@{userProfile?.username || 'username'}</p>
                <div className="flex gap-2">
                  {userProfile?.profile_types?.map((type, index) => (
                    <Badge key={index} variant="secondary" className="shadow-sm">{type}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')} className="shadow-sm">
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
              <Button size="sm" onClick={() => navigate('/profile/edit')} className="shadow-sm">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover-card border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold mb-1">2</p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </CardContent>
          </Card>
          <Card className="hover-card border-l-4 border-l-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-5 w-5 text-accent-foreground" />
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold mb-1">4.8</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
          <Card className="hover-card border-l-4 border-l-secondary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="h-5 w-5 text-secondary-foreground" />
                <Badge variant="secondary" className="h-5 px-2">{stats.messages}</Badge>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.messages}</p>
              <p className="text-sm text-muted-foreground">Unread Messages</p>
            </CardContent>
          </Card>
          <Card className="hover-card border-l-4 border-l-muted">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <Badge variant="outline" className="h-5 px-2">3</Badge>
              </div>
              <p className="text-3xl font-bold mb-1">3</p>
              <p className="text-sm text-muted-foreground">Notifications</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profiles">My Profiles</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard 
                title="Projects" 
                description="Your development projects"
                count={stats.projects}
                icon={<FileText className="h-5 w-5 text-muted-foreground" />}
                link="/projects"
                createLink="/projects/new"
              />
              <DashboardCard 
                title="Events" 
                description="Events you're hosting or participating in"
                count={stats.events}
                icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
                link="/events"
                createLink="/events/new"
              />
              <DashboardCard 
                title="Communities" 
                description="Communities you're a part of"
                count={stats.communities}
                icon={<Users className="h-5 w-5 text-muted-foreground" />}
                link="/communities"
                createLink="/communities/new"
              />
              <DashboardCard 
                title="Messages" 
                description="Unread messages"
                count={stats.messages}
                icon={<MessageSquare className="h-5 w-5 text-muted-foreground" />}
                link="/messages"
              />
              <DashboardCard 
                title="Offers" 
                description="Active collaboration offers"
                count={stats.offers}
                icon={<Briefcase className="h-5 w-5 text-muted-foreground" />}
                link="/offers"
              />
              <DashboardCard 
                title="Resources" 
                description="Manage your resources"
                count={0}
                icon={<Home className="h-5 w-5 text-muted-foreground" />}
                link="/resources"
                createLink="/create-resource"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <RecentActivity activities={recentActivity} />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming</CardTitle>
                  <CardDescription>Your schedule for the next few days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className="bg-primary/10 p-2 rounded">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Team Meeting</p>
                        <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className="bg-primary/10 p-2 rounded">
                        <Music className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Recording Session</p>
                        <p className="text-sm text-muted-foreground">Friday, 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full mt-4" onClick={() => navigate('/calendar')}>
                    View Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="profiles" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Artist Profile Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Artist Profile</CardTitle>
                    <Badge>Active</Badge>
                  </div>
                  <CardDescription>Your creative portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={userProfile?.avatar_url || undefined} />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userProfile?.display_name || 'Artist Name'}</p>
                      <p className="text-sm text-muted-foreground">Musician, Producer</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/profile/artist')}>
                    View Profile
                  </Button>
                </CardContent>
              </Card>
              
              {/* Venue Profile Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Venue Profile</CardTitle>
                    <Badge variant="outline">Draft</Badge>
                  </div>
                  <CardDescription>Your venue information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Home className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Completion Required</p>
                      <p className="text-sm text-muted-foreground">60% complete</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/profile/venue/edit')}>
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
              
              {/* Add New Profile Card */}
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-full py-8">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mb-2">Add New Profile</CardTitle>
                  <CardDescription className="text-center mb-4">Create a new profile type for different activities</CardDescription>
                  <Button variant="outline" onClick={() => navigate('/profile/new')}>
                    Create Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <UnifiedCalendar />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Your recent notifications and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg border">
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">New collaboration request</p>
                      <p className="text-sm text-muted-foreground">Jane Smith wants to collaborate on your project</p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-lg border">
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">New message</p>
                      <p className="text-sm text-muted-foreground">You have a new message from Alex Johnson</p>
                      <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-lg border">
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Event reminder</p>
                      <p className="text-sm text-muted-foreground">Your event "Album Release Party" is tomorrow</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-4">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
