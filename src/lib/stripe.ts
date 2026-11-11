import Stripe from "stripe";
import { readDb, mutateDb } from "./store";
import type { PlanConfig } from "./types";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

export const DEFAULT_PLANS: PlanConfig[] = [
  {
    id: "free",
    name: "Free starter",
    price: 0,
    period: "forever",
    credits: 120,
    features: ["All 7 generators", "History library", "Demo AI mode", "Local workspace"],
  },
  {
    id: "pro",
    name: "Creator",
    price: 1900,
    period: "month",
    credits: 1000,
    features: ["Priority generation", "Higher output limits", "Email support", "Commercial use"],
    stripePriceId: process.env.STRIPE_PRICE_PRO,
  },
  {
    id: "business",
    name: "Business",
    price: 4900,
    period: "month",
    credits: 5000,
    features: ["Team-ready limits", "Usage reporting", "Priority support", "Custom templates"],
    stripePriceId: process.env.STRIPE_PRICE_BUSINESS,
  },
];

function envPriceOverrides(plans: PlanConfig[]): PlanConfig[] {
  return plans.map((p) => {
    if (p.id === "pro" && process.env.STRIPE_PRICE_PRO) {
      return { ...p, stripePriceId: process.env.STRIPE_PRICE_PRO };
    }
    if (p.id === "business" && process.env.STRIPE_PRICE_BUSINESS) {
      return { ...p, stripePriceId: process.env.STRIPE_PRICE_BUSINESS };
    }
    return p;
  });
}

export async function getPlans(): Promise<PlanConfig[]> {
  const db = await readDb();
  const stored = db.plans && db.plans.length ? db.plans : DEFAULT_PLANS;
  return envPriceOverrides(stored.map((p) => ({ ...p })));
}

export async function savePlans(
  updates: Array<Pick<PlanConfig, "id" | "name" | "price" | "credits"> & { stripePriceId?: string }>,
): Promise<PlanConfig[]> {
  return mutateDb((db) => {
    const current = db.plans && db.plans.length ? db.plans : DEFAULT_PLANS.map((p) => ({ ...p }));
    db.plans = current.map((plan) => {
      const patch = updates.find((u) => u.id === plan.id);
      if (!patch) return plan;
      return {
        ...plan,
        name: patch.name,
        price: patch.price,
        credits: patch.credits,
        stripePriceId: patch.stripePriceId ?? plan.stripePriceId,
      };
    });
    return db.plans;
  });
}

export async function createCheckoutSession(userId: string, planId: string, quantity?: number) {
  const plans = await getPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) throw new Error("Unknown plan");
  if (!plan.stripePriceId) throw new Error("This plan is not purchasable.");
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local.");
  }

  return getStripe().checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: quantity ?? 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
    metadata: { userId, planId },
    subscription_data: { metadata: { userId, planId } },
  });
}