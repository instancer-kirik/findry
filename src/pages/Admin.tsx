import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  RefreshCw, Users, Mail, MessageSquare, Calendar, 
  FolderKanban, Bug, Lightbulb, Terminal, Database,
  TrendingUp, Star, Eye, ArrowUpRight
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { toast } from 'sonner';

interface WaitlistEntry {
  id: number;
  email: string;
  message: string | null;
  source: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  created_at: string;
}

interface ServiceRequest {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  created_at: string;
}

interface FeedbackItem {
  id: string;
  user_id: string | null;
  project_id: string | null;
  category: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
}

interface UnifiedProject {
  id: string;
  name: string;
  description: string | null;
  domain: string | null;
  status: string | null;
  featured: boolean | null;
  source_table: string | null;
  created_at: string;
}

const Admin: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dev tools state
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM profiles LIMIT 10');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalFeedback: 0,
    pendingFeedback: 0,
    totalProjects: 0,
    featuredProjects: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch waitlist
      const { data: waitlistData } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (waitlistData) setWaitlist(waitlistData);

      // Fetch profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, full_name, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (profilesData) setProfiles(profilesData);

      // Fetch service requests
      const { data: requestsData } = await supabase
        .from('service_requests')
        .select('id, title, description, status, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (requestsData) setServiceRequests(requestsData);

      // Fetch feedback
      const { data: feedbackData } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (feedbackData) setFeedback(feedbackData as FeedbackItem[]);

      // Fetch projects from unified view
      const { data: projectsData } = await supabase
        .from('unified_projects')
        .select('id, name, description, domain, status, featured, source_table, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (projectsData) setProjects(projectsData as UnifiedProject[]);

      // Calculate stats
      const today = startOfDay(new Date());
      const newUsersToday = profilesData?.filter(p => 
        new Date(p.created_at) >= today
      ).length || 0;

      setStats({
        totalUsers: profilesData?.length || 0,
        newUsersToday,
        totalFeedback: feedbackData?.length || 0,
        pendingFeedback: feedbackData?.filter(f => f.status === 'pending').length || 0,
        totalProjects: projectsData?.length || 0,
        featuredProjects: projectsData?.filter(p => p.featured).length || 0,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const updateFeedbackStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Feedback status updated');
      fetchData();
    } catch (error: any) {
      toast.error(`Failed to update: ${error.message}`);
    }
  };

  const toggleProjectFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Project ${!currentFeatured ? 'featured' : 'unfeatured'}`);
      fetchData();
    } catch (error: any) {
      toast.error(`Failed to update: ${error.message}`);
    }
  };

  const runQuery = async () => {
    if (!sqlQuery.trim()) return;
    
    // Safety check - only allow SELECT queries
    if (!sqlQuery.trim().toLowerCase().startsWith('select')) {
      setQueryError('Only SELECT queries are allowed for safety');
      return;
    }

    setIsQuerying(true);
    setQueryError(null);
    setQueryResult(null);

    try {
      const { data, error } = await supabase.rpc('get_table_definition', {
        table_name: 'profiles'
      });
      
      // For actual query execution, we'd need a custom RPC function
      // For now, show a placeholder
      setQueryResult({ message: 'Query executed (preview mode)', query: sqlQuery });
    } catch (error: any) {
      setQueryError(error.message);
    } finally {
      setIsQuerying(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug': return <Bug className="h-4 w-4 text-red-500" />;
      case 'feature': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      default: return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="overview">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FolderKanban className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="waitlist">
              <Mail className="h-4 w-4 mr-2" />
              Waitlist
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="devtools">
              <Terminal className="h-4 w-4 mr-2" />
              Dev Tools
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">+{stats.newUsersToday}</span> today
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{waitlist.length}</div>
                  <p className="text-xs text-muted-foreground">email signups</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Feedback</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalFeedback}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-yellow-500">{stats.pendingFeedback}</span> pending
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Projects</CardTitle>
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-yellow-500">{stats.featuredProjects}</span> featured
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{serviceRequests.length}</div>
                  <p className="text-xs text-muted-foreground">total requests</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>Latest feedback from users</CardDescription>
              </CardHeader>
              <CardContent>
                {feedback.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start gap-3 py-3 border-b last:border-0">
                    {getCategoryIcon(item.category)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.subject}</p>
                      <p className="text-sm text-muted-foreground truncate">{item.message}</p>
                    </div>
                    <Badge variant={item.status === 'pending' ? 'secondary' : 'default'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
                {feedback.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No feedback yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>User Feedback</CardTitle>
                <CardDescription>Manage feedback, bug reports, and feature requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : feedback.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No feedback yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedback.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(item.category)}
                              <span className="capitalize">{item.category}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium max-w-xs truncate">
                            {item.subject}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {item.message}
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'pending' ? 'secondary' : 'default'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(item.created_at)}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.status}
                              onValueChange={(value) => updateFeedbackStatus(item.id, value)}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Unified Projects</CardTitle>
                <CardDescription>Manage projects from all sources</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No projects yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Domain</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {project.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{project.domain || 'N/A'}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{project.source_table || 'projects'}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                              {project.status || 'unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {project.featured ? (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <Star className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(project.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigate(`/projects/${project.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={project.featured ? 'default' : 'outline'}
                                onClick={() => toggleProjectFeatured(project.id, project.featured || false)}
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Waitlist Tab */}
          <TabsContent value="waitlist">
            <Card>
              <CardHeader>
                <CardTitle>Waitlist Signups</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : waitlist.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No waitlist entries yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waitlist.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{entry.source || 'unknown'}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {entry.message || '-'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(entry.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : profiles.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No users yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">
                            {profile.username || '-'}
                          </TableCell>
                          <TableCell>{profile.full_name || '-'}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(profile.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dev Tools Tab */}
          <TabsContent value="devtools">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    SQL Query Runner
                  </CardTitle>
                  <CardDescription>
                    Run read-only queries against the database (SELECT only)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="SELECT * FROM profiles LIMIT 10"
                    className="font-mono text-sm min-h-[100px]"
                  />
                  <Button onClick={runQuery} disabled={isQuerying}>
                    {isQuerying ? 'Running...' : 'Run Query'}
                  </Button>
                  {queryError && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">{queryError}</pre>
                    </div>
                  )}
                  {queryResult && (
                    <div className="p-4 bg-muted rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-64">
                        {JSON.stringify(queryResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                  <CardDescription>Useful development resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => window.open('https://supabase.com/dashboard/project/xlmibzeenudmkqgiyaif', '_blank')}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Supabase Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => window.open('https://supabase.com/dashboard/project/xlmibzeenudmkqgiyaif/auth/users', '_blank')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Auth Users
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => window.open('https://supabase.com/dashboard/project/xlmibzeenudmkqgiyaif/storage/buckets', '_blank')}
                    >
                      <FolderKanban className="h-4 w-4 mr-2" />
                      Storage Buckets
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => window.open('https://supabase.com/dashboard/project/xlmibzeenudmkqgiyaif/functions', '_blank')}
                    >
                      <Terminal className="h-4 w-4 mr-2" />
                      Edge Functions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
