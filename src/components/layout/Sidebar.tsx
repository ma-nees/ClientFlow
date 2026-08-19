import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Inbox,
  LayoutDashboard,
  Settings,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/contexts/auth";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const primaryNav: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/campaigns", label: "Campaigns", icon: Target },
  { to: "/email-queue", label: "Email Queue", icon: Inbox },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export const settingsNav: NavItem[] = [{ to: "/settings", label: "Settings", icon: Settings }];

export function SidebarContent({
  collapsed = false,
  gmailConnected,
  onNavigate,
  onToggleCollapse,
}: {
  collapsed?: boolean;
  gmailConnected: boolean;
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
}) {
  const { user } = useAuth();

  const renderItem = ({ to, label, icon: Icon }: NavItem) => (
    <Link
      key={to}
      to={to}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      activeProps={{
        className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
        "aria-current": "page",
      }}
      className={cn(
        "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className={cn("flex h-16 items-center gap-2.5 border-b px-4", collapsed && "justify-center px-0")}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <Zap className="size-4" aria-hidden />
        </span>
        {!collapsed && (
          <span className="text-[15px] font-semibold tracking-tight">
            ClientFlow <span className="text-primary">AI</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3" aria-label="Main navigation">
        <div className="space-y-1">
          {!collapsed && <p className="text-eyebrow px-2.5 pb-1">Workspace</p>}
          {primaryNav.map(renderItem)}
        </div>
        <div className="space-y-1">
          {!collapsed && <p className="text-eyebrow px-2.5 pb-1">Configuration</p>}
          {settingsNav.map(renderItem)}
        </div>
      </nav>

      <div className="space-y-3 border-t p-3">
        <Link
          to="/settings/gmail"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs transition-colors hover:bg-sidebar-accent/60",
            collapsed && "justify-center px-0",
          )}
          title={gmailConnected ? "Gmail connected" : "Gmail not connected"}
        >
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              gmailConnected ? "bg-success" : "border border-muted-foreground/60 bg-transparent",
            )}
            aria-hidden
          />
          {!collapsed && (
            <span className={gmailConnected ? "text-success" : "text-muted-foreground"}>
              {gmailConnected ? "Gmail connected" : "Gmail not connected"}
            </span>
          )}
        </Link>

        <Link
          to="/settings/profile"
          onClick={onNavigate}
          className={cn(
            "group flex items-center justify-between gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-sidebar-accent/80",
            collapsed && "justify-center px-0",
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground shadow-sm ring-1 ring-border/50">
              {initials(user?.name ?? "Guest")}
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{user?.name ?? "Guest"}</span>
                <span className="block truncate text-xs text-muted-foreground">{user?.role ?? "Demo"}</span>
              </span>
            )}
          </div>
          {!collapsed && <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100" aria-hidden />}
        </Link>

        {onToggleCollapse ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full justify-center text-muted-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} aria-hidden />
            {!collapsed && <span className="ml-1 text-xs">Collapse</span>}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
