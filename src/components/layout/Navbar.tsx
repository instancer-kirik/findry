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
  Plus
} from "lucide-react";
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
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileAction = (action: string) => {
    switch (action) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'profile':
        navigate(`/profile/${user?.user_metadata?.username}`);
        break;
      case 'settings':
        navigate('/settings');
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
                    location.pathname.includes('/discover') || 
                    location.pathname.includes('/artists') || 
                    location.pathname.includes('/venues') || 
                    location.pathname.includes('/resources') ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            Discover
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[400px] p-0 grid grid-cols-2 gap-0 bg-background">
                <div className="p-4 space-y-4 border-r">
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">Browse Content</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/discover" className="w-full cursor-pointer">All Content</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/resources" className="w-full cursor-pointer">Resources</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/artists" className="w-full cursor-pointer">Artists</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/venues" className="w-full cursor-pointer">Venues</Link>
                    </DropdownMenuItem>
                  </div>
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">My Items</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/profile/resources" className="w-full cursor-pointer">My Resources</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer">My Profile</Link>
                    </DropdownMenuItem>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">More</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/projects" className="w-full cursor-pointer">Projects</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/brands" className="w-full cursor-pointer">Brands</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/shops" className="w-full cursor-pointer">Shops</Link>
                    </DropdownMenuItem>
                  </div>
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/profile/resources" className="w-full cursor-pointer">Add Resource</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/search" className="w-full cursor-pointer">Advanced Search</Link>
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-sm px-3 py-2 h-auto font-normal ${
                    location.pathname.includes('/events') ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  Events
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[400px] p-0 grid grid-cols-2 gap-0 bg-background">
                <div className="p-4 space-y-4 border-r">
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">Browse Events</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/events" className="w-full cursor-pointer">All Events</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/events/calendar" className="w-full cursor-pointer">Calendar View</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/events/upcoming" className="w-full cursor-pointer">Upcoming Events</Link>
                    </DropdownMenuItem>
                  </div>
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">My Events</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/events/interested" className="w-full cursor-pointer">Interested</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile/events" className="w-full cursor-pointer">My Events</Link>
                    </DropdownMenuItem>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">Create</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/events/create" className="w-full cursor-pointer">Create Event</Link>
                    </DropdownMenuItem>
                  </div>
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">Integrations</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/eventbrite/orders" className="w-full cursor-pointer">Eventbrite Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/eventbrite/callback" className="w-full cursor-pointer">Eventbrite Settings</Link>
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-sm px-3 py-2 h-auto font-normal ${
                    location.pathname.includes('/communities') || 
                    location.pathname.includes('/collaboration') || 
                    location.pathname.includes('/chats') || 
                    location.pathname.includes('/meetings') ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  Connect
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[400px] p-0 grid grid-cols-2 gap-0 bg-background">
                <div className="p-4 space-y-4 border-r">
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">Communities</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/communities" className="w-full cursor-pointer">All Communities</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/community/events" className="w-full cursor-pointer">Community Events</Link>
                    </DropdownMenuItem>
                  </div>
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">Communication</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/chats" className="w-full cursor-pointer">Chats</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/chats/new" className="w-full cursor-pointer">New Message</Link>
                    </DropdownMenuItem>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">Collaboration</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/collaboration" className="w-full cursor-pointer">Collaborations</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/projects/create" className="w-full cursor-pointer">New Project</Link>
                    </DropdownMenuItem>
                  </div>
                  <div>
                    <DropdownMenuLabel className="text-primary mb-1">Scheduling</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/meetings" className="w-full cursor-pointer">Meetings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/meetings/schedule" className="w-full cursor-pointer">Schedule Meeting</Link>
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-sm px-3 py-2 h-auto font-normal ${
                    location.pathname.includes('/create') || 
                    location.pathname.includes('/add') || 
                    location.pathname.includes('/profile/resources') ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[250px] p-2 bg-background">
                <DropdownMenuItem asChild>
                  <Link to="/profile/resources" className="w-full cursor-pointer">Add Resource</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/events/create" className="w-full cursor-pointer">Create Event</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/projects/create" className="w-full cursor-pointer">Start Project</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/shops/create" className="w-full cursor-pointer">Open Shop</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile-setup" className="w-full cursor-pointer">Edit Profile</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          
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
                <Link to="/about" className="w-full cursor-pointer">About Findry</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contact" className="w-full cursor-pointer">Contact Us</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="https://github.com/lovable/findry" target="_blank" rel="noopener noreferrer" className="w-full cursor-pointer">
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
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfileAction('dashboard')}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileAction('profile')}>
                  <UserRound className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileAction('settings')}>
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
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {user && (
                  <Link to="/dashboard" className="flex items-center space-x-2 py-2 text-sm px-4 hover:bg-muted border-b" onClick={() => setIsMobileMenuOpen(false)}>
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                </Link>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md">
                    <Compass className="h-5 w-5" />
                    <span>Discover</span>
                  </div>
                  <div className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md">
                    <Calendar className="h-5 w-5" />
                    <span>Events</span>
                  </div>
                  <div className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md">
                    <Users className="h-5 w-5" />
                    <span>Connect</span>
                  </div>
                  <div className="flex items-center space-x-2 py-2 px-4 hover:bg-muted rounded-md">
                    <Plus className="h-5 w-5" />
                    <span>Create</span>
                  </div>
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
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Log In
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
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
