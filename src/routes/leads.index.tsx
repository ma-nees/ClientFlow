import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Sparkles, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { AddLeadDialog } from "@/components/leads/AddLeadDialog";
import { ImportLeadsDialog } from "@/components/leads/ImportLeadsDialog";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/shared/PageStates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { queryKeys } from "@/services/api";
import { deleteLead, generatePitch, listLeads } from "@/services/leads";
import type { Lead } from "@/types";

export const Route = createFileRoute("/leads/")({
  head: () => ({
    meta: [
      { title: "Leads — ClientFlow AI" },
      { name: "description", content: "Browse, filter and analyse every business lead in your outreach pipeline." },
      { property: "og:title", content: "Leads — ClientFlow AI" },
      { property: "og:description", content: "Website analysis, lead scores and email status for every prospect." },
    ],
  }),
  component: LeadsPage,
});

const websiteFilters = ["ALL", "NO_WEBSITE", "OUTDATED", "POOR_MOBILE", "SLOW", "GOOD"] as const;
const opportunityFilters = ["ALL", "NEW_WEBSITE", "REDESIGN", "MOBILE_OPTIMIZATION", "PERFORMANCE", "SKIP"] as const;

function LeadsPage() {
  const [query, setQuery] = useState("");
  const [website, setWebsite] = useState<string>("ALL");
  const [opportunity, setOpportunity] = useState<string>("ALL");
  const [selected, setSelected] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const leads = useQuery({ queryKey: queryKeys.leads, queryFn: listLeads });

  const remove = useMutation({
    mutationFn: (lead: Lead) => deleteLead(lead.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      toast("Lead deleted");
    },
  });

  const pitch = useMutation({
    mutationFn: (leadIds: string[]) => Promise.all(leadIds.map((id) => generatePitch(id))),
    onSuccess: (_data, leadIds) =>
      toast.success("Generating pitches", {
        description: `${leadIds.length} personalised draft${leadIds.length === 1 ? "" : "s"} queued.`,
      }),
  });

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (leads.data ?? []).filter((lead) => {
      const matchesQuery =
        needle === "" ||
        [lead.businessName, lead.contactName, lead.email, lead.city, lead.industry]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesWebsite = website === "ALL" || lead.websiteStatus === website;
      const matchesOpportunity = opportunity === "ALL" || lead.opportunity === opportunity;
      return matchesQuery && matchesWebsite && matchesOpportunity;
    });
  }, [leads.data, query, website, opportunity]);

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const toggleAll = () =>
    setSelected((current) => (current.length === filtered.length ? [] : filtered.map((lead) => lead.id)));

  return (
    <AppLayout title="Leads" crumbs={[{ label: "Workspace", to: "/dashboard" }, { label: "Leads" }]}>
      <PageHeader
        title="Leads"
        subtitle="Every business in your pipeline, scored by website opportunity."
        actions={
          <>
            <ImportLeadsDialog />
            <AddLeadDialog />
          </>
        }
      />

      <div className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search business, contact, city…"
              className="pl-9"
              aria-label="Search leads"
            />
          </div>
          <Select value={website} onValueChange={setWebsite}>
            <SelectTrigger className="sm:w-48" aria-label="Filter by website status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {websiteFilters.map((value) => (
                <SelectItem key={value} value={value}>
                  {value === "ALL" ? "All website states" : value.replaceAll("_", " ").toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={opportunity} onValueChange={setOpportunity}>
            <SelectTrigger className="sm:w-48" aria-label="Filter by opportunity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {opportunityFilters.map((value) => (
                <SelectItem key={value} value={value}>
                  {value === "ALL" ? "All opportunities" : value.replaceAll("_", " ").toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selected.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 border-b bg-muted/50 px-4 py-2.5 text-sm">
            <span className="font-medium">{selected.length} selected</span>
            <Button size="sm" variant="outline" onClick={() => pitch.mutate(selected)}>
              <Sparkles className="size-3.5" aria-hidden /> Generate pitches
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => {
                setSelected([]);
                toast("Bulk delete queued");
              }}
            >
              <Trash2 className="size-3.5" aria-hidden /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              Clear
            </Button>
          </div>
        ) : null}

        {leads.isError ? (
          <div className="p-6">
            <ErrorState onRetry={() => leads.refetch()} />
          </div>
        ) : leads.isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={8} columns={7} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title="No leads match these filters"
              description="Adjust your search or import a new list of businesses to analyse."
            />
          </div>
        ) : (
          <LeadsTable
            leads={filtered}
            selected={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
            onGeneratePitch={(lead) => pitch.mutate([lead.id])}
            onDelete={(lead) => remove.mutate(lead)}
          />
        )}
      </div>
    </AppLayout>
  );
}
