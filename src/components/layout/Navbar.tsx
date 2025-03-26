
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Globe, 
  Search, 
  Bell, 
  Menu, 
  X, 
  User,
  MessageSquare,
  Calendar,
  Compass,
  UsersRound,
  Layers
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

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const navLinks = [
    { name: 'Discover', path: '/discover', icon: <Compass className="h-5 w-5" /> },
    { name: 'Events', path: '/events', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Collaboration', path: '/collaboration', icon: <UsersRound className="h-5 w-5" /> },
    { name: 'Projects', path: '/projects', icon: <Layers className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
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
      <Button variant="outline" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </Button>
      
      <Button variant="outline" size="icon">
        <MessageSquare className="h-5 w-5" />
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
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers className="mr-2 h-4 w-4" />
            <span>Projects</span>
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
            <Globe className="h-8 w-8 text-primary mr-2" />
            <span className="font-bold text-xl hidden sm:inline">CreativeConnect</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive(link.path) 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search Button */}
        <div className="hidden sm:flex items-center mx-4 flex-1 max-w-md">
          <div className="bg-gray-100 rounded-lg w-full flex items-center px-3 py-1.5">
            <Search className="h-5 w-5 text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search CreativeConnect" 
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
          <Button variant="outline" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          
          {isLoggedIn && (
            <Button variant="outline" size="icon" className="relative md:hidden">
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
                  Navigate CreativeConnect
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
                    </Link>
                  </SheetClose>
                ))}
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
