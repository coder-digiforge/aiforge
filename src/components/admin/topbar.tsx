"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, Shield } from "lucide-react";
import type { PublicUser } from "@/lib/types";

function breadcrumb(pathname: string): string {
  if (pathname === "/admin") return "Overview";
  if (pathname.startsWith("/admin/users")) return "Users";
  if (pathname.startsWith("/admin/plans")) return "Plans";
  return "Admin";
}

type Props = {
  user: PublicUser;
  onOpenMenu: () => void;
};

export default function AdminTopbar({ user, onOpenMenu }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function logout() {
    setMenuOpen(false);
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
    <header className="dash-topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-menu-btn" onClick={onOpenMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="breadcrumbs">
          Admin <span>/</span> <b>{breadcrumb(pathname)}</b>
        </div>
      </div>

      <div className="topbar-right">
        <span className="demo-pill admin-pill">
          <Shield size={12} /> ADMIN
        </span>

        <div className="top-account" ref={menuRef}>
          <button
            className="top-avatar-button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Account menu"
            aria-expanded={menuOpen}
          >
            <div className="top-avatar">{initials || "A"}</div>
            <ChevronDown size={14} />
          </button>

          {menuOpen && (
            <div className="account-menu">
              <div className="account-menu-head">
                <b>{user.name}</b>
                <small>{user.email}</small>
              </div>
              <button onClick={logout}>
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
