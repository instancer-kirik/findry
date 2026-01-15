import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ShoppingCart,
  FolderKanban,
  ChevronRight,
  Loader2,
  ArrowUpDown,
  Tag,
  Search,
  X,
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
  tags?: string[];
}

type SortOption = "priority" | "date" | "source" | "alphabetical";
type SortDirection = "asc" | "desc";

export default function Tasks() {
  const { data: projects = [], isLoading: projectsLoading } = useGetProjects();
  const { data: shoppingItems = [], isLoading: shoppingLoading } = useGetShoppingList();
  const updateTaskStatus = useUpdateTaskStatus();
  const updateShoppingItem = useUpdateShoppingListItem();

  const [activeTab, setActiveTab] = useState("all");
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Aggregate all tasks into unified format
  const allTasks = useMemo((): UnifiedTask[] => {
    const tasks: UnifiedTask[] = [];

    // Add project tasks
    projects.forEach((project) => {
      if (project.tasks) {
        project.tasks.forEach((task) => {
          // Extract tags from project tags or task description
          const projectTags = project.tags || [];
          const taskTags = task.description?.match(/#(\w+)/g)?.map(t => t.slice(1)) || [];
          
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
            tags: [...new Set([...projectTags, ...taskTags])],
          });
        });
      }
    });

    // Add shopping list items
    shoppingItems.forEach((item) => {
      // Extract category or tags from item
      const itemTags = item.category ? [item.category] : [];
      
      tasks.push({
        id: item.id,
        title: item.item_name,
        description: item.description,
        status: item.status || "planned",
        priority: item.priority || "medium",
        source: "shopping",
        sourceName: "Shopping List",
        isCompleted: item.purchased || item.status === "purchased" || item.status === "received",
        tags: itemTags,
      });
    });

    return tasks;
  }, [projects, shoppingItems]);

  // Get all unique tags and sources
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allTasks.forEach(task => {
      task.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allTasks]);

  const allSources = useMemo(() => {
    const sources = new Set<string>();
    allTasks.forEach(task => {
      if (task.sourceName) sources.add(task.sourceName);
    });
    return Array.from(sources).sort();
  }, [allTasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = allTasks;

    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter((t) => !t.isCompleted);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.sourceName?.toLowerCase().includes(query) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((t) =>
        selectedTags.some(tag => t.tags?.includes(tag))
      );
    }

    // Filter by selected sources
    if (selectedSources.length > 0) {
      filtered = filtered.filter((t) =>
        t.sourceName && selectedSources.includes(t.sourceName)
      );
    }

    // Filter by tab
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

    // Sort tasks
    return filtered.sort((a, b) => {
      // Completed always at bottom
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;

      let comparison = 0;
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "date":
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case "source":
          comparison = (a.sourceName || "").localeCompare(b.sourceName || "");
          break;
        case "alphabetical":
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [allTasks, activeTab, showCompleted, sortBy, sortDirection, searchQuery, selectedTags, selectedSources]);

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

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleSourceFilter = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedSources([]);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedSources.length > 0;

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

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="date">Due Date</SelectItem>
                <SelectItem value="source">Source</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Direction */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(d => d === "asc" ? "desc" : "asc")}
              className="px-2"
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </Button>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                    {selectedTags.length > 0 && (
                      <Badge variant="secondary" className="ml-2 px-1.5">
                        {selectedTags.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allTags.map(tag => (
                    <DropdownMenuCheckboxItem
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTagFilter(tag)}
                    >
                      {tag}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Source Filter */}
            {allSources.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FolderKanban className="h-4 w-4 mr-2" />
                    Source
                    {selectedSources.length > 0 && (
                      <Badge variant="secondary" className="ml-2 px-1.5">
                        {selectedSources.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filter by Source</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allSources.map(source => (
                    <DropdownMenuCheckboxItem
                      key={source}
                      checked={selectedSources.includes(source)}
                      onCheckedChange={() => toggleSourceFilter(source)}
                    >
                      {source}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Show Completed */}
            <Button
              variant={showCompleted ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Hide Done" : "Show Done"}
            </Button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filter Tags */}
          {(selectedTags.length > 0 || selectedSources.length > 0) && (
            <div className="flex flex-wrap gap-1">
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleTagFilter(tag)}
                >
                  #{tag} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {selectedSources.map(source => (
                <Badge
                  key={source}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => toggleSourceFilter(source)}
                >
                  {source} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="project">Projects</TabsTrigger>
            <TabsTrigger value="shopping">Shopping</TabsTrigger>
          </TabsList>
        </Tabs>

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
                  {hasActiveFilters
                    ? "No tasks match your filters."
                    : activeTab === "all" && !showCompleted
                    ? "All caught up! No pending tasks."
                    : "No tasks found."}
                </p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Clear filters
                  </Button>
                )}
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
                        <div className="flex items-start gap-2 mb-1 flex-wrap">
                          <span
                            className={cn(
                              "font-medium",
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
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
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
                          {task.tags && task.tags.length > 0 && (
                            <>
                              <span className="text-muted-foreground/50">•</span>
                              {task.tags.slice(0, 3).map(tag => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs px-1.5 py-0 cursor-pointer hover:bg-muted"
                                  onClick={() => toggleTagFilter(tag)}
                                >
                                  #{tag}
                                </Badge>
                              ))}
                              {task.tags.length > 3 && (
                                <span className="text-xs">+{task.tags.length - 3}</span>
                              )}
                            </>
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
