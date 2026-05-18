const TOPIC_COLORS: Record<string, string> = {
  tech: "#6c63ff",
  sports: "#00d4aa",
  politics: "#ff6b9d",
  health: "#f7b731",
  science: "#4fc3f7",
  finance: "#81c784",
  entertainment: "#ce93d8",
  world: "#ffb74d",
};

type Feed = {
  user_id: number;
  user_name: string;
  preferences: string[];
  top5: { score: number; title: string; topic: string }[];
};

type Props = { feeds: Feed[] };

export default function SampleFeedCard({ feeds }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
      {feeds.map(feed => (
        <div key={feed.user_id} style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 16, padding: "1.25rem", overflow: "hidden"
        }}>
          {/* User header */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `linear-gradient(135deg, var(--accent), var(--accent-2))`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", fontWeight: 700, color: "#fff", flexShrink: 0
            }}>
              {feed.user_name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{feed.user_name}</div>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: 3 }}>
                {feed.preferences.map(p => (
                  <span key={p} style={{
                    padding: "0.15rem 0.55rem", borderRadius: 20, fontSize: "0.65rem",
                    fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                    background: `${TOPIC_COLORS[p] ?? "#888"}20`,
                    color: TOPIC_COLORS[p] ?? "#888",
                    border: `1px solid ${TOPIC_COLORS[p] ?? "#888"}40`
                  }}>{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Articles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {feed.top5.map((article, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.65rem 0.85rem", borderRadius: 10,
                background: i === 0 ? "#6c63ff12" : "#ffffff05",
                border: i === 0 ? "1px solid #6c63ff30" : "1px solid transparent",
                transition: "background 0.2s",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  background: `${TOPIC_COLORS[article.topic] ?? "#888"}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 800, color: TOPIC_COLORS[article.topic] ?? "#888"
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {article.title}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 1, textTransform: "capitalize" }}>
                    {article.topic}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem",
                  fontWeight: 700, color: TOPIC_COLORS[article.topic] ?? "var(--accent)",
                  flexShrink: 0
                }}>{article.score.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
