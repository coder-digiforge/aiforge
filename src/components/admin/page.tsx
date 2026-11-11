"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminApi, type AdminStats as AdminStatsData } from "@/lib/admin-api";
import { errorMessage } from "@/lib/errors";
import AdminStats from "./stats";
import UserList from "./users";
import PlanEditor from "./plans";
import AdminLogs from "./logs";

export default function DashboardAdminPage() {
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
    return (
      <div className="admin-loading">
        <p className="text-slate-500">Loading admin panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-loading">
        <span className="text-red-400">{error}</span>
        <Link href="/dashboard" className="button">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="dash-content">
      <h1 className="page-title">Admin Panel</h1>
      <p className="page-subtitle">Manage users, plans and usage</p>

      <AdminStats stats={stats} />

      <div className="admin-grid">
        <UserList />
        <PlanEditor />
        <AdminLogs activity={stats?.recentActivity ?? []} />
      </div>
    </div>
  );
}
