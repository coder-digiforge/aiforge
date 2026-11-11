import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — AIForge",
  description: "How AIForge handles account and generation data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#080910] px-6 py-16 text-slate-200">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <Sparkles size={16} />
          </span>
          <span className="font-semibold">
            AI<span className="text-violet-400">Forge</span>
          </span>
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mb-8 text-sm text-slate-500">Last updated: November 11, 2026</p>
        <div className="space-y-6 text-sm leading-relaxed text-slate-300">
          <p>
            AIForge stores account details you provide (name, email, hashed password), session
            tokens, generation history, and billing identifiers when Stripe is configured.
          </p>
          <p>
            AI prompts and outputs are stored so you can revisit history. When a live AI provider
            key is configured, prompts are sent to that provider under their terms. In demo mode,
            no external AI provider is called.
          </p>
          <p>
            Cookies: an httpOnly session cookie authenticates signed-in users. We do not sell
            personal data. Operators who deploy this software are responsible for their own
            privacy notices and compliance.
          </p>
          <p>
            Contact the site operator for access or deletion requests. Source buyers should
            replace this page with their own policy before production use.
          </p>
        </div>
        <Link href="/" className="mt-10 inline-block text-sm text-violet-400 hover:text-violet-300">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
