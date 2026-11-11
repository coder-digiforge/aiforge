"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles, CheckCircle } from "lucide-react";
import { errorMessage } from "@/lib/errors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed.");
      }
      setSent(true);
    } catch (err) {
      setError(errorMessage(err, "Request failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          <span className="brand-mark">
            <Sparkles size={17} />
          </span>
          AI<span>Forge</span>
        </Link>

        <div className="auth-heading">
          <span className="section-kicker">PASSWORD RESET</span>
          <h1>Forgot your password?</h1>
          <p>We will email you a link to set a new password.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {sent ? (
          <div className="text-center py-6">
            <CheckCircle size={40} className="mx-auto text-green-400" />
            <p className="mt-4 text-green-400">Check your inbox for a reset link.</p>
            <p className="text-sm text-slate-500 mt-2">
              If an account exists for {email}, a message is on its way.
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={onSubmit}>
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <button type="submit" className="button auth-submit" disabled={loading}>
              {loading ? <Loader2 size={16} className="spin" /> : <ArrowRight size={16} />}
              <span>{loading ? "Sending..." : "Send reset link"}</span>
            </button>
          </form>
        )}

        <p className="auth-switch">
          Remember your password? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
