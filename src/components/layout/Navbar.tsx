import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "@/components/ui/theme-provider";
import { AlignJustify } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-4 font-bold text-2xl">
          Findry
        </Link>
        
        <div className="flex items-center gap-2">
          
          <Link
            to="/discover"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/discover" ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Discover
          </Link>

          <Link
            to="/communities"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/communities" ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Communities
          </Link>

          <Link
            to="/grouper"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/grouper" ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Grouper
          </Link>
          
        </div>

        <div className="ml-auto flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setTheme(theme => (theme === "light" ? "dark" : "light"))
            }
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 lg:h-10 lg:w-10">
                  <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url as string} />
                    <AvatarFallback>{user?.user_metadata?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/profile/${user?.user_metadata?.username}`)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <AlignJustify className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-64">
              <div className="grid gap-4 py-4">
                <Link to="/" className="mr-4 font-bold text-2xl">
                  Findry
                </Link>
                <Link
                  to="/discover"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Discover
                </Link>
                <Link
                  to="/communities"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Communities
                </Link>
                {user ? (
                  <>
                    <Link
                      to={`/profile/${user?.user_metadata?.username}`}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Dashboard
                    </Link>
                    <Button variant="outline" onClick={handleSignOut}>
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
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
