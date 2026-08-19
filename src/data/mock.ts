/**
 * DEMO DATA ONLY — clearly fictional.
 * Replace by wiring src/services/* to the real backend API.
 */
import type {
  ActivityEvent,
  AISettings,
  AnalyticsData,
  Campaign,
  EmailMessage,
  FollowUpStep,
  GmailConnection,
  Lead,
  Notification,
  Opportunity,
  SendingSettings,
  User,
  WebsiteStatus,
} from "@/types";

export const demoUser: User = {
  id: "u_1",
  name: "Manish",
  email: "manish@clientflow.demo",
  role: "Web Developer",
};

const pitch = (business: string, contact: string, angle: string) =>
  `Hi ${contact},

I came across ${business} while looking at local businesses in your area, and ${angle}

I build fast, mobile-first websites for small businesses — usually a 2-week turnaround, fixed price, no retainer required. I put together a couple of rough ideas of how a new page could look for you.

Would it be useful if I sent them over? Happy to share whether or not it turns into work.

Manish Sahani
Web Developer — portfolio.example.dev`;

interface Seed {
  business: string;
  contact: string;
  city: string;
  country: string;
  industry: string;
  website: string | null;
  status: WebsiteStatus;
  websiteScore: number;
  opportunity: Opportunity;
  leadScore: number;
  emailStatus: Lead["emailStatus"];
  issues: string[];
  angle: string;
  campaignId?: string;
}

