import type { PublicUser } from "./types";

export type AdminStats = {
  totalUsers: number;
  totalGenerations: number;
  totalCreditsUsed: number;
  planCounts: Record<string, number>;
  recentActivity: Array<{
    time: string;
    action: string;
    user: string;
    status: string;
  }>;
};

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status}).`);
  }
  return data;
}

export const adminApi = {
  getUsers: async (): Promise<{ users: PublicUser[] }> =>
    parseJson(await fetch("/api/admin/users", { cache: "no-store" })),

  getStats: async (): Promise<AdminStats> =>
    parseJson(await fetch("/api/admin/stats", { cache: "no-store" })),

  getPlans: async (): Promise<{
    plans: Array<{
      id: string;
      name: string;
      price: number;
      period: string;
      credits: number;
      features: string[];
      stripePriceId?: string;
    }>;
  }> => parseJson(await fetch("/api/admin/plans", { cache: "no-store" })),

  savePlans: async (
    plans: Array<{
      id: string;
      name: string;
      price: number;
      credits: number;
      stripePriceId?: string;
    }>,
  ): Promise<{ plans: unknown }> =>
    parseJson(
      await fetch("/api/admin/plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plans }),
      }),
    ),

  updateUser: async (
    userId: string,
    updates: { plan?: string; credits?: number; role?: string },
  ): Promise<{ users: PublicUser[] }> =>
    parseJson(
      await fetch(`/api/admin/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates }),
      }),
    ),

  deleteUser: async (userId: string): Promise<{ users: PublicUser[] }> =>
    parseJson(
      await fetch(`/api/admin/users?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE",
      }),
    ),
};
