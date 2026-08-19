import { supabase } from "../config/supabase";

export interface CreateCampaignInput {
  name: string;
  target: string;
  leadIds?: string[];
  dailyLimit: number;
  randomizedDelay?: boolean;
}

export class CampaignsService {
  static async listCampaigns(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  static async getCampaign(userId: string, campaignId: string): Promise<any> {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId)
      .eq("id", campaignId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async createCampaign(userId: string, input: CreateCampaignInput): Promise<any> {
    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        user_id: userId,
        name: input.name,
        target: input.target,
        daily_limit: input.dailyLimit,
        randomized_delay: input.randomizedDelay ?? true,
        status: "ACTIVE",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (input.leadIds && input.leadIds.length > 0) {
      const links = input.leadIds.map(leadId => ({
        campaign_id: data.id,
        lead_id: leadId,
      }));
      await supabase.from("campaign_leads").insert(links);
    }

    return data;
  }

  static async updateStatus(userId: string, campaignId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from("campaigns")
      .update({ status })
      .eq("user_id", userId)
      .eq("id", campaignId);

    if (error) throw new Error(error.message);
  }

  static async deleteCampaign(userId: string, campaignId: string): Promise<void> {
    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("user_id", userId)
      .eq("id", campaignId);

    if (error) throw new Error(error.message);
  }
}