const seeds: Seed[] = [
  {
    business: "ABC Plumbing",
    contact: "John Smith",
    city: "Auckland",
    country: "New Zealand",
    industry: "Plumbing",
    website: null,
    status: "NO_WEBSITE",
    websiteScore: 0,
    opportunity: "NEW_WEBSITE",
    leadScore: 94,
    emailStatus: "NEEDS_REVIEW",
    issues: ["No dedicated website detected", "Relies on a directory listing only"],
    angle: "noticed you don't have a website yet — all of your enquiries are coming through a directory listing.",
    campaignId: "c_1",
  },
  {
    business: "Sarah's Bakery",
    contact: "Sarah Nolan",
    city: "Melbourne",
    country: "Australia",
    industry: "Bakery",
    website: "sarahsbakery.example.com",
    status: "OUTDATED",
    websiteScore: 38,
    opportunity: "REDESIGN",
    leadScore: 89,
    emailStatus: "APPROVED",
    issues: ["Design patterns from ~2013", "No online ordering", "Copyright notice reads 2016"],
    angle: "your site looks like it hasn't been updated in a few years, and the menu isn't easy to read on a phone.",
    campaignId: "c_1",
  },
  {
    business: "XYZ Construction",
    contact: "Daniel Poole",
    city: "London",
    country: "United Kingdom",
    industry: "Construction",
    website: "xyzconstruction.example.co.uk",
    status: "POOR_MOBILE",
    websiteScore: 44,
    opportunity: "MOBILE_OPTIMIZATION",
    leadScore: 86,
    emailStatus: "SENT",
    issues: ["Horizontal scrolling on mobile", "Tap targets too small", "Contact form unusable on phones"],
    angle: "your site breaks out of the screen on mobile, which is where most trade enquiries start.",
    campaignId: "c_2",
  },
  {
    business: "Northside Dental",
    contact: "Priya Raman",
    city: "Toronto",
    country: "Canada",
    industry: "Dental",
    website: "northsidedental.example.ca",
    status: "SLOW",
    websiteScore: 51,
    opportunity: "PERFORMANCE",
    leadScore: 82,
    emailStatus: "REPLIED",
    issues: ["8.4s largest contentful paint", "Unoptimised hero images", "Blocking third-party scripts"],
    angle: "your homepage takes over eight seconds to load, which quietly costs you booking enquiries.",
    campaignId: "c_2",
  },
  {
    business: "Harbour Landscaping",
    contact: "Tom Reeves",
    city: "Wellington",
    country: "New Zealand",
    industry: "Landscaping",
    website: null,
    status: "NO_WEBSITE",
    websiteScore: 0,
    opportunity: "NEW_WEBSITE",
    leadScore: 91,
    emailStatus: "NEEDS_REVIEW",
    issues: ["No website", "Strong review volume on Google Business"],
    angle: "you have a great set of reviews but nowhere to send people who want to see your work.",
    campaignId: "c_1",
  },
  {
    business: "Bright Smile Salon",
    contact: "Ava Lindqvist",
    city: "Sydney",
    country: "Australia",
    industry: "Salon",
    website: "brightsmilesalon.example.com",
    status: "GOOD",
    websiteScore: 88,
    opportunity: "SKIP",
    leadScore: 24,
    emailStatus: "NOT_CONTACTED",
    issues: [],
    angle: "your site is already in good shape.",
  },
  {
    business: "Cedar Grove Gym",
    contact: "Marcus Hale",
    city: "Austin",
    country: "United States",
    industry: "Gym",
    website: "cedargrovegym.example.com",
    status: "OUTDATED",
    websiteScore: 41,
    opportunity: "REDESIGN",
    leadScore: 78,
    emailStatus: "AI_GENERATED",
    issues: ["Flash-era layout", "No class schedule", "No sign-up flow"],
    angle: "there's no way for someone to see class times or sign up without calling you.",
    campaignId: "c_3",
  },
  {
    business: "Desert Auto Repair",
    contact: "Khalid Nasser",
    city: "Dubai",
    country: "UAE",
    industry: "Auto Repair",
    website: "desertauto.example.ae",
    status: "POOR_MOBILE",
    websiteScore: 47,
    opportunity: "MOBILE_OPTIMIZATION",
    leadScore: 80,
    emailStatus: "NEEDS_REVIEW",
    issues: ["Not responsive below 768px", "Phone number not tappable"],
    angle: "your booking page is hard to use on a phone.",
    campaignId: "c_3",
  },
  {
    business: "Kowhai Cleaning Co",
    contact: "Lisa Whitmore",
    city: "Christchurch",
    country: "New Zealand",
    industry: "Cleaning",
    website: null,
    status: "NO_WEBSITE",
    websiteScore: 0,
    opportunity: "NEW_WEBSITE",
    leadScore: 84,
    emailStatus: "APPROVED",
    issues: ["Facebook page only"],
    angle: "everything currently runs through a Facebook page, which limits who can find you.",
    campaignId: "c_1",
  },
  {
    business: "Maple Ridge Realty",
    contact: "Erin Doyle",
    city: "Vancouver",
    country: "Canada",
    industry: "Real Estate",
    website: "mapleridge.example.ca",
    status: "SLOW",
    websiteScore: 55,
    opportunity: "PERFORMANCE",
    leadScore: 74,
    emailStatus: "SCHEDULED",
    issues: ["Unoptimised listing gallery", "6.1s time to interactive"],
    angle: "your listings gallery is heavy enough that mobile visitors often bounce before it loads.",
    campaignId: "c_2",
  },
  {
    business: "Olive & Thyme Restaurant",
    contact: "Nikos Petrou",
    city: "Manchester",
    country: "United Kingdom",
    industry: "Restaurant",
    website: "oliveandthyme.example.co.uk",
    status: "OUTDATED",
    websiteScore: 36,
    opportunity: "REDESIGN",
    leadScore: 87,
    emailStatus: "NEEDS_REVIEW",
    issues: ["Menu is a PDF download", "No reservations link", "No mobile layout"],
    angle: "your menu is a PDF, which is a frustrating experience for anyone browsing on a phone.",
    campaignId: "c_2",
  },
  {
    business: "Summit Roofing",
    contact: "Grant Ellis",
    city: "Denver",
    country: "United States",
    industry: "Construction",
    website: null,
    status: "NO_WEBSITE",
    websiteScore: 0,
    opportunity: "NEW_WEBSITE",
    leadScore: 88,
    emailStatus: "NOT_CONTACTED",
    issues: ["No website", "Active in local listings"],
    angle: "you're showing up in local searches but there's no site behind the listing.",
  },
  {
    business: "Pearl Nail Studio",
    contact: "Mia Trần",
    city: "Brisbane",
    country: "Australia",
    industry: "Salon",
    website: "pearlnails.example.com",
    status: "POOR_MOBILE",
    websiteScore: 49,
    opportunity: "MOBILE_OPTIMIZATION",
    leadScore: 71,
    emailStatus: "AI_GENERATED",
    issues: ["Fixed-width layout", "Booking widget cut off on mobile"],
    angle: "your booking widget gets cut off on smaller screens.",
  },
  {
    business: "Anchor Bay Dental",
    contact: "Owen Fitzgerald",
    city: "Auckland",
    country: "New Zealand",
    industry: "Dental",
    website: "anchorbaydental.example.nz",
    status: "GOOD",
    websiteScore: 84,
    opportunity: "SKIP",
    leadScore: 21,
    emailStatus: "NOT_CONTACTED",
    issues: [],
    angle: "your site is already performing well.",
  },
  {
    business: "Ironwood Fitness",
    contact: "Rachel Kim",
    city: "Chicago",
    country: "United States",
    industry: "Gym",
    website: "ironwoodfit.example.com",
    status: "SLOW",
    websiteScore: 58,
    opportunity: "PERFORMANCE",
    leadScore: 69,
    emailStatus: "SENT",
    issues: ["Video hero at 12MB", "No caching headers"],
    angle: "your homepage video is heavy enough to slow the whole page down.",
    campaignId: "c_3",
  },
  {
    business: "Golden Crust Bakery",
    contact: "Elena Rossi",
    city: "Auckland",
    country: "New Zealand",
    industry: "Bakery",
    website: null,
    status: "NO_WEBSITE",
    websiteScore: 0,
    opportunity: "NEW_WEBSITE",
    leadScore: 83,
    emailStatus: "NEEDS_REVIEW",
    issues: ["Instagram only"],
    angle: "everything currently lives on Instagram, so new customers can't find your hours or order online.",
    campaignId: "c_1",
  },
  {
    business: "Blue Ridge Plumbing",
    contact: "Peter Ainsley",
    city: "Bristol",
    country: "United Kingdom",
    industry: "Plumbing",
    website: "blueridgeplumbing.example.co.uk",
    status: "OUTDATED",
    websiteScore: 40,
    opportunity: "REDESIGN",
    leadScore: 76,
    emailStatus: "REJECTED",
    issues: ["No SSL", "Broken contact form", "Dated typography"],
    angle: "your contact form currently returns an error, so enquiries may be going nowhere.",
  },
  {
    business: "Sandline Cleaning",
    contact: "Yusuf Amari",
    city: "Abu Dhabi",
    country: "UAE",
    industry: "Cleaning",
    website: "sandlineclean.example.ae",
    status: "UNKNOWN",
    websiteScore: 0,
    opportunity: "SKIP",
    leadScore: 42,
    emailStatus: "NOT_CONTACTED",
    issues: ["Analysis pending"],
    angle: "we haven't been able to analyse your site yet.",
  },
  {
    business: "Fernvale Landscaping",
    contact: "Holly Baxter",
    city: "Hamilton",
    country: "New Zealand",
    industry: "Landscaping",
    website: "fernvale.example.nz",
    status: "POOR_MOBILE",
    websiteScore: 46,
    opportunity: "MOBILE_OPTIMIZATION",
    leadScore: 73,
    emailStatus: "APPROVED",
    issues: ["Gallery unusable on mobile", "No click-to-call"],
    angle: "your project gallery is hard to browse on a phone.",
    campaignId: "c_1",
  },
  {
    business: "Copper Kettle Cafe",
    contact: "Jamie Sutherland",
    city: "Edinburgh",
    country: "United Kingdom",
    industry: "Restaurant",
    website: "copperkettle.example.co.uk",
    status: "SLOW",
    websiteScore: 53,
    opportunity: "PERFORMANCE",
    leadScore: 68,
    emailStatus: "SENT",
    issues: ["7.2s load on 4G", "Three separate font providers"],
    angle: "your site is slow enough on mobile data that many visitors won't wait for it.",
    campaignId: "c_2",
  },
  {
    business: "Silverline Auto",
    contact: "Bianca Moretti",
    city: "Calgary",
    country: "Canada",
    industry: "Auto Repair",
    website: null,
    status: "NO_WEBSITE",
    websiteScore: 0,
    opportunity: "NEW_WEBSITE",
    leadScore: 79,
    emailStatus: "NOT_CONTACTED",
    issues: ["No website"],
    angle: "there's no website behind your listings, so people can't check services or book.",
  },
  {
    business: "Aurora Real Estate",
    contact: "Chris Whelan",
    city: "Perth",
    country: "Australia",
    industry: "Real Estate",
    website: "auroraestate.example.com",
    status: "OUTDATED",
    websiteScore: 43,
    opportunity: "REDESIGN",
    leadScore: 72,
    emailStatus: "AI_GENERATED",
    issues: ["Table-based layout", "No property filters"],
    angle: "buyers can't filter your listings, which makes browsing harder than it needs to be.",
    campaignId: "c_3",
  },
];

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

