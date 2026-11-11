import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { errorMessage } from "@/lib/errors";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { planId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const planId = body.planId;
  if (!planId || !["pro", "business"].includes(planId)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  try {
    const session = await createCheckoutSession(user.id, planId as "pro" | "business");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: errorMessage(err, "Checkout failed.") },
      { status: 502 },
    );
  }
}