type Props = { data: number[] };

const USER_COLORS = [
  "#6c63ff","#ff6b9d","#00d4aa","#f7b731","#4fc3f7","#81c784",
  "#ce93d8","#ffb74d","#80cbc4","#ef9a9a","#90caf9","#a5d6a7"
];

export default function ReferenceString({ data }: Props) {
  const counts: Record<number, number> = {};
  data.forEach(id => { counts[id] = (counts[id] ?? 0) + 1; });
  const maxCount = Math.max(...Object.values(counts));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Visual token stream */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "1.25rem" }}>
        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", fontWeight: 600 }}>
          🔗 Request Stream ({data.length} requests)
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {data.map((uid, i) => {
            const color = USER_COLORS[uid % USER_COLORS.length];
            return (
              <div key={i} title={`Request ${i + 1}: User ${uid}`} style={{
                width: 36, height: 36, borderRadius: 8, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", fontWeight: 700,
                background: `${color}20`, color, border: `1px solid ${color}50`,
                cursor: "default", transition: "transform 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1.2)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 10px ${color}60`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }}
              >{uid}</div>
            );
          })}
        </div>
      </div>

      {/* Frequency heat table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "1.25rem" }}>
        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", fontWeight: 600 }}>
          🔥 User Request Frequency
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .map(([uid, count]) => {
              const color = USER_COLORS[+uid % USER_COLORS.length];
              const intensity = count / maxCount;
              return (
                <div key={uid} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "0.5rem 0.75rem", borderRadius: 10,
                  background: `${color}${Math.round(intensity * 25).toString(16).padStart(2, "0")}`,
                  border: `1px solid ${color}${Math.round(intensity * 80).toString(16).padStart(2, "0")}`,
                  minWidth: 52
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", fontWeight: 800, color }}>{uid}</span>
                  <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: 2 }}>{count}×</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Raw string */}
      <div style={{ background: "#0a0a10", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem" }}>
        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>Raw Array</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.8, wordBreak: "break-all" }}>
          [{data.join(", ")}]
        </div>
      </div>
    </div>
  );
}
