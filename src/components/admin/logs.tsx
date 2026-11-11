"use client";

import type { AdminStats } from "@/lib/admin-api";

interface Props {
  activity: AdminStats["recentActivity"];
}

export default function AdminLogs({ activity }: Props) {
  return (
    <section className="settings-card">
      <div className="section-title-row">
        <h2>Recent Activity</h2>
      </div>
      {activity.length === 0 ? (
        <p className="text-slate-500">No activity yet.</p>
      ) : (
        <div className="admin-logs">
          {activity.map((log, idx) => (
            <div key={idx} className="log-item">
              <span className="log-time">{log.time}</span>
              <span className="log-action">{log.action}</span>
              <span className="log-user">{log.user}</span>
              <span className="log-status">{log.status}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
