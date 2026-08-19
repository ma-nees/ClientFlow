import { request } from "./api";
import type { Campaign, CampaignStatus } from "@/types";

export interface CreateCampaignInput {
  name: string;
  target: string;
  leadIds?: string[];
  dailyLimit: number;
  randomizedDelay?: boolean;
}

/** GET /api/campaigns */
export async function listCampaigns(): Promise<Campaign[]> {
  return request<Campaign[]>("/api/campaigns");
}

/** GET /api/campaigns/:id */
export async function getCampaign(id: string): Promise<Campaign | undefined> {
  return request<Campaign>(`/api/campaigns/${id}`);
}

/** POST /api/campaigns */
export async function createCampaign(input: CreateCampaignInput): Promise<{ id: string }> {
  return request("/api/campaigns", { method: "POST", body: JSON.stringify(input) });
}

/** PATCH /api/campaigns/:id */
export async function setCampaignStatus(id: string, status: CampaignStatus): Promise<void> {
  return request(`/api/campaigns/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
}

/** DELETE /api/campaigns/:id */
export async function deleteCampaign(id: string): Promise<void> {
  return request(`/api/campaigns/${id}`, { method: "DELETE" });
}
