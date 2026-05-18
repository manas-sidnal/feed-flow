"use client";
import { useState } from "react";
import ConfigPanel from "@/components/ConfigPanel";
import StatCard from "@/components/StatCard";
import SpeedupCard from "@/components/SpeedupCard";
import SampleFeedCard from "@/components/SampleFeedCard";
import CacheLogTable from "@/components/CacheLogTable";
import AlgoCompareChart from "@/components/AlgoCompareChart";
import TrendingPanel from "@/components/TrendingPanel";
import ReferenceString from "@/components/ReferenceString";

export type SimResult = {
  config: { users: number; articles: number; requests: number; cache_capacity: number; hit_bias: number };
  reference_string: number[];
  speedup: { linear_time_us: number; hash_time_us: number; speedup: number | null };
  sample_feeds: { user_id: number; user_name: string; preferences: string[]; top5: { score: number; title: string; topic: string }[] }[];
  lru_log: { request: number; user_id: number; status: "HIT" | "MISS"; cache: number[] }[];
  lru_stats: { total: number; hits: number; misses: number; hit_ratio: number; miss_ratio: number };
  algo_comparison: { algorithm: string; hits: number; misses: number; hit_ratio: number }[];
  trending_snapshots: { request: number; trending: number[] }[];
};

export default function Home() {
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("feed");

  const runSimulation = async (config: object) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("API error: " + res.status);
      const data: SimResult = await res.json();
      setResult(data);
      setActiveTab("feed");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error. Is the Python API running?");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "feed", label: "Sample Feed" },
    { id: "cache", label: "LRU Log" },
    { id: "algo", label: "Algo Comparison" },
    { id: "trending", label: "Trending" },
    { id: "ref", label: "Reference String" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #222",
        background: "#000",
        padding: "0 2rem",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>⚡</div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
                Feed<span style={{ color: "#aaa" }}>Flow</span>
              </div>
              <div style={{ fontSize: "0.65rem", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Feed Simulator
              </div>
            </div>
          </div>
          <div style={{
            padding: "0.3rem 0.85rem", borderRadius: 20,
            background: result ? "#38a16918" : "#ffffff0a",
            border: `1px solid ${result ? "#38a16940" : "#333"}`,
            color: result ? "#38a169" : "#666",
            fontSize: "0.72rem", fontWeight: 600,
          }}>
            {result ? "✓ Done" : "Idle"}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 2rem" }}>
        <ConfigPanel onRun={runSimulation} loading={loading} />

        {error && (
          <div style={{
            marginTop: "1.25rem", padding: "0.85rem 1.1rem",
            background: "#e53e3e0d", border: "1px solid #e53e3e30",
            borderRadius: 10, color: "#e53e3e", fontSize: "0.82rem",
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            ⚠ {error}
          </div>
        )}

        {loading && (
          <div style={{ marginTop: "3rem", textAlign: "center", color: "#555", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 40, height: 40, border: "2px solid #222",
              borderTop: "2px solid #fff", borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: "0.85rem" }}>Running simulation…</p>
          </div>
        )}

        {result && (
          <div style={{ marginTop: "1.5rem" }}>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <StatCard label="Users" value={result.config.users} icon="👥" color="#fff" />
              <StatCard label="Articles" value={result.config.articles} icon="📄" color="#fff" />
              <StatCard label="Requests" value={result.config.requests} icon="🔄" color="#fff" />
              <StatCard label="Cache Size" value={result.config.cache_capacity} icon="🗄️" color="#fff" />
              <StatCard label="Hit Ratio" value={`${result.lru_stats.hit_ratio}%`} icon="✅" color="#38a169" />
              <StatCard label="Miss Ratio" value={`${result.lru_stats.miss_ratio}%`} icon="❌" color="#e53e3e" />
            </div>

            <SpeedupCard speedup={result.speedup} />

            {/* Tabs */}
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "1.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              {tabs.map(t => (
                <button key={t.id} id={`tab-${t.id}`} onClick={() => setActiveTab(t.id)} style={{
                  padding: "0.45rem 1.1rem", borderRadius: 8, border: "none", cursor: "pointer",
                  fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 600,
                  background: activeTab === t.id ? "#fff" : "#0d0d0d",
                  color: activeTab === t.id ? "#000" : "#666",
                  border: activeTab === t.id ? "1px solid #fff" : "1px solid #222",
                  transition: "all 0.15s",
                }}>{t.label}</button>
              ))}
            </div>

            {activeTab === "feed" && <SampleFeedCard feeds={result.sample_feeds} />}
            {activeTab === "cache" && <CacheLogTable log={result.lru_log} stats={result.lru_stats} />}
            {activeTab === "algo" && <AlgoCompareChart data={result.algo_comparison} total={result.lru_stats.total} />}
            {activeTab === "trending" && <TrendingPanel snapshots={result.trending_snapshots} />}
            {activeTab === "ref" && <ReferenceString data={result.reference_string} />}
          </div>
        )}
      </main>
    </div>
  );
}
