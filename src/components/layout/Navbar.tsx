import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  MessageSquare, 
  Calendar, 
  Menu, 
  X, 
  User,
  LogIn,
  LogOut,
  Settings,
  Bell,
  UserRound,
  ChevronDown,
  LayoutDashboard,
  Compass,
  Plus,
  CircleHelp,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeNavbarToggle from './ThemeNavbarToggle';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const [mode] = useLocalStorage<'light' | 'dark' | 'system'>(
    'vite-ui-theme',
    'system'
  );

  // State for mobile menu
  const [activeTab, setActiveTab] = useState<'find' | 'found' | 'connect'>('find');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Handle session changes
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      // Handle initial session
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleProfileAction = (action: string) => {
    if (action === 'profile') {
      navigate('/profile');
    } else if (action === 'dashboard') {
      navigate('/dashboard');
    } else {
      toast({
        title: "Action triggered",
        description: `You clicked on ${action}`,
      });
    }
  };

  return (
    <div className="container flex h-16 items-center justify-between">
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="font-bold text-xl">
        Findry
      </Link>

      {/* Desktop Navigation - Simplified with dropdowns */}
      <div className="hidden md:flex items-center space-x-3">
        {isAuthenticated && (
          <Link
            to="/dashboard"
            className={`text-sm px-3 py-2 rounded-md ${location.pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
          >
            <span>Dashboard</span>
          </Link>
        )}
        
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
        
        <Link
          to="/about"
          className={`text-sm px-3 py-2 rounded-md ${location.pathname === '/about' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
        >
          <span>About</span>
        </Link>
      </div>

      {/* Auth and Help Buttons */}
      <div className="hidden md:flex items-center space-x-4">
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
        
        <ThemeNavbarToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
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
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline">
                <LogIn className="h-4 w-4 mr-2" />
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center">
        <ThemeNavbarToggle />
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0 overflow-y-auto">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-3 border-b">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="font-bold text-xl" onClick={() => setOpen(false)}>
                  Findry
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {isAuthenticated && (
                <Link to="/dashboard" className="flex items-center space-x-2 py-2 text-sm px-4 hover:bg-muted border-b" onClick={() => setOpen(false)}>
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              )}
              
              <div className="overflow-y-auto">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="discover" className="border-b">
                    <AccordionTrigger className="py-2 px-4 hover:bg-muted/50 hover:no-underline">
                      <div className="flex items-center">
                        <Compass className="h-5 w-5 mr-2" />
                        <span>Discover</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2">
                      <div className="grid grid-cols-2 gap-1 px-2">
                        <Link to="/discover" className="py-2 px-3 text-sm rounded-md hover:bg-muted text-center" onClick={() => setOpen(false)}>
                          All Content
                        </Link>
                        <Link to="/resources" className="py-2 px-3 text-sm rounded-md hover:bg-muted text-center" onClick={() => setOpen(false)}>
                          Resources
                        </Link>
                        <Link to="/artists" className="py-2 px-3 text-sm rounded-md hover:bg-muted text-center" onClick={() => setOpen(false)}>
                          Artists
                        </Link>
                        <Link to="/venues" className="py-2 px-3 text-sm rounded-md hover:bg-muted text-center" onClick={() => setOpen(false)}>
                          Venues
                        </Link>
                        <Link to="/projects" className="py-2 px-3 text-sm rounded-md hover:bg-muted text-center" onClick={() => setOpen(false)}>
                          Projects
                        </Link>
                        <Link to="/brands" className="py-2 px-3 text-sm rounded-md hover:bg-muted text-center" onClick={() => setOpen(false)}>
                          Brands
                        </Link>
                        <Link to="/shops" className="py-2 px-3 text-sm rounded-md hover:bg-muted text-center" onClick={() => setOpen(false)}>
                          Shops
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="events" className="border-b">
                    <AccordionTrigger className="py-2 px-4 hover:bg-muted/50 hover:no-underline">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>Events</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2">
                      <div className="grid grid-cols-1 gap-1 px-2">
                        <Link to="/events" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          All Events
                        </Link>
                        <Link to="/events/calendar" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Calendar View
                        </Link>
                        <Link to="/events/upcoming" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Upcoming Events
                        </Link>
                        <Link to="/events/interested" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Interested Events
                        </Link>
                        <Link to="/events/create" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Create Event
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="connect" className="border-b">
                    <AccordionTrigger className="py-2 px-4 hover:bg-muted/50 hover:no-underline">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2" />
                        <span>Connect</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2">
                      <div className="grid grid-cols-1 gap-1 px-2">
                        <Link to="/communities" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Communities
                        </Link>
                        <Link to="/chats" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Chats
                        </Link>
                        <Link to="/collaboration" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Collaboration
                        </Link>
                        <Link to="/meetings" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Meetings
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="create" className="border-b">
                    <AccordionTrigger className="py-2 px-4 hover:bg-muted/50 hover:no-underline">
                      <div className="flex items-center">
                        <Plus className="h-5 w-5 mr-2" />
                        <span>Create</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2">
                      <div className="grid grid-cols-1 gap-1 px-2">
                        <Link to="/profile/resources" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Add Resource
                        </Link>
                        <Link to="/events/create" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Create Event
                        </Link>
                        <Link to="/projects/create" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Start Project
                        </Link>
                        <Link to="/shops/create" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Open Shop
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="profile" className="border-b">
                    <AccordionTrigger className="py-2 px-4 hover:bg-muted/50 hover:no-underline">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        <span>Profile</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2">
                      <div className="grid grid-cols-1 gap-1 px-2">
                        <Link to="/profile" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          My Profile
                        </Link>
                        <Link to="/profile-setup" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          Edit Profile
                        </Link>
                        <Link to="/profile/resources" className="py-2 px-3 text-sm rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          My Resources
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="grid grid-cols-2 gap-1 p-3 border-b">
                  <Link to="/about" className="py-2 px-3 text-sm rounded-md hover:bg-muted text-center" onClick={() => setOpen(false)}>
                    About
                  </Link>
                  <Link to="/contact" className="py-2 px-3 text-sm rounded-md hover:bg-muted text-center" onClick={() => setOpen(false)}>
                    Contact
                  </Link>
                </div>
              </div>
              
              {isAuthenticated ? (
                <div className="mt-auto p-3 border-t">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <p className="text-sm font-medium">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="mt-auto p-3 border-t grid grid-cols-2 gap-2">
                  <Link to="/login" className="w-full" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <LogIn className="h-4 w-4 mr-2" />
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full" onClick={() => setOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
