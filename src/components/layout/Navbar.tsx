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
  Store
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

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  subItems?: {
    href: string;
    icon: React.ReactNode;
    label: string;
  }[];
}

const navItems: NavItem[] = [
  { href: '/', icon: <Sparkles className="h-5 w-5" />, label: 'Home' },
  { href: '/discover', icon: <Search className="h-5 w-5" />, label: 'Discover' },
  { href: '/communities', icon: <Users className="h-5 w-5" />, label: 'Communities' },
  { href: '/shops', icon: <Store className="h-5 w-5" />, label: 'Shops' },
  { href: '/chats', icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', badge: 3 },
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
  const [session, setSession] = useState<any>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/login');
  };

  const handleProfileAction = (action: string) => {
    if (action === 'profile') {
      navigate('/profile');
    } else {
      toast({
        title: "Action triggered",
        description: `You clicked on ${action}`,
      });
    }
  };

  const userProfileLink = session ? `/profile` : '/login';
  const user = session?.user;

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

  return (
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="font-bold text-xl">
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
        {user ? (
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
              <Button>
                <User className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-6">
          <div className="mb-4">
            <Link to="/" className="font-bold text-xl block" onClick={() => setOpen(false)}>
              Findry
            </Link>
          </div>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.subItems ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 py-2 text-sm font-medium">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className="flex items-center space-x-2 py-2 text-sm pl-7"
                        onClick={() => setOpen(false)}
                      >
                        {subItem.icon}
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <MobileNavItem
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    onClick={() => setOpen(false)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <ThemeNavbarToggle />
            {user ? (
              <>
                <Link to={userProfileLink} className="flex items-center space-x-2 py-2 text-sm" onClick={() => setOpen(false)}>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>Profile</span>
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-2 py-2 text-sm" onClick={() => setOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Log In</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-2 py-2 text-sm" onClick={() => setOpen(false)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navbar;
