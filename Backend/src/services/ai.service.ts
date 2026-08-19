import { mistral } from "../config/mistral";
import { env } from "../config/env";
import { supabase } from "../config/supabase";

export class AiService {
  /**
   * Generates a personalized cold email pitch for a given lead.
   */
  static async generatePitch(leadId: string): Promise<any> {
    // 1. Fetch lead details from Supabase
    const { data: lead, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (error || !lead) {
      throw new Error(`Lead not found: ${error?.message}`);
    }

    // 2. Build the prompt
    const prompt = `
      You are an expert B2B sales copywriter. Write a short, highly personalized cold email 
      pitching web design and development services.

      Lead Details:
      - Name: ${lead.contact_name || "Decision Maker"}
      - Company: ${lead.business_name}
      - Industry: ${lead.industry || "General"}
      - Location: ${lead.city}, ${lead.country}
      - Website Status: ${lead.website_status} (Opportunity: ${lead.opportunity})

      Guidelines:
      - Keep it under 150 words.
      - Use an engaging, non-salesy subject line.
      - Personalize the opening line based on their industry or location.
      - Propose a clear value proposition related to their website status.
      - End with a low-friction call to action.
      
      Return the response in exactly this JSON format:
      {
        "subject": "The email subject line",
        "body": "The plain text email body"
      }
    `;

    // 3. Call Mistral
    const response = await mistral.chat.complete({
      model: env.MISTRAL_MODEL,
      messages: [{ role: "user", content: prompt }],
      responseFormat: { type: "jsonObject" },
      temperature: 0.7,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content generated from Mistral");
    }

    // Mistral returns a string, or an array of parts depending on the SDK version, let's assume it's a string.
    let parsedContent;
    try {
      parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    } catch (e) {
      // In case it's not JSON
      parsedContent = { subject: "Generated Email", body: content };
    }

    // 4. Update the lead's status in Supabase (Optional but helpful)
    await supabase.from("leads").update({ email_status: "DRAFTED" }).eq("id", leadId);

    // 5. Create an email draft in the database
    // For now, we just return the payload so the controller can save it or return it
    return {
      leadId,
      subject: parsedContent.subject || "Generated Subject",
      body: parsedContent.body || JSON.stringify(parsedContent),
    };
  }

  /**
   * Analyzes a lead based on available data to find personalization points.
   */
  static async analyzeLead(leadId: string): Promise<any> {
    // Fetch lead details
    const { data: lead, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (error || !lead) {
      throw new Error("Lead not found");
    }

    const prompt = `
      Analyze this lead for a web design agency. Provide 3 bullet points of specific 
      angles or pain points to use in outreach based on this profile.
      
      Company: ${lead.business_name}
      Industry: ${lead.industry}
      Website: ${lead.website || "No website"}
      
      Return JSON: { "analysis": ["point 1", "point 2", "point 3"] }
    `;

    const response = await mistral.chat.complete({
      model: env.MISTRAL_MODEL,
      messages: [{ role: "user", content: prompt }],
      responseFormat: { type: "jsonObject" },
      temperature: 0.7,
    });

    const content = response.choices?.[0]?.message?.content;
    let parsedContent: any = { analysis: [] };
    
    try {
        if (typeof content === 'string') {
            parsedContent = JSON.parse(content);
        } else if (content) {
            parsedContent = content;
        }
    } catch (e) {
        console.error("Failed to parse Mistral response:", e);
    }

    // Update lead score or attach analysis notes to the lead
    await supabase.from("leads").update({ lead_score: 85 }).eq("id", leadId);

    return {
      leadId,
      analysis: parsedContent.analysis || [],
    };
  }
}
