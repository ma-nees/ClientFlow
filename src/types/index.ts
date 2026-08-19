/**
 * Domain types for ClientFlow AI.
 * These mirror the shapes the backend (Node/Express + Supabase) will return,
 * so services can be swapped from mock data to real API calls without UI changes.
 */

export type WebsiteStatus =
  | "NO_WEBSITE"
  | "GOOD"
  | "OUTDATED"
  | "POOR_MOBILE"
  | "SLOW"
  | "UNKNOWN";

export type Opportunity =
  | "NEW_WEBSITE"
  | "REDESIGN"
  | "MOBILE_OPTIMIZATION"
  | "PERFORMANCE"
  | "SKIP";

export type EmailStatus =
  | "DRAFT"
  | "AI_GENERATED"
  | "NEEDS_REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "SENDING"
  | "SENT"
  | "DELIVERED"
  | "REPLIED"
  | "BOUNCED"
  | "FAILED"
  | "REJECTED"
  | "NOT_CONTACTED";

export type CampaignStatus =
  | "DRAFT"
  | "REVIEW"
  | "SCHEDULED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED";

export type ActivityEventType =
  | "LEAD_IMPORTED"
  | "WEBSITE_ANALYZED"
  | "PITCH_GENERATED"
  | "EMAIL_EDITED"
  | "EMAIL_APPROVED"
  | "EMAIL_SCHEDULED"
  | "EMAIL_SENT"
  | "EMAIL_DELIVERED"
  | "REPLY_RECEIVED"
  | "FOLLOW_UP_SCHEDULED"
  | "FOLLOW_UP_SENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | undefined;
}

export interface WebsiteAnalysis {
  status: WebsiteStatus;
  score: number; // 0-100
  issues: string[];
  recommendation: Opportunity;
  analyzedAt?: string | undefined;
  summary?: string | undefined;
}

export interface AIRecommendation {
  service: string;
  reasons: string[];
  confidence: number; // 0-1
}

export interface OnlinePresence {
  googleBusiness?: boolean | undefined;
  instagram?: string | undefined;
  facebook?: string | undefined;
  linkedin?: string | undefined;
}

export interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  industry: string;
  website: string | null;
  websiteStatus: WebsiteStatus;
  websiteScore: number;
  opportunity: Opportunity;
  leadScore: number;
  analysis?: WebsiteAnalysis | undefined;
  aiRecommendation?: AIRecommendation | undefined;
  aiPitch?: string | undefined;
  emailStatus: EmailStatus;
  campaignId?: string | undefined;
  presence?: OnlinePresence | undefined;
  notes?: LeadNote[] | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface LeadNote {
  id: string;
  body: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  target: string;
  status: CampaignStatus;
  leadCount: number;
  generated: number;
  approved: number;
  sent: number;
  opened: number;
  replies: number;
  interested: number;
  dailyLimit: number;
  createdAt: string;
}

export interface EmailMessage {
  id: string;
  leadId: string;
  campaignId?: string | undefined;
  businessName: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  opportunity: Opportunity;
  aiConfidence: number; // 0-1
  status: EmailStatus;
  createdAt: string;
  scheduledFor?: string | undefined;
  sentAt?: string | undefined;
  replyPreview?: string | undefined;
}

export interface EmailEvent {
  id: string;
  emailId: string;
  type: ActivityEventType;
  at: string;
}

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description?: string | undefined;
  at: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  at: string;
  read: boolean;
}

export interface GmailConnection {
  connected: boolean;
  account?: string | undefined;
  connectedAt?: string | undefined;
}

export interface SendingSettings {
  dailyLimit: number;
  minDelayMinutes: number;
  maxDelayMinutes: number;
  requireManualApproval: boolean;
  stopFollowUpOnReply: boolean;
  workingHoursOnly: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  timezone: string;
}

export interface FollowUpStep {
  id: string;
  label: string;
  delayDays: number;
  subject: string;
  body: string;
  enabled: boolean;
}

export type EmailTone = "professional" | "friendly" | "direct" | "consultative";
export type EmailLength = "short" | "medium" | "detailed";
export type PersonalizationLevel = "low" | "medium" | "high";

export interface AISettings {
  provider: string;
  apiConnected: boolean;
  model: string;
  tone: EmailTone;
  length: EmailLength;
  personalization: PersonalizationLevel;
  signature: string;
  includeWebsiteObservation: boolean;
  includeBusinessDetail: boolean;
  includePortfolioLink: boolean;
  includeCallToAction: boolean;
}

export interface AnalyticsSeriesPoint {
  date: string;
  sent: number;
  replies: number;
  interested: number;
}

export interface AnalyticsData {
  range: "7d" | "30d" | "90d" | "custom";
  emailsSent: number;
  deliveryRate: number;
  replyRate: number;
  positiveReplyRate: number;
  meetingRate: number;
  series: AnalyticsSeriesPoint[];
  byCountry: { country: string; sent: number; replyRate: number }[];
  byOpportunity: { opportunity: string; sent: number; replyRate: number }[];
  campaignComparison: { name: string; sent: number; replies: number }[];
  insights: string[];
}
