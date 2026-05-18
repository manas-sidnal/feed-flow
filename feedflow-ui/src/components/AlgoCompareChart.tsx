type AlgoRow = { algorithm: string; hits: number; misses: number; hit_ratio: number };
type Props = { data: AlgoRow[]; total: number };

const ALGO_COLORS: Record<string, string> = {
  FIFO: "#f7b731",
  LRU: "#6c63ff",
  Optimal: "#00d4aa",
};

export default function AlgoCompareChart({ data, total }: Props) {
  const best = [...data].sort((a, b) => b.hit_ratio - a.hit_ratio)[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Horizontal bar chart */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.5rem" }}>
        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem", fontWeight: 600 }}>
          📊 Hit Ratio Comparison
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {data.map(row => (
            <div key={row.algorithm}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{
                    padding: "0.15rem 0.6rem", borderRadius: 6, fontSize: "0.72rem", fontWeight: 700,
                    background: `${ALGO_COLORS[row.algorithm]}20`, color: ALGO_COLORS[row.algorithm],
                    border: `1px solid ${ALGO_COLORS[row.algorithm]}40`
                  }}>{row.algorithm}</span>
                  {row.algorithm === best.algorithm && (
                    <span style={{ fontSize: "0.65rem", color: "#f7b731", fontWeight: 700 }}>★ BEST</span>
                  )}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 700, color: ALGO_COLORS[row.algorithm] }}>
                  {row.hit_ratio}%
                </span>
              </div>
              <div style={{ height: 10, background: "var(--border)", borderRadius: 5, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${row.hit_ratio}%`,
                  background: `linear-gradient(90deg, ${ALGO_COLORS[row.algorithm]}, ${ALGO_COLORS[row.algorithm]}aa)`,
                  borderRadius: 5, transition: "width 1.2s ease",
                  boxShadow: `0 0 8px ${ALGO_COLORS[row.algorithm]}80`
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "#0d0d1a", borderBottom: "1px solid var(--border)" }}>
              {["Algorithm", "Hits", "Misses", "Hit Ratio", "Miss Ratio"].map(h => (
                <th key={h} style={{ padding: "0.7rem 1rem", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.algorithm} style={{
                borderBottom: "1px solid var(--border)",
                background: row.algorithm === best.algorithm ? `${ALGO_COLORS[row.algorithm]}08` : "transparent"
              }}>
                <td style={{ padding: "0.7rem 1rem" }}>
                  <span style={{ fontWeight: 700, color: ALGO_COLORS[row.algorithm] }}>{row.algorithm}</span>
                  {row.algorithm === best.algorithm && <span style={{ marginLeft: 6, color: "#f7b731", fontSize: "0.7rem" }}>★</span>}
                </td>
                <td style={{ padding: "0.7rem 1rem", color: "var(--accent-3)" }}>{row.hits}</td>
                <td style={{ padding: "0.7rem 1rem", color: "var(--accent-2)" }}>{row.misses}</td>
                <td style={{ padding: "0.7rem 1rem", color: ALGO_COLORS[row.algorithm], fontWeight: 700 }}>{row.hit_ratio}%</td>
                <td style={{ padding: "0.7rem 1rem", color: "var(--text-secondary)" }}>
                  {(100 - row.hit_ratio).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary callout */}
      <div style={{
        padding: "1rem 1.25rem", borderRadius: 12,
        background: `${ALGO_COLORS[best.algorithm]}10`,
        border: `1px solid ${ALGO_COLORS[best.algorithm]}30`,
        fontSize: "0.85rem", color: "var(--text-secondary)"
      }}>
        <span style={{ color: ALGO_COLORS[best.algorithm], fontWeight: 700 }}>★ {best.algorithm}</span>
        {" "}wins with a {best.hit_ratio}% hit ratio across {total} requests.
        {data.find(d => d.algorithm === "LRU") && data.find(d => d.algorithm === "FIFO") && (
          <> LRU outperforms FIFO by <span style={{ color: "var(--accent)", fontWeight: 700 }}>
            {(data.find(d => d.algorithm === "LRU")!.hit_ratio - data.find(d => d.algorithm === "FIFO")!.hit_ratio).toFixed(1)}%
          </span>.</>
        )}
      </div>
    </div>
  );
}
