import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { AnalyticsSeriesPoint } from "@/types";

export function PerformanceChart({ data }: { data: AnalyticsSeriesPoint[] }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="sentFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => value.slice(5)}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--color-popover-foreground)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="sent"
            name="Emails sent"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            fill="url(#sentFill)"
          />
          <Area
            type="monotone"
            dataKey="replies"
            name="Replies"
            stroke="var(--color-chart-3)"
            strokeWidth={2}
            fillOpacity={0}
          />
          <Area
            type="monotone"
            dataKey="interested"
            name="Interested"
            stroke="var(--color-chart-4)"
            strokeWidth={2}
            fillOpacity={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
