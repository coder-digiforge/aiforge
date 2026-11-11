"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { errorMessage } from "@/lib/errors";

export default function UpgradeButton({ planId, label }: { planId: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed.");
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned.");
    } catch (err) {
      setError(errorMessage(err, "Checkout failed."));
      setLoading(false);
    }
  }

  return (
    <>
      <button className="button" onClick={checkout} disabled={loading}>
        {loading ? <Loader2 size={14} className="spin" /> : label}
      </button>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </>
  );
}
