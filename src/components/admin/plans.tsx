"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { errorMessage } from "@/lib/errors";

type Plan = {
  id: string;
  name: string;
  price: number;
  period: string;
  credits: number;
  features: string[];
  stripePriceId?: string;
};

const EMPTY_FORM = { name: "", price: 0, credits: 0, stripePriceId: "" };

export default function PlanEditor() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getPlans();
      setPlans(res.plans);
    } catch (err) {
      setError(errorMessage(err, "Failed to load plans."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(plan: Plan) {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      price: plan.price,
      credits: plan.credits,
      stripePriceId: plan.stripePriceId ?? "",
    });
    setNotice("");
    setError("");
  }

  async function save() {
    if (!editingId) return;
    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("Plan name must be at least 2 characters.");
      return;
    }
    if (!Number.isFinite(form.price) || form.price < 0) {
      setError("Price must be a non-negative number.");
      return;
    }
    if (!Number.isFinite(form.credits) || form.credits < 0) {
      setError("Credits must be a non-negative number.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await adminApi.savePlans([
        {
          id: editingId,
          name: form.name.trim(),
          price: Math.round(form.price),
          credits: Math.round(form.credits),
          stripePriceId: form.stripePriceId.trim() || undefined,
        },
      ]);
      setPlans(res.plans as Plan[]);
      setEditingId(null);
      setNotice("Plan saved.");
    } catch (err) {
      setError(errorMessage(err, "Save failed."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="settings-card">
        <p className="text-slate-500">Loading plans...</p>
      </section>
    );
  }

  return (
    <section className="settings-card">
      <div className="section-title-row">
        <h2>Plans</h2>
        {notice && <span className="badge-live">{notice}</span>}
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <div className="plans-grid">
        {plans.map((p) => (
          <div key={p.id} className={`plan-option ${editingId === p.id ? "current" : ""}`}>
            <div className="plan-option-top">
              <b>{p.name}</b>
              {p.id !== "free" && <span className="badge-demo">{p.id}</span>}
            </div>
            <div className="plan-price">
              ${Math.round(p.price / 100)}
              <small>{p.period === "month" ? "/month" : ""}</small>
            </div>
            <div className="plan-credits">{p.credits} credits</div>

            {editingId === p.id ? (
              <>
                <div className="form-field">
                  <label>Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Price (cents / month)</label>
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
                <div className="form-field">
                  <label>Credits</label>
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={form.credits}
                    onChange={(e) => setForm({ ...form, credits: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
                {p.id !== "free" && (
                  <div className="form-field">
                    <label>Stripe Price ID</label>
                    <input
                      className="input"
                      placeholder="price_..."
                      value={form.stripePriceId}
                      onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })}
                    />
                  </div>
                )}
                <div className="filter-row">
                  <button className="button" onClick={save} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button className="button" onClick={() => setEditingId(null)} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                {p.id !== "free" && (
                  <button className="button" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="plans-note">
        Set <code>STRIPE_PRICE_PRO</code> and <code>STRIPE_PRICE_BUSINESS</code> in .env.local (or edit the
        Stripe Price ID here) to enable live Checkout. Webhook events must point to{" "}
        <code>/api/stripe/webhook</code>.
      </div>
    </section>
  );
}
