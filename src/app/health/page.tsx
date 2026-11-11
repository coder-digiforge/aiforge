export const dynamic = "force-dynamic";

export default function HealthPage() {
  const hasDb = Boolean(process.env.DATABASE_URL?.trim());
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "(not set)";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#080910",
        color: "#f4f5fb",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>AIForge OK</h1>
        <p style={{ color: "#8991a8", fontSize: 14 }}>
          Health check page. If you see this, routing works.
        </p>
        <p style={{ color: "#8991a8", fontSize: 12, marginTop: 12 }}>
          Has DB: {hasDb ? "yes" : "no"} · App URL: {appUrl}
        </p>
      </div>
    </main>
  );
}
