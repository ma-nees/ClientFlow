import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

export function StatCard({
  label,
  value,
  trend,
  icon: Icon,
}: {
  label: string;
  value: number;
  trend?: number;
  icon: LucideIcon;
}) {
  const up = (trend ?? 0) >= 0;
  const TrendIcon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="panel p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-eyebrow">{label}</p>
        <span className="flex size-7 items-center justify-center rounded-md border bg-muted text-muted-foreground">
          <Icon className="size-3.5" aria-hidden />
        </span>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tabular-nums">{formatNumber(value)}</p>
      {trend !== undefined ? (
        <p className={cn("mt-2 flex items-center gap-1 text-xs", up ? "text-success" : "text-destructive")}>
          <TrendIcon className="size-3.5" aria-hidden />
          <span>
            {up ? "+" : ""}
            {trend}% vs last 30 days
          </span>
        </p>
      ) : null}
    </div>
  );
}
