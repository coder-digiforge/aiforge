import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { generators, generatorCategories } from "@/config/generators";
import { readDb } from "@/lib/store";
import CategoryFilter from "@/components/dashboard/category-filter";

export const dynamic = "force-dynamic";

export default async function GeneratorsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const db = await readDb();
  const counts = new Map<string, number>();
  for (const item of db.history) {
    if (item.userId !== user.id) continue;
    counts.set(item.generatorId, (counts.get(item.generatorId) ?? 0) + 1);
  }

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="section-kicker">TOOLKIT</div>
          <h1>
            AI generators <span>✦</span>
          </h1>
          <p>
            {generators.length} tools · {user.credits} credits available
          </p>
        </div>
        <span className="ai-chip">
          <Zap size={13} /> {user.credits} credits
        </span>
      </div>

      <CategoryFilter categories={[...generatorCategories]} />

      <div className="generator-grid generators-full">
        {generators.map(({ id, name, description, icon: Icon, color, category, cost }) => (
          <Link key={id} href={`/dashboard/generators/${id}`} className="generator-card" data-category={category}>
            <div className={`generator-icon ${color}`}>
              <Icon size={20} />
            </div>
            <span className="generator-category">{category}</span>
            <h3>{name}</h3>
            <p>{description}</p>
            <span className="generator-meta">
              <Zap size={11} /> {cost} cr
              {counts.get(id) ? <span className="generator-used">{counts.get(id)} used</span> : null}
            </span>
            <span className="generator-open">
              <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>

      <div className="info-banner">
        <Sparkles size={16} />
        <div>
          <b>Tip</b>
          <p>
            Open any tool for a focused workspace with prompt guidance, live output and instant
            copy. Every generation is saved to your history.
          </p>
        </div>
      </div>

      <footer className="dash-footer">
        <span>© 2026 AIForge</span>
        <span>
          Made for ideas in motion <Sparkles size={12} />
        </span>
      </footer>
    </>
  );
}
