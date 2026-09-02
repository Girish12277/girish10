import { useEffect, useState } from "react";
import { Panel, Btn } from "../_shared/ui";

type T = { id: number; text: string; done: boolean };
const KEY = "vlc-feat-todo";

export default function Todo() {
  const [items, setItems] = useState<T[]>(() => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } });
  const [text, setText] = useState("");
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items]);

  const add = () => { if (!text.trim()) return; setItems(i => [{ id: Date.now(), text, done: false }, ...i]); setText(""); };

  return (
    <Panel>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="New task…"
          style={{ flex: 1, padding: 8, background: "var(--vlc-bg-base)", border: "1px solid var(--vlc-border-subtle)", color: "var(--vlc-text-primary)", borderRadius: 4 }} />
        <Btn onClick={add}>Add</Btn>
      </div>
      <div style={{ maxHeight: 280, overflow: "auto" }}>
        {items.map(t => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: 6, borderBottom: "1px solid var(--vlc-border-subtle)" }}>
            <input type="checkbox" checked={t.done} onChange={() => setItems(arr => arr.map(x => x.id===t.id?{...x, done:!x.done}:x))} />
            <span style={{ flex: 1, textDecoration: t.done?"line-through":"none", opacity: t.done?0.5:1 }}>{t.text}</span>
            <button onClick={() => setItems(arr => arr.filter(x => x.id!==t.id))} style={{ background: "none", border: "none", color: "var(--vlc-text-ghost)", cursor: "pointer" }}>✕</button>
          </div>
        ))}
        {!items.length && <div style={{ opacity: 0.5, textAlign: "center", padding: 20 }}>No tasks yet</div>}
      </div>
    </Panel>
  );
}
