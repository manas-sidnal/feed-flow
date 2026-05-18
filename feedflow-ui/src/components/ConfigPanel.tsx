"use client";
import { useState } from "react";

type Props = { onRun: (config: object) => void; loading: boolean };

export default function ConfigPanel({ onRun, loading }: Props) {
  const [users, setUsers] = useState(20);
  const [articles, setArticles] = useState(100);
  const [requests, setRequests] = useState(55);
  const [cacheCapacity, setCacheCapacity] = useState(4);
  const [hitBias, setHitBias] = useState(0.4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRun({ users, articles, requests, cache_capacity: cacheCapacity, hit_bias: hitBias });
  };

  const fieldStyle = {
    display: "flex", flexDirection: "column" as const, gap: "0.4rem",
  };
  const labelStyle = {
    fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)",
    textTransform: "uppercase" as const, letterSpacing: "0.08em"
  };
  const inputStyle = {
    background: "#0d0d1a", border: "1px solid var(--border)", borderRadius: 8,
    padding: "0.55rem 0.85rem", color: "var(--text-primary)", fontSize: "0.9rem",
    fontFamily: "'JetBrains Mono', monospace", outline: "none", width: "100%",
    transition: "border-color 0.2s",
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16,
      padding: "1.5rem", boxShadow: "0 4px 32px #0004"
    }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
          ⚙️ Simulation Configuration
        </h2>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
          Tune the parameters and click Run to generate results
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Users</label>
          <input id="input-users" type="number" min={2} max={200} value={users}
            onChange={e => setUsers(+e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Articles</label>
          <input id="input-articles" type="number" min={10} max={1000} value={articles}
            onChange={e => setArticles(+e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Requests</label>
          <input id="input-requests" type="number" min={10} max={500} value={requests}
            onChange={e => setRequests(+e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Cache Size</label>
          <input id="input-cache" type="number" min={1} max={50} value={cacheCapacity}
            onChange={e => setCacheCapacity(+e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Hit Bias (0–1)</label>
          <input id="input-hitbias" type="number" min={0} max={1} step={0.05} value={hitBias}
            onChange={e => setHitBias(+e.target.value)} style={inputStyle} />
        </div>
      </div>

      <button id="btn-run" type="submit" disabled={loading} style={{
        padding: "0.65rem 2rem", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
        background: loading ? "#2a2a3e" : "linear-gradient(135deg, var(--accent), var(--accent-2))",
        color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem",
        boxShadow: loading ? "none" : "0 0 20px var(--accent)50",
        transition: "all 0.2s", opacity: loading ? 0.6 : 1,
      }}>
        {loading ? "Running…" : "▶ Run Simulation"}
      </button>
    </form>
  );
}