export const mockLeads: Lead[] = seeds.map((s, i) => ({
  id: `l_${i + 1}`,
  businessName: s.business,
  contactName: s.contact,
  email: `${s.contact.split(" ")[0]!.toLowerCase()}@${s.business.toLowerCase().replace(/[^a-z]/g, "")}.example.com`,
  phone: `+64 21 000 ${String(1000 + i)}`,
  country: s.country,
  city: s.city,
  industry: s.industry,
  website: s.website,
  websiteStatus: s.status,
  websiteScore: s.websiteScore,
  opportunity: s.opportunity,
  leadScore: s.leadScore,
  emailStatus: s.emailStatus,
  campaignId: s.campaignId,
  analysis: {
    status: s.status,
    score: s.websiteScore,
    issues: s.issues,
    recommendation: s.opportunity,
    analyzedAt: s.status === "UNKNOWN" ? undefined : daysAgo(i % 9),
    summary:
      s.status === "NO_WEBSITE"
        ? "No dedicated website detected. Business has an active online presence and strong customer reviews."
        : s.issues.join(". "),
  },
  aiRecommendation:
    s.opportunity === "SKIP"
      ? { service: "Skip", reasons: ["Existing site is modern and fast"], confidence: 0.91 }
      : {
          service:
            s.opportunity === "NEW_WEBSITE"
              ? "New Website"
              : s.opportunity === "REDESIGN"
                ? "Website Redesign"
                : s.opportunity === "MOBILE_OPTIMIZATION"
                  ? "Mobile Optimization"
                  : "Performance Improvement",
          reasons: [...s.issues, "Active business with visible customer demand"],
          confidence: 0.72 + ((i % 5) * 0.05),
        },
  aiPitch: s.opportunity === "SKIP" ? undefined : pitch(s.business, s.contact.split(" ")[0]!, s.angle),
  presence: {
    googleBusiness: i % 3 !== 0,
    instagram: i % 2 === 0 ? `@${s.business.toLowerCase().replace(/[^a-z]/g, "")}` : undefined,
    facebook: i % 3 === 0 ? `/${s.business.toLowerCase().replace(/[^a-z]/g, "")}` : undefined,
    linkedin: i % 4 === 0 ? `/company/${s.business.toLowerCase().replace(/[^a-z]/g, "-")}` : undefined,
  },
  notes:
    i === 0
      ? [{ id: "n_1", body: "Called once — asked to follow up by email in the new year.", createdAt: daysAgo(3) }]
      : [],
  createdAt: daysAgo(i + 1),
  updatedAt: daysAgo(i % 4),
}));

