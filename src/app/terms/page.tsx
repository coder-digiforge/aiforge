import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Terms of Use — AIForge",
  description: "Terms for using the AIForge demo and workspace.",
};

export default function TermsPage() {
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
        <h1 className="mb-2 text-3xl font-bold text-white">Terms of Use</h1>
        <p className="mb-8 text-sm text-slate-500">Last updated: November 11, 2026</p>
        <div className="space-y-6 text-sm leading-relaxed text-slate-300">
          <p>
            This public demo is provided as-is for evaluation. Accounts may be reset. Do not
            upload sensitive, illegal, or infringing content.
          </p>
          <p>
            Credits and plans shown on this demo may be simulated. Paid features require a
            configured Stripe account. AI output can be inaccurate; review results before
            publishing.
          </p>
          <p>
            The AIForge source code is sold separately under the license included with your
            purchase. Marketplace buyers receive rights described in LICENSE.txt, not ownership of
            trademarks or this hosted demo.
          </p>
          <p>
            Operators who deploy their own instance must provide their own terms, privacy policy,
            and support channels.
          </p>
        </div>
        <Link href="/" className="mt-10 inline-block text-sm text-violet-400 hover:text-violet-300">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
