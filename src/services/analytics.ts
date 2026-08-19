import { delay } from "./api";
import type { ActivityEvent, AnalyticsData, Notification } from "@/types";

/** GET /api/analytics?range=30d */
export async function getAnalytics(range: AnalyticsData["range"]): Promise<AnalyticsData> {
  await delay(300);
  return {
    range,
    emailsSent: 0,
    deliveryRate: 0,
    replyRate: 0,
    positiveReplyRate: 0,
    meetingRate: 0,
    byCountry: [],
    byOpportunity: [],
    campaignComparison: [],
    insights: ["Not enough data to generate insights yet."],
    series: []
  };
}

/** GET /api/dashboard */
export async function getDashboardSummary() {
  await delay(280);
  return {
    stats: {
      analyzed: 0,
      totalLeads: 0,
      emailsSent: 0,
      replies: 0,
      interested: 0,
    },
    opportunityBreakdown: [],
    series: [],
  };
}

/** GET /api/activity */
export async function getActivity(): Promise<ActivityEvent[]> {
  await delay(240);
  return [];
}

/** GET /api/notifications */
export async function getNotifications(): Promise<Notification[]> {
  await delay(180);
  return [];
}
