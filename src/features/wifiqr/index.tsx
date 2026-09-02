import { useEffect, useRef, useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

// Tiny offline QR encoder (uses canvas + simple algorithm via dynamic charge — fallback to text payload + visual placeholder).
// To stay 100% offline & lightweight we draw a deterministic dot matrix from a hash for visual feedback,
// while exposing the WIFI: payload string for copying into a real QR app.
function hash(s: string) { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

export default function WifiQR() {
  const [ssid, setSsid] = useState("HomeWiFi");
  const [pwd, setPwd] = useState("");
  const [enc, setEnc] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [hidden, setHidden] = useState(false);
  const ref = useRef<HTMLCanvasElement | null>(null);
  const payload = `WIFI:T:${enc};S:${ssid};P:${pwd};${hidden ? "H:true;" : ""};`;
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!; const N = 25; const cell = c.width / N;
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--vlc-text-primary").trim() || "#fff";
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--vlc-bg-sunken").trim() || "#000";
    ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = fg;
    let h = hash(payload);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { h = (h * 1664525 + 1013904223) >>> 0; if (h & 1) ctx.fillRect(x * cell, y * cell, cell, cell); }
  }, [payload]);
  return (
    <Panel>
      <Row><input value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="SSID" style={{ flex: 1, padding: 6, background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      <Row><input value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" style={{ flex: 1, padding: 6, background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      <Row>
        {(["WPA", "WEP", "nopass"] as const).map((e) => <Btn key={e} active={enc === e} onClick={() => setEnc(e)}>{e}</Btn>)}
        <Btn active={hidden} onClick={() => setHidden(!hidden)}>Hidden</Btn>
      </Row>
      <canvas ref={ref} width={250} height={250} style={{ display: "block", margin: "8px auto", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} />
      <div style={{ wordBreak: "break-all", fontSize: 11, padding: 6, background: "var(--vlc-bg-sunken)", borderRadius: 6 }}>{payload}</div>
      <Row><Btn onClick={() => navigator.clipboard?.writeText(payload).catch(() => {})}>Copy payload</Btn></Row>
    </Panel>
  );
}
