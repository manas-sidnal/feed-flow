type Props = { label: string; value: string | number; icon: string; color: string };

export default function StatCard({ label, value, icon, color }: Props) {
  return (
    <div style={{
      background: "#0d0d0d", border: "1px solid #222", borderRadius: 12,
      padding: "0.85rem 1rem",
    }}>
      <div style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>{icon}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.68rem", color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}
