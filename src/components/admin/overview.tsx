"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminStats as AdminStatsData } from "@/lib/admin-api";
import { errorMessage } from "@/lib/errors";
import AdminStats from "./stats";
import AdminLogs from "./logs";

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<AdminStatsData | null>(null);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      setError(errorMessage(err, "Failed to load admin data."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  if (loading) {
    return <p className="admin-muted">Loading overview...</p>;
  }

  if (error) {
    return (
      <div className="admin-empty">
        <p className="text-red-400">{error}</p>
        <button type="button" className="button" onClick={refresh}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="page-title">Overview</h1>
      <p className="page-subtitle">Users, usage and recent activity</p>
      <AdminStats stats={stats} />
      <AdminLogs activity={stats?.recentActivity ?? []} />
    </>
  );
}
