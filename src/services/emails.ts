import type { EmailMessage, EmailStatus } from "@/types";
import { request } from "./api";
import { listLeads, getLead } from "./leads";

function mapLeadToEmail(lead: any): EmailMessage {
  const parts = lead.aiPitch?.split('\n\n') || ["Subject: Draft", ""];
  let subject = parts[0];
  if (subject.startsWith("Subject: ")) {
    subject = subject.replace("Subject: ", "").trim();
  }
  const body = parts.slice(1).join('\n\n').trim();

  return {
    id: lead.id, // using lead id as email id since it's 1:1
    leadId: lead.id,
    businessName: lead.businessName,
    recipientName: lead.contactName,
    recipientEmail: lead.email,
    subject,
    body,
    opportunity: lead.opportunity,
    aiConfidence: lead.aiRecommendation?.confidence || 0.9,
    status: lead.emailStatus,
    createdAt: lead.updatedAt || lead.createdAt,
  };
}

/** GET /api/emails (mocked by fetching leads with pitches) */
export async function listEmails(): Promise<EmailMessage[]> {
  const leads = await listLeads();
  return leads
    .filter((lead) => lead.emailStatus !== "NOT_CONTACTED" && lead.aiPitch)
    .map(mapLeadToEmail);
}

/** GET /api/emails/:id */
export async function getEmail(id: string): Promise<EmailMessage | undefined> {
  const lead = await getLead(id);
  if (!lead || !lead.aiPitch) return undefined;
  return mapLeadToEmail(lead);
}

/** PATCH /api/emails/:id — saving an edited draft never sends anything. */
export async function saveEmail(id: string, patch: Partial<EmailMessage>): Promise<void> {
  let ai_pitch = undefined;
  if (patch.subject !== undefined || patch.body !== undefined) {
    const existing = await getEmail(id);
    const newSubject = patch.subject !== undefined ? patch.subject : existing?.subject || "";
    const newBody = patch.body !== undefined ? patch.body : existing?.body || "";
    ai_pitch = `Subject: ${newSubject}\n\n${newBody}`;
  }

  const payload: any = {};
  if (ai_pitch !== undefined) payload.ai_pitch = ai_pitch;
  if (patch.status !== undefined) payload.email_status = patch.status;

  if (Object.keys(payload).length > 0) {
    await request(`/api/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }
}

/**
 * POST /api/emails/:id/approve
 * Approval only moves an email into the send queue.
 */
export async function approveEmail(id: string): Promise<void> {
  await request(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ email_status: "APPROVED" }),
  });
}

/** POST /api/emails/:id/reject */
export async function rejectEmail(id: string): Promise<void> {
  await request(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ email_status: "REJECTED" }),
  });
}
