"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#080910",
          color: "#f4f5fb",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 22 }}>Application error</h1>
          <p style={{ color: "#8991a8", fontSize: 14 }}>{error.message}</p>
          {error.digest ? (
            <p style={{ color: "#8991a8", fontSize: 12 }}>Digest: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              background: "#8b70ff",
              color: "white",
              border: 0,
              borderRadius: 10,
              padding: "10px 16px",
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
