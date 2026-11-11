"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#080910",
        color: "#f4f5fb",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>Something went wrong</h1>
        <p style={{ color: "#8991a8", fontSize: 14, marginBottom: 8 }}>
          {error.message || "Server error"}
        </p>
        {error.digest ? (
          <p style={{ color: "#8991a8", fontSize: 12, marginBottom: 20 }}>
            Digest: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#8b70ff",
            color: "white",
            border: 0,
            borderRadius: 10,
            padding: "10px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
