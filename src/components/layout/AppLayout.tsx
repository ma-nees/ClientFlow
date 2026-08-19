import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Menu, Moon, Settings, Sun, User as UserIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { SidebarContent, primaryNav } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth";
import { useTheme } from "@/contexts/theme";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/services/api";
import { getGmailStatus } from "@/services/gmail";

export interface Crumb {
  label: string;
  to?: string;
}

const COLLAPSE_KEY = "clientflow.sidebar-collapsed";

export function AppLayout({
  title,
  crumbs = [],
  children,
}: {
  title: string;
  crumbs?: Crumb[];
  children: ReactNode;
}) {
  const { user, ready, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: gmail } = useQuery({ queryKey: queryKeys.gmail, queryFn: getGmailStatus });
  const gmailConnected = gmail?.connected ?? false;

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const toggleCollapsed = () =>
    setCollapsed((value) => {
      window.localStorage.setItem(COLLAPSE_KEY, value ? "0" : "1");
      return !value;
    });

  if (!ready || !user) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r lg:block",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          gmailConnected={gmailConnected}
          onToggleCollapse={toggleCollapsed}
        />
      </aside>

      <div className={cn("flex min-h-screen flex-col", collapsed ? "lg:pl-[68px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="size-4" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarContent gmailConnected={gmailConnected} onNavigate={() => setDrawerOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
                <nav aria-label="Breadcrumb" className="mb-1 hidden text-xs font-medium text-muted-foreground sm:block">
                  <ol className="flex items-center gap-1.5">
                    {crumbs.map((crumb, index) => (
                      <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                        {crumb.to ? (
                          <Link to={crumb.to} className="transition-colors hover:text-foreground">
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="text-foreground">{crumb.label}</span>
                        )}
                        {index < crumbs.length - 1 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-3 opacity-40"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </nav>
              <h1 className="truncate text-base font-semibold">{title}</h1>
            </div>

            <div className="hidden md:block">
              <GlobalSearch />
            </div>

            <Link
              to="/settings/gmail"
              className="hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs sm:flex"
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  gmailConnected ? "bg-success" : "border border-muted-foreground/60",
                )}
                aria-hidden
              />
              <span className={gmailConnected ? "text-success" : "text-muted-foreground"}>
                {gmailConnected ? "Gmail connected" : "Gmail not connected"}
              </span>
            </Link>

            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle dark mode">
              {theme === "dark" ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
            </Button>

            <NotificationsMenu />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground shadow-sm ring-1 ring-border/50 transition-all hover:ring-primary/30 hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  aria-label="Account menu"
                >
                  {initials(user.name)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <span className="block text-sm font-medium">{user.name}</span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/settings/profile" })}>
                  <UserIcon className="size-4" aria-hidden /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                  <Settings className="size-4" aria-hidden /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                    navigate({ to: "/login" });
                  }}
                >
                  <LogOut className="size-4" aria-hidden /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="border-t px-4 py-2 md:hidden">
            <GlobalSearch />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:pb-8">{children}</main>

        <nav
          className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t bg-background/95 backdrop-blur lg:hidden"
          aria-label="Primary"
        >
          {primaryNav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: "text-primary", "aria-current": "page" }}
              className="flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium text-muted-foreground"
            >
              <Icon className="size-4" aria-hidden />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
  backTo,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backTo?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {backTo && (
          <Link
            to={backTo}
            className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md border bg-background hover:bg-muted"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        )}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap justify-end gap-2 w-full sm:w-auto">{actions}</div> : null}
    </div>
  );
}
