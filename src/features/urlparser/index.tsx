import { useState } from "react";
import { Panel, Row } from "../_shared/ui";
export default function URLParser() {
  const [v, setV] = useState("https://user:pass@example.com:8080/path/to/page?x=1&y=2#frag");
  let u: URL | null = null; try { u = new URL(v); } catch { /* ignore */ }
  const row = (k: string, val: string) => (<div style={{ display: "flex", padding: "6px 8px", borderBottom: "1px solid var(--vlc-border-subtle)" }}><div style={{ width: 90, color: "var(--vlc-text-secondary)" }}>{k}</div><div style={{ fontFamily: "var(--vlc-font-mono)", color: "var(--vlc-accent)", wordBreak: "break-all" }}>{val || "—"}</div></div>);
  return (<Panel><Row><b>URL Parser</b></Row>
    <input value={v} onChange={(e) => setV(e.target.value)} style={{ width: "100%", padding: 8, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6, fontFamily: "var(--vlc-font-mono)", fontSize: 12 }} />
    <div style={{ marginTop: 10, background: "var(--vlc-bg-elevated)", borderRadius: 6 }}>
      {u ? (<>{row("protocol", u.protocol)}{row("username", u.username)}{row("password", u.password)}{row("host", u.host)}{row("hostname", u.hostname)}{row("port", u.port)}{row("pathname", u.pathname)}{row("search", u.search)}{row("hash", u.hash)}{Array.from(u.searchParams.entries()).map(([k, v]) => row(`?${k}`, v))}</>) : <div style={{ padding: 12, color: "var(--vlc-bad, #ff4d6d)" }}>Invalid URL</div>}
    </div></Panel>);
}
