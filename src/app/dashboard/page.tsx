import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Clock3,
  FileText,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { generators } from "@/config/generators";
import { readDb } from "@/lib/store";
import QuickCreate from "@/components/dashboard/quick-create";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const db = await readDb();
  const history = db.history.filter((h) => h.userId === user.id);
  const recent = history.slice(0, 4);
  const planLimit = user.plan === "free" ? 120 : user.plan === "pro" ? 1000 : 5000;
  const used = Math.max(0, planLimit - user.credits);
  const pct = Math.min(100, Math.round((user.credits / planLimit) * 100));

  const dateLabel = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  const firstName = user.name.split(/\s+/)[0] ?? user.name;

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="date-label">{dateLabel}</div>
          <h1>
            Good day, {firstName} <span>✦</span>
          </h1>
          <p>Ready to turn your next idea into something great?</p>
        </div>
        <Link href="/dashboard/generators" className="button">
          <Plus size={17} />
          <span className="button-label">New creation</span>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <span>Available credits</span>
            <Zap size={17} />
          </div>
          <div className="stat-number">
            {user.credits} <small>/ {planLimit}</small>
          </div>
          <div className="stat-foot">
            <span className="stat-positive">{user.plan} plan</span>
            <span>{used} used</span>
          </div>
          <div className="progress">
            <i style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Total generations</span>
            <Activity size={17} />
          </div>
          <div className="stat-number">{history.length}</div>
          <div className="stat-foot">
            <span className="stat-positive">
              <ArrowDownRight size={13} /> All time
            </span>
            <span>Saved</span>
          </div>
          <div className="sparkline" aria-hidden="true">
            {Array.from({ length: 11 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Saved creations</span>
            <FileText size={17} />
          </div>
          <div className="stat-number">{String(history.length).padStart(2, "0")}</div>
          <div className="stat-foot">
            <span>Across all tools</span>
            <span>Library</span>
          </div>
          <div className="stat-mini">
            <Link href="/dashboard/history" className="view-all">
              Open history <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      <section className="quick-create">
        <div className="quick-heading">
          <div>
            <span className="section-kicker">QUICK START</span>
            <h2>What are we creating today?</h2>
          </div>
          <span className="ai-chip">
            <Sparkles size={13} /> AI powered
          </span>
        </div>
        <QuickCreate generators={generators} credits={user.credits} />
      </section>

      <section className="generator-section">
        <div className="section-title-row">
          <div>
            <span className="section-kicker">EXPLORE THE TOOLKIT</span>
            <h2>AI generators</h2>
          </div>
          <Link href="/dashboard/generators" className="view-all">
            View all tools <ArrowRight size={15} />
          </Link>
        </div>

        <div className="generator-grid">
          {generators.map(({ id, name, description, icon: Icon, color, category }) => (
            <Link key={id} href={`/dashboard/generators/${id}`} className="generator-card">
              <div className={`generator-icon ${color}`}>
                <Icon size={20} />
              </div>
              <span className="generator-category">{category}</span>
              <h3>{name}</h3>
              <p>{description}</p>
              <span className="generator-open">
                <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="bottom-grid">
        <section className="recent-card">
          <div className="section-title-row">
            <div>
              <span className="section-kicker">YOUR WORKSPACE</span>
              <h2>Recent activity</h2>
            </div>
            <Link href="/dashboard/history" className="view-all">
              View history <ArrowRight size={14} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="empty-state">
              <div>
                <Clock3 size={20} />
              </div>
              <b>Your creations will appear here</b>
              <p>Start with any AI generator to build your history.</p>
            </div>
          ) : (
            <ul className="activity-list">
              {recent.map((item) => {
                const gen = generators.find((g) => g.id === item.generatorId);
                return (
                  <li key={item.id}>
                    <span className={`generator-icon ${gen?.color ?? "violet"} small`}>
                      {gen ? <gen.icon size={14} /> : <FileText size={14} />}
                    </span>
                    <div>
                      <b>{gen?.name ?? item.generatorId}</b>
                      <p>{item.prompt.slice(0, 90)}{item.prompt.length > 90 ? "..." : ""}</p>
                    </div>
                    <small>
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </small>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="plan-card">
          <span className="section-kicker">YOUR PLAN</span>
          <h2>{user.plan === "free" ? "Free starter" : user.plan}</h2>
          <p>
            {user.plan === "free"
              ? "Explore AIForge with demo credits. Upgrade when you're ready to do more."
              : "Enjoy a higher monthly credit allowance for heavier workloads."}
          </p>
          <div className="plan-line">
            <span>Monthly credits</span>
            <b>
              {user.credits} / {planLimit}
            </b>
          </div>
          <div className="progress">
            <i style={{ width: `${pct}%` }} />
          </div>
          <Link href="/dashboard/settings" className="plan-link">
            View plans <ArrowRight size={14} />
          </Link>
        </section>
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
