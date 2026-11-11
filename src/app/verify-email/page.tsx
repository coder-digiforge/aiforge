"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { errorMessage } from "@/lib/errors";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");
  const redirected = useRef(false);

  async function resend() {
    if (!resendEmail.trim()) return;
    setResendState("sending");
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail.trim() }),
      });
      setResendState("sent");
    } catch {
      setResendState("idle");
    }
  }

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    let cancelled = false;

    async function verify() {
      setStatus("loading");
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Verification failed.");
        }
        if (cancelled) return;
        setStatus("success");
        setMessage("Email verified! You can now sign in.");
        const timer = setTimeout(() => {
          if (!redirected.current) {
            redirected.current = true;
            router.push("/login");
          }
        }, 3000);
        return () => clearTimeout(timer);
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(errorMessage(err, "Verification failed."));
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <span className="section-kicker">EMAIL VERIFICATION</span>
          <h1>Verify your email</h1>
          <p>Confirm your address to activate your AIForge account.</p>
        </div>

        {status === "loading" && (
          <div className="text-center py-6">
            <Loader2 size={40} className="spin mx-auto text-violet-400" />
            <p className="mt-4 text-slate-400">Verifying...</p>
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

            <div className="auth-form mt-4 text-left">
              <label>
                Didn&apos;t get the email? Enter your address to resend
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <button
                type="button"
                className="button auth-submit"
                onClick={resend}
                disabled={resendState !== "idle"}
              >
                {resendState === "sending"
                  ? "Sending..."
                  : resendState === "sent"
                    ? "Email sent (if account exists)"
                    : "Resend verification email"}
              </button>
            </div>
          </div>
        )}

        <div className="auth-switch">
          <p>
            Already verified? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
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
      <VerifyEmailContent />
    </Suspense>
  );
}
