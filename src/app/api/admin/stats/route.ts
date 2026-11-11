import { NextResponse } from "next/server";
import { getSessionUser, getUserStats } from "@/lib/auth";
import { readDb } from "@/lib/store";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const stats = await getUserStats();
  const db = await readDb();

  const recent = [
    ...db.users.map((u) => ({
      ts: u.createdAt,
      action: "User registered",
      user: u.email,
      status: u.emailVerified ? "success" : "pending",
    })),
    ...db.history.map((h) => ({
      ts: h.createdAt,
      action: h.demo ? "Demo generation" : "AI generation",
      user: db.users.find((u) => u.id === h.userId)?.email ?? "unknown",
      status: "success",
    })),
  ]
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 12)
    .map(({ ts, action, user: who, status }) => ({
      time: new Date(ts).toLocaleString(),
      action,
      user: who,
      status,
    }));

  return NextResponse.json({ ...stats, recentActivity: recent });
}
