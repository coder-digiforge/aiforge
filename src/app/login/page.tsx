"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
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
          <span className="section-kicker">WELCOME BACK</span>
          <h1>Sign in to your workspace</h1>
          <p>Continue creating with your AI tools, history and credits.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

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
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <div className="auth-forgot">
            <Link href="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="button auth-submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <ArrowRight size={16} />}
            <span>{loading ? "Signing in..." : "Sign in"}</span>
          </button>
        </form>

        <p className="auth-switch">
          New to AIForge? <Link href="/register">Create an account</Link>
        </p>
        <p className="auth-note">Demo mode works out of the box — 120 free credits on signup.</p>
      </div>
    </main>
  );
}