export const mockCampaigns: Campaign[] = [
  {
    id: "c_1",
    name: "NZ Local Businesses",
    target: "New Zealand · trades & hospitality",
    status: "RUNNING",
    leadCount: 127,
    generated: 104,
    approved: 83,
    sent: 62,
    opened: 41,
    replies: 8,
    interested: 3,
    dailyLimit: 20,
    createdAt: daysAgo(21),
  },
  {
    id: "c_2",
    name: "UK Redesign Push",
    target: "United Kingdom · outdated websites",
    status: "PAUSED",
    leadCount: 68,
    generated: 61,
    approved: 44,
    sent: 39,
    opened: 22,
    replies: 6,
    interested: 2,
    dailyLimit: 15,
    createdAt: daysAgo(34),
  },
  {
    id: "c_3",
    name: "AU/US Mobile Fixes",
    target: "Australia & US · mobile issues",
    status: "REVIEW",
    leadCount: 53,
    generated: 48,
    approved: 26,
    sent: 26,
    opened: 15,
    replies: 4,
    interested: 1,
    dailyLimit: 20,
    createdAt: daysAgo(9),
  },
];

const emailStatuses: EmailMessage["status"][] = [
  "NEEDS_REVIEW",
  "NEEDS_REVIEW",
  "NEEDS_REVIEW",
  "NEEDS_REVIEW",
  "NEEDS_REVIEW",
  "APPROVED",
  "APPROVED",
  "APPROVED",
  "SCHEDULED",
  "SCHEDULED",
  "SENT",
  "SENT",
  "SENT",
  "REPLIED",
  "REPLIED",
  "FAILED",
  "REJECTED",
];

