import { NextRequest, NextResponse } from "next/server";
import { getStripe, getPlans } from "@/lib/stripe";
import { mutateDb, readDb } from "@/lib/store";
import type { PlanId } from "@/lib/types";
import { errorMessage } from "@/lib/errors";

export const runtime = "nodejs";

const MAX_PROCESSED_EVENTS = 100;

async function markProcessed(eventId: string): Promise<boolean> {
  return mutateDb((db) => {
    const list = db.stripeEvents ?? [];
    if (list.includes(eventId)) return false;
    db.stripeEvents = [...list, eventId].slice(-MAX_PROCESSED_EVENTS);
    return true;
  });
}

async function applyPlanToUser(userId: string, planId: PlanId, extra: {
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}) {
  const plans = await getPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) throw new Error(`Unknown plan: ${planId}`);

  await mutateDb((db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error(`User not found: ${userId}`);
    user.plan = planId;
    user.credits += plan.credits;
    if (extra.stripeCustomerId) user.stripeCustomerId = extra.stripeCustomerId;
    if (extra.stripeSubscriptionId) user.stripeSubscriptionId = extra.stripeSubscriptionId;
    user.updatedAt = new Date().toISOString();
  });
}

async function downgradeToFree(userId: string) {
  await mutateDb((db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) return;
    user.plan = "free";
    user.stripeSubscriptionId = undefined;
    user.updatedAt = new Date().toISOString();
  });
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature." }, { status: 400 });
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not configured." }, { status: 500 });
  }

  const payload = await request.text();

  let event: Awaited<ReturnType<ReturnType<typeof getStripe>["webhooks"]["constructEvent"]>>;
  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", errorMessage(err, "Webhook error."));
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const fresh = await markProcessed(event.id);
  if (!fresh) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId as PlanId | undefined;
        if (!userId || !planId) break;

        const existing = await readDb();
        const user = existing.users.find((u) => u.id === userId);
        if (!user) break;

        await applyPlanToUser(userId, planId, {
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : session.customer?.id,
          stripeSubscriptionId:
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.id,
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        if (invoice.billing_reason !== "subscription_cycle") break;
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;
        if (!subscriptionId) break;

        const db = await readDb();
        const user = db.users.find((u) => u.stripeSubscriptionId === subscriptionId);
        if (!user) break;

        await applyPlanToUser(user.id, user.plan, {});
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const db = await readDb();
        const user = db.users.find((u) => u.stripeSubscriptionId === subscription.id);
        if (!user) break;
        await downgradeToFree(user.id);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true, eventType: event.type });
  } catch (err) {
    console.error("Stripe webhook handling error:", err);
    return NextResponse.json({ error: errorMessage(err, "Webhook handler failed.") }, { status: 500 });
  }
}
