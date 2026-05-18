type Props = {
  speedup: { linear_time_us: number; hash_time_us: number; speedup: number | null };
};

export default function SpeedupCard({ speedup }: Props) {
  const pct = speedup.speedup ? Math.min((speedup.speedup / 20) * 100, 100) : 0;

  return (
    <div style={{
      background: "#0d0d0d", border: "1px solid #222",
      borderRadius: 12, padding: "1.1rem 1.25rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.68rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>
            Hash Index Speedup vs Linear Scan
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>
              {speedup.speedup ?? "—"}x
            </span>
            <span style={{ fontSize: "0.8rem", color: "#555" }}>faster</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.65rem", color: "#555", marginBottom: 4, textTransform: "uppercase" }}>Linear</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#e53e3e", fontFamily: "'JetBrains Mono', monospace" }}>
              {speedup.linear_time_us} µs
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.65rem", color: "#555", marginBottom: 4, textTransform: "uppercase" }}>Hash</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#38a169", fontFamily: "'JetBrains Mono', monospace" }}>
              {speedup.hash_time_us} µs
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "0.85rem" }}>
        <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "#fff",
            borderRadius: 2, transition: "width 1s ease",
          }} />
        </div>
        <div style={{ fontSize: "0.66rem", color: "#444", marginTop: 4 }}>
          Hash: {speedup.hash_time_us}µs — Linear: {speedup.linear_time_us}µs
        </div>
      </div>
    </div>
  );
}