export const mockEmails: EmailMessage[] = mockLeads
  .filter((l) => l.opportunity !== "SKIP")
  .slice(0, emailStatuses.length)
  .map((lead, i) => ({
    id: `e_${i + 1}`,
    leadId: lead.id,
    campaignId: lead.campaignId,
    businessName: lead.businessName,
    recipientName: lead.contactName,
    recipientEmail: lead.email,
    subject:
      lead.opportunity === "NEW_WEBSITE"
        ? `A quick idea for ${lead.businessName}`
        : lead.opportunity === "REDESIGN"
          ? `Refreshing the ${lead.businessName} website`
          : lead.opportunity === "MOBILE_OPTIMIZATION"
            ? `${lead.businessName} on mobile`
            : `Speeding up ${lead.businessName}`,
    body: lead.aiPitch ?? "",
    opportunity: lead.opportunity,
    aiConfidence: lead.aiRecommendation?.confidence ?? 0.75,
    status: emailStatuses[i]!,
    createdAt: daysAgo(i % 12),
    scheduledFor: emailStatuses[i] === "SCHEDULED" ? daysAgo(-1) : undefined,
    sentAt: ["SENT", "REPLIED"].includes(emailStatuses[i]!) ? daysAgo(i % 6) : undefined,
    replyPreview:
      emailStatuses[i] === "REPLIED"
        ? "Thanks for reaching out — can you send over the mockups and a rough price?"
        : undefined,
  }));

export const mockActivity: ActivityEvent[] = [
  { id: "a_1", type: "REPLY_RECEIVED", title: "Reply received", description: "Northside Dental replied to your pitch", at: daysAgo(0) },
  { id: "a_2", type: "EMAIL_SENT", title: "Email sent", description: "XYZ Construction · mobile optimization pitch", at: daysAgo(0) },
  { id: "a_3", type: "EMAIL_APPROVED", title: "Email approved", description: "Sarah's Bakery · redesign pitch", at: daysAgo(1) },
  { id: "a_4", type: "PITCH_GENERATED", title: "AI pitch generated", description: "12 pitches drafted for NZ Local Businesses", at: daysAgo(1) },
  { id: "a_5", type: "WEBSITE_ANALYZED", title: "Website analysis completed", description: "18 leads analysed", at: daysAgo(2) },
  { id: "a_6", type: "LEAD_IMPORTED", title: "Leads imported", description: "42 leads from nz-trades.csv", at: daysAgo(2) },
  { id: "a_7", type: "EMAIL_DELIVERED", title: "Email delivered", description: "Copper Kettle Cafe", at: daysAgo(3) },
  { id: "a_8", type: "FOLLOW_UP_SCHEDULED", title: "Follow-up scheduled", description: "Ironwood Fitness · follow-up #1", at: daysAgo(4) },
  { id: "a_9", type: "EMAIL_SCHEDULED", title: "Email scheduled", description: "Maple Ridge Realty · tomorrow 09:20", at: daysAgo(4) },
  { id: "a_10", type: "EMAIL_EDITED", title: "Email edited", description: "Golden Crust Bakery · subject line tightened", at: daysAgo(5) },
];

export const mockNotifications: Notification[] = [
  { id: "n_1", title: "Website analysis finished", description: "18 leads finished website analysis.", at: daysAgo(0), read: false },
  { id: "n_2", title: "New replies", description: "3 prospects replied.", at: daysAgo(0), read: false },
  { id: "n_3", title: "Approvals waiting", description: "5 emails are waiting for approval.", at: daysAgo(1), read: false },
  { id: "n_4", title: "Campaign paused", description: "Campaign UK Redesign Push is paused.", at: daysAgo(2), read: true },
];

export const mockGmail: GmailConnection = { connected: false };

export const mockSendingSettings: SendingSettings = {
  dailyLimit: 20,
  minDelayMinutes: 2,
  maxDelayMinutes: 7,
  requireManualApproval: true,
  stopFollowUpOnReply: true,
  workingHoursOnly: true,
  workingHoursStart: "09:00",
  workingHoursEnd: "17:00",
  timezone: "Asia/Kolkata",
};

