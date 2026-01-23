import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, Calendar, Users, Tags, Star, MessageSquare, 
  AlertCircle, BookOpen, Folder, Code, Lightbulb, Rocket,
  ExternalLink, Github, Wrench, TrendingUp
} from 'lucide-react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { ContentItemProps } from '../marketplace/ContentCard';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DiscoverSidebarProps {
  activeTabData?: ContentItemProps[];
  activeTab?: string;
}

const UserCircle: React.FC<{ name: string, users: string[], color: string }> = ({ name, users, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="text-sm font-medium">{name}</h3>
          <Badge variant="outline" className="text-xs">{users.length}</Badge>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-1 mb-2">
        <div className="ml-5 space-y-1 bg-muted/30 rounded-md p-2">
          {users.map((user, index) => (
            <div key={index} className="text-sm py-1 px-2 hover:bg-muted/70 rounded-sm transition-colors">
              {user}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const RecentActivity = () => {
  const activities = [
    { type: 'collaboration', user: 'Alex Kim', action: 'invited you to collaborate', time: '2 hours ago' },
    { type: 'message', user: 'Elena Rivera', action: 'sent you a message', time: '5 hours ago' },
    { type: 'event', user: 'The Acoustic Lounge', action: 'added a new event', time: 'Yesterday' },
    { type: 'update', user: 'Summit Beats', action: 'updated their profile', time: '2 days ago' }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'collaboration': return <Users className="h-4 w-4 text-blue-500" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'event': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'update': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <ScrollArea className="h-[180px]">
      <div className="space-y-2">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded-md transition-colors cursor-pointer">
            <div className="mt-0.5">{getIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">
                <span className="font-semibold">{activity.user}</span> {activity.action}
              </p>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

const LearningResources = () => {
  const resources = [
    { title: 'Music Production Basics', type: 'Course', url: '#' },
    { title: 'Artist Branding Guide', type: 'Article', url: '#' },
    { title: 'Networking for Musicians', type: 'eBook', url: '#' },
    { title: 'Studio Recording Tips', type: 'Video', url: '#' }
  ];

  return (
    <ScrollArea className="h-[180px]">
      <div className="space-y-2">
        {resources.map((resource, idx) => (
          <Link to={resource.url} key={idx} className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded-md transition-colors block">
            <BookOpen className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium line-clamp-1">{resource.title}</p>
              <Badge variant="outline" className="text-xs mt-1">{resource.type}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};

// Project-specific sidebar content
const ProjectQuickActions = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        <Rocket className="h-4 w-4" />
        Quick Actions
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Button className="w-full justify-start" asChild>
        <Link to="/create-project">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Project
        </Link>
      </Button>
      <Button className="w-full justify-start" variant="outline" asChild>
        <Link to="/projects">
          <Folder className="mr-2 h-4 w-4" />
          My Projects
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const ProjectCategories = () => {
  const domains = [
    { name: 'Development Tools', icon: Code, count: 12, color: 'text-blue-500' },
    { name: 'Creative Tools', icon: Lightbulb, count: 8, color: 'text-purple-500' },
    { name: 'System Tools', icon: Wrench, count: 5, color: 'text-green-500' },
    { name: 'Gaming', icon: Rocket, count: 4, color: 'text-orange-500' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Tags className="h-4 w-4" />
          Project Domains
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[160px]">
          <div className="space-y-2">
            {domains.map((domain, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <domain.icon className={`h-4 w-4 ${domain.color}`} />
                  <span className="text-sm">{domain.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">{domain.count}</Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const ProjectTechStack = () => {
  const techTags = [
    'TypeScript', 'React', 'Zig', 'Rust', 'Python', 
    'Go', 'Node.js', 'PostgreSQL', 'Supabase'
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Code className="h-4 w-4 text-blue-500" />
          Tech Stack Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {techTags.map(tag => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary/10 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedProjects = ({ projects }: { projects: ContentItemProps[] }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-green-500" />
        Featured Projects
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[140px]">
        <div className="space-y-2">
          {projects.slice(0, 4).map((project, idx) => (
            <Link 
              key={idx} 
              to={`/projects/${project.id}`}
              className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded-md transition-colors block"
            >
              <span className="text-lg">{project.emoji || '📦'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{project.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
);

// Default sidebar content (for artists, events, etc.)
const DefaultSidebarContent = ({ activeTab }: { activeTab: string }) => {
  const [activeCircleTab, setActiveCircleTab] = useState("circles");

  const userCircles = [
    { name: "Collaborators", users: ["Alex Kim", "Taylor Swift", "John Doe"], color: "bg-blue-500" },
    { name: "Favorites", users: ["Elena Rivera", "Studio 54", "James Bond"], color: "bg-yellow-500" },
    { name: "Potential Venues", users: ["The Acoustic Lounge", "Electric Factory"], color: "bg-green-500" },
    { name: "Session Musicians", users: ["Mike Drums", "Bass Betty", "Guitar George"], color: "bg-purple-500" }
  ];

  return (
    <>
      <AnimatedSection animation="slide-in-left" delay={100}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" asChild>
              <Link to="/events/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
            {activeTab === "glossary" && (
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/glossary/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Glossary Term
                </Link>
              </Button>
            )}
            {activeTab === "resources" && (
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/create-resource">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Resource
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection animation="slide-in-left" delay={200}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">User Categories</CardTitle>
            <CardDescription>Organize people for collaboration</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeCircleTab} onValueChange={setActiveCircleTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-3">
                <TabsTrigger value="circles" className="flex items-center gap-1 text-xs">
                  <Users className="h-3 w-3" />
                  Circles
                </TabsTrigger>
                <TabsTrigger value="tags" className="flex items-center gap-1 text-xs">
                  <Tags className="h-3 w-3" />
                  Tags
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="circles" className="border rounded-md p-2">
                <ScrollArea className="h-[180px]">
                  <div className="space-y-1">
                    {userCircles.map((circle, idx) => (
                      <UserCircle 
                        key={idx} 
                        name={circle.name} 
                        users={circle.users} 
                        color={circle.color} 
                      />
                    ))}
                  </div>
                </ScrollArea>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <PlusCircle className="h-3 w-3 mr-2" />
                  New Circle
                </Button>
              </TabsContent>
              
              <TabsContent value="tags" className="border rounded-md p-2">
                <ScrollArea className="h-[180px]">
                  <div className="flex flex-wrap gap-1.5">
                    {['Producer', 'Vocalist', 'Jazz', 'Hip-hop', 'Mixing', 'Studio', 'Mastering', 'Composition'].map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <PlusCircle className="h-3 w-3 mr-2" />
                  New Tag
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection animation="slide-in-left" delay={300}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection animation="slide-in-left" delay={400}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              Learning Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LearningResources />
          </CardContent>
        </Card>
      </AnimatedSection>
    </>
  );
};

const DiscoverSidebar: React.FC<DiscoverSidebarProps> = ({ 
  activeTabData = [],
  activeTab = 'events'
}) => {
  // Render project-specific sidebar
  if (activeTab === 'projects') {
    return (
      <div className="space-y-4">
        <AnimatedSection animation="slide-in-left" delay={100}>
          <ProjectQuickActions />
        </AnimatedSection>
        <AnimatedSection animation="slide-in-left" delay={200}>
          <ProjectCategories />
        </AnimatedSection>
        <AnimatedSection animation="slide-in-left" delay={300}>
          <ProjectTechStack />
        </AnimatedSection>
        <AnimatedSection animation="slide-in-left" delay={400}>
          <FeaturedProjects projects={activeTabData} />
        </AnimatedSection>
      </div>
    );
  }

  // Render default sidebar for other tabs
  return (
    <div className="space-y-4">
      <DefaultSidebarContent activeTab={activeTab} />
    </div>
  );
};

export default DiscoverSidebar;