"use client";

import { Users, Zap, DollarSign, TrendingUp } from "lucide-react";
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
  const proCount = (stats?.planCounts?.pro ?? 0) + (stats?.planCounts?.business ?? 0);

  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-top">
          <span>Total Users</span>
          <Users size={17} />
        </div>
        <div className="stat-number">{formatNumber(totalUsers)}</div>
        <div className="stat-foot">
          <span className="stat-positive">
            <TrendingUp size={13} /> {proCount} on paid plans
          </span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Total Generations</span>
          <Zap size={17} />
        </div>
        <div className="stat-number">{formatNumber(generations)}</div>
        <div className="stat-foot">
          <span className="stat-positive">Across all tools</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Credits Consumed</span>
          <DollarSign size={17} />
        </div>
        <div className="stat-number">{formatNumber(creditsUsed)}</div>
        <div className="stat-foot">
          <span className="stat-positive">Lifetime usage</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Active Generators</span>
          <Zap size={17} />
        </div>
        <div className="stat-number">7 / 7</div>
        <div className="stat-foot">
          <span className="stat-positive">All operational</span>
        </div>
      </div>
    </section>
  );
}
