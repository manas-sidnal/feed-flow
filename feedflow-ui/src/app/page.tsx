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
    { id: "feed", label: "📰 Sample Feed" },
    { id: "cache", label: "🗄️ LRU Log" },
    { id: "algo", label: "📊 Algo Comparison" },
    { id: "trending", label: "🔥 Trending" },
    { id: "ref", label: "🔗 Reference String" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        background: "linear-gradient(135deg, #0d0d1a 0%, #0a0a0f 100%)",
        padding: "0 2rem",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 0 16px var(--accent)60"
            }}>⚡</div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                Feed<span style={{ color: "var(--accent)" }}>Flow</span>
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Feed Simulator
              </div>
            </div>
          </div>
          <div style={{
            padding: "0.35rem 1rem", borderRadius: 20,
            background: result ? "#00d4aa18" : "#6c63ff18",
            border: `1px solid ${result ? "#00d4aa40" : "#6c63ff30"}`,
            color: result ? "var(--accent-3)" : "var(--accent)",
            fontSize: "0.75rem", fontWeight: 600,
          }}>
            {result ? `✓ Simulation Complete` : "Idle"}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem" }}>
        {/* Config */}
        <ConfigPanel onRun={runSimulation} loading={loading} />

        {/* Error */}
        {error && (
          <div style={{
            marginTop: "1.5rem", padding: "1rem 1.25rem",
            background: "#ff6b9d12", border: "1px solid #ff6b9d40",
            borderRadius: 12, color: "#ff6b9d", fontSize: "0.875rem", fontFamily: "JetBrains Mono, monospace"
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            marginTop: "3rem", textAlign: "center", color: "var(--text-secondary)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem"
          }}>
            <div style={{
              width: 48, height: 48, border: "3px solid var(--border)",
              borderTop: "3px solid var(--accent)", borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: "0.9rem" }}>Running simulation…</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ marginTop: "2rem" }}>
            {/* Stat cards row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              <StatCard label="Users" value={result.config.users} icon="👥" color="var(--accent)" />
              <StatCard label="Articles" value={result.config.articles} icon="📄" color="var(--accent-2)" />
              <StatCard label="Requests" value={result.config.requests} icon="🔄" color="var(--accent-3)" />
              <StatCard label="Cache Size" value={result.config.cache_capacity} icon="🗄️" color="var(--accent-4)" />
              <StatCard label="Hit Ratio" value={`${result.lru_stats.hit_ratio}%`} icon="✅" color="var(--accent-3)" />
              <StatCard label="Miss Ratio" value={`${result.lru_stats.miss_ratio}%`} icon="❌" color="var(--accent-2)" />
            </div>

            {/* Speedup banner */}
            <SpeedupCard speedup={result.speedup} />

            {/* Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {tabs.map(t => (
                <button key={t.id} id={`tab-${t.id}`} onClick={() => setActiveTab(t.id)} style={{
                  padding: "0.5rem 1.25rem", borderRadius: 10, border: "none", cursor: "pointer",
                  fontFamily: "Inter, sans-serif", fontSize: "0.85rem", fontWeight: 600,
                  background: activeTab === t.id ? "var(--accent)" : "var(--bg-card)",
                  color: activeTab === t.id ? "#fff" : "var(--text-secondary)",
                  border: activeTab === t.id ? "1px solid var(--accent)" : "1px solid var(--border)",
                  transition: "all 0.2s",
                  boxShadow: activeTab === t.id ? "0 0 16px var(--accent)50" : "none"
                }}>{t.label}</button>
              ))}
            </div>

            {/* Tab content */}
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
