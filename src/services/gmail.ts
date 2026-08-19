import { mockGmail } from "@/data/mock";
import type { GmailConnection, SendingSettings } from "@/types";
import { mockSendingSettings } from "@/data/mock";
import { delay } from "./api";

import { request } from "./api";

/** GET /api/gmail/status */
export async function getGmailStatus(): Promise<GmailConnection> {
  return request<GmailConnection>("/api/gmail/status");
}

/** GET /api/gmail/connect */
export async function beginGmailConnect(): Promise<{ available: boolean; reason?: string; url?: string }> {
  try {
    const response = await request<{ url: string }>("/api/gmail/connect");
    return { available: true, url: response.url };
  } catch (error: any) {
    return { available: false, reason: error.message || "Failed to initiate Gmail connection" };
  }
}

/** POST /api/gmail/disconnect */
export async function disconnectGmail(): Promise<void> {
  await request("/api/gmail/disconnect", { method: "POST" });
}

/** GET /api/settings/sending */
export async function getSendingSettings(): Promise<SendingSettings> {
  await delay(200);
  return mockSendingSettings;
}

/** PUT /api/settings/sending */
export async function saveSendingSettings(settings: SendingSettings): Promise<void> {
  await delay(300);
  void settings;
}
