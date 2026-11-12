"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, Sparkles, UserRound } from "lucide-react";
import type { PublicUser } from "@/lib/types";

function breadcrumb(pathname: string): string[] {
  if (pathname === "/dashboard") return ["Overview"];
  if (pathname.startsWith("/dashboard/generators/")) {
    const id = pathname.split("/")[3] ?? "";
    const names: Record<string, string> = {
      writer: "AI Writer",
      image: "Image Generator",
      code: "Code Assistant",
      seo: "SEO Studio",
      social: "Social Creator",
      "product-copy": "Product Copy",
      chat: "AI Chat",
    };
    return ["AI Generators", names[id] ?? id];
  }
  if (pathname.startsWith("/dashboard/generators")) return ["AI Generators"];
  if (pathname.startsWith("/dashboard/history")) return ["History"];
  if (pathname.startsWith("/dashboard/settings")) return ["Settings"];
  return ["Workspace"];
}

type Props = {
  user: PublicUser;
  onOpenMenu: () => void;
};

export default function Topbar({ user, onOpenMenu }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const crumbs = breadcrumb(pathname);
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
          Workspace <span>/</span> <b>{crumbs.join(" / ")}</b>
        </div>
      </div>

      <div className="topbar-right">
        <span className="demo-pill">
          <i /> {user.credits} CREDITS
        </span>

        <div className="top-account" ref={menuRef}>
          <button
            className="top-avatar-button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Account menu"
            aria-expanded={menuOpen}
          >
            <div className="top-avatar">{initials || "U"}</div>
            <ChevronDown size={14} />
          </button>

          {menuOpen && (
            <div className="account-menu">
              <div className="account-menu-head">
                <b>{user.name}</b>
                <small>{user.email}</small>
              </div>
              <Link href="/dashboard/settings" onClick={() => setMenuOpen(false)}>
                <UserRound size={15} /> Settings
              </Link>
              <button onClick={logout}>
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <span className="topbar-brand-mobile" aria-hidden="true">
        <Sparkles size={14} />
      </span>
    </header>
  );
}
