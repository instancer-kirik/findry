import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ShoppingCart,
  FolderKanban,
  Calendar,
  Filter,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useGetProjects, useUpdateTaskStatus } from "@/hooks/use-projects";
import { useGetShoppingList, useUpdateShoppingListItem } from "@/hooks/use-shopping-list";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow, isThisWeek, isPast, parseISO } from "date-fns";

interface UnifiedTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: "low" | "medium" | "high";
  source: "project" | "shopping";
  sourceId?: string;
  sourceName?: string;
  dueDate?: string;
  isCompleted: boolean;
}

export default function Tasks() {
  const { data: projects = [], isLoading: projectsLoading } = useGetProjects();
  const { data: shoppingItems = [], isLoading: shoppingLoading } = useGetShoppingList();
  const updateTaskStatus = useUpdateTaskStatus();
  const updateShoppingItem = useUpdateShoppingListItem();

  const [activeTab, setActiveTab] = useState("all");
  const [showCompleted, setShowCompleted] = useState(false);

  // Aggregate all tasks into unified format
  const allTasks = useMemo((): UnifiedTask[] => {
    const tasks: UnifiedTask[] = [];

    // Add project tasks
    projects.forEach((project) => {
      if (project.tasks) {
        project.tasks.forEach((task) => {
          tasks.push({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority || "medium",
            source: "project",
            sourceId: project.id,
            sourceName: project.name,
            dueDate: task.dueDate,
            isCompleted: task.status === "completed",
          });
        });
      }
    });

    // Add shopping list items (not purchased)
    shoppingItems.forEach((item) => {
      tasks.push({
        id: item.id,
        title: item.item_name,
        description: item.description,
        status: item.status || "planned",
        priority: item.priority || "medium",
        source: "shopping",
        sourceName: "Shopping List",
        isCompleted: item.purchased || item.status === "purchased" || item.status === "received",
      });
    });

    return tasks;
  }, [projects, shoppingItems]);

  // Filter tasks based on tab
  const filteredTasks = useMemo(() => {
    let filtered = allTasks;

    if (!showCompleted) {
      filtered = filtered.filter((t) => !t.isCompleted);
    }

    switch (activeTab) {
      case "project":
        filtered = filtered.filter((t) => t.source === "project");
        break;
      case "shopping":
        filtered = filtered.filter((t) => t.source === "shopping");
        break;
      case "today":
        filtered = filtered.filter((t) => {
          if (!t.dueDate) return false;
          return isToday(parseISO(t.dueDate));
        });
        break;
      case "overdue":
        filtered = filtered.filter((t) => {
          if (!t.dueDate || t.isCompleted) return false;
          return isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate));
        });
        break;
    }

    // Sort by priority and completion
    return filtered.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [allTasks, activeTab, showCompleted]);

  // Stats
  const stats = useMemo(() => {
    const pending = allTasks.filter((t) => !t.isCompleted);
    const completed = allTasks.filter((t) => t.isCompleted);
    const overdue = allTasks.filter((t) => {
      if (!t.dueDate || t.isCompleted) return false;
      return isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate));
    });
    const highPriority = pending.filter((t) => t.priority === "high");

    return { pending: pending.length, completed: completed.length, overdue: overdue.length, highPriority: highPriority.length };
  }, [allTasks]);

  const handleToggleTask = async (task: UnifiedTask) => {
    if (task.source === "project" && task.sourceId) {
      const newStatus = task.isCompleted ? "pending" : "completed";
      updateTaskStatus.mutate({ taskId: task.id, status: newStatus });
    } else if (task.source === "shopping") {
      updateShoppingItem.mutate({
        id: task.id,
        purchased: !task.isCompleted,
        status: task.isCompleted ? "planned" : "purchased",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (task: UnifiedTask) => {
    if (task.isCompleted) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (task.priority === "high") return <AlertCircle className="h-5 w-5 text-destructive" />;
    return <Circle className="h-5 w-5 text-muted-foreground" />;
  };

  const getDueDateBadge = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = parseISO(dueDate);
    
    if (isPast(date) && !isToday(date)) {
      return <Badge variant="destructive" className="text-xs">Overdue</Badge>;
    }
    if (isToday(date)) {
      return <Badge variant="default" className="text-xs">Today</Badge>;
    }
    if (isTomorrow(date)) {
      return <Badge variant="secondary" className="text-xs">Tomorrow</Badge>;
    }
    if (isThisWeek(date)) {
      return <Badge variant="outline" className="text-xs">{format(date, "EEEE")}</Badge>;
    }
    return <Badge variant="outline" className="text-xs">{format(date, "MMM d")}</Badge>;
  };

  const isLoading = projectsLoading || shoppingLoading;

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">
            Everything you need to do, in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Circle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Done</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <Clock className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-500/10">
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-5 w-full sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="project">Projects</TabsTrigger>
              <TabsTrigger value="shopping">Shopping</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant={showCompleted ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            <Filter className="h-4 w-4 mr-1" />
            {showCompleted ? "Hide Done" : "Show Done"}
          </Button>
        </div>

        {/* Task List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {activeTab === "all" && "All Tasks"}
              {activeTab === "today" && "Today's Tasks"}
              {activeTab === "overdue" && "Overdue Tasks"}
              {activeTab === "project" && "Project Tasks"}
              {activeTab === "shopping" && "Shopping Items"}
              <Badge variant="outline" className="ml-auto">
                {filteredTasks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">
                  {activeTab === "all" && !showCompleted
                    ? "All caught up! No pending tasks."
                    : "No tasks found."}
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[500px]">
                <div className="divide-y divide-border">
                  {filteredTasks.map((task) => (
                    <div
                      key={`${task.source}-${task.id}`}
                      className={cn(
                        "flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors group",
                        task.isCompleted && "opacity-60"
                      )}
                    >
                      <Checkbox
                        checked={task.isCompleted}
                        onCheckedChange={() => handleToggleTask(task)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <span
                            className={cn(
                              "font-medium truncate",
                              task.isCompleted && "line-through text-muted-foreground"
                            )}
                          >
                            {task.title}
                          </span>
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs shrink-0">
                            {task.priority}
                          </Badge>
                          {getDueDateBadge(task.dueDate)}
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {task.source === "project" ? (
                            <FolderKanban className="h-3 w-3" />
                          ) : (
                            <ShoppingCart className="h-3 w-3" />
                          )}
                          {task.sourceId ? (
                            <Link
                              to={task.source === "project" ? `/projects/${task.sourceId}` : "/shopping-list"}
                              className="hover:text-primary hover:underline"
                            >
                              {task.sourceName}
                            </Link>
                          ) : (
                            <span>{task.sourceName}</span>
                          )}
                        </div>
                      </div>

                      {task.sourceId && (
                        <Link
                          to={task.source === "project" ? `/projects/${task.sourceId}` : "/shopping-list"}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/projects">
              <FolderKanban className="h-4 w-4 mr-2" />
              View Projects
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/shopping-list">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Shopping List
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
