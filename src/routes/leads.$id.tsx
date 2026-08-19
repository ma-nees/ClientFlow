import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Mail, Phone, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { DetailSkeleton, EmptyState, ErrorState } from "@/components/shared/PageStates";
import {
  EmailStatusBadge,
  OpportunityBadge,
  ScorePill,
  WebsiteStatusBadge,
} from "@/components/shared/StatusBadge";
import { Timeline } from "@/components/shared/Timeline";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format";
import { queryKeys } from "@/services/api";
import { getActivity } from "@/services/analytics";
import { analyzeLead, generatePitch, getLead } from "@/services/leads";

export const Route = createFileRoute("/leads/$id")({
  head: () => ({
    meta: [
      { title: "Lead detail — ClientFlow AI" },
      { name: "description", content: "Website analysis, AI recommendation and generated pitch for this lead." },
      { property: "og:title", content: "Lead detail — ClientFlow AI" },
      { property: "og:description", content: "Full opportunity breakdown for a single business lead." },
    ],
  }),
  component: LeadDetailPage,
});

function LeadDetailPage() {
  const { id } = useParams({ from: "/leads/$id" });
  const lead = useQuery({ queryKey: queryKeys.lead(id), queryFn: () => getLead(id) });
  const activity = useQuery({ queryKey: queryKeys.activity, queryFn: getActivity });

  const analyze = useMutation({
    mutationFn: () => analyzeLead(id),
    onSuccess: () => toast.success("Re-analysing website", { description: "Results update when the scan finishes." }),
  });
  const pitch = useMutation({
    mutationFn: () => generatePitch(id),
    onSuccess: () => toast.success("Generating pitch", { description: "A new AI draft is being written." }),
  });

  if (lead.isLoading) {
    return (
      <AppLayout title="Lead">
        <DetailSkeleton />
      </AppLayout>
    );
  }

  if (lead.isError) {
    return (
      <AppLayout title="Lead">
        <ErrorState onRetry={() => lead.refetch()} />
      </AppLayout>
    );
  }

  if (!lead.data) {
    return (
      <AppLayout title="Lead">
        <EmptyState
          icon={Sparkles}
          title="Lead not found"
          description="This lead may have been deleted."
          action={
            <Button asChild variant="outline">
              <Link to="/leads">
                <ArrowLeft className="size-4" aria-hidden /> Back to leads
              </Link>
            </Button>
          }
        />
      </AppLayout>
    );
  }

  const data = lead.data;

  return (
    <AppLayout
      title={data.businessName}
      crumbs={[{ label: "Leads", to: "/leads" }, { label: data.businessName }]}
    >
      <PageHeader
        title={data.businessName}
        subtitle={`${data.industry} · ${data.city}, ${data.country}`}
        actions={
          <>
            <Button variant="outline" onClick={() => analyze.mutate()} disabled={analyze.isPending}>
              <RefreshCw className="size-4" aria-hidden /> Re-analyse website
            </Button>
            <Button onClick={() => pitch.mutate()} disabled={pitch.isPending}>
              <Sparkles className="size-4" aria-hidden /> Generate pitch
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Contact</h3>
          <dl className="mt-3 space-y-2.5 text-sm">
            <div>
              <dt className="text-eyebrow">Contact person</dt>
              <dd>{data.contactName}</dd>
            </div>
            <div>
              <dt className="text-eyebrow">Email</dt>
              <dd className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" aria-hidden />
                <a href={`mailto:${data.email}`} className="hover:text-primary">
                  {data.email}
                </a>
              </dd>
            </div>
            {data.phone ? (
              <div>
                <dt className="text-eyebrow">Phone</dt>
                <dd className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" aria-hidden />
                  {data.phone}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-eyebrow">Website</dt>
              <dd>
                {data.website ? (
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 hover:text-primary"
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                    <span className="truncate">{data.website}</span>
                  </a>
                ) : (
                  <span className="text-muted-foreground">No website found</span>
                )}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <WebsiteStatusBadge status={data.websiteStatus} />
            <OpportunityBadge opportunity={data.opportunity} />
            <EmailStatusBadge status={data.emailStatus} />
          </div>
        </section>

        <section className="panel p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold">Website analysis</h3>
            <ScorePill score={data.leadScore} />
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Website quality</span>
              <span className="font-mono tabular-nums">{data.websiteScore}/100</span>
            </div>
            <Progress value={data.websiteScore} />
          </div>
          {data.analysis ? (
            <>
              <p className="mt-4 text-sm text-muted-foreground">{data.analysis.summary}</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {data.analysis.issues.map((issue) => (
                  <li key={issue} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" aria-hidden />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
              {data.analysis.analyzedAt ? (
                <p className="mt-4 text-xs text-muted-foreground">
                  Last analysed {formatDate(data.analysis.analyzedAt)}
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No analysis yet — run a scan to detect issues.</p>
          )}
        </section>

        <section className="panel p-4 sm:p-5">
          <h3 className="text-sm font-semibold">AI recommendation</h3>
          {data.aiRecommendation ? (
            <>
              <p className="mt-3 text-sm font-medium">{data.aiRecommendation.service}</p>
              <p className="text-xs text-muted-foreground">
                Confidence {Math.round(data.aiRecommendation.confidence * 100)}%
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {data.aiRecommendation.reasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              The recommendation is produced by the backend once analysis completes.
            </p>
          )}
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="panel p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Generated pitch</h3>
            <Button variant="ghost" size="sm" onClick={() => pitch.mutate()}>
              <RefreshCw className="size-3.5" aria-hidden /> Regenerate
            </Button>
          </div>
          {data.aiPitch ? (
            <div className="mt-3 rounded-md border bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {data.aiPitch}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No pitch generated yet. Generate one to add this lead to the email queue.
            </p>
          )}
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to="/email-queue">Open email queue</Link>
            </Button>
          </div>
        </section>

        <section className="panel p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Activity</h3>
          <div className="mt-3">{activity.data ? <Timeline events={activity.data.slice(0, 6)} /> : null}</div>
        </section>
      </div>

      {data.notes && data.notes.length > 0 ? (
        <section className="panel mt-4 p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Notes</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {data.notes.map((note) => (
              <li key={note.id}>
                <p>{note.body}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </AppLayout>
  );
}