export const mockAISettings: AISettings = {
  provider: "OpenAI",
  apiConnected: false,
  model: "gpt-4o-mini (placeholder)",
  tone: "professional",
  length: "short",
  personalization: "high",
  signature: "Manish Sahani\nWeb Developer\nportfolio.example.dev",
  includeWebsiteObservation: true,
  includeBusinessDetail: true,
  includePortfolioLink: true,
  includeCallToAction: true,
};

export const mockFollowUps: FollowUpStep[] = [
  {
    id: "f_1",
    label: "Follow-up #1",
    delayDays: 3,
    subject: "Re: A quick idea for {{business_name}}",
    body: "Hi {{first_name}}, just floating this back to the top of your inbox in case it got buried.",
    enabled: true,
  },
  {
    id: "f_2",
    label: "Follow-up #2",
    delayDays: 7,
    subject: "One mockup for {{business_name}}",
    body: "Hi {{first_name}}, I sketched a quick homepage concept for {{business_name}} — want me to send it over?",
    enabled: true,
  },
  {
    id: "f_3",
    label: "Follow-up #3",
    delayDays: 14,
    subject: "Closing the loop",
    body: "Hi {{first_name}}, I'll leave it there — happy to help any time if {{service}} becomes a priority.",
    enabled: false,
  },
];

export const mockDashboardStats = {
  totalLeads: 248,
  analyzed: 213,
  emailsSent: 127,
  replies: 18,
  interested: 6,
  meetings: 2,
};

export const mockOpportunityBreakdown = [
  { label: "No Website", value: 68, key: "NO_WEBSITE" },
  { label: "Outdated Website", value: 54, key: "OUTDATED" },
  { label: "Mobile Issues", value: 39, key: "POOR_MOBILE" },
  { label: "Performance Issues", value: 27, key: "SLOW" },
  { label: "Good Website", value: 42, key: "GOOD" },
  { label: "Skipped", value: 18, key: "SKIP" },
];

const seriesFor = (days: number) =>
  Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86_400_000);
    const base = 4 + ((i * 7) % 11);
    return {
      date: d.toISOString().slice(0, 10),
      sent: base,
      replies: Math.max(0, Math.round(base * 0.16)),
      interested: Math.max(0, Math.round(base * 0.06)),
    };
  });

export const mockAnalytics = (range: AnalyticsData["range"]): AnalyticsData => {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const series = seriesFor(days);
  const sent = series.reduce((a, p) => a + p.sent, 0);
  const replies = series.reduce((a, p) => a + p.replies, 0);
  const interested = series.reduce((a, p) => a + p.interested, 0);
  return {
    range,
    emailsSent: sent,
    deliveryRate: 0.972,
    replyRate: sent ? replies / sent : 0,
    positiveReplyRate: replies ? interested / replies : 0,
    meetingRate: sent ? 2 / sent : 0,
    series,
    byCountry: [
      { country: "New Zealand", sent: Math.round(sent * 0.38), replyRate: 0.19 },
      { country: "Australia", sent: Math.round(sent * 0.22), replyRate: 0.14 },
      { country: "United Kingdom", sent: Math.round(sent * 0.18), replyRate: 0.12 },
      { country: "United States", sent: Math.round(sent * 0.12), replyRate: 0.09 },
      { country: "Canada", sent: Math.round(sent * 0.06), replyRate: 0.11 },
      { country: "UAE", sent: Math.round(sent * 0.04), replyRate: 0.08 },
    ],
    byOpportunity: [
      { opportunity: "New Website", sent: Math.round(sent * 0.42), replyRate: 0.21 },
      { opportunity: "Redesign", sent: Math.round(sent * 0.28), replyRate: 0.15 },
      { opportunity: "Mobile", sent: Math.round(sent * 0.18), replyRate: 0.12 },
      { opportunity: "Performance", sent: Math.round(sent * 0.12), replyRate: 0.1 },
    ],
    campaignComparison: mockCampaigns.map((c) => ({ name: c.name, sent: c.sent, replies: c.replies })),
    insights: [
      "New website leads generated the highest reply rate.",
      "NZ leads are currently outperforming other markets.",
      "Emails approved within 24 hours of generation reply ~30% more often.",
    ],
  };
};
