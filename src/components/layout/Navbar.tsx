import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  MoonIcon,
  SunIcon,
  Menu,
  X,
  LayoutDashboard,
  UserRound,
  Settings,
  LogOut,
  LogIn,
  ChevronRight,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { navigation, mobileNavSections, createActions, type NavCategory } from "@/config/navigation";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error signing out",
        description:
          error instanceof Error
            ? error.message
            : "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileAction = (action: string) => {
    switch (action) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "profile":
        navigate(`/profile/${user?.user_metadata?.username}`);
        break;
      case "settings":
        navigate("/settings");
        break;
    }
  };

  // Featured Card Component for megamenu
  const FeaturedCard = ({ category }: { category: NavCategory }) => {
    if (!category.featured) return null;
    
    return (
      <div className={cn(
        "relative overflow-hidden rounded-xl p-5 h-full min-h-[200px]",
        "bg-gradient-to-br",
        category.featured.gradient,
        "border border-border/50"
      )}>
        <div className="relative z-10 flex flex-col h-full">
          <h3 className="font-semibold text-base mb-2">{category.featured.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-grow">
            {category.featured.description}
          </p>
          <NavigationMenuLink asChild>
            <Link 
              to={category.featured.href}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
            >
              {category.featured.cta}
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </NavigationMenuLink>
        </div>
      </div>
    );
  };

  // Link Item Component
  const LinkItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { 
      icon?: React.ReactNode;
      compact?: boolean;
    }
  >(({ className, title, children, icon, compact, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none rounded-lg transition-all duration-200",
              "hover:bg-accent/50 hover:shadow-sm",
              "focus:bg-accent focus:outline-none",
              compact ? "p-2" : "p-3",
              className
            )}
            {...props}
          >
            <div className={cn(
              "flex items-center gap-2.5",
              compact ? "text-sm" : "text-sm font-medium"
            )}>
              {icon && (
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/70 text-muted-foreground shrink-0">
                  {icon}
                </span>
              )}
              <div className="min-w-0">
                <div className="font-medium leading-none mb-1">{title}</div>
                {children && !compact && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {children}
                  </p>
                )}
              </div>
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  LinkItem.displayName = "LinkItem";

  // Section Header Component
  const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
      {children}
    </h4>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl tracking-tight">
            Findry
          </Link>

          {/* Desktop Navigation with Professional Megamenu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {navigation.map((category) => (
                <NavigationMenuItem key={category.id}>
                  <NavigationMenuTrigger 
                    className="h-9 px-3 bg-transparent data-[state=open]:bg-accent/50"
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={(e) => e.preventDefault()}
                  >
                    {category.href ? (
                      <Link 
                        to={category.href}
                        className="flex items-center"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <category.icon className="h-4 w-4 mr-1.5" />
                        {category.label}
                      </Link>
                    ) : (
                      <>
                        <category.icon className="h-4 w-4 mr-1.5" />
                        {category.label}
                      </>
                    )}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className={cn(
                      "p-4",
                      category.featured ? "w-[600px]" : "w-[400px]"
                    )}>
                      {category.featured ? (
                        // Layout with featured card
                        <div className="grid grid-cols-5 gap-4">
                          {/* Featured Card - 2 columns */}
                          <div className="col-span-2">
                            <FeaturedCard category={category} />
                          </div>
                          
                          {/* Links - 3 columns */}
                          <div className="col-span-3 space-y-4">
                            {category.sections.map((section) => (
                              <div key={section.title}>
                                <SectionHeader>{section.title}</SectionHeader>
                                <ul className="grid gap-1">
                                  {section.links.map((link) => (
                                    <LinkItem
                                      key={link.href}
                                      href={link.href}
                                      title={link.title}
                                      icon={<link.icon className="h-4 w-4" />}
                                      compact
                                    >
                                      {link.description}
                                    </LinkItem>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // Simple layout without featured card
                        <div className="grid grid-cols-2 gap-4">
                          {category.sections.map((section) => (
                            <div key={section.title}>
                              <SectionHeader>{section.title}</SectionHeader>
                              <ul className="grid gap-1">
                                {section.links.map((link) => (
                                  <LinkItem
                                    key={link.href}
                                    href={link.href}
                                    title={link.title}
                                    icon={<link.icon className="h-4 w-4" />}
                                    compact
                                  >
                                    {link.description}
                                  </LinkItem>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <Link to="/dashboard" className="hidden md:block">
              <Button variant="ghost" size="sm" className="h-9">
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                Dashboard
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden md:flex h-9 w-9"
          >
            <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.user_metadata?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfileAction("dashboard")}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileAction("profile")}>
                  <UserRound className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileAction("settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 overflow-y-auto p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <Link 
                    to="/" 
                    className="font-bold text-xl" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Findry
                  </Link>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                      <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-4">
                  {user && (
                    <div className="px-4 mb-4">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </div>
                  )}

                  {/* Navigation Sections */}
                  {mobileNavSections.map((section, index) => (
                    <div key={section.title} className={cn(
                      "px-4 pb-4",
                      index < mobileNavSections.length - 1 && "border-b mb-4"
                    )}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        {section.title}
                      </p>
                      <div className="space-y-1">
                        {section.links.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className="flex items-center gap-3 py-2.5 px-3 hover:bg-accent rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <link.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{link.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Create Actions */}
                  {user && (
                    <div className="px-4 pb-4 border-b mb-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Create
                      </p>
                      <div className="space-y-1">
                        {createActions.map((action) => (
                          <Link
                            key={action.href}
                            to={action.href}
                            className="flex items-center gap-3 py-2.5 px-3 hover:bg-accent rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <action.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{action.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Auth */}
                <div className="p-4 border-t mt-auto">
                  {user ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <LogIn className="h-4 w-4 mr-2" />
                          Log In
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
