"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { errorMessage } from "@/lib/errors";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing reset token.");
    }
  }, [token]);

  async function reset() {
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Reset failed.");
      }
      setStatus("success");
      setMessage("Password reset successful! You can now sign in.");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setStatus("error");
      setMessage(errorMessage(err, "Reset failed."));
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <span className="section-kicker">RESET PASSWORD</span>
          <h1>Create a new password</h1>
          <p>Enter a new password to access your account.</p>
        </div>

        {status === "loading" && (
          <div className="text-center py-6">
            <Loader2 size={40} className="spin mx-auto text-violet-400" />
            <p className="mt-4 text-slate-400">Resetting password...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-6">
            <CheckCircle size={40} className="mx-auto text-green-400" />
            <p className="mt-4 text-green-400">{message}</p>
            <p className="text-sm text-slate-500 mt-2">Redirecting to login in 3 seconds...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-6">
            <AlertCircle size={40} className="mx-auto text-red-400" />
            <p className="mt-4 text-red-400">{message}</p>
          </div>
        )}

        {status !== "success" && status !== "loading" && (
          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              reset();
            }}
          >
            <div className="form-field">
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="form-field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" className="button auth-submit">
              Reset Password
            </button>
          </form>
        )}

        <div className="auth-switch">
          <p>
            Remember your password? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="auth-page">
          <div className="auth-card">
            <div className="text-center py-6">
              <Loader2 size={40} className="spin mx-auto text-violet-400" />
            </div>
          </div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
