import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { errorMessage } from "@/lib/errors";
import { getPlans, savePlans } from "@/lib/stripe";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }
  return NextResponse.json({ plans: await getPlans() });
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  let body: {
    plans?: Array<{
      id?: string;
      name?: string;
      price?: number;
      credits?: number;
      stripePriceId?: string;
    }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates = body.plans;
  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ error: "plans array is required." }, { status: 400 });
  }

  for (const p of updates) {
    if (!p.id || !["pro", "business"].includes(p.id)) {
      return NextResponse.json({ error: "Only paid plans can be updated." }, { status: 400 });
    }
    if (typeof p.name !== "string" || p.name.trim().length < 2) {
      return NextResponse.json({ error: "Plan name must be at least 2 characters." }, { status: 400 });
    }
    if (typeof p.price !== "number" || !Number.isFinite(p.price) || p.price < 0) {
      return NextResponse.json({ error: "Plan price must be a non-negative number." }, { status: 400 });
    }
    if (typeof p.credits !== "number" || !Number.isFinite(p.credits) || p.credits < 0) {
      return NextResponse.json({ error: "Plan credits must be a non-negative number." }, { status: 400 });
    }
  }

  try {
    await savePlans(
      updates.map((p) => ({
        id: p.id as "pro" | "business",
        name: p.name!.trim(),
        price: Math.round(p.price!),
        credits: Math.round(p.credits!),
        stripePriceId: typeof p.stripePriceId === "string" ? p.stripePriceId.trim() : undefined,
      })),
    );
    return NextResponse.json({ plans: await getPlans() });
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err, "Request failed.") }, { status: 400 });
  }
}
