import React from 'react';
import { Link } from 'react-router-dom';

import { Icons } from '@/components/ui/icons';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from 'react-router-dom';
import { useSignOut } from '@/hooks/use-sign-out';

// Add the Route icon import
import { Route } from 'lucide-react';

export default function Navbar() {
  const { session, user, isLoading } = useAuth();
  const { toast } = useToast()
  const navigate = useNavigate();
  const { signOut } = useSignOut();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <Link className="mr-6 flex items-center space-x-2" to="/">
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            Creative Hub
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-1">
            {/* Add the tour planner link here */}
            <Link to="/tour-planner" className="text-sm font-medium transition-colors hover:text-primary">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <Route className="h-4 w-4" />
                <span>Tour Planner</span>
              </div>
            </Link>
            
            <Link to="/discover" className="text-sm font-medium transition-colors hover:text-primary">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <Icons.discover className="h-4 w-4" />
                <span>Discover</span>
              </div>
            </Link>
            <Link to="/submit" className="text-sm font-medium transition-colors hover:text-primary">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <Icons.submit className="h-4 w-4" />
                <span>Submit</span>
              </div>
            </Link>
            <Link to="/requests" className="text-sm font-medium transition-colors hover:text-primary">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <Icons.request className="h-4 w-4" />
                <span>Requests</span>
              </div>
            </Link>
            {session && user ? (
              <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <Icons.dashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </div>
              </Link>
            ) : null}
          </nav>

          {isLoading ? (
            <Skeleton className="h-8 w-[80px] rounded-full" />
          ) : session && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full border border-muted/50 p-1 transition-colors hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  aria-label="Open user menu"
                >
                  <Avatar>
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{user?.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end" forceMount>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut()
                      .then(() => {
                        toast({
                          title: "Signed out",
                          description: "See you soon 👋",
                        })
                        navigate('/')
                      })
                      .catch((error) => {
                        toast({
                          variant: "destructive",
                          title: "Uh oh! Something went wrong.",
                          description: "There was a problem signing you out. Please try again.",
                        })
                      });
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Log In
              </Link>
              <Link to="/register" className={buttonVariants({ size: "sm" })}>
                Sign Up
              </Link>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
