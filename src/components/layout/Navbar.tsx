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
  Compass
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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { useLocalStorage } from '@/hooks/use-local-storage';

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
      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated && (
          <Link
            to="/dashboard"
            className={`flex items-center space-x-2 ${location.pathname === '/dashboard' ? 'text-primary' : 'hover:text-primary'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <Compass className="h-5 w-5" />
              <span>Discover</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/discover" className="w-full cursor-pointer">All Content</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/artists" className="w-full cursor-pointer">Artists</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/venues" className="w-full cursor-pointer">Venues</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/resources" className="w-full cursor-pointer">Resources</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/projects" className="w-full cursor-pointer">Projects</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/brands" className="w-full cursor-pointer">Brands</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/events" className="w-full cursor-pointer">All Events</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/events/calendar" className="w-full cursor-pointer">Calendar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/events/interested" className="w-full cursor-pointer">Interested</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/events/upcoming" className="w-full cursor-pointer">Upcoming</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/events/create" className="w-full cursor-pointer">Create Event</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Connect</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/communities" className="w-full cursor-pointer">Communities</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/chats" className="w-full cursor-pointer">Chats</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/collaboration" className="w-full cursor-pointer">Collaboration</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/meetings" className="w-full cursor-pointer">Meetings</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Link
          to="/shops"
          className={`flex items-center space-x-2 ${location.pathname === '/shops' ? 'text-primary' : 'hover:text-primary'}`}
        >
          <span>Shops</span>
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center space-x-4">
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
              <DropdownMenuContent align="end">
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
          <SheetContent side="left">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="font-bold text-xl" onClick={() => setOpen(false)}>Findry</Link>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-1 space-y-4">
                {isAuthenticated && (
                  <Link to="/dashboard" className="flex items-center space-x-2 py-2 text-sm" onClick={() => setOpen(false)}>
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                <Link to="/discover" className="flex items-center space-x-2 py-2 text-sm" onClick={() => setOpen(false)}>
                  <Compass className="h-5 w-5" />
                  <span>Discover</span>
                </Link>
                
                <Link to="/events" className="flex items-center space-x-2 py-2 text-sm" onClick={() => setOpen(false)}>
                  <Calendar className="h-5 w-5" />
                  <span>Events</span>
                </Link>
                
                <Link to="/communities" className="flex items-center space-x-2 py-2 text-sm" onClick={() => setOpen(false)}>
                  <MessageSquare className="h-5 w-5" />
                  <span>Communities</span>
                </Link>
                
                <Link to="/shops" className="flex items-center space-x-2 py-2 text-sm" onClick={() => setOpen(false)}>
                  <span>Shops</span>
                </Link>
              </div>
              
              {isAuthenticated ? (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link to="/profile" className="flex items-center space-x-2 py-2 text-sm" onClick={() => setOpen(false)}>
                      <UserRound className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-2 py-2 text-sm" onClick={() => setOpen(false)}>
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t space-y-2">
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
