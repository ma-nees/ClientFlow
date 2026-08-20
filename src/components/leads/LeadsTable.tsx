import { Link } from "@tanstack/react-router";
import { ExternalLink, MoreHorizontal, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EmailStatusBadge,
  OpportunityBadge,
  ScorePill,
  WebsiteStatusBadge,
} from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/format";
import type { Lead } from "@/types";

interface LeadsTableProps {
  leads: Lead[];
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onGeneratePitch: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadsTable(props: LeadsTableProps) {
  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <caption className="sr-only">Leads with website opportunity analysis</caption>
          <thead>
            <tr className="border-b bg-muted/40 text-left">
              <th scope="col" className="w-10 px-2 py-2.5">
                <Checkbox
                  checked={props.leads.length > 0 && props.selected.length === props.leads.length}
                  onCheckedChange={props.onToggleAll}
                  aria-label="Select all leads"
                />
              </th>
              {["Business", "Contact", "Location", "Website", "Opportunity", "Score", "Email status", "Added", ""].map(
                (heading) => (
                  <th key={heading} scope="col" className="px-2 py-2.5 text-eyebrow font-semibold">
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {props.leads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-muted/40">
                <td className="px-2 py-3">
                  <Checkbox
                    checked={props.selected.includes(lead.id)}
                    onCheckedChange={() => props.onToggle(lead.id)}
                    aria-label={`Select ${lead.businessName}`}
                  />
                </td>
                <td className="px-2 py-3">
                  <Link to="/leads/$id" params={{ id: lead.id }} className="font-medium hover:text-primary">
                    {lead.businessName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{lead.industry}</p>
                </td>
                <td className="px-2 py-3">
                  <p>{lead.contactName}</p>
                  <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-muted-foreground">
                  {lead.city}, {lead.country}
                </td>
                <td className="px-2 py-3">
                  {lead.website ? (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ExternalLink className="size-3" aria-hidden />
                      <span className="max-w-[150px] truncate">{lead.website}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                  <div className="mt-1">
                    <WebsiteStatusBadge status={lead.websiteStatus} />
                  </div>
                </td>
                <td className="px-2 py-3">
                  <OpportunityBadge opportunity={lead.opportunity} />
                </td>
                <td className="px-2 py-3">
                  <ScorePill score={lead.leadScore} />
                </td>
                <td className="px-2 py-3">
                  <EmailStatusBadge status={lead.emailStatus} />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-muted-foreground">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-2 py-3 text-right">
                  <RowActions lead={lead} onGeneratePitch={props.onGeneratePitch} onDelete={props.onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y md:hidden">
        {props.leads.map((lead) => (
          <li key={lead.id} className="px-4 py-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={props.selected.includes(lead.id)}
                onCheckedChange={() => props.onToggle(lead.id)}
                aria-label={`Select ${lead.businessName}`}
                className="mt-1"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link to="/leads/$id" params={{ id: lead.id }} className="font-medium hover:text-primary">
                    {lead.businessName}
                  </Link>
                  <ScorePill score={lead.leadScore} />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {lead.contactName} · {lead.city}, {lead.country}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <WebsiteStatusBadge status={lead.websiteStatus} />
                  <OpportunityBadge opportunity={lead.opportunity} />
                  <EmailStatusBadge status={lead.emailStatus} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function RowActions({
  lead,
  onGeneratePitch,
  onDelete,
}: {
  lead: Lead;
  onGeneratePitch: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Actions for ${lead.businessName}`}>
          <MoreHorizontal className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onGeneratePitch(lead)}>
          <Sparkles className="size-4" aria-hidden /> Generate pitch
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(lead)}>
          <Trash2 className="size-4" aria-hidden /> Delete lead
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
