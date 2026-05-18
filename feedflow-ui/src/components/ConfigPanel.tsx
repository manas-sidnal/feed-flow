"use client";
import { useState } from "react";

type Props = { onRun: (config: object) => void; loading: boolean };

export default function ConfigPanel({ onRun, loading }: Props) {
  const [users, setUsers] = useState(20);
  const [articles, setArticles] = useState(100);
  const [requests, setRequests] = useState(50);
  const [cacheCapacity, setCacheCapacity] = useState(4);
  const [hitBias, setHitBias] = useState(0.4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRun({ users, articles, requests, cache_capacity: cacheCapacity, hit_bias: hitBias });
  };

  const inputStyle = {
    background: "#000", border: "1px solid #333", borderRadius: 6,
    padding: "0.5rem 0.75rem", color: "#fff", fontSize: "0.88rem",
    fontFamily: "'JetBrains Mono', monospace", outline: "none", width: "100%",
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "#0d0d0d", border: "1px solid #222", borderRadius: 12, padding: "1.25rem",
    }}>
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>Simulation Configuration</h2>
        <p style={{ fontSize: "0.75rem", color: "#555", marginTop: 3 }}>Tune parameters and click Run</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {[
          { id: "input-users", label: "Users (20)", value: users, set: setUsers, min: 2, max: 200 },
          { id: "input-articles", label: "Articles (100)", value: articles, set: setArticles, min: 10, max: 1000 },
          { id: "input-requests", label: "Requests (50)", value: requests, set: setRequests, min: 10, max: 500 },
          { id: "input-cache", label: "Cache Size (20% of users)", value: cacheCapacity, set: setCacheCapacity, min: 1, max: 50 },
        ].map(f => (
          <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.65rem", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em" }}>{f.label}</label>
            <input id={f.id} type="number" min={f.min} max={f.max} value={f.value}
              onChange={e => f.set(+e.target.value)} style={inputStyle} />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <label style={{ fontSize: "0.65rem", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em" }}>Hit Bias (0.4)</label>
          <input id="input-hitbias" type="number" min={0} max={1} step={0.05} value={hitBias}
            onChange={e => setHitBias(+e.target.value)} style={inputStyle} />
        </div>
      </div>
      <button id="btn-run" type="submit" disabled={loading} style={{
        padding: "0.6rem 1.75rem", borderRadius: 8, border: "1px solid #fff", cursor: loading ? "not-allowed" : "pointer",
        background: loading ? "#111" : "#fff",
        color: loading ? "#555" : "#000",
        fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.85rem",
        transition: "all 0.15s", opacity: loading ? 0.5 : 1,
      }}>
        {loading ? "Running…" : "▶ Run Simulation"}
      </button>
    </form>
  );
}
