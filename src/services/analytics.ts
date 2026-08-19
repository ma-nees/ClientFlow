import { mockActivity, mockAnalytics, mockDashboardStats, mockNotifications, mockOpportunityBreakdown } from "@/data/mock";
import type { ActivityEvent, AnalyticsData, Notification } from "@/types";
import { delay } from "./api";

/** GET /api/analytics?range=30d */
export async function getAnalytics(range: AnalyticsData["range"]): Promise<AnalyticsData> {
  // TODO(backend): return request<AnalyticsData>(`/api/analytics?range=${range}`)
  await delay(300);
  return mockAnalytics(range);
}

/** GET /api/dashboard */
export async function getDashboardSummary() {
  await delay(280);
  return {
    stats: mockDashboardStats,
    opportunityBreakdown: mockOpportunityBreakdown,
    series: mockAnalytics("30d").series.slice(-14),
  };
}

/** GET /api/activity */
export async function getActivity(): Promise<ActivityEvent[]> {
  await delay(240);
  return mockActivity;
}

/** GET /api/notifications */
export async function getNotifications(): Promise<Notification[]> {
  await delay(180);
  const readTimestamp = Number(localStorage.getItem("notifications_read_timestamp") || 0);
  return mockNotifications.map(n => ({
    ...n,
    read: n.read || (new Date(n.at).getTime() <= readTimestamp)
  }));
}
