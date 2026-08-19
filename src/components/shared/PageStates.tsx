import type { LucideIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 flex size-11 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this view. Try again in a moment.",
  onRetry,
  onBack,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onBack?: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 flex size-11 items-center justify-center rounded-lg border border-destructive/25 bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" aria-hidden />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 flex gap-2">
        {onRetry ? <Button onClick={onRetry}>Retry</Button> : null}
        {onBack ? (
          <Button variant="outline" onClick={onBack}>
            Go back
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="divide-y" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-4 py-3.5">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" style={{ maxWidth: colIndex === 0 ? 220 : 120 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardsSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={className ?? "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"} aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="panel p-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-4 h-7 w-16" />
          <Skeleton className="mt-3 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return <Skeleton className="w-full rounded-lg" style={{ height }} aria-busy="true" />;
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-40" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

export function DemoDataNotice({ className }: { className?: string }) {
  return (
    <p className={className ?? "text-xs text-muted-foreground"}>
      Demo data — no backend, Gmail account, or AI provider is connected yet.
    </p>
  );
}
