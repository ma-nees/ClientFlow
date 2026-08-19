import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const palette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-3)",
  "var(--color-muted-foreground)",
];

export function OpportunityBreakdown({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-[160px] w-[160px] mx-auto shrink-0 sm:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={46} outerRadius={72} paddingAngle={2}>
              {data.map((item, index) => (
                <Cell key={item.label} fill={palette[index % palette.length]} stroke="var(--color-card)" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--color-popover-foreground)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2">
        {data.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2.5 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: palette[index % palette.length] }}
              aria-hidden
            />
            <span className="flex-1 truncate">{item.label}</span>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {item.value} · {total ? Math.round((item.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
