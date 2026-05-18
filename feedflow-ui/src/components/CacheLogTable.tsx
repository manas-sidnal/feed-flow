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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Stats */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {[
          { label: "Total", value: stats.total, color: "#fff" },
          { label: "Hits", value: stats.hits, color: "#38a169" },
          { label: "Misses", value: stats.misses, color: "#e53e3e" },
          { label: "Hit %", value: `${stats.hit_ratio}%`, color: "#38a169" },
          { label: "Miss %", value: `${stats.miss_ratio}%`, color: "#e53e3e" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#0d0d0d", border: "1px solid #222",
            borderRadius: 8, padding: "0.5rem 0.85rem", textAlign: "center"
          }}>
            <div style={{ fontSize: "0.62rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Ratio bar */}
      <div style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 10, padding: "0.85rem 1rem" }}>
        <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex" }}>
          <div style={{ width: `${stats.hit_ratio}%`, background: "#38a169", transition: "width 1s ease" }} />
          <div style={{ flex: 1, background: "#e53e3e", opacity: 0.6 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: "0.68rem", color: "#555" }}>
          <span style={{ color: "#38a169" }}>● Hits {stats.hit_ratio}%</span>
          <span style={{ color: "#e53e3e" }}>● Misses {stats.miss_ratio}%</span>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: "0.4rem" }}>
        {(["ALL", "HIT", "MISS"] as const).map(f => (
          <button key={f} id={`filter-${f.toLowerCase()}`} onClick={() => { setFilter(f); setPage(0); }} style={{
            padding: "0.3rem 0.8rem", borderRadius: 6, border: "none", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 600,
            background: "#0d0d0d",
            color: filter === f ? (f === "HIT" ? "#38a169" : f === "MISS" ? "#e53e3e" : "#fff") : "#555",
            border: filter === f
              ? `1px solid ${f === "HIT" ? "#38a16960" : f === "MISS" ? "#e53e3e60" : "#fff40"}`
              : "1px solid #222",
          }}>{f}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "#444", lineHeight: "28px" }}>{filtered.length} entries</span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #222" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ background: "#080808", borderBottom: "1px solid #222" }}>
              {["Req#", "User", "Status", "Cache State"].map(h => (
                <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", color: "#444", fontWeight: 600, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((entry, i) => (
              <tr key={entry.request} style={{
                borderBottom: "1px solid #161616",
                background: i % 2 === 0 ? "transparent" : "#0a0a0a",
              }}>
                <td style={{ padding: "0.5rem 1rem", color: "#444" }}>{entry.request}</td>
                <td style={{ padding: "0.5rem 1rem", color: "#fff", fontWeight: 600 }}>U{entry.user_id}</td>
                <td style={{ padding: "0.5rem 1rem" }}>
                  <span style={{
                    padding: "0.18rem 0.55rem", borderRadius: 5, fontSize: "0.68rem", fontWeight: 700,
                    background: entry.status === "HIT" ? "#38a16918" : "#e53e3e18",
                    color: entry.status === "HIT" ? "#38a169" : "#e53e3e",
                    border: `1px solid ${entry.status === "HIT" ? "#38a16940" : "#e53e3e40"}`
                  }}>{entry.status}</span>
                </td>
                <td style={{ padding: "0.5rem 1rem", color: "#555" }}>[{entry.cache.join(", ")}]</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} id={`page-${i}`} onClick={() => setPage(i)} style={{
              width: 30, height: 30, borderRadius: 6, border: "none", cursor: "pointer",
              background: page === i ? "#fff" : "#0d0d0d",
              color: page === i ? "#000" : "#555",
              border: page === i ? "1px solid #fff" : "1px solid #222",
              fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600
            }}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
