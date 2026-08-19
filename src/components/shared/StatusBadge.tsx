import { cn } from "@/lib/utils";
import type { CampaignStatus, EmailStatus, Opportunity, WebsiteStatus } from "@/types";

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";

const toneClass: Record<Tone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  info: "border-info/25 bg-info/10 text-info",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/35 bg-warning/15 text-warning-foreground dark:text-warning",
  danger: "border-destructive/25 bg-destructive/10 text-destructive",
  accent: "border-primary/25 bg-primary/10 text-primary",
};

function Pill({ tone, label, dot }: { tone: Tone; label: string; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        toneClass[tone],
      )}
    >
      {dot ? <span className="size-1.5 rounded-full bg-current" aria-hidden /> : null}
      {label}
    </span>
  );
}

const websiteStatusMap: Record<WebsiteStatus, { label: string; tone: Tone }> = {
  NO_WEBSITE: { label: "No website", tone: "danger" },
  OUTDATED: { label: "Outdated", tone: "warning" },
  POOR_MOBILE: { label: "Poor mobile", tone: "warning" },
  SLOW: { label: "Slow", tone: "warning" },
  GOOD: { label: "Good", tone: "success" },
  UNKNOWN: { label: "Unknown", tone: "neutral" },
};

export function WebsiteStatusBadge({ status }: { status: WebsiteStatus }) {
  const config = websiteStatusMap[status];
  return <Pill tone={config.tone} label={config.label} dot />;
}

const opportunityMap: Record<Opportunity, { label: string; tone: Tone }> = {
  NEW_WEBSITE: { label: "New website", tone: "accent" },
  REDESIGN: { label: "Redesign", tone: "info" },
  MOBILE_OPTIMIZATION: { label: "Mobile optimization", tone: "info" },
  PERFORMANCE: { label: "Performance", tone: "info" },
  SKIP: { label: "Skip", tone: "neutral" },
};

export function OpportunityBadge({ opportunity }: { opportunity: Opportunity }) {
  const config = opportunityMap[opportunity];
  return <Pill tone={config.tone} label={config.label} />;
}

const emailStatusMap: Record<EmailStatus, { label: string; tone: Tone }> = {
  DRAFT: { label: "Draft", tone: "neutral" },
  AI_GENERATED: { label: "AI generated", tone: "accent" },
  NEEDS_REVIEW: { label: "Needs review", tone: "warning" },
  APPROVED: { label: "Approved", tone: "info" },
  SCHEDULED: { label: "Scheduled", tone: "info" },
  SENDING: { label: "Sending", tone: "info" },
  SENT: { label: "Sent", tone: "success" },
  DELIVERED: { label: "Delivered", tone: "success" },
  REPLIED: { label: "Replied", tone: "success" },
  BOUNCED: { label: "Bounced", tone: "danger" },
  FAILED: { label: "Failed", tone: "danger" },
  REJECTED: { label: "Rejected", tone: "danger" },
  NOT_CONTACTED: { label: "Not contacted", tone: "neutral" },
};

export function EmailStatusBadge({ status }: { status: EmailStatus }) {
  const config = emailStatusMap[status];
  return <Pill tone={config.tone} label={config.label} dot />;
}

const campaignStatusMap: Record<CampaignStatus, { label: string; tone: Tone }> = {
  DRAFT: { label: "Draft", tone: "neutral" },
  REVIEW: { label: "Review", tone: "warning" },
  SCHEDULED: { label: "Scheduled", tone: "info" },
  RUNNING: { label: "Running", tone: "success" },
  PAUSED: { label: "Paused", tone: "warning" },
  COMPLETED: { label: "Completed", tone: "neutral" },
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const config = campaignStatusMap[status];
  return <Pill tone={config.tone} label={config.label} dot />;
}

export function ScorePill({ score }: { score: number }) {
  const tone: Tone = score >= 85 ? "success" : score >= 60 ? "warning" : "neutral";
  return (
    <span
      className={cn(
        "inline-flex min-w-9 items-center justify-center rounded-md border px-1.5 py-0.5 font-mono text-xs font-semibold",
        toneClass[tone],
      )}
    >
      {score}
    </span>
  );
}
