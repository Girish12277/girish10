import { useMemo, useState } from "react";
import { Panel } from "../_shared/ui";

export default function Regex() {
  const [pat, setPat] = useState("\\b\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Hello world, test 123 regex.");
  const result = useMemo(() => {
    try {
      const re = new RegExp(pat, flags);
      const matches = [...text.matchAll(re.global ? re : new RegExp(pat, flags + "g"))];
      const highlighted = text.replace(re, m => `\u0001${m}\u0002`).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]!))
        .replace(/\u0001/g, '<mark style="background:#ffb300;color:#000">').replace(/\u0002/g, '</mark>');
      return { count: matches.length, html: highlighted, err: "" };
    } catch (e) { return { count: 0, html: text, err: String((e as Error).message) }; }
  }, [pat, flags, text]);
  return (
    <Panel>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <span style={{ alignSelf: "center" }}>/</span>
        <input value={pat} onChange={e=>setPat(e.target.value)} style={{ flex: 1, padding: 6, background: "var(--vlc-bg-base)", color: "var(--vlc-accent)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4, fontFamily: "monospace" }} />
        <span style={{ alignSelf: "center" }}>/</span>
        <input value={flags} onChange={e=>setFlags(e.target.value)} style={{ width: 60, padding: 6, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4, fontFamily: "monospace" }} />
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} style={{ width: "100%", height: 100, padding: 8, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4, fontFamily: "monospace", fontSize: 12, marginBottom: 8 }} />
      <div style={{ padding: 10, background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4, minHeight: 60, fontFamily: "monospace", fontSize: 12 }} dangerouslySetInnerHTML={{ __html: result.html }} />
      <div style={{ marginTop: 6, fontSize: 11, color: result.err ? "#e57373" : "var(--vlc-text-ghost)" }}>{result.err || `${result.count} match(es)`}</div>
    </Panel>
  );
}
