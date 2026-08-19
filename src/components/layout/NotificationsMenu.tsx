import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelative } from "@/lib/format";
import { queryKeys } from "@/services/api";
import { getNotifications } from "@/services/analytics";

export function NotificationsMenu() {
  const { data, isLoading } = useQuery({ queryKey: queryKeys.notifications, queryFn: getNotifications });
  const unread = data?.filter((n) => !n.read).length ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
          <span className="relative">
            <Bell className="size-4" aria-hidden />
            {unread > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {unread}
              </span>
            ) : null}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <span className="text-xs text-muted-foreground">{unread} unread</span>
        </div>
        <ul className="max-h-80 divide-y overflow-y-auto">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="px-4 py-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-3 w-48" />
                </li>
              ))
            : data?.map((n) => (
                <li key={n.id} className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <span
                      className={
                        n.read ? "mt-1.5 size-1.5 rounded-full bg-border" : "mt-1.5 size-1.5 rounded-full bg-primary"
                      }
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground">{n.description}</p>
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{formatRelative(n.at)}</p>
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
