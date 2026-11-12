"use client";

import { useState, type ReactNode } from "react";
import type { PublicUser } from "@/lib/types";
import AdminSidebar from "./sidebar";
import AdminTopbar from "./topbar";

type Props = {
  user: PublicUser;
  children: ReactNode;
};

export function AdminShell({ user, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <main className="dashboard-shell admin-shell">
      <AdminSidebar user={user} open={open} onClose={() => setOpen(false)} />
      <section className="dash-main">
        <AdminTopbar user={user} onOpenMenu={() => setOpen(true)} />
        <div className="dash-content">{children}</div>
      </section>
    </main>
  );
}
