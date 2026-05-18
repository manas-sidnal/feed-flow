"use client";
import { useState } from "react";

type LogEntry = { request: number; user_id: number; status: "HIT" | "MISS"; cache: number[] };
type Stats = { total: number; hits: number; misses: number; hit_ratio: number; miss_ratio: number };
type Props = { log: LogEntry[]; stats: Stats };

const PAGE_SIZE = 20;

export default function CacheLogTable({ log, stats }: Props) {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<"ALL" | "HIT" | "MISS">("ALL");

  const filtered = filter === "ALL" ? log : log.filter(e => e.status === filter);
  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const slice = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Stats summary */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {[
          { label: "Total", value: stats.total, color: "var(--text-primary)" },
          { label: "Hits", value: stats.hits, color: "var(--accent-3)" },
          { label: "Misses", value: stats.misses, color: "var(--accent-2)" },
          { label: "Hit Ratio", value: `${stats.hit_ratio}%`, color: "var(--accent-3)" },
          { label: "Miss Ratio", value: `${stats.miss_ratio}%`, color: "var(--accent-2)" },
        ].map(s => (
          <div key={s.label} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "0.6rem 1rem", textAlign: "center"
          }}>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Hit/Miss ratio bar */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem" }}>
        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Cache Performance
        </div>
        <div style={{ height: 12, borderRadius: 6, overflow: "hidden", display: "flex" }}>
          <div style={{ width: `${stats.hit_ratio}%`, background: "var(--accent-3)", transition: "width 1s ease" }} />
          <div style={{ flex: 1, background: "var(--accent-2)", opacity: 0.7 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.7rem", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--accent-3)" }}>● Hits {stats.hit_ratio}%</span>
          <span style={{ color: "var(--accent-2)" }}>● Misses {stats.miss_ratio}%</span>
        </div>
      </div>

      {/* Filter buttons */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {(["ALL", "HIT", "MISS"] as const).map(f => (
          <button key={f} id={`filter-${f.toLowerCase()}`} onClick={() => { setFilter(f); setPage(0); }} style={{
            padding: "0.35rem 0.9rem", borderRadius: 8, border: "none", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600,
            background: filter === f
              ? f === "HIT" ? "#00d4aa30" : f === "MISS" ? "#ff6b9d30" : "#6c63ff30"
              : "var(--bg-card)",
            color: filter === f
              ? f === "HIT" ? "var(--accent-3)" : f === "MISS" ? "var(--accent-2)" : "var(--accent)"
              : "var(--text-secondary)",
            border: filter === f
              ? `1px solid ${f === "HIT" ? "var(--accent-3)" : f === "MISS" ? "var(--accent-2)" : "var(--accent)"}60`
              : "1px solid var(--border)",
          }}>{f}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "30px" }}>
          {filtered.length} entries
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ background: "#0d0d1a", borderBottom: "1px solid var(--border)" }}>
              {["Req#", "User", "Status", "Cache State"].map(h => (
                <th key={h} style={{ padding: "0.65rem 1rem", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((entry, i) => (
              <tr key={entry.request} style={{
                borderBottom: "1px solid var(--border)",
                background: i % 2 === 0 ? "transparent" : "#ffffff02",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#6c63ff08"}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "transparent" : "#ffffff02"}
              >
                <td style={{ padding: "0.55rem 1rem", color: "var(--text-muted)" }}>{entry.request}</td>
                <td style={{ padding: "0.55rem 1rem", color: "var(--accent)", fontWeight: 600 }}>User {entry.user_id}</td>
                <td style={{ padding: "0.55rem 1rem" }}>
                  <span style={{
                    padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700,
                    background: entry.status === "HIT" ? "#00d4aa20" : "#ff6b9d20",
                    color: entry.status === "HIT" ? "var(--accent-3)" : "var(--accent-2)",
                    border: `1px solid ${entry.status === "HIT" ? "#00d4aa40" : "#ff6b9d40"}`
                  }}>{entry.status}</span>
                </td>
                <td style={{ padding: "0.55rem 1rem", color: "var(--text-secondary)" }}>
                  [{entry.cache.join(", ")}]
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} id={`page-${i}`} onClick={() => setPage(i)} style={{
              width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
              background: page === i ? "var(--accent)" : "var(--bg-card)",
              color: page === i ? "#fff" : "var(--text-secondary)",
              border: page === i ? "1px solid var(--accent)" : "1px solid var(--border)",
              fontFamily: "Inter, sans-serif", fontSize: "0.8rem", fontWeight: 600
            }}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
