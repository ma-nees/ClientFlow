import { supabase } from "@/lib/supabase";
import type { Lead } from "@/types";
import { request } from "./api";

export interface ImportSummary {
  totalRows: number;
  validRows: number;
  duplicateRows: number;
  invalidEmails: number;
}

/** Helper to map Supabase snake_case to frontend camelCase Lead type */
function mapLead(row: any): Lead {
  return {
    id: row.id,
    businessName: row.business_name,
    contactName: row.contact_name || "",
    email: row.email,
    phone: row.phone || "",
    country: row.country || "",
    city: row.city || "",
    industry: row.industry || "",
    website: row.website,
    websiteStatus: row.website_status as any,
    websiteScore: row.website_score || 0,
    opportunity: row.opportunity as any,
    leadScore: row.lead_score || 0,
    emailStatus: row.email_status as any,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** GET /api/leads */
export async function listLeads(): Promise<Lead[]> {
  const data = await request<any[]>("/api/leads");
  return data.map(mapLead);
}

/** GET /api/leads/:id */
export async function getLead(id: string): Promise<Lead | undefined> {
  const data = await request<any>(`/api/leads/${id}`);
  return mapLead(data);
}

export interface NewLeadInput {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  country: string;
  industry: string;
}

/** POST /api/leads */
export async function createLead(input: NewLeadInput): Promise<Lead> {
  const data = await request("/api/leads", {
    method: "POST",
    body: JSON.stringify({
      business_name: input.businessName,
      contact_name: input.contactName || "—",
      email: input.email,
      phone: input.phone,
      website: input.website || null,
      city: input.city || "—",
      country: input.country || "—",
      industry: input.industry || "General",
      website_status: input.website ? "UNKNOWN" : "NO_WEBSITE",
      opportunity: input.website ? "REDESIGN" : "NEW_WEBSITE",
    })
  });
  return mapLead(data);
}

/** POST /api/leads/import */
export async function importLeads(fileName: string): Promise<ImportSummary> {
  // Real parsing requires backend/edge function. Mocking summary for now.
  return { totalRows: 128, validRows: 121, duplicateRows: 5, invalidEmails: 2 };
}

/** POST /api/leads/:id/analyze */
export async function analyzeLead(id: string): Promise<{ leadId: string; analysis: string[] }> {
  return request(`/api/leads/${id}/analyze`, { method: "POST" });
}

/** POST /api/leads/:id/generate-pitch */
export async function generatePitch(id: string): Promise<{ leadId: string; subject: string; body: string }> {
  return request(`/api/leads/${id}/generate-pitch`, { method: "POST" });
}

/** DELETE /api/leads/:id */
export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
}
