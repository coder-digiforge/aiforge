"use client";

import { DollarSign, TrendingUp, Users, Zap } from "lucide-react";
import type { AdminStats as AdminStatsData } from "@/lib/admin-api";

interface Props {
  stats: AdminStatsData | null;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export default function AdminStats({ stats }: Props) {
  const totalUsers = stats?.totalUsers ?? 0;
  const creditsUsed = stats?.totalCreditsUsed ?? 0;
  const generations = stats?.totalGenerations ?? 0;
  const paid =
    (stats?.planCounts?.pro ?? 0) + (stats?.planCounts?.business ?? 0);

  return (
    <section className="stats-grid admin-stats">
      <div className="stat-card">
        <div className="stat-top">
          <span>Users</span>
          <Users size={17} />
        </div>
        <div className="stat-number">{formatNumber(totalUsers)}</div>
        <div className="stat-foot">
          <span className="stat-positive">
            <TrendingUp size={13} /> {paid} on paid plans
          </span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Generations</span>
          <Zap size={17} />
        </div>
        <div className="stat-number">{formatNumber(generations)}</div>
        <div className="stat-foot">
          <span className="stat-positive">All tools</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Credits used</span>
          <DollarSign size={17} />
        </div>
        <div className="stat-number">{formatNumber(creditsUsed)}</div>
        <div className="stat-foot">
          <span className="stat-positive">Lifetime usage</span>
        </div>
      </div>
    </section>
  );
}
