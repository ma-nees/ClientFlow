import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { CardsSkeleton, ChartSkeleton, ErrorState } from "@/components/shared/PageStates";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, formatPercent } from "@/lib/format";
import { queryKeys } from "@/services/api";
import { getAnalytics } from "@/services/analytics";
import type { AnalyticsData } from "@/types";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — ClientFlow AI" },
      { name: "description", content: "Delivery, reply and conversion rates across countries, campaigns and offers." },
      { property: "og:title", content: "Analytics — ClientFlow AI" },
      { property: "og:description", content: "Understand which segments respond to your outreach." },
    ],
  }),
  component: AnalyticsPage,
});

const ranges: AnalyticsData["range"][] = ["7d", "30d", "90d"];

function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsData["range"]>("30d");
  const analytics = useQuery({ queryKey: queryKeys.analytics(range), queryFn: () => getAnalytics(range) });

  return (
    <AppLayout title="Analytics" crumbs={[{ label: "Workspace", to: "/dashboard" }, { label: "Analytics" }]}>
      <PageHeader
        title="Analytics"
        subtitle="Where replies come from, and which opportunities convert best."
        actions={
          <Tabs value={range} onValueChange={(value) => setRange(value as AnalyticsData["range"])} className="w-full sm:w-auto mt-2 sm:mt-0">
            <TabsList className="grid w-full grid-cols-3 sm:inline-flex sm:w-auto">
              {ranges.map((value) => (
                <TabsTrigger key={value} value={value}>
                  Last {value.replace("d", " days")}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />

      {analytics.isError ? (
        <ErrorState onRetry={() => analytics.refetch()} />
      ) : analytics.isLoading || !analytics.data ? (
        <>
          <CardsSkeleton count={5} />
          <div className="mt-4">
            <ChartSkeleton />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Metric label="Emails sent" value={formatNumber(analytics.data.emailsSent)} />
            <Metric label="Delivery rate" value={formatPercent(analytics.data.deliveryRate)} />
            <Metric label="Reply rate" value={formatPercent(analytics.data.replyRate)} />
            <Metric label="Positive replies" value={formatPercent(analytics.data.positiveReplyRate)} />
            <div className="col-span-2 sm:col-span-1">
              <Metric label="Meetings booked" value={formatPercent(analytics.data.meetingRate)} />
            </div>
          </div>

          <section className="panel mt-4 p-4 sm:p-5">
            <h3 className="text-sm font-semibold">Trend</h3>
            <div className="mt-4">
              <PerformanceChart data={analytics.data.series} />
            </div>
          </section>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <BreakdownTable
              title="By country"
              columns={["Country", "Sent", "Reply rate"]}
              rows={analytics.data.byCountry.map((row) => [
                row.country,
                formatNumber(row.sent),
                formatPercent(row.replyRate),
              ])}
            />
            <BreakdownTable
              title="By opportunity type"
              columns={["Opportunity", "Sent", "Reply rate"]}
              rows={analytics.data.byOpportunity.map((row) => [
                row.opportunity.replaceAll("_", " ").toLowerCase(),
                formatNumber(row.sent),
                formatPercent(row.replyRate),
              ])}
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <BreakdownTable
              title="Campaign comparison"
              columns={["Campaign", "Sent", "Replies"]}
              rows={analytics.data.campaignComparison.map((row) => [
                row.name,
                formatNumber(row.sent),
                formatNumber(row.replies),
              ])}
            />
            <section className="panel p-4 sm:p-5">
              <h3 className="text-sm font-semibold">AI insights</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {analytics.data.insights.map((insight) => (
                  <li key={insight} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </AppLayout>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-4 sm:p-5">
      <p className="text-eyebrow">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function BreakdownTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b p-4 sm:p-5">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="border-b bg-muted/40 text-left">
              {columns.map((column) => (
                <th key={column} scope="col" className="text-eyebrow px-4 py-2.5 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={String(row[0])}>
                {row.map((cell, index) => (
                  <td
                    key={index}
                    className={index === 0 ? "px-4 py-2.5" : "px-4 py-2.5 font-mono text-xs tabular-nums"}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
