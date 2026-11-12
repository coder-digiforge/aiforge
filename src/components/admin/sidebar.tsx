"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
  X,
} from "lucide-react";
import type { PublicUser } from "@/lib/types";

const menu = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Plans", href: "/admin/plans", icon: CreditCard },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = {
  user: PublicUser;
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ user, open, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? "visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-mobile-head">
          <Link href="/admin" className="brand" onClick={onClose}>
            <span className="brand-mark">
              <Shield size={17} />
            </span>
            Admin
          </Link>
          <button className="icon-button" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <Link href="/admin" className="brand sidebar-brand">
          <span className="brand-mark">
            <Shield size={17} />
          </span>
          Admin
        </Link>

        <div className="workspace-label">CONTROL</div>
        <div className="workspace-switch admin-workspace">
          <div className="workspace-avatar">{initials || "A"}</div>
          <div>
            <b>{user.name}</b>
            <small>Administrator</small>
          </div>
        </div>

        <div className="nav-label">MENU</div>
        {menu.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            onClick={onClose}
            className={`nav-item ${isActive(pathname, href) ? "selected" : ""}`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="profile-avatar">{initials || "A"}</div>
            <div>
              <b>{user.name}</b>
              <small>{user.email}</small>
            </div>
            <button
              onClick={logout}
              disabled={busy}
              aria-label="Sign out"
              title="Sign out"
              className="profile-logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
