import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  MoonIcon,
  SunIcon,
  Menu,
  X,
  CircleHelp,
  LayoutDashboard,
  UserRound,
  Settings,
  LogOut,
  LogIn,
  Compass,
  Calendar,
  Users,
  Plus,
  Route,
  BookOpen,
  MapPin,
  ShoppingCart,
  Wrench,
  Car,
  FolderKanban,
  Briefcase,
  ChevronDown,
  Play,
  Store,
  Scale,
} from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { useTheme } from "@/components/ui/theme-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error signing out",
        description:
          error instanceof Error
            ? error.message
            : "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileAction = (action: string) => {
    switch (action) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "profile":
        navigate(`/profile/${user?.user_metadata?.username}`);
        break;
      case "settings":
        navigate("/settings");
        break;
    }
  };

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
  >(({ className, title, children, icon, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="flex items-center gap-2 text-sm font-medium leading-none">
              {icon}
              {title}
            </div>
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-xl mr-2">
            Findry
          </Link>

          {/* Desktop Navigation with Megamenu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {/* Discover Megamenu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9">
                  <Compass className="h-4 w-4 mr-1.5" />
                  Discover
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                    <ListItem
                      href="/feed"
                      title="Feed"
                      icon={<Play className="h-4 w-4" />}
                    >
                      UGC content from the community
                    </ListItem>
                    <ListItem
                      href="/discover"
                      title="Browse All"
                      icon={<Compass className="h-4 w-4" />}
                    >
                      Explore everything on the platform
                    </ListItem>
                    <ListItem
                      href="/discover?type=artists"
                      title="Artists"
                      icon={<UserRound className="h-4 w-4" />}
                    >
                      Creators and collaborators
                    </ListItem>
                    <ListItem
                      href="/discover?type=venues"
                      title="Venues"
                      icon={<MapPin className="h-4 w-4" />}
                    >
                      Studios, galleries, spaces
                    </ListItem>
                    <ListItem
                      href="/discover?type=brands"
                      title="Brands"
                      icon={<Briefcase className="h-4 w-4" />}
                    >
                      Companies and organizations
                    </ListItem>
                    <ListItem
                      href="/shops"
                      title="Shops"
                      icon={<Store className="h-4 w-4" />}
                    >
                      Marketplace products
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Events */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Events
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-3 p-4">
                    <ListItem
                      href="/events/upcoming"
                      title="Upcoming Events"
                      icon={<Calendar className="h-4 w-4" />}
                    >
                      Browse events and shows
                    </ListItem>
                    <ListItem
                      href="/events/interested"
                      title="My Interested"
                      icon={<Calendar className="h-4 w-4" />}
                    >
                      Events you're tracking
                    </ListItem>
                    {user && (
                      <ListItem
                        href="/events/create"
                        title="Create Event"
                        icon={<Plus className="h-4 w-4" />}
                      >
                        Host your own event
                      </ListItem>
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Projects & Communities */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9">
                  <FolderKanban className="h-4 w-4 mr-1.5" />
                  Projects
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                    <ListItem
                      href="/projects"
                      title="All Projects"
                      icon={<FolderKanban className="h-4 w-4" />}
                    >
                      Browse community projects
                    </ListItem>
                    <ListItem
                      href="/communities"
                      title="Communities"
                      icon={<Users className="h-4 w-4" />}
                    >
                      Join groups
                    </ListItem>
                    <ListItem
                      href="/collaboration"
                      title="Collaboration"
                      icon={<Users className="h-4 w-4" />}
                    >
                      Manage collaborations
                    </ListItem>
                    <ListItem
                      href="/request-service"
                      title="Request Service"
                      icon={<Briefcase className="h-4 w-4" />}
                    >
                      Post service requests
                    </ListItem>
                    {user && (
                      <ListItem
                        href="/projects/create"
                        title="Start Project"
                        icon={<Plus className="h-4 w-4" />}
                      >
                        Create a new project
                      </ListItem>
                    )}
                    <ListItem
                      href="/chats"
                      title="Messages"
                      icon={<Users className="h-4 w-4" />}
                    >
                      Chat with collaborators
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Tools Megamenu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9">
                  <Wrench className="h-4 w-4 mr-1.5" />
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[450px] gap-3 p-4 md:grid-cols-2">
                    <ListItem
                      href="/travel-locations"
                      title="Travel Locations"
                      icon={<MapPin className="h-4 w-4" />}
                    >
                      Road resources & campsites
                    </ListItem>
                    <ListItem
                      href="/tour-planner"
                      title="Tour Planner"
                      icon={<Route className="h-4 w-4" />}
                    >
                      Plan trips and routes
                    </ListItem>
                    <ListItem
                      href="/shopping-list"
                      title="Shopping List"
                      icon={<ShoppingCart className="h-4 w-4" />}
                    >
                      Track purchases & supplies
                    </ListItem>
                    <ListItem
                      href="/gear-packing"
                      title="Gear Packing"
                      icon={<Briefcase className="h-4 w-4" />}
                    >
                      Organize gear and equipment
                    </ListItem>
                    <ListItem
                      href="/vehicle-build"
                      title="Vehicle Build"
                      icon={<Car className="h-4 w-4" />}
                    >
                      Track vehicle conversions
                    </ListItem>
                    <ListItem
                      href="/grouper"
                      title="Grouper"
                      icon={<Users className="h-4 w-4" />}
                    >
                      Organize groups and teams
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Knowledge */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9">
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[350px] gap-3 p-4">
                    <ListItem
                      href="/about"
                      title="About Us"
                      icon={<CircleHelp className="h-4 w-4" />}
                    >
                      Learn about the platform
                    </ListItem>
                    <ListItem
                      href="/compare"
                      title="Platform Comparison"
                      icon={<Scale className="h-4 w-4" />}
                    >
                      Compare with alternatives
                    </ListItem>
                    <ListItem
                      href="/roadmap"
                      title="Roadmap"
                      icon={<Route className="h-4 w-4" />}
                    >
                      Development roadmap
                    </ListItem>
                    <ListItem
                      href="/glossary"
                      title="Glossary"
                      icon={<BookOpen className="h-4 w-4" />}
                    >
                      Terms and definitions
                    </ListItem>
                    <ListItem
                      href="/resources"
                      title="Resources"
                      icon={<Briefcase className="h-4 w-4" />}
                    >
                      Guides and references
                    </ListItem>
                    <ListItem
                      href="/contact"
                      title="Contact"
                      icon={<Users className="h-4 w-4" />}
                    >
                      Get in touch
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Compact desktop nav for medium screens */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9">
                  <Compass className="h-4 w-4 mr-1" />
                  Discover
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background">
                <DropdownMenuItem asChild>
                  <Link to="/feed">Feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/discover">Browse All</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/discover?type=artists">Artists</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/discover?type=venues">Venues</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/events/upcoming">
              <Button variant="ghost" size="sm" className="h-9">
                <Calendar className="h-4 w-4 mr-1" />
                Events
              </Button>
            </Link>

            <Link to="/projects">
              <Button variant="ghost" size="sm" className="h-9">
                <FolderKanban className="h-4 w-4 mr-1" />
                Projects
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9">
                  <Wrench className="h-4 w-4 mr-1" />
                  Tools
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background">
                <DropdownMenuItem asChild>
                  <Link to="/travel-locations">Travel Locations</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/shopping-list">Shopping List</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tour-planner">Tour Planner</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <Link to="/dashboard" className="hidden md:block">
              <Button variant="ghost" size="sm" className="h-9">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <CircleHelp className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem asChild>
                <Link to="/about">About Findry</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contact">Contact Us</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href="https://github.com/lovable/findry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden md:flex h-9 w-9"
          >
            <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name}
                    />
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleProfileAction("dashboard")}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleProfileAction("profile")}
                >
                  <UserRound className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleProfileAction("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-1" />
                  Log In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 overflow-y-auto">
              <div className="flex flex-col gap-2 py-4">
                <div className="flex items-center justify-between mb-4">
                  <Link to="/" className="font-bold text-xl" onClick={() => setIsMobileMenuOpen(false)}>
                    Findry
                  </Link>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                      <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {user && (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 py-3 px-4 bg-primary/5 rounded-lg mb-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                )}

                {/* Discover Section */}
                <div className="border-b pb-3 mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
                    Discover
                  </p>
                  <Link
                    to="/feed"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Play className="h-4 w-4" />
                    <span>Feed</span>
                  </Link>
                  <Link
                    to="/discover"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Compass className="h-4 w-4" />
                    <span>Browse All</span>
                  </Link>
                  <Link
                    to="/discover?type=artists"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserRound className="h-4 w-4" />
                    <span>Artists</span>
                  </Link>
                  <Link
                    to="/discover?type=venues"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Venues</span>
                  </Link>
                  <Link
                    to="/shops"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Store className="h-4 w-4" />
                    <span>Shops</span>
                  </Link>
                </div>

                {/* Events & Projects Section */}
                <div className="border-b pb-3 mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
                    Connect
                  </p>
                  <Link
                    to="/events/upcoming"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Events</span>
                  </Link>
                  <Link
                    to="/projects"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FolderKanban className="h-4 w-4" />
                    <span>Projects</span>
                  </Link>
                  <Link
                    to="/communities"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    <span>Communities</span>
                  </Link>
                  <Link
                    to="/collaboration"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    <span>Collaboration</span>
                  </Link>
                  <Link
                    to="/chats"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </div>

                {/* Tools Section */}
                <div className="border-b pb-3 mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
                    Tools
                  </p>
                  <Link
                    to="/travel-locations"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Travel Locations</span>
                  </Link>
                  <Link
                    to="/tour-planner"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Route className="h-4 w-4" />
                    <span>Tour Planner</span>
                  </Link>
                  <Link
                    to="/shopping-list"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Shopping List</span>
                  </Link>
                  <Link
                    to="/gear-packing"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Gear Packing</span>
                  </Link>
                  <Link
                    to="/vehicle-build"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Car className="h-4 w-4" />
                    <span>Vehicle Build</span>
                  </Link>
                  <Link
                    to="/grouper"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    <span>Grouper</span>
                  </Link>
                </div>

                {/* About Section */}
                <div className="border-b pb-3 mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
                    About
                  </p>
                  <Link
                    to="/about"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CircleHelp className="h-4 w-4" />
                    <span>About Us</span>
                  </Link>
                  <Link
                    to="/compare"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Scale className="h-4 w-4" />
                    <span>Platform Comparison</span>
                  </Link>
                  <Link
                    to="/roadmap"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Route className="h-4 w-4" />
                    <span>Roadmap</span>
                  </Link>
                  <Link
                    to="/glossary"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Glossary</span>
                  </Link>
                  <Link
                    to="/resources"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Resources</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    <span>Contact</span>
                  </Link>
                </div>

                {/* Create Actions */}
                {user && (
                  <div className="border-b pb-3 mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
                      Create
                    </p>
                    <Link
                      to="/events/create"
                      className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Event</span>
                    </Link>
                    <Link
                      to="/projects/create"
                      className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Start Project</span>
                    </Link>
                    <Link
                      to="/request-service"
                      className="flex items-center gap-3 py-2 px-4 hover:bg-muted rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icons.request className="h-4 w-4" />
                      <span>Request Service</span>
                    </Link>
                  </div>
                )}

                {/* Auth Section */}
                <div className="mt-auto pt-4">
                  {user ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link
                          to="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Log In
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link
                          to="/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
