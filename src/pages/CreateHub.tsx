import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FolderKanban, 
  Users2, 
  Handshake, 
  Briefcase, 
  MessageSquare,
  Plus,
  ArrowRight,
  Sparkles,
  Rocket,
  Video,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const createOptions = [
  {
    title: "Events Hub",
    description: "Browse, create, and manage shows, gatherings, and experiences",
    icon: Calendar,
    href: "/events/upcoming",
    gradient: "from-rose-500/20 to-orange-500/20",
    iconColor: "text-rose-500",
    tooltip: "View upcoming events, create new ones, and track events you're interested in",
  },
  {
    title: "Start Project",
    description: "Launch collaborative projects and track progress with your team",
    icon: FolderKanban,
    href: "/projects/create",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    title: "Community Manager",
    description: "Build, manage, and chat with groups and circles",
    icon: Users2,
    href: "/communities",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
  },
  {
    title: "Project Meetings",
    description: "Schedule and manage meetings with collaborators",
    icon: Video,
    href: "/chats",
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-500",
  },
  {
    title: "Request Service",
    description: "Post service requests and find collaborators for hire",
    icon: Briefcase,
    href: "/request-service",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
];

const quickActions = [
  {
    title: "All Projects",
    description: "View and manage your projects",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    title: "Create Event",
    description: "Host a new event",
    icon: Plus,
    href: "/events/create",
  },
  {
    title: "Collaboration",
    description: "Manage partnerships",
    icon: Handshake,
    href: "/collaboration",
  },
  {
    title: "Messages",
    description: "Chat with collaborators",
    icon: MessageSquare,
    href: "/chats",
  },
];

export default function CreateHub() {
  return (
    <Layout>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
          <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Create & Collaborate</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Build Something{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Amazing
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Launch projects, host events, and collaborate with the creative community. 
                Everything you need to bring your ideas to life.
              </p>
            </motion.div>

            {/* Main Create Options */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {createOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={option.href}>
                    <Card className={`group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <CardHeader className="relative">
                        <div className={`w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <option.icon className={`h-6 w-6 ${option.iconColor}`} />
                        </div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          {option.title}
                          {option.tooltip && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p>{option.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {option.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative">
                        <Button variant="ghost" className="group/btn p-0 h-auto text-primary">
                          Get Started
                          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Rocket className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.href}>
                  <Card className="group hover:border-primary/50 transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{action.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      </TooltipProvider>
    </Layout>
  );
}
