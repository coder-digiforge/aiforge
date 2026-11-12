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

type PlanForm = {
  name: string;
  priceDollars: string;
  credits: string;
  stripePriceId: string;
};

const EMPTY_FORM: PlanForm = {
  name: "",
  priceDollars: "0",
  credits: "0",
  stripePriceId: "",
};

export default function PlanEditor() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getPlans();
      setPlans(res.plans.filter((p) => p.id !== "free"));
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
      priceDollars: String(plan.price / 100),
      credits: String(plan.credits),
      stripePriceId: plan.stripePriceId ?? "",
    });
    setNotice("");
    setError("");
  }

  async function save() {
    if (!editingId) return;

    const name = form.name.trim();
    const priceDollars = Number(form.priceDollars);
    const credits = Number(form.credits);

    if (name.length < 2) {
      setError("Plan name must be at least 2 characters.");
      return;
    }
    if (!Number.isFinite(priceDollars) || priceDollars < 0) {
      setError("Enter a valid price in dollars.");
      return;
    }
    if (!Number.isFinite(credits) || credits < 0) {
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
          name,
          price: Math.round(priceDollars * 100),
          credits: Math.round(credits),
          stripePriceId: form.stripePriceId.trim() || undefined,
        },
      ]);
      setPlans((res.plans as Plan[]).filter((p) => p.id !== "free"));
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
      <section className="settings-card admin-panel-card">
        <p className="admin-muted">Loading plans...</p>
      </section>
    );
  }

  return (
    <section className="settings-card admin-panel-card">
      <div className="section-title-row">
        <h2>Paid plans</h2>
        {notice && <span className="badge-live">{notice}</span>}
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <div className="plans-grid">
        {plans.map((p) => (
          <div key={p.id} className={`plan-option ${editingId === p.id ? "current" : ""}`}>
            <div className="plan-option-top">
              <b>{p.name}</b>
              <span className="badge-demo">{p.id}</span>
            </div>
            <div className="plan-price">
              ${Math.round(p.price / 100)}
              <small>{p.period === "month" ? "/month" : ""}</small>
            </div>
            <div className="plan-credits">{p.credits} credits</div>

            {editingId === p.id ? (
              <div className="plan-edit-form">
                <div className="form-field">
                  <label htmlFor={`plan-name-${p.id}`}>Plan name</label>
                  <input
                    id={`plan-name-${p.id}`}
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor={`plan-price-${p.id}`}>Price per month</label>
                  <div className="price-input">
                    <span>$</span>
                    <input
                      id={`plan-price-${p.id}`}
                      type="number"
                      min={0}
                      step={1}
                      className="input"
                      value={form.priceDollars}
                      onChange={(e) => setForm({ ...form, priceDollars: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor={`plan-credits-${p.id}`}>Monthly credits</label>
                  <input
                    id={`plan-credits-${p.id}`}
                    type="number"
                    min={0}
                    className="input"
                    value={form.credits}
                    onChange={(e) => setForm({ ...form, credits: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor={`plan-stripe-${p.id}`}>Stripe Price ID</label>
                  <input
                    id={`plan-stripe-${p.id}`}
                    className="input"
                    placeholder="price_..."
                    value={form.stripePriceId}
                    onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })}
                  />
                  <small className="field-hint">Optional. Paste from Stripe → Products → Price.</small>
                </div>

                <div className="plan-edit-actions">
                  <button type="button" className="button" onClick={save} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setEditingId(null)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <button type="button" className="button" onClick={() => startEdit(p)}>
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
