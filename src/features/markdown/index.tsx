import { useEffect, useMemo, useState } from "react";
import { Panel } from "../_shared/ui";

const esc = (s: string) => s.replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]!));

function render(md: string) {
  let h = esc(md);
  h = h.replace(/^### (.*)$/gm, "<h3>$1</h3>")
       .replace(/^## (.*)$/gm, "<h2>$1</h2>")
       .replace(/^# (.*)$/gm, "<h1>$1</h1>")
       .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
       .replace(/\*(.+?)\*/g, "<em>$1</em>")
       .replace(/`([^`]+)`/g, "<code>$1</code>")
       .replace(/^- (.*)$/gm, "<li>$1</li>")
       .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
       .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
       .replace(/\n\n/g, "<br/><br/>")
       .replace(/\n/g, "<br/>");
  return h;
}

const KEY = "vlc-feat-md";
export default function Markdown() {
  const [md, setMd] = useState(() => { try { return localStorage.getItem(KEY) ?? "# Hello\n\n**Markdown** preview"; } catch { return ""; } });
  useEffect(() => { try { localStorage.setItem(KEY, md); } catch {} }, [md]);
  const html = useMemo(() => render(md), [md]);
  return (
    <Panel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, height: 320 }}>
        <textarea value={md} onChange={e=>setMd(e.target.value)} spellCheck={false}
          style={{ padding: 10, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4, fontFamily: "monospace", fontSize: 12, resize: "none" }} />
        <div style={{ padding: 10, background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4, overflow: "auto", fontSize: 13 }} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Panel>
  );
}
