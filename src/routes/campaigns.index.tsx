import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pause, Play, Target } from "lucide-react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { CreateCampaignDialog } from "@/components/campaigns/CreateCampaignDialog";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/shared/PageStates";
import { CampaignStatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatPercent } from "@/lib/format";
import { queryKeys } from "@/services/api";
import { listCampaigns, setCampaignStatus } from "@/services/campaigns";
import type { Campaign } from "@/types";

export const Route = createFileRoute("/campaigns/")({
  head: () => ({
    meta: [
      { title: "Campaigns — ClientFlow AI" },
      { name: "description", content: "Group leads into outreach campaigns and control sending pace and approvals." },
      { property: "og:title", content: "Campaigns — ClientFlow AI" },
      { property: "og:description", content: "Monitor generated, approved and sent emails per campaign." },
    ],
  }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const campaigns = useQuery({ queryKey: queryKeys.campaigns, queryFn: listCampaigns });
  const queryClient = useQueryClient();

  const toggle = useMutation({
    mutationFn: (campaign: Campaign) =>
      setCampaignStatus(campaign.id, campaign.status === "RUNNING" ? "PAUSED" : "RUNNING"),
    onSuccess: (_data, campaign) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns });
      toast.success(campaign.status === "RUNNING" ? "Campaign paused" : "Campaign resumed");
    },
  });

  return (
    <AppLayout title="Campaigns" crumbs={[{ label: "Workspace", to: "/dashboard" }, { label: "Campaigns" }]}>
      <PageHeader
        title="Campaigns"
        subtitle="Batch outreach by opportunity type with controlled daily volume."
        actions={<CreateCampaignDialog />}
      />

      {campaigns.isError ? (
        <ErrorState onRetry={() => campaigns.refetch()} />
      ) : campaigns.isLoading ? (
        <CardsSkeleton count={4} />
      ) : (campaigns.data ?? []).length === 0 ? (
        <EmptyState
          icon={Target}
          title="No campaigns yet"
          description="Create your first campaign to start generating personalised pitches in batches."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(campaigns.data ?? []).map((campaign) => {
            const progress = campaign.leadCount ? Math.round((campaign.sent / campaign.leadCount) * 100) : 0;
            return (
              <article key={campaign.id} className="panel flex flex-col p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      to="/campaigns/$id"
                      params={{ id: campaign.id }}
                      className="truncate font-medium hover:text-primary"
                    >
                      {campaign.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {campaign.target.replaceAll("_", " ").toLowerCase()} · {campaign.leadCount} leads
                    </p>
                  </div>
                  <CampaignStatusBadge status={campaign.status} />
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Sent</span>
                    <span className="font-mono tabular-nums">
                      {campaign.sent}/{campaign.leadCount}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    ["Generated", campaign.generated],
                    ["Replies", campaign.replies],
                    ["Interested", campaign.interested],
                  ].map(([label, value]) => (
                    <div key={label as string} className="rounded-md border bg-muted/40 py-2">
                      <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">{label}</dt>
                      <dd className="font-mono text-sm tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-4 text-xs text-muted-foreground">
                  Reply rate {formatPercent(campaign.sent ? campaign.replies / campaign.sent : 0)} · created{" "}
                  {formatDate(campaign.createdAt)}
                </p>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggle.mutate(campaign)}>
                    {campaign.status === "RUNNING" ? (
                      <>
                        <Pause className="size-3.5" aria-hidden /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="size-3.5" aria-hidden /> Resume
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/campaigns/$id" params={{ id: campaign.id }}>
                      View details
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
