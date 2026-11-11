import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getGenerator } from "@/config/generators";
import GeneratorWorkspace from "@/components/dashboard/generator-workspace";

export const dynamic = "force-dynamic";

export default async function GeneratorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const generator = getGenerator(id);
  if (!generator) notFound();

  return (
    <>
      <Link href="/dashboard/generators" className="back-link">
        <ArrowLeft size={15} /> All generators
      </Link>

      <GeneratorWorkspace generator={generator} initialCredits={user.credits} />

      <footer className="dash-footer">
        <span>© 2026 AIForge</span>
        <span>
          Made for ideas in motion <Sparkles size={12} />
        </span>
      </footer>
    </>
  );
}
