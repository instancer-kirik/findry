
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  User,
  MessageSquare,
  Calendar,
  Compass,
  UsersRound,
  Layers,
  CalendarClock,
  CalendarDays,
  CalendarCheck,
  CalendarHeart,
  MessagesSquare,
  Users,
  Settings,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for now to show the user menu
  const [notificationCount, setNotificationCount] = useState(3);
  const [messageCount, setMessageCount] = useState(5);
  const [communityCount, setCommunityCount] = useState(2);
  const { toast } = useToast();

  const navLinks = [
    { name: 'Discover', path: '/discover', icon: <Compass className="h-5 w-5" /> }, // Changed back to "Discover" with Compass icon
    // Events is now handled with NavigationMenu dropdown
    { name: 'Collaboration', path: '/collaboration', icon: <UsersRound className="h-5 w-5" /> },
    { name: 'Projects', path: '/projects', icon: <Layers className="h-5 w-5" /> },
    { name: 'Communities', path: '/communities', icon: <Users className="h-5 w-5" />, count: communityCount },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have " + notificationCount + " unread notifications.",
    });
    // Clear notifications after viewing
    setNotificationCount(0);
  };

  const handleMessageClick = () => {
    // Navigate to chats page
    // Using window.location to avoid needing to create a new component with useNavigate
    if (!isActive('/chats')) {
      window.location.href = '/chats';
    }
  };

  const AuthButtons = () => (
    <>
      <Link to="/login">
        <Button variant="outline" className="mr-2">Log In</Button>
      </Link>
      <Link to="/signup">
        <Button>Sign Up</Button>
      </Link>
    </>
  );

  const UserMenu = () => (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        className="relative"
        onClick={handleNotificationClick}
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="relative"
        onClick={handleMessageClick}
      >
        <MessageSquare className="h-5 w-5" />
        {messageCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {messageCount}
          </span>
        )}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="@username" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Username</p>
              <p className="text-xs leading-none text-muted-foreground">
                username@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            toast({
              title: "Profile",
              description: "Your profile page will be available soon.",
            });
          }}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            toast({
              title: "Calendar",
              description: "Your calendar will be available soon.",
            });
          }}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            toast({
              title: "Projects",
              description: "Your projects will be available soon.",
            });
          }}>
            <Layers className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            toast({
              title: "Settings",
              description: "Settings will be available soon.",
            });
          }}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <nav className="bg-background py-4 px-6 border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Sparkles className="h-8 w-8 text-primary mr-2" /> {/* Changed from Search to Sparkles icon */}
            <span className="font-bold text-xl hidden sm:inline">Findry</span> {/* Changed from CreativeConnect to Findry */}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                isActive(link.path) 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {link.name}
              {link.count && link.count > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {link.count}
                </Badge>
              )}
            </Link>
          ))}

          {/* Remove Chats text link from navbar - keep icon only in user menu */}

          {/* Events NavigationMenu with dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={`${
                  isActive('/events') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  Events
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          to="/events"
                        >
                          <Calendar className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Events
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Discover upcoming events and get involved with your community
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link to="/meetings" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">My Calendar</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          View and manage your scheduled events and meetings
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/events?filter=interested" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarHeart className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Interested Events</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Events you've shown interest in attending
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/events/create" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Create Event</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Create and schedule your own events or meetings
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search Button */}
        <div className="hidden sm:flex items-center mx-4 flex-1 max-w-md">
          <div className="bg-gray-100 rounded-lg w-full flex items-center px-3 py-1.5">
            <Search className="h-5 w-5 text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search Findry" /* Changed from CreativeConnect to Findry */
              className="bg-transparent border-none flex-1 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Auth / User Menu - Desktop */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? <UserMenu /> : <AuthButtons />}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="md:hidden"
            onClick={() => {
              toast({
                title: "Search",
                description: "Search functionality will be available soon.",
              });
            }}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {isLoggedIn && (
            <Button 
              variant="outline" 
              size="icon" 
              className="relative md:hidden"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <SheetHeader className="mb-4">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate Findry {/* Changed from CreativeConnect to Findry */}
                </SheetDescription>
              </SheetHeader>
              
              {isLoggedIn && (
                <div className="flex items-center space-x-2 mb-6 pb-4 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt="@username" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Username</p>
                    <p className="text-xs text-muted-foreground">View profile</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-1 py-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.name}>
                    <Link 
                      to={link.path}
                      className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive(link.path) 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {link.icon}
                      <span className="ml-2">{link.name}</span>
                      {link.count && link.count > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {link.count}
                        </Badge>
                      )}
                    </Link>
                  </SheetClose>
                ))}

                {/* Modified Chats Link to match MessageSquare icon in mobile menu */}
                <SheetClose asChild>
                  <Link 
                    to="/chats"
                    className={`flex items-center py-2 px-3 rounded-md text-sm ${
                      isActive('/chats') 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <MessagesSquare className="h-5 w-5" />
                    <span className="ml-2">Messages</span> {/* Changed from "Chats" to "Messages" */}
                    {messageCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {messageCount}
                      </Badge>
                    )}
                  </Link>
                </SheetClose>

                {/* Events section in mobile view */}
                <div className="pt-2">
                  <p className="px-3 text-sm font-medium text-muted-foreground">Events</p>
                  <SheetClose asChild>
                    <Link 
                      to="/events"
                      className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive('/events') && !location.pathname.includes('create') && !location.pathname.includes('interested')
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>All Events</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/meetings"
                      className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive('/meetings') 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <CalendarCheck className="h-5 w-5 mr-2" />
                      <span>My Calendar</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/events?filter=interested"
                      className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        location.pathname.includes('interested')
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <CalendarHeart className="h-5 w-5 mr-2" />
                      <span>Interested Events</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/events/create"
                      className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        location.pathname.includes('create')
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <CalendarClock className="h-5 w-5 mr-2" />
                      <span>Create Event</span>
                    </Link>
                  </SheetClose>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                {isLoggedIn ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsLoggedIn(false)}
                  >
                    Log out
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <SheetClose asChild>
                      <Link to="/login">
                        <Button variant="outline" className="w-full">Log In</Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/signup">
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </SheetClose>
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
