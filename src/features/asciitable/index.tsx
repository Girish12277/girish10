import { Panel } from "../_shared/ui";

export default function AsciiTable() {
  const rows = [];
  for (let i = 32; i < 127; i++) rows.push(i);
  return (
    <Panel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, fontFamily: "var(--vlc-font-mono, monospace)", fontSize: 11, maxHeight: 360, overflowY: "auto" }}>
        {rows.map((i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 6px", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }}>
            <span style={{ opacity: 0.6 }}>{i}</span>
            <span style={{ opacity: 0.6 }}>0x{i.toString(16).toUpperCase().padStart(2, "0")}</span>
            <span style={{ fontWeight: 700 }}>{String.fromCharCode(i)}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
