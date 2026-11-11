import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { readDb } from "@/lib/store";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const db = await readDb();
  const history = db.history.filter((h) => h.userId === user.id);
  return NextResponse.json({ history });
}
