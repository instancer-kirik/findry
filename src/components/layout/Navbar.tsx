
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
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeNavbarToggle from './ThemeNavbarToggle';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: <Home className="h-5 w-5" />, label: 'Home' },
  { href: '/discover', icon: <Search className="h-5 w-5" />, label: 'Discover' },
  { href: '/messages', icon: <MessageSquare className="h-5 w-5" />, label: 'Messages' },
  { href: '/events', icon: <Calendar className="h-5 w-5" />, label: 'Events' },
];

interface MobileNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ href, icon, label, onClick }) => (
  <Link to={href} className="flex items-center space-x-2 py-2 text-sm" onClick={onClick}>
    {icon}
    <span>{label}</span>
  </Link>
);

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Add useEffect to handle auth state changes
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/login');
  };

  const userProfileLink = session ? `/profile` : '/login';
  const user = session?.user;

  return (
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="font-bold text-xl">
        Findry
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center space-x-2 ${location.pathname === item.href ? 'text-primary' : 'hover:text-primary'}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <ThemeNavbarToggle />
        {user ? (
          <div className="flex items-center gap-2">
            <Link to={userProfileLink}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        ) : (
          <>
            <Button variant="outline" onClick={handleLogin}>
              Log In
            </Button>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="md:hidden">
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
              <MobileNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                onClick={() => setOpen(false)}
              />
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
                  <LogIn className="mr-2 h-4 w-4" />
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
