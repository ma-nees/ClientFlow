import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pause, Play, Target } from "lucide-react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { DetailSkeleton, EmptyState, ErrorState } from "@/components/shared/PageStates";
import { CampaignStatusBadge, EmailStatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatPercent } from "@/lib/format";
import { queryKeys } from "@/services/api";
import { getCampaign, setCampaignStatus } from "@/services/campaigns";
import { listEmails } from "@/services/emails";

export const Route = createFileRoute("/campaigns/$id")({
  head: () => ({
    meta: [
      { title: "Campaign detail — ClientFlow AI" },
      { name: "description", content: "Campaign performance, sending settings and the emails it generated." },
      { property: "og:title", content: "Campaign detail — ClientFlow AI" },
      { property: "og:description", content: "Track sends, replies and interested leads for one campaign." },
    ],
  }),
  component: CampaignDetailPage,
});

function CampaignDetailPage() {
  const { id } = useParams({ from: "/campaigns/$id" });
  const campaign = useQuery({ queryKey: queryKeys.campaign(id), queryFn: () => getCampaign(id) });
  const emails = useQuery({ queryKey: queryKeys.emails, queryFn: listEmails });
  const queryClient = useQueryClient();

  const toggle = useMutation({
    mutationFn: (next: "RUNNING" | "PAUSED") => setCampaignStatus(id, next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaign(id) });
      toast.success("Campaign updated");
    },
  });

  if (campaign.isLoading) {
    return (
      <AppLayout title="Campaign">
        <DetailSkeleton />
      </AppLayout>
    );
  }

  if (campaign.isError) {
    return (
      <AppLayout title="Campaign">
        <ErrorState onRetry={() => campaign.refetch()} />
      </AppLayout>
    );
  }

  if (!campaign.data) {
    return (
      <AppLayout title="Campaign">
        <EmptyState
          icon={Target}
          title="Campaign not found"
          description="It may have been deleted."
          action={
            <Button asChild variant="outline">
              <Link to="/campaigns">
                <ArrowLeft className="size-4" aria-hidden /> Back to campaigns
              </Link>
            </Button>
          }
        />
      </AppLayout>
    );
  }

  const data = campaign.data;
  const running = data.status === "RUNNING";
  const campaignEmails = (emails.data ?? []).filter((email) => email.campaignId === id);
  const progress = data.leadCount ? Math.round((data.sent / data.leadCount) * 100) : 0;

  return (
    <AppLayout title={data.name} crumbs={[{ label: "Campaigns", to: "/campaigns" }, { label: data.name }]}>
      <PageHeader
        title={data.name}
        subtitle={`${data.target.replaceAll("_", " ").toLowerCase()} · created ${formatDate(data.createdAt)}`}
        actions={
          <Button variant="outline" onClick={() => toggle.mutate(running ? "PAUSED" : "RUNNING")}>
            {running ? (
              <>
                <Pause className="size-4" aria-hidden /> Pause campaign
              </>
            ) : (
              <>
                <Play className="size-4" aria-hidden /> Resume campaign
              </>
            )}
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Progress</h3>
            <CampaignStatusBadge status={data.status} />
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Emails sent</span>
              <span className="font-mono tabular-nums">
                {data.sent}/{data.leadCount}
              </span>
            </div>
            <Progress value={progress} />
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Generated", data.generated],
              ["Approved", data.approved],
              ["Opened", data.opened],
              ["Replies", data.replies],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-md border bg-muted/40 p-3">
                <dt className="text-eyebrow">{label}</dt>
                <dd className="mt-1 font-mono text-lg tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Reply rate {formatPercent(data.sent ? data.replies / data.sent : 0)} · interested {data.interested}
          </p>
        </section>

        <section className="panel p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Sending settings</h3>
          <dl className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Daily limit</dt>
              <dd className="font-mono tabular-nums">{data.dailyLimit}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Leads in campaign</dt>
              <dd className="font-mono tabular-nums">{data.leadCount}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Manual approval</dt>
              <dd>Required</dd>
            </div>
          </dl>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/settings/sending">Adjust sending rules</Link>
          </Button>
        </section>
      </div>

      <section className="panel mt-4 overflow-hidden">
        <div className="border-b p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Emails in this campaign</h3>
        </div>
        {campaignEmails.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Target}
              title="No emails generated yet"
              description="Drafts appear here as the AI processes leads in this campaign."
            />
          </div>
        ) : (
          <ul className="divide-y">
            {campaignEmails.map((email) => (
              <li key={email.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{email.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {email.businessName} · {email.recipientEmail}
                  </p>
                </div>
                <EmailStatusBadge status={email.status} />
                <Button asChild variant="ghost" size="sm">
                  <Link to="/email-queue">Review</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppLayout>
  );
}
