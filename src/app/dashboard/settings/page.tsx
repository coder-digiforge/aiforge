import { redirect } from "next/navigation";
import {
  Check,
  CreditCard,
  KeyRound,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { isLiveAiEnabled } from "@/lib/ai";
import { getPlans } from "@/lib/stripe";
import { readDb } from "@/lib/store";
import UpgradeButton from "@/components/dashboard/upgrade-button";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { success, canceled } = await searchParams;
  const db = await readDb();
  const historyCount = db.history.filter((h) => h.userId === user.id).length;
  const live = isLiveAiEnabled();
  const plans = await getPlans();

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="section-kicker">ACCOUNT</div>
          <h1>
            Settings <span>✦</span>
          </h1>
          <p>Profile, plan and provider status for this workspace.</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="settings-card">
          <div className="section-title-row">
            <h2>
              <UserRound size={16} /> Profile
            </h2>
          </div>
          <dl className="profile-fields">
            <div>
              <dt>
                <UserRound size={13} /> Name
              </dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>
                <Mail size={13} /> Email
              </dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>
                <ShieldCheck size={13} /> Account ID
              </dt>
              <dd className="mono">{user.id}</dd>
            </div>
            <div>
              <dt>
                <Zap size={13} /> Credits
              </dt>
              <dd>
                {user.credits} available · {historyCount} generations
              </dd>
            </div>
          </dl>
        </section>

        <section className="settings-card">
          <div className="section-title-row">
            <h2>
              <KeyRound size={16} /> AI provider
            </h2>
            <span className={live ? "badge-live" : "badge-demo"}>{live ? "Live" : "Demo"}</span>
          </div>
          <p className="settings-copy">
            {live
              ? "Live AI is active. New generations use the connected provider."
              : "Demo mode is active. Generations return sample output until a live provider is connected."}
          </p>
          <ul className="settings-checklist">
            <li>
              <Check size={14} /> Secure server-side generation
            </li>
            <li>
              <Check size={14} /> Credits deducted per run
            </li>
            <li>
              <Check size={14} /> History saved to your workspace
            </li>
          </ul>
        </section>
      </div>

      <section className="settings-plans">
        <div className="section-title-row plans-heading">
          <div>
            <span className="section-kicker">BILLING</span>
            <h2>Plans</h2>
          </div>
          <span className="ai-chip">
            <CreditCard size={13} /> Secure checkout
          </span>
        </div>

        {success && (
          <p className="plans-status success">
            Payment successful. Your plan will update shortly.
          </p>
        )}
        {canceled && <p className="plans-status">Checkout canceled — no charge was made.</p>}

        <div className="plans-grid">
          {plans.map((plan) => {
            const current = plan.id === user.plan;
            const price = Math.round(plan.price / 100);
            return (
              <div key={plan.id} className={`plan-option ${current ? "current" : ""}`}>
                <div className="plan-option-top">
                  <b>{plan.name}</b>
                  {current && <span className="badge-live">Current</span>}
                </div>
                <div className="plan-price">
                  ${price}
                  <small>{plan.period === "month" ? "/month" : ""}</small>
                </div>
                <div className="plan-credits">{plan.credits.toLocaleString("en-US")} credits</div>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <Check size={13} /> {f}
                    </li>
                  ))}
                </ul>
                {current ? (
                  <button className="btn-neon-outline" disabled>
                    Current plan
                  </button>
                ) : plan.id === "free" ? (
                  <button className="button" disabled>
                    Included
                  </button>
                ) : plan.stripePriceId ? (
                  <UpgradeButton planId={plan.id} label={`Upgrade to ${plan.name}`} />
                ) : (
                  <button className="button" disabled>
                    Coming soon
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="dash-footer">
        <span>© 2026 AIForge</span>
        <span>
          Made for ideas in motion <Sparkles size={12} />
        </span>
      </footer>
    </>
  );
}
