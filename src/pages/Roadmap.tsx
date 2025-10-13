import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, AlertCircle, Wrench, TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const Roadmap: React.FC = () => {
  const getStatusIcon = (status: 'complete' | 'progress' | 'planned' | 'issue') => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'progress':
        return <Wrench className="h-5 w-5 text-yellow-500" />;
      case 'issue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: 'complete' | 'progress' | 'planned' | 'issue') => {
    const variants: Record<typeof status, { variant: any; label: string }> = {
      complete: { variant: 'default', label: 'Complete' },
      progress: { variant: 'secondary', label: 'In Progress' },
      planned: { variant: 'outline', label: 'Planned' },
      issue: { variant: 'destructive', label: 'Needs Work' },
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

          {/* Overall Progress */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Overall Platform Status</CardTitle>
              <CardDescription>Current completion across all phases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Phase 1: Core Platform (MVP)</span>
                  <span className="text-muted-foreground">~85%</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Phase 2: Growth & Enhancement</span>
                  <span className="text-muted-foreground">~40%</span>
                </div>
                <Progress value={40} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Phase 3: Ecosystem Growth</span>
                  <span className="text-muted-foreground">~15%</span>
                </div>
                <Progress value={15} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Known Issues */}
          <Card className="mb-12 border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Known Issues & Priority Fixes
              </CardTitle>
              <CardDescription>Active issues being addressed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                {getStatusIcon('issue')}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">Discover Page UI/UX</h4>
                    {getStatusBadge('progress')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Discover page needs design polish, improved filtering UX, and better mobile responsiveness.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                {getStatusIcon('issue')}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">404 Error Handling</h4>
                    {getStatusBadge('progress')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Some routes redirecting improperly. Improving error boundaries and route guards.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                {getStatusIcon('issue')}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">Project Detail Edit Flow</h4>
                    {getStatusBadge('progress')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Edit UI for tasks and components needs visibility improvements and ownership validation fixes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phase 1: Core Platform */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Phase 1: Core Platform (MVP)</CardTitle>
              <CardDescription>Launch-ready features</CardDescription>
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
                    <span>Multi-role signup flow (Consumer/Artist/Organizer)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Profile customization and settings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('progress')}
                    <span>Profile onboarding optimization</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Event Platform */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Event Management
                  {getStatusBadge('complete')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Event discovery and browsing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Personal calendar management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Event creation and editing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Eventbrite integration for ticketing</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Community Features */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Community & Communication
                  {getStatusBadge('complete')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Direct messaging and chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Community circles and groups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('progress')}
                    <span>Notification system refinement</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Artist Features */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Artist Tools
                  {getStatusBadge('complete')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Portfolio management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Availability calendar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Booking and gig discovery</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Phase 2: Growth */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Phase 2: Growth & Enhancement</CardTitle>
              <CardDescription>Post-launch improvements (Q3-Q4 2025)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Enhanced Media Management
                  {getStatusBadge('progress')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Photo uploads and social archive</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Content organization improvements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Advanced media search</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Booking & Financial Tools
                  {getStatusBadge('progress')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Basic contract creation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Payment processing integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Booking confirmation flow</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Platform Analytics
                  {getStatusBadge('planned')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>User engagement dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Event performance metrics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Community growth analytics</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Phase 3: Ecosystem */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Phase 3: Ecosystem Growth</CardTitle>
              <CardDescription>Future roadmap (2026)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Business Integration
                  {getStatusBadge('progress')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('complete')}
                    <span>Business profiles and category management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Sponsorship tools and management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Business networking features</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Platform Expansion
                  {getStatusBadge('planned')}
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Mobile application development</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Public API for developers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon('planned')}
                    <span>Third-party platform integrations</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Technical Priorities */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Technical Focus Areas</CardTitle>
              <CardDescription>Infrastructure and code quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-yellow-600 dark:text-yellow-500">Immediate Priorities</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      <span>Performance optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      <span>Security audit completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      <span>Cross-browser compatibility</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      <span>Error tracking implementation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-primary">Ongoing Improvements</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span>Code refactoring & tech debt</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span>Component library standardization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span>API endpoint optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span>Testing coverage expansion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Success Metrics</CardTitle>
              <CardDescription>How we measure progress</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>User signup and onboarding completion rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Event creation and participation metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Community engagement and growth</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Platform performance and stability</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>User satisfaction and feedback scores</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Roadmap;
