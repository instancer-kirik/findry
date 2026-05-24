import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  X,
  Search,
  SunIcon,
  MoonIcon,
  LayoutDashboard,
  LogOut,
  LogIn,
  Plus,
  Sparkles,
  ChevronRight,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { useToast } from "@/hooks/use-toast";
import {
  navigation,
  mobileNavSections,
  createActions,
} from "@/config/navigation";

type FlatLink = {
  href: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  kind: "nav" | "create";
};

// Per-route contextual quick actions
const routeQuickActions: Record<string, { title: string; href: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  "/lyrics": [{ title: "New lyric", href: "/lyrics?new=1", icon: Plus }],
  "/projects": [{ title: "Start project", href: "/projects/create", icon: Plus }],
  "/communities": [{ title: "Create community", href: "/communities?create=1", icon: Plus }],
  "/events/upcoming": [{ title: "Create event", href: "/events/create", icon: Plus }],
  "/tasks": [{ title: "New task", href: "/tasks?new=1", icon: Plus }],
  "/garages": [{ title: "Add garage", href: "/garages/create", icon: Plus }],
  "/shopping-list": [{ title: "Add item", href: "/shopping-list?new=1", icon: Plus }],
  "/tour-planner": [{ title: "New tour", href: "/tour-planner?new=1", icon: Plus }],
  "/discover": [{ title: "Request service", href: "/request-service", icon: Sparkles }],
};

const MobileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const close = () => {
    setOpen(false);
    setQuery("");
    setActiveIdx(0);
  };

  // Flatten searchable index
  const flatLinks: FlatLink[] = useMemo(() => {
    const out: FlatLink[] = [];
    navigation.forEach((cat) =>
      cat.sections.forEach((s) =>
        s.links.forEach((l) =>
          out.push({
            href: l.href,
            title: l.title,
            description: l.description,
            icon: l.icon,
            category: cat.label,
            kind: "nav",
          }),
        ),
      ),
    );
    createActions.forEach((a) =>
      out.push({
        href: a.href,
        title: a.title,
        icon: a.icon,
        category: "Create",
        kind: "create",
      }),
    );
    return out;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return flatLinks
      .filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query, flatLinks]);

  useEffect(() => setActiveIdx(0), [query]);

  // Find contextual quick actions for the current route (longest prefix match)
  const contextActions = useMemo(() => {
    const direct = routeQuickActions[pathname];
    if (direct) return direct;
    const match = Object.keys(routeQuickActions)
      .filter((k) => pathname.startsWith(k))
      .sort((a, b) => b.length - a.length)[0];
    return match ? routeQuickActions[match] : [];
  }, [pathname]);

  const currentRouteLabel = useMemo(() => {
    const all = flatLinks.find((l) => l.href.split("?")[0] === pathname);
    return all?.title ?? null;
  }, [pathname, flatLinks]);

  const go = (href: string) => {
    navigate(href);
    close();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
      toast({ title: "Signed out" });
    } catch (e) {
      toast({ title: "Error signing out", variant: "destructive" });
    }
    close();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b shrink-0">
          <Link to="/" onClick={close} className="font-bold text-lg tracking-tight">
            Consparium
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-9 w-9"
            >
              <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" size="icon" onClick={close} className="h-9 w-9">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2 border-b shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus={false}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (!results.length) return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIdx((i) => Math.min(i + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIdx((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  go(results[activeIdx].href);
                }
              }}
              placeholder="Search pages, actions…"
              className="pl-9 h-10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {query ? (
            // Search results
            <div className="p-2">
              {results.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No matches for "{query}"
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {results.map((r, i) => (
                    <li key={r.href}>
                      <button
                        onClick={() => go(r.href)}
                        onMouseEnter={() => setActiveIdx(i)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                          i === activeIdx ? "bg-accent" : "hover:bg-accent/50",
                        )}
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/70 shrink-0">
                          <r.icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium truncate">{r.title}</span>
                          <span className="block text-xs text-muted-foreground truncate">
                            {r.category}
                            {r.description ? ` · ${r.description}` : ""}
                          </span>
                        </span>
                        {i === activeIdx && (
                          <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="pb-4">
              {/* Contextual quick actions */}
              {(contextActions.length > 0 || currentRouteLabel) && (
                <div className="px-4 pt-4 pb-3 border-b">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    On this page{currentRouteLabel ? ` · ${currentRouteLabel}` : ""}
                  </p>
                  {contextActions.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {contextActions.map((a) => (
                        <button
                          key={a.href}
                          onClick={() => go(a.href)}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/10 hover:bg-primary/15 border border-primary/20 text-sm font-medium transition-colors"
                        >
                          <a.icon className="h-4 w-4 text-primary shrink-0" />
                          <span className="truncate">{a.title}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No quick actions here yet.</p>
                  )}
                </div>
              )}

              {/* Dashboard shortcut */}
              {user && (
                <div className="px-4 pt-4">
                  <Link
                    to="/dashboard"
                    onClick={close}
                    className="flex items-center gap-3 p-3 bg-accent/40 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">Dashboard</span>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Link>
                </div>
              )}

              {/* Create actions */}
              {user && (
                <div className="px-4 pt-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Create
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {createActions.map((a) => (
                      <Link
                        key={a.href}
                        to={a.href}
                        onClick={close}
                        className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-accent transition-colors text-sm"
                      >
                        <a.icon className="h-4 w-4 text-muted-foreground" />
                        <span>{a.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Category groups */}
              {mobileNavSections.map((section) => (
                <div key={section.title} className="px-4 pt-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {section.links.map((link) => {
                      const active = pathname === link.href.split("?")[0];
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={close}
                          className={cn(
                            "flex items-center gap-3 py-2 px-2 rounded-md transition-colors text-sm",
                            active
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-accent",
                          )}
                        >
                          <link.icon
                            className={cn(
                              "h-4 w-4",
                              active ? "text-primary" : "text-muted-foreground",
                            )}
                          />
                          <span>{link.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer auth */}
        <div className="p-3 border-t shrink-0">
          {user ? (
            <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login" onClick={close}>
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Log In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup" onClick={close}>
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;