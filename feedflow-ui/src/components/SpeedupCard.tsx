type Props = {
  speedup: { linear_time_us: number; hash_time_us: number; speedup: number | null };
};

export default function SpeedupCard({ speedup }: Props) {
  const pct = speedup.speedup ? Math.min((speedup.speedup / 20) * 100, 100) : 0;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d0d1a 0%, #111120 100%)",
      border: "1px solid #6c63ff30",
      borderRadius: 16, padding: "1.25rem 1.5rem",
      boxShadow: "0 0 32px #6c63ff12",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 6 }}>
            ⚡ Hash Index Speedup vs Linear Scan
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace" }}>
              {speedup.speedup ?? "—"}x
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>faster</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>Linear</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ff6b9d", fontFamily: "'JetBrains Mono', monospace" }}>
              {speedup.linear_time_us} µs
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>Hash</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#00d4aa", fontFamily: "'JetBrains Mono', monospace" }}>
              {speedup.hash_time_us} µs
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: "1rem" }}>
        <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
            borderRadius: 3, transition: "width 1s ease",
            boxShadow: "0 0 8px var(--accent)"
          }} />
        </div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4 }}>
          Hash index is {speedup.speedup}x faster — Linear: {speedup.linear_time_us}µs → Hash: {speedup.hash_time_us}µs
        </div>
      </div>
    </div>
  );
}
