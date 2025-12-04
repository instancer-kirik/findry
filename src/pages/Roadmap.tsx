import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Rocket, Wrench, TrendingUp, Calendar, Zap, Users, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const Roadmap: React.FC = () => {
  const getStatusIcon = (status: 'complete' | 'progress' | 'planned') => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
      case 'progress':
        return <Wrench className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: 'complete' | 'progress' | 'planned' | 'live') => {
    const variants: Record<typeof status, { variant: any; label: string }> = {
      complete: { variant: 'default', label: 'Complete' },
      progress: { variant: 'secondary', label: 'In Progress' },
      planned: { variant: 'outline', label: 'Planned' },
      live: { variant: 'default', label: 'Live' },
    };
    return <Badge variant={variants[status].variant}>{variants[status].label}</Badge>;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Development Roadmap</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Track the progress of Findry's development. Transparent, iterative, and community-driven.
            </p>
          </section>

          {/* Launch Timeline */}
          <Card className="mb-12 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Launch Timeline
              </CardTitle>
              <CardDescription>December 2024 Launch Schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Beta Launch</h4>
                      <p className="text-sm text-muted-foreground">Dec 4-6, 2024</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-[52px]">
                    Core features live, invite-only access, gathering initial feedback
                  </p>
                  <Badge className="ml-[52px] mt-2" variant="default">Current</Badge>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Soft Launch</h4>
                      <p className="text-sm text-muted-foreground">Dec 7-13, 2024</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-[52px]">
                    Open registration, community building, bug fixes from feedback
                  </p>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Star className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Public Launch</h4>
                      <p className="text-sm text-muted-foreground">Dec 14, 2024</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-[52px]">
                    Full public access, marketing push, community events
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Progress */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Platform Completion</CardTitle>
              <CardDescription>Current status across all development phases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Phase 1: Core Platform (MVP)</span>
                  <span className="text-primary font-medium">95%</span>
                </div>
                <Progress value={95} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Phase 2: Enhancement & Polish</span>
                  <span className="text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Phase 3: Ecosystem Growth</span>
                  <span className="text-muted-foreground">30%</span>
                </div>
                <Progress value={30} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Phase 1: Core Platform */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Phase 1: Core Platform
                <Badge variant="default" className="ml-2">Launch Ready</Badge>
              </CardTitle>
              <CardDescription>Essential features for launch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Experience */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  User Profiles & Authentication
                  {getStatusBadge('complete')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Multi-role signup (Consumer/Artist/Organizer)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Profile customization and settings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Profile wizard onboarding</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Discovery */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Discovery & Marketplace
                  {getStatusBadge('complete')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Unified discovery (Artists, Venues, Brands, Shops, Resources)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Advanced filtering and search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>UGC Feed with media uploads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Selection mode for bulk operations</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Events */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Event Management
                  {getStatusBadge('complete')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Event creation, editing, and detail pages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Personal calendar and event tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Eventbrite integration for ticketing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Art gallery and featured artists</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Projects */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Projects & Collaboration
                  {getStatusBadge('complete')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Project creation and showcase</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Collaboration pipeline (ideation → complete)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Component and task management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Project landing pages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Service requests and proposals</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Tools */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Creative Tools
                  {getStatusBadge('complete')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Tour planning wizard with budgeting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Travel locations POI map</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Shopping list with project linking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Vehicle build tracker</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Gear packing organizer</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Community */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Community & Communication
                  {getStatusBadge('complete')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Direct messaging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Community circles and groups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>User networking (follows, connections)</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Knowledge */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Resources & Knowledge Base
                  {getStatusBadge('complete')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Glossary with categories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Resource guides and references</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Platform comparison page</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Phase 2: Enhancement */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Phase 2: Enhancement & Polish</CardTitle>
              <CardDescription>Post-launch improvements (Q1 2025)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  UI/UX Refinements
                  {getStatusBadge('progress')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Professional megamenu navigation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('progress')}
                    <span>Mobile responsiveness improvements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Accessibility (WCAG 2.1 AA compliance)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Performance optimization</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Enhanced Features
                  {getStatusBadge('progress')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Media uploads and galleries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('progress')}
                    <span>Advanced notifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Real-time collaboration features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Calendar import/export (iCal, Google)</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Analytics & Insights
                  {getStatusBadge('planned')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Event analytics dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>User engagement metrics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Content performance tracking</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Phase 3: Ecosystem */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Phase 3: Ecosystem Growth</CardTitle>
              <CardDescription>Q2-Q3 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Platform Expansion
                  {getStatusBadge('planned')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Mobile applications (iOS/Android)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Public API and developer documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Plugin/integration system</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Business Features
                  {getStatusBadge('planned')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('progress')}
                    <span>Payment processing integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Subscription plans and premium features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Venue booking and payments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Artist booking system</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Community Growth
                  {getStatusBadge('planned')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Referral and ambassador program</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Community moderation tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Event sponsorship marketplace</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
              <CardDescription>Building the creative venue ecosystem</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Findry bridges the gap between indie venues, artists, and creative communities. We're building 
                infrastructure for non-traditional spaces—maker studios, galleries, unconventional venues—that 
                serve the creative economy. Our goal is to combine the reliability of enterprise venue management 
                with the social virality and organic discovery that modern creators need.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary">Layer 1</div>
                  <div className="text-sm text-muted-foreground">Resource Graph</div>
                  <p className="text-xs mt-1">Venues, gear, services, availability</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary">Layer 2</div>
                  <div className="text-sm text-muted-foreground">Event Engine</div>
                  <p className="text-xs mt-1">Bookings, logistics, ticketing</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary">Layer 3</div>
                  <div className="text-sm text-muted-foreground">Social Feed</div>
                  <p className="text-xs mt-1">UGC, discovery, collaboration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Roadmap;
