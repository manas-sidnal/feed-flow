type Props = { label: string; value: string | number; icon: string; color: string };

export default function StatCard({ label, value, icon, color }: Props) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14,
      padding: "1rem 1.25rem", position: "relative", overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${color}25`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0, width: 60, height: 60,
        background: `radial-gradient(circle at top right, ${color}20, transparent)`,
        borderRadius: "0 14px 0 60px"
      }} />
      <div style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}
