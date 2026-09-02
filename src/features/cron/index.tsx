import { useState } from "react";
import { Panel, Row } from "../_shared/ui";
const describe = (expr: string): string => {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Need 5 fields: min hour dom mon dow";
  const [m, h, dom, mon, dow] = parts;
  const f = (v: string, single: string, all: string) => v === "*" ? all : v.includes("/") ? `every ${v.split("/")[1]} ${single}` : v.includes(",") ? `at ${single}s ${v}` : `at ${single} ${v}`;
  return [f(m, "minute", "every minute"), f(h, "hour", "every hour"), dom === "*" ? "" : `on day ${dom}`, mon === "*" ? "" : `in month ${mon}`, dow === "*" ? "" : `on weekday ${dow}`].filter(Boolean).join(", ");
};
const PRESETS = [["Every minute", "* * * * *"], ["Hourly", "0 * * * *"], ["Daily 6 AM", "0 6 * * *"], ["Weekdays 9 AM", "0 9 * * 1-5"], ["Every 5 min", "*/5 * * * *"], ["Weekly Sun", "0 0 * * 0"]];
export default function Cron() {
  const [v, setV] = useState("*/15 * * * *");
  return (<Panel><Row><b>Cron Helper</b></Row>
    <input value={v} onChange={(e) => setV(e.target.value)} style={{ width: "100%", padding: 8, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6, fontFamily: "var(--vlc-font-mono)" }} />
    <div style={{ marginTop: 10, padding: 12, background: "var(--vlc-bg-base)", border: "1px solid var(--vlc-accent)", borderRadius: 6, color: "var(--vlc-accent)" }}>{describe(v)}</div>
    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>{PRESETS.map(([l, e]) => (<button key={e} onClick={() => setV(e)} style={{ padding: "4px 8px", fontSize: 11, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 4, cursor: "pointer" }}>{l}</button>))}</div>
  </Panel>);
}
