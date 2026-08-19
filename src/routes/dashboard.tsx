import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Mail, MessageSquare, Sparkles, Target, Users } from "lucide-react";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { OpportunityBreakdown } from "@/components/dashboard/OpportunityBreakdown";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { CardsSkeleton, ChartSkeleton, DemoDataNotice, ErrorState } from "@/components/shared/PageStates";
import { ScorePill } from "@/components/shared/StatusBadge";
import { Timeline } from "@/components/shared/Timeline";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { greeting } from "@/lib/format";
import { queryKeys } from "@/services/api";
import { getActivity, getAnalytics, getDashboardSummary } from "@/services/analytics";
import { listLeads } from "@/services/leads";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ClientFlow AI" },
      { name: "description", content: "Outreach performance, hot leads and pipeline activity at a glance." },
      { property: "og:title", content: "Dashboard — ClientFlow AI" },
      { property: "og:description", content: "Track leads analysed, emails sent and replies received." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();

  const summary = useQuery({ queryKey: queryKeys.dashboard, queryFn: getDashboardSummary });
  const analytics = useQuery({ queryKey: queryKeys.analytics("30d"), queryFn: () => getAnalytics("30d") });
  const activity = useQuery({ queryKey: queryKeys.activity, queryFn: getActivity });
  const leads = useQuery({ queryKey: queryKeys.leads, queryFn: listLeads });

  const hotLeads = (leads.data ?? [])
    .slice()
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, 5);

  return (
    <AppLayout title="Dashboard">
      <PageHeader
        title={`${greeting()}, ${user?.name.split(" ")[0] ?? "there"}`}
        subtitle="Here is how your outreach is performing over the last 30 days."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/leads">
                <Users className="size-4" aria-hidden /> View leads
              </Link>
            </Button>
            <Button asChild>
              <Link to="/email-queue">
                <Inbox className="size-4" aria-hidden /> Review email queue
              </Link>
            </Button>
          </>
        }
      />

      <DemoDataNotice className="mb-4" />

      {summary.isError ? (
        <ErrorState onRetry={() => summary.refetch()} />
      ) : summary.isLoading || !summary.data ? (
        <CardsSkeleton count={5} className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5" />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Leads analysed" value={summary.data.stats.analyzed} trend={12} icon={Users} />
          <StatCard label="Total leads" value={summary.data.stats.totalLeads} trend={9} icon={Sparkles} />
          <StatCard label="Emails sent" value={summary.data.stats.emailsSent} trend={6} icon={Mail} />
          <StatCard label="Replies" value={summary.data.stats.replies} trend={4} icon={MessageSquare} />
          <StatCard label="Interested" value={summary.data.stats.interested} trend={-2} icon={Target} />
        </div>
      )}

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <section className="panel p-3 sm:p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold">Outreach performance</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Emails sent, replies and interested responses.</p>
          <div className="mt-4">
            {analytics.isLoading || !analytics.data ? (
              <ChartSkeleton />
            ) : (
              <PerformanceChart data={analytics.data.series} />
            )}
          </div>
        </section>

        <section className="panel p-3 sm:p-4">
          <h3 className="text-sm font-semibold">Opportunity mix</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Where your pipeline value sits today.</p>
          <div className="mt-4">
            {analytics.isLoading || !analytics.data ? (
              <ChartSkeleton height={180} />
            ) : (
              <OpportunityBreakdown
                data={analytics.data.byOpportunity.map((item) => ({ label: item.opportunity, value: item.sent }))}
              />
            )}
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <section className="panel p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Hot leads</h3>
            <Link to="/leads" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y">
            {hotLeads.map((lead) => (
              <li key={lead.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <Link
                    to="/leads/$id"
                    params={{ id: lead.id }}
                    className="block truncate text-sm font-medium hover:text-primary"
                  >
                    {lead.businessName}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {lead.city}, {lead.country} · {lead.industry}
                  </p>
                </div>
                <ScorePill score={lead.leadScore} />
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-3 sm:p-4">
          <h3 className="text-sm font-semibold">Recent activity</h3>
          <div className="mt-3">
            {activity.data ? <Timeline events={activity.data.slice(0, 8)} /> : <CardsSkeleton count={3} />}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
