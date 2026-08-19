/**
 * Central API abstraction.
 *
 * Today every service resolves from local demo data (src/data/mock.ts).
 * When the Node/Express + Supabase backend exists, set VITE_API_BASE_URL and
 * flip USE_MOCK_DATA to false — the UI does not need to change.
 */

export const API_BASE_URL: string = import.meta.env['VITE_API_BASE_URL'] ?? "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

/** Simulated latency so loading/skeleton states are exercised in the demo. */
export const delay = (ms = 320) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Thin fetch wrapper for the future backend.
 * Auth tokens are attached by the backend session cookie / Supabase client —
 * never embed API keys or service-role secrets in frontend code.
 */
import { auth } from "../lib/firebase";

/**
 * Thin fetch wrapper for the future backend.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> ?? {}),
  };

  await auth.authStateReady(); // Ensure auth is initialized before checking currentUser
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    try {
      const parsed = JSON.parse(errorText);
      throw new ApiError(parsed.error?.message || errorText, response.status);
    } catch {
      throw new ApiError(errorText, response.status);
    }
  }
  return (await response.json()).data as T;
}

/** Query keys shared across TanStack Query hooks. */
export const queryKeys = {
  leads: ["leads"] as const,
  lead: (id: string) => ["leads", id] as const,
  campaigns: ["campaigns"] as const,
  campaign: (id: string) => ["campaigns", id] as const,
  emails: ["emails"] as const,
  email: (id: string) => ["emails", id] as const,
  activity: ["activity"] as const,
  notifications: ["notifications"] as const,
  analytics: (range: string) => ["analytics", range] as const,
  dashboard: ["dashboard"] as const,
  gmail: ["gmail"] as const,
  settings: (scope: string) => ["settings", scope] as const,
};
