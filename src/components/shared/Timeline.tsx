import {
  CheckCircle2,
  Clock,
  FileEdit,
  MailCheck,
  MailPlus,
  Repeat,
  Send,
  Sparkles,
  Upload,
  type LucideIcon,
} from "lucide-react";

import { formatRelative } from "@/lib/format";
import type { ActivityEvent, ActivityEventType } from "@/types";

const eventIcon: Record<ActivityEventType, LucideIcon> = {
  LEAD_IMPORTED: Upload,
  WEBSITE_ANALYZED: CheckCircle2,
  PITCH_GENERATED: Sparkles,
  EMAIL_EDITED: FileEdit,
  EMAIL_APPROVED: MailCheck,
  EMAIL_SCHEDULED: Clock,
  EMAIL_SENT: Send,
  EMAIL_DELIVERED: MailPlus,
  REPLY_RECEIVED: MailCheck,
  FOLLOW_UP_SCHEDULED: Repeat,
  FOLLOW_UP_SENT: Repeat,
};

export function Timeline({ events }: { events: ActivityEvent[] }) {
  return (
    <ol className="relative space-y-5 pl-6">
      <span className="absolute left-[11px] top-1.5 bottom-1.5 w-px bg-border" aria-hidden />
      {events.map((event) => {
        const Icon = eventIcon[event.type];
        return (
          <li key={event.id} className="relative">
            <span className="absolute -left-6 flex size-6 items-center justify-center rounded-full border bg-card text-muted-foreground">
              <Icon className="size-3" aria-hidden />
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="text-sm font-medium">{event.title}</p>
              <time className="font-mono text-xs text-muted-foreground">{formatRelative(event.at)}</time>
            </div>
            {event.description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
