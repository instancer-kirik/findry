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
  Sparkles,
  Users,
  Star,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  ChevronDown,
  Store,
  Code,
  LayoutDashboard,
  Palette,
  FileBox,
  FolderKanban,
  MapPin,
  ShoppingBag
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  requiresAuth?: boolean;
  visibleWhenAuth?: boolean;
  badge?: number;
  subItems?: {
    href: string;
    icon: React.ReactNode;
    label: string;
  }[];
}

// Define base navigation items
const baseNavItems: NavItem[] = [
  { 
    href: '/', 
    icon: <Home className="h-5 w-5" />, 
    label: 'Landing',
    visibleWhenAuth: false
  },
  { 
    href: '/dashboard', 
    icon: <LayoutDashboard className="h-5 w-5" />, 
    label: 'Dashboard',
    requiresAuth: true
  },
  { 
    href: '/discover', 
    icon: <Search className="h-5 w-5" />, 
    label: 'Discover'
  },
  { 
    href: '/artists', 
    icon: <Palette className="h-5 w-5" />, 
    label: 'Artists'
  },
  { 
    href: '/resources', 
    icon: <FileBox className="h-5 w-5" />, 
    label: 'Resources'
  },
  { 
    href: '/projects', 
    icon: <FolderKanban className="h-5 w-5" />, 
    label: 'Projects'
  },
  { 
    href: '/communities', 
    icon: <Users className="h-5 w-5" />, 
    label: 'Communities'
  },
  { 
    href: '/shops', 
    icon: <Store className="h-5 w-5" />, 
    label: 'Shops' 
  },
  { 
    href: '/chats', 
    icon: <MessageSquare className="h-5 w-5" />, 
    label: 'Chats', 
    badge: 3, 
    requiresAuth: true 
  },
  { 
    href: '/events', 
    icon: <Calendar className="h-5 w-5" />, 
    label: 'Events',
    subItems: [
      { href: '/events/calendar', icon: <CalendarDays className="h-4 w-4" />, label: 'Calendar' },
      { href: '/events/interested', icon: <CalendarCheck className="h-4 w-4" />, label: 'Interested' },
      { href: '/events/upcoming', icon: <CalendarClock className="h-4 w-4" />, label: 'Upcoming' },
      { href: '/events/create', icon: <CalendarPlus className="h-4 w-4" />, label: 'Create Event' },
    ]
  },
];

interface MobileNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ href, icon, label, badge, onClick }) => (
  <Link to={href} className="flex items-center space-x-2 py-2 text-sm relative" onClick={onClick}>
    {icon}
    <span>{label}</span>
    {badge && (
      <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {badge}
      </span>
    )}
  </Link>
);

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { toast } = useToast();
  const [mode, setMode] = useLocalStorage<'light' | 'dark' | 'system'>(
    'vite-ui-theme',
    'system'
  );
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

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

  // Filter navigation items based on authentication status
  const navItems = baseNavItems.filter(item => {
    // Hide items that require auth if user is not authenticated
    if (item.requiresAuth && !isAuthenticated) return false;
    
    // Hide items marked as not visible when authenticated
    if (item.visibleWhenAuth === false && isAuthenticated) return false;
    
    return true;
  });

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

  const userProfileLink = isAuthenticated ? `/profile` : '/login';

  const renderNavItem = (item: NavItem) => {
    if (item.subItems) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex items-center space-x-2 relative ${location.pathname.startsWith(item.href) ? 'text-primary' : 'hover:text-primary'}`}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronDown className="h-4 w-4" />
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {item.subItems.map((subItem) => (
              <DropdownMenuItem key={subItem.href} asChild>
                <Link to={subItem.href} className="flex items-center space-x-2">
                  {subItem.icon}
                  <span>{subItem.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        key={item.href}
        to={item.href}
        className={`flex items-center space-x-2 relative ${location.pathname === item.href ? 'text-primary' : 'hover:text-primary'}`}
      >
        {item.icon}
        <span>{item.label}</span>
        {item.badge && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  // Toggle submenu visibility
  const toggleSubMenu = (label: string) => {
    if (activeSubMenu === label) {
      setActiveSubMenu(null);
    } else {
      setActiveSubMenu(label);
    }
  };

  return (
    <div className="container flex h-16 items-center justify-between">
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="font-bold text-xl">
        Findry
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <div key={item.href}>
            {renderNavItem(item)}
          </div>
        ))}
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
                {navItems.map((item) => {
                  if (item.subItems) {
                    return (
                      <div key={item.href} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <div className="pl-6 space-y-2">
                          {item.subItems.map((subItem) => (
                            <MobileNavItem
                              key={subItem.href}
                              href={subItem.href}
                              icon={subItem.icon}
                              label={subItem.label}
                              onClick={() => setOpen(false)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <MobileNavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      badge={item.badge}
                      onClick={() => setOpen(false)}
                    />
                  );
                })}
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
                    <MobileNavItem
                      href="/profile"
                      icon={<UserRound className="h-5 w-5" />}
                      label="Profile"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem
                      href="/settings"
                      icon={<Settings className="h-5 w-5" />}
                      label="Settings"
                      onClick={() => setOpen(false)}
                    />
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
