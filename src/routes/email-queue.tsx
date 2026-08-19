import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { useMemo, useState } from "react";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { EmailReviewPanel } from "@/components/email/EmailReviewPanel";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/shared/PageStates";
import { EmailStatusBadge } from "@/components/shared/StatusBadge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/services/api";
import { listEmails } from "@/services/emails";
import type { EmailStatus } from "@/types";

export const Route = createFileRoute("/email-queue")({
  head: () => ({
    meta: [
      { title: "Email queue — ClientFlow AI" },
      { name: "description", content: "Review, edit and approve AI-generated outreach emails before they send." },
      { property: "og:title", content: "Email queue — ClientFlow AI" },
      { property: "og:description", content: "Human approval step for every AI-written pitch." },
    ],
  }),
  component: EmailQueuePage,
});

const tabs: { value: string; label: string; statuses: EmailStatus[] }[] = [
  { value: "review", label: "Needs review", statuses: ["AI_GENERATED", "NEEDS_REVIEW", "DRAFT"] },
  { value: "approved", label: "Approved", statuses: ["APPROVED", "SCHEDULED"] },
  { value: "sent", label: "Sent", statuses: ["SENDING", "SENT", "DELIVERED"] },
  { value: "replied", label: "Replied", statuses: ["REPLIED"] },
  { value: "failed", label: "Failed", statuses: ["BOUNCED", "FAILED", "REJECTED"] },
];

function EmailQueuePage() {
  const [tab, setTab] = useState("review");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const emails = useQuery({ queryKey: queryKeys.emails, queryFn: listEmails });

  const filtered = useMemo(() => {
    const statuses = tabs.find((item) => item.value === tab)?.statuses ?? [];
    const needle = query.trim().toLowerCase();
    return (emails.data ?? []).filter((email) => {
      const matchesTab = statuses.includes(email.status);
      const matchesQuery =
        needle === "" ||
        [email.subject, email.businessName, email.recipientEmail].join(" ").toLowerCase().includes(needle);
      return matchesTab && matchesQuery;
    });
  }, [emails.data, tab, query]);

  const active = filtered.find((email) => email.id === selectedId) ?? filtered[0];

  return (
    <AppLayout title="Email queue" crumbs={[{ label: "Workspace", to: "/dashboard" }, { label: "Email queue" }]}>
      <PageHeader
        title="Email queue"
        subtitle="Nothing sends without your approval — edit any draft before it goes out."
      />

      <Tabs value={tab} onValueChange={setTab} className="mb-4 w-full sm:w-auto">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:flex sm:w-auto sm:flex-wrap lg:grid-cols-5">
          {tabs.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="whitespace-nowrap">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {emails.isError ? (
        <ErrorState onRetry={() => emails.refetch()} />
      ) : emails.isLoading ? (
        <CardsSkeleton count={4} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
          <section className="panel flex max-h-[40vh] lg:max-h-[70vh] flex-col overflow-hidden">
            <div className="border-b p-3">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search subject or recipient…"
                aria-label="Search emails"
              />
            </div>
            {filtered.length === 0 ? (
              <div className="p-6">
                <EmptyState icon={Inbox} title="Queue is clear" description="No emails in this state right now." />
              </div>
            ) : (
              <ul className="divide-y overflow-y-auto">
                {filtered.map((email) => (
                  <li key={email.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(email.id)}
                      aria-current={active?.id === email.id}
                      className={cn(
                        "w-full px-4 py-3 text-left transition-colors hover:bg-muted/60",
                        active?.id === email.id && "bg-muted",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{email.businessName}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {formatRelative(email.createdAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{email.subject}</p>
                      <div className="mt-1.5">
                        <EmailStatusBadge status={email.status} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel min-h-[70vh] overflow-hidden">
            {active ? (
              <EmailReviewPanel email={active} />
            ) : (
              <div className="p-6">
                <EmptyState
                  icon={Inbox}
                  title="Select an email"
                  description="Choose a draft on the left to review and approve it."
                />
              </div>
            )}
          </section>
        </div>
      )}
    </AppLayout>
  );
}
