import { mockAISettings } from "@/data/mock";
import type { AISettings, EmailLength, EmailTone, PersonalizationLevel } from "@/types";
import { delay } from "./api";

export interface GenerateRequest {
  leadId: string;
  tone?: EmailTone;
  length?: EmailLength;
  personalization?: PersonalizationLevel;
  includeWebsiteObservation?: boolean;
  includeBusinessDetail?: boolean;
  includePortfolioLink?: boolean;
  includeCallToAction?: boolean;
}

/**
 * POST /api/ai/generate
 * The OpenAI key lives on the backend only. This front end never talks to OpenAI.
 */
export async function generateEmail(input: GenerateRequest): Promise<{ queued: true }> {
  // TODO(backend): request("/api/ai/generate", { method: "POST", body: JSON.stringify(input) })
  await delay(700);
  void input;
  return { queued: true };
}

/** GET /api/settings/ai */
export async function getAISettings(): Promise<AISettings> {
  await delay(200);
  return mockAISettings;
}

/** PUT /api/settings/ai */
export async function saveAISettings(settings: AISettings): Promise<void> {
  await delay(350);
  void settings;
}

/** Rendered client-side purely so the user can preview the prompt shape. */
export function buildPromptPreview(settings: AISettings): string {
  return [
    `You are writing a short cold outreach email as a freelance web developer.`,
    `Tone: ${settings.tone}. Length: ${settings.length}. Personalization: ${settings.personalization}.`,
    settings.includeWebsiteObservation ? `Reference one concrete observation about {{business_name}}'s website.` : null,
    settings.includeBusinessDetail ? `Mention one business-specific detail (industry, city, reviews).` : null,
    settings.includePortfolioLink ? `Include the portfolio link once, without pressure.` : null,
    settings.includeCallToAction ? `End with a single low-friction question as the call to action.` : null,
    `Never use hype, buzzwords, or fake urgency. Recommended service: {{service}}.`,
    `Sign off as:\n${settings.signature}`,
  ]
    .filter(Boolean)
    .join("\n");
}
