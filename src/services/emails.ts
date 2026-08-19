import { mockEmails } from "@/data/mock";
import type { EmailMessage } from "@/types";
import { delay } from "./api";

/** GET /api/emails */
export async function listEmails(): Promise<EmailMessage[]> {
  // TODO(backend): return request<EmailMessage[]>("/api/emails")
  await delay();
  return mockEmails;
}

/** GET /api/emails/:id */
export async function getEmail(id: string): Promise<EmailMessage | undefined> {
  await delay(200);
  return mockEmails.find((email) => email.id === id);
}

/** PATCH /api/emails/:id — saving an edited draft never sends anything. */
export async function saveEmail(id: string, patch: Partial<EmailMessage>): Promise<void> {
  // TODO(backend): request(`/api/emails/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
  await delay(350);
  void id;
  void patch;
}

/**
 * POST /api/emails/:id/approve
 * Approval only moves an email into the send queue. Actual delivery is performed
 * by the backend worker through the Gmail API, never from the browser.
 */
export async function approveEmail(id: string): Promise<void> {
  await delay(300);
  void id;
}

/** POST /api/emails/:id/reject */
export async function rejectEmail(id: string): Promise<void> {
  await delay(300);
  void id;
}
