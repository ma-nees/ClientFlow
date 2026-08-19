import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Search, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { queryKeys } from "@/services/api";
import { listCampaigns } from "@/services/campaigns";
import { listEmails } from "@/services/emails";
import { listLeads } from "@/services/leads";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: leads } = useQuery({ queryKey: queryKeys.leads, queryFn: listLeads, enabled: open });
  const { data: campaigns } = useQuery({ queryKey: queryKeys.campaigns, queryFn: listCampaigns, enabled: open });
  const { data: emails } = useQuery({ queryKey: queryKeys.emails, queryFn: listEmails, enabled: open });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full items-center gap-2 rounded-md border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-input md:w-72"
        aria-label="Search leads, campaigns and emails"
      >
        <Search className="size-4" aria-hidden />
        <span className="truncate">Search businesses, contacts, emails…</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] md:inline">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search leads, campaigns or emails…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Leads">
            {(leads ?? []).slice(0, 6).map((lead) => (
              <CommandItem
                key={lead.id}
                value={`${lead.businessName} ${lead.contactName} ${lead.email}`}
                onSelect={() => go(() => navigate({ to: "/leads/$id", params: { id: lead.id } }))}
              >
                <Users className="size-4" aria-hidden />
                <span>{lead.businessName}</span>
                <span className="ml-auto text-xs text-muted-foreground">{lead.city}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Campaigns">
            {(campaigns ?? []).map((campaign) => (
              <CommandItem
                key={campaign.id}
                value={campaign.name}
                onSelect={() => go(() => navigate({ to: "/campaigns/$id", params: { id: campaign.id } }))}
              >
                <Target className="size-4" aria-hidden />
                <span>{campaign.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Emails">
            {(emails ?? []).slice(0, 5).map((email) => (
              <CommandItem
                key={email.id}
                value={`${email.subject} ${email.recipientEmail}`}
                onSelect={() => go(() => navigate({ to: "/email-queue" }))}
              >
                <Inbox className="size-4" aria-hidden />
                <span className="truncate">{email.subject}</span>
                <span className="ml-auto text-xs text-muted-foreground">{email.businessName}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
