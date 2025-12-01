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
} from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { useTheme } from "@/components/ui/theme-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl">
            Findry
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-sm px-3 py-2 h-auto font-normal ${
                    location.pathname.includes("/discover")
                      ? "bg-primary/10 text-primary"
                      : ""
                  }`}
                >
                  <Compass className="h-4 w-4 mr-1.5" />
                  Discover
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[200px] bg-background"
              >
                <DropdownMenuItem asChild>
                  <Link to="/discover" className="w-full cursor-pointer">
                    Browse All
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/discover?type=artists"
                    className="w-full cursor-pointer"
                  >
                    Artists
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/discover?type=venues"
                    className="w-full cursor-pointer"
                  >
                    Venues
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/discover?type=brands"
                    className="w-full cursor-pointer"
                  >
                    Brands
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-sm px-3 py-2 h-auto font-normal ${
                    location.pathname.includes("/events")
                      ? "bg-primary/10 text-primary"
                      : ""
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Events
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[200px] bg-background"
              >
                <DropdownMenuItem asChild>
                  <Link to="/events" className="w-full cursor-pointer">
                    All Events
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/events/upcoming" className="w-full cursor-pointer">
                    Upcoming
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/events/create" className="w-full cursor-pointer">
                    Create Event
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/communities"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              <div className="flex items-center gap-1.5 px-3 py-2">
                <Users className="h-4 w-4" />
                <span>Communities</span>
              </div>
            </Link>

            <Link
              to="/projects"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span>Projects</span>
              </div>
            </Link>

            <Link
              to="/bathroom-finder"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/bathroom-finder" ? "text-primary" : ""
              }`}
            >
              <div className="flex items-center gap-1.5 px-3 py-2">
                <MapPin className="h-4 w-4" />
                <span>Bathrooms</span>
              </div>
            </Link>

            <Link
              to="/shopping-list"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/shopping-list" ? "text-primary" : ""
              }`}
            >
              <div className="flex items-center gap-1.5 px-3 py-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Shopping List</span>
              </div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-sm px-3 py-2 h-auto font-normal ${
                    location.pathname.includes("/discover") &&
                    new URLSearchParams(location.search).get("type") ===
                      "glossary"
                      ? "bg-primary/10 text-primary"
                      : ""
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  Knowledge
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[200px] bg-background"
              >
                <DropdownMenuItem asChild>
                  <Link
                    to="/discover?type=glossary"
                    className="w-full cursor-pointer"
                  >
                    Glossary
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/discover?type=resources"
                    className="w-full cursor-pointer"
                  >
                    Resources
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm px-3 py-2 h-auto font-normal"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Create
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] bg-background"
                >
                  <DropdownMenuItem asChild>
                    <Link to="/events/create" className="w-full cursor-pointer">
                      Create Event
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/projects/create"
                      className="w-full cursor-pointer"
                    >
                      Start Project
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/request-service"
                      className="w-full cursor-pointer"
                    >
                      Request Service
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {user && (
              <Link
                to="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <Icons.dashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <CircleHelp className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem asChild>
                <Link to="/about" className="w-full cursor-pointer">
                  About Findry
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contact" className="w-full cursor-pointer">
                  Contact Us
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href="https://github.com/lovable/findry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full cursor-pointer"
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
            className="hidden md:flex"
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
              <Button variant="outline" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Log In
                </Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-64">
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center justify-between">
                  <Link to="/" className="font-bold text-xl">
                    Findry
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {user && (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 py-2 text-sm px-4 hover:bg-muted border-b"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                )}

                <div className="space-y-2">
                  <Link
                    to="/discover"
                    className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Compass className="h-5 w-5" />
                    <span>Discover</span>
                  </Link>
                  <Link
                    to="/events"
                    className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Events</span>
                  </Link>
                  <Link
                    to="/communities"
                    className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-5 w-5" />
                    <span>Communities</span>
                  </Link>
                  <Link
                    to="/projects"
                    className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Projects</span>
                  </Link>
                  <Link
                    to="/discover?type=glossary"
                    className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Knowledge</span>
                  </Link>
                  <Link
                    to="/bathroom-finder"
                    className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Bathrooms</span>
                  </Link>
                  {user && (
                    <Link
                      to="/events/create"
                      className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Plus className="h-5 w-5" />
                      <span>Create</span>
                    </Link>
                  )}
                  <Link
                    to="/request-service"
                    className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icons.request className="h-5 w-5" />
                    <span>Request Service</span>
                  </Link>
                </div>

                {user ? (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="w-full">
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
