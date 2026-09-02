import { useMemo, useState } from "react";
import { Panel, Row } from "../_shared/ui";
export default function WordCounter() {
  const [t, setT] = useState("");
  const stats = useMemo(() => {
    const chars = t.length; const noSpace = t.replace(/\s/g, "").length;
    const words = (t.trim().match(/\S+/g) || []).length;
    const lines = t === "" ? 0 : t.split(/\n/).length;
    const sentences = (t.match(/[.!?]+/g) || []).length;
    const readSec = Math.ceil(words / (200 / 60));
    return { chars, noSpace, words, lines, sentences, read: `${Math.floor(readSec / 60)}:${String(readSec % 60).padStart(2, "0")}` };
  }, [t]);
  return (<Panel><Row><b>Word Counter</b></Row>
    <textarea value={t} onChange={(e) => setT(e.target.value)} placeholder="Paste text…" style={{ width: "100%", minHeight: 160, padding: 8, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6, fontFamily: "var(--vlc-font-mono)" }} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 10, fontSize: 12 }}>
      {[["Words", stats.words], ["Chars", stats.chars], ["No spaces", stats.noSpace], ["Lines", stats.lines], ["Sentences", stats.sentences], ["Read", stats.read]].map(([k, v]) => (
        <div key={k as string} style={{ padding: 8, background: "var(--vlc-bg-elevated)", borderRadius: 6 }}><div style={{ color: "var(--vlc-text-secondary)" }}>{k}</div><div style={{ fontSize: 16, fontWeight: 700, color: "var(--vlc-accent)" }}>{v}</div></div>
      ))}
    </div></Panel>);
}
