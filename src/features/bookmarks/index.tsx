import { useEffect, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, useMediaTime, NoMedia, fmtTime } from "../_shared/media";

type BM = { id: string; t: number; name: string };
const KEY = "vlc-bookmarks";

export default function Bookmarks() {
  const m = useMedia();
  const t = useMediaTime(m);
  const [list, setList] = useState<BM[]>([]);
  useEffect(() => { try { setList(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* */ } }, []);
  const save = (l: BM[]) => { setList(l); try { localStorage.setItem(KEY, JSON.stringify(l)); } catch { /* */ } };
  if (!m) return <NoMedia />;
  const add = () => save([...list, { id: crypto.randomUUID(), t: m.currentTime, name: `BM ${list.length + 1}` }]);
  const del = (id: string) => save(list.filter((x) => x.id !== id));
  return (
    <Panel>
      <Row><strong>Bookmarks</strong></Row>
      <Row><span>{fmtTime(t.cur)}</span><Btn onClick={add}>Add at current</Btn></Row>
      <div style={{ maxHeight: 200, overflowY: "auto" }}>
        {list.map((b) => (
          <Row key={b.id}>
            <input value={b.name} onChange={(e) => save(list.map((x) => x.id === b.id ? { ...x, name: e.target.value } : x))}
                   style={{ flex: 1, background: "transparent", border: "1px solid var(--vlc-border-subtle)", color: "inherit", padding: 4 }} />
            <Btn onClick={() => { m.currentTime = b.t; }}>{fmtTime(b.t)}</Btn>
            <Btn onClick={() => del(b.id)}>✕</Btn>
          </Row>
        ))}
        {list.length === 0 && <span style={{ opacity: 0.5 }}>No bookmarks yet.</span>}
      </div>
    </Panel>
  );
}
