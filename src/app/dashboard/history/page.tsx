import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Clock3, Sparkles, Zap } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { generators } from "@/config/generators";
import { readDb } from "@/lib/store";
import HistoryList from "@/components/dashboard/history-list";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const db = await readDb();
  const history = db.history.filter((h) => h.userId === user.id);

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="section-kicker">YOUR LIBRARY</div>
          <h1>
            History <span>✦</span>
          </h1>
          <p>
            {history.length} creation{history.length === 1 ? "" : "s"} saved across all tools
          </p>
        </div>
        <Link href="/dashboard/generators" className="button">
          <Zap size={16} /> New creation
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="empty-state history-empty">
          <div>
            <Clock3 size={20} />
          </div>
          <b>Your creations will appear here</b>
          <p>Start with any AI generator to build your history.</p>
          <Link href="/dashboard/generators" className="view-all">
            Explore generators <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <HistoryList
          items={history.map((item) => {
            const gen = generators.find((g) => g.id === item.generatorId);
            return {
              id: item.id,
              generatorId: item.generatorId,
              generatorName: gen?.name ?? item.generatorId,
              color: gen?.color ?? "violet",
              prompt: item.prompt,
              output: item.output,
              cost: item.cost,
              demo: item.demo,
              createdAt: item.createdAt,
              isImage: item.generatorId === "image",
            };
          })}
        />
      )}

      <footer className="dash-footer">
        <span>© 2026 AIForge</span>
        <span>
          Made for ideas in motion <Sparkles size={12} />
        </span>
      </footer>
    </>
  );
}
