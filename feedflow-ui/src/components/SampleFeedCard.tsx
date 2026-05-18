type Feed = {
  user_id: number;
  user_name: string;
  preferences: string[];
  top5: { score: number; title: string; topic: string }[];
};

type Props = { feeds: Feed[] };

export default function SampleFeedCard({ feeds }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1rem" }}>
      {feeds.map(feed => (
        <div key={feed.user_id} style={{
          background: "#0d0d0d", border: "1px solid #222",
          borderRadius: 12, padding: "1.1rem",
        }}>
          {/* User header */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1rem" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "#1a1a1a", border: "1px solid #333",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", fontWeight: 700, color: "#fff", flexShrink: 0
            }}>
              {feed.user_name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>{feed.user_name}</div>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: 3 }}>
                {feed.preferences.map(p => (
                  <span key={p} style={{
                    padding: "0.12rem 0.5rem", borderRadius: 4, fontSize: "0.62rem",
                    fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em",
                    background: "#1a1a1a", color: "#888", border: "1px solid #333"
                  }}>{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Articles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {feed.top5.map((article, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "0.65rem",
                padding: "0.55rem 0.75rem", borderRadius: 8,
                background: i === 0 ? "#ffffff08" : "transparent",
                border: i === 0 ? "1px solid #333" : "1px solid transparent",
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                  background: "#1a1a1a", border: "1px solid #333",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.62rem", fontWeight: 800, color: i === 0 ? "#fff" : "#555"
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#ddd", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {article.title}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#555", marginTop: 1, textTransform: "capitalize" }}>
                    {article.topic}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem",
                  fontWeight: 700, color: "#38a169", flexShrink: 0
                }}>{article.score.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
