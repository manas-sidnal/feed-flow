type Props = { data: number[] };

export default function ReferenceString({ data }: Props) {
  const counts: Record<number, number> = {};
  data.forEach(id => { counts[id] = (counts[id] ?? 0) + 1; });
  const maxCount = Math.max(...Object.values(counts));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Token stream */}
      <div style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 12, padding: "1.1rem" }}>
        <div style={{ fontSize: "0.65rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.85rem", fontWeight: 600 }}>
          Request Stream ({data.length} requests)
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {data.map((uid, i) => (
            <div key={i} title={`Request ${i + 1}: User ${uid}`} style={{
              width: 34, height: 34, borderRadius: 6, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", fontWeight: 700,
              background: "#1a1a1a", color: "#888", border: "1px solid #2a2a2a",
              cursor: "default",
            }}>{uid}</div>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 12, padding: "1.1rem" }}>
        <div style={{ fontSize: "0.65rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.85rem", fontWeight: 600 }}>
          User Request Frequency
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .map(([uid, count]) => {
              const intensity = count / maxCount;
              const bg = intensity > 0.7 ? "#38a16920" : intensity > 0.4 ? "#ffffff10" : "#1a1a1a";
              const col = intensity > 0.7 ? "#38a169" : intensity > 0.4 ? "#aaa" : "#555";
              return (
                <div key={uid} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "0.45rem 0.65rem", borderRadius: 8,
                  background: bg, border: "1px solid #222", minWidth: 48
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.88rem", fontWeight: 800, color: col }}>{uid}</span>
                  <span style={{ fontSize: "0.6rem", color: "#444", marginTop: 2 }}>{count}×</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Raw */}
      <div style={{ background: "#080808", border: "1px solid #1a1a1a", borderRadius: 10, padding: "0.85rem 1rem" }}>
        <div style={{ fontSize: "0.62rem", color: "#444", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.07em" }}>Raw Array</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#555", lineHeight: 1.8, wordBreak: "break-all" }}>
          [{data.join(", ")}]
        </div>
      </div>
    </div>
  );
}
