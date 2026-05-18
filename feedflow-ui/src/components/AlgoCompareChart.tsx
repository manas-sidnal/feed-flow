type AlgoRow = { algorithm: string; hits: number; misses: number; hit_ratio: number };
type Props = { data: AlgoRow[]; total: number };

const ALGO_COLORS: Record<string, string> = {
  FIFO: "#aaaaaa",
  LRU: "#ffffff",
  Optimal: "#38a169",
};

export default function AlgoCompareChart({ data, total }: Props) {
  const best = [...data].sort((a, b) => b.hit_ratio - a.hit_ratio)[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Bar chart */}
      <div style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 12, padding: "1.25rem" }}>
        <div style={{ fontSize: "0.65rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.1rem", fontWeight: 600 }}>
          Hit Ratio Comparison
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {data.map(row => (
            <div key={row.algorithm}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 700, color: ALGO_COLORS[row.algorithm], fontSize: "0.82rem" }}>{row.algorithm}</span>
                  {row.algorithm === best.algorithm && (
                    <span style={{ fontSize: "0.62rem", color: "#38a169", fontWeight: 700 }}>BEST</span>
                  )}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", fontWeight: 700, color: ALGO_COLORS[row.algorithm] }}>
                  {row.hit_ratio}%
                </span>
              </div>
              <div style={{ height: 8, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${row.hit_ratio}%`,
                  background: ALGO_COLORS[row.algorithm],
                  borderRadius: 4, transition: "width 1.2s ease", opacity: 0.9
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #222" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ background: "#080808", borderBottom: "1px solid #222" }}>
              {["Algorithm", "Hits", "Misses", "Hit %"].map(h => (
                <th key={h} style={{ padding: "0.65rem 1rem", textAlign: "left", color: "#444", fontWeight: 600, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.algorithm} style={{ borderBottom: "1px solid #161616" }}>
                <td style={{ padding: "0.65rem 1rem", color: ALGO_COLORS[row.algorithm], fontWeight: 700 }}>
                  {row.algorithm}{row.algorithm === best.algorithm ? " ★" : ""}
                </td>
                <td style={{ padding: "0.65rem 1rem", color: "#38a169" }}>{row.hits}</td>
                <td style={{ padding: "0.65rem 1rem", color: "#e53e3e" }}>{row.misses}</td>
                <td style={{ padding: "0.65rem 1rem", color: ALGO_COLORS[row.algorithm], fontWeight: 700 }}>{row.hit_ratio}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{
        padding: "0.85rem 1rem", borderRadius: 10,
        background: "#38a16910", border: "1px solid #38a16930",
        fontSize: "0.82rem", color: "#888"
      }}>
        <span style={{ color: "#38a169", fontWeight: 700 }}>{best.algorithm}</span>
        {" "}wins with {best.hit_ratio}% hit ratio across {total} requests.
        {data.find(d => d.algorithm === "LRU") && data.find(d => d.algorithm === "FIFO") && (
          <> LRU outperforms FIFO by <span style={{ color: "#fff", fontWeight: 700 }}>
            {(data.find(d => d.algorithm === "LRU")!.hit_ratio - data.find(d => d.algorithm === "FIFO")!.hit_ratio).toFixed(1)}%
          </span>.</>
        )}
      </div>
    </div>
  );
}
