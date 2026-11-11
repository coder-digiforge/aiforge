"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import type { PublicUser } from "@/lib/types";

type Props = {
  user: PublicUser;
  children: ReactNode;
};

export function DashboardShell({ user, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <main className="dashboard-shell">
      <Sidebar user={user} open={open} onClose={() => setOpen(false)} />
      <section className="dash-main">
        <Topbar user={user} onOpenMenu={() => setOpen(true)} />
        <div className="dash-content">{children}</div>
      </section>
    </main>
  );
}
