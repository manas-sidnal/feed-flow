type Snapshot = { request: number; trending: number[] };
type Props = { snapshots: Snapshot[] };

export default function TrendingPanel({ snapshots }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
        Articles appearing in ≥ 3 feeds within the last 10 requests are considered trending.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
        {snapshots.map(snap => (
          <div key={snap.request} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "1.1rem 1.25rem", position: "relative", overflow: "hidden"
          }}>
            {/* Glow accent */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: "linear-gradient(90deg, var(--accent-2), var(--accent-4))"
            }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
                After Request
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 800, color: "var(--accent-4)"
              }}>#{snap.request}</span>
            </div>

            {snap.trending.length === 0 ? (
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>No trending articles</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {snap.trending.map(id => (
                  <span key={id} style={{
                    padding: "0.2rem 0.55rem", borderRadius: 6, fontSize: "0.72rem", fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    background: "#ff6b9d15", color: "var(--accent-2)",
                    border: "1px solid #ff6b9d30"
                  }}>#{id}</span>
                ))}
              </div>
            )}

            <div style={{ marginTop: "0.75rem", fontSize: "0.68rem", color: "var(--text-muted)" }}>
              {snap.trending.length} trending article{snap.trending.length !== 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
