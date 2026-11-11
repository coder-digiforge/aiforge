import { NextRequest, NextResponse } from "next/server";
import { errorMessage } from "@/lib/errors";
import {
  getSessionUser,
  listUsers,
  updateUserPlan,
  setCredits,
  updateUserRole,
  deleteUser,
} from "@/lib/auth";
import type { PlanId, RoleId } from "@/lib/types";

const PLAN_IDS: PlanId[] = ["free", "pro", "business"];
const ROLE_IDS: RoleId[] = ["user", "admin"];

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }
  const users = await listUsers();
  return NextResponse.json({ users });
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  let body: { userId?: string; plan?: string; credits?: number; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { userId, plan, credits, role } = body;
  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  try {
    if (plan !== undefined) {
      if (!PLAN_IDS.includes(plan as PlanId)) {
        return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
      }
      await updateUserPlan(userId, plan as PlanId, credits);
    } else if (credits !== undefined) {
      if (typeof credits !== "number") {
        return NextResponse.json({ error: "credits must be a number." }, { status: 400 });
      }
      await setCredits(userId, credits);
    } else if (role !== undefined) {
      if (!ROLE_IDS.includes(role as RoleId)) {
        return NextResponse.json({ error: "Unknown role." }, { status: 400 });
      }
      await updateUserRole(userId, role as RoleId);
    } else {
      return NextResponse.json({ error: "No valid updates provided." }, { status: 400 });
    }
    const users = await listUsers();
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err, "Request failed.") }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }
  try {
    await deleteUser(userId);
    const users = await listUsers();
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err, "Request failed.") }, { status: 400 });
  }
}