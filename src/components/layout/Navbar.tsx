
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu,
  X,
  Compass,
  Layers,
  Globe,
  UsersRound,
  Bell,
  Search,
  Settings,
  MessageSquare,
  Calendar,
  CalendarHeart,
  MessagesSquare,
  Users,
  Star,
  Sparkles,
  UserRound
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage 
} from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import ThemeNavbarToggle from './ThemeNavbarToggle';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </li>
  )
})
ListItem.displayName = "ListItem"

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { toast } = useToast();

  const navLinks = [
    { name: 'Discover', path: '/discover', icon: <Compass className="h-5 w-5" /> },
    // Events is now handled with NavigationMenu dropdown
    { name: 'Collaboration', path: '/collaboration', icon: <UsersRound className="h-5 w-5" /> },
    { name: 'Projects', path: '/projects', icon: <Layers className="h-5 w-5" /> },
    { name: 'Communities', path: '/communities', icon: <Users className="h-5 w-5" /> },
    { name: 'Messages', path: '/chats', icon: <MessagesSquare className="h-5 w-5" /> },
  ];

  const notifications = [
    { content: "New message from Alex", time: "2 minutes ago", read: false },
    { content: "Your event 'Jazz Night' is trending", time: "1 hour ago", read: false },
    { content: "New collaboration request from Studio 54", time: "3 hours ago", read: false },
    { content: "Your profile was viewed by 12 people", time: "Yesterday", read: true },
    { content: "New resources added in your area", time: "2 days ago", read: true },
  ];

  const openNotifications = () => {
    setIsNotificationsOpen(true);
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

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="relative h-8 w-8 mr-2">
                <Star className="h-8 w-8 text-primary absolute" />
                <Sparkles className="h-6 w-6 text-primary/80 absolute top-1 left-1" />
              </div>
              <span className="font-bold text-xl hidden sm:inline">Findry</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Desktop Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <Link to={link.path}>
                      <NavigationMenuLink 
                        className={cn(
                          "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                          location.pathname === link.path || location.pathname.startsWith(link.path + '/') 
                            ? "bg-accent/50 text-accent-foreground" 
                            : "text-foreground/70"
                        )}
                      >
                        {link.icon}
                        <span className="ml-2">{link.name}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
                
                {/* Events Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      location.pathname === '/events' || location.pathname.startsWith('/events/') 
                        ? "bg-accent/50 text-accent-foreground" 
                        : "text-foreground/70"
                    )}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Events
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      <ListItem href="/events" title="All Events">
                        Browse all upcoming events
                      </ListItem>
                      <ListItem href="/events/interested" title="My Events">
                        Events you're interested in
                      </ListItem>
                      <ListItem href="/events/create" title="Create Event">
                        Host your own event
                      </ListItem>
                      <ListItem href="/meetings" title="Meetings">
                        Schedule 1:1 meetings
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right section: search, notifications, profile */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center mr-4 relative bg-muted/50 rounded-full px-3 py-1.5">
              <Search className="h-5 w-5 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search Findry"
                className="bg-transparent border-none flex-1 focus:outline-none text-sm"
              />
            </div>

            {/* Notifications */}
            <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative mr-2" onClick={openNotifications}>
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    3
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div key={index} className="p-3 border-b hover:bg-muted/50 cursor-pointer flex items-start gap-3">
                      <span className={`h-2 w-2 mt-2 flex-shrink-0 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary'}`} />
                      <div>
                        <p className="text-sm">{notification.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t text-center">
                  <Button variant="ghost" size="sm" className="w-full text-primary">Mark all as read</Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>CN</AvatarFallback>
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
                <DropdownMenuItem onClick={() => handleProfileAction('billing')}>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfileAction('logout')}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeNavbarToggle />

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate Findry
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name}
                      to={link.path}
                      className={cn(
                        "flex items-center px-4 py-2 rounded-md transition-colors hover:bg-muted",
                        location.pathname === link.path || location.pathname.startsWith(link.path + '/') 
                          ? "bg-muted" 
                          : ""
                      )}
                    >
                      {link.icon}
                      <span className="ml-2">{link.name}</span>
                    </Link>
                  ))}
                  
                  <div className="border-t my-2 pt-4">
                    <h3 className="px-4 mb-2 text-sm font-medium">Events</h3>
                    <Link to="/events" className="flex items-center px-4 py-2 rounded-md transition-colors hover:bg-muted text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      All Events
                    </Link>
                    <Link to="/events/interested" className="flex items-center px-4 py-2 rounded-md transition-colors hover:bg-muted text-sm">
                      <CalendarHeart className="h-4 w-4 mr-2" />
                      My Events
                    </Link>
                    <Link to="/events/create" className="flex items-center px-4 py-2 rounded-md transition-colors hover:bg-muted text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Create Event
                    </Link>
                    <Link to="/meetings" className="flex items-center px-4 py-2 rounded-md transition-colors hover:bg-muted text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Meetings
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
