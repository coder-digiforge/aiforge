"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { generators } from "@/config/generators";
import type { PublicUser } from "@/lib/types";

const menu = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Generators", href: "/dashboard/generators", icon: WandSparkles },
  { label: "History", href: "/dashboard/history", icon: Clock3 },
];

const prefs = [{ label: "Settings", href: "/dashboard/settings", icon: Settings }];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = {
  user: PublicUser;
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ user, open, onClose }: Props) {
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
          <Link href="/" className="brand">
            <span className="brand-mark">
              <Sparkles size={17} />
            </span>
            AI<span>Forge</span>
          </Link>
          <button className="icon-button" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <Link href="/" className="brand sidebar-brand">
          <span className="brand-mark">
            <Sparkles size={17} />
          </span>
          AI<span>Forge</span>
        </Link>

        <div className="workspace-label">
          WORKSPACE <ChevronDown size={13} />
        </div>
        <div className="workspace-switch">
          <div className="workspace-avatar">{initials || "A"}</div>
          <div>
            <b>{user.name}</b>
            <small>{user.plan === "free" ? "Free workspace" : `${user.plan} workspace`}</small>
          </div>
          <ChevronDown size={14} />
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
            {label === "AI Generators" && <span className="nav-count">{generators.length}</span>}
          </Link>
        ))}

        <div className="nav-label space-top">PREFERENCES</div>
        {prefs.map(({ label, href, icon: Icon }) => (
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
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Zap size={16} />
            </div>
            <b>Unlock your full potential</b>
            <p>Get more credits and create without limits.</p>
            <Link href="/dashboard/settings">
              Explore plans <ArrowRight size={14} />
            </Link>
          </div>

          <div className="profile">
            <div className="profile-avatar">{initials || "U"}</div>
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
