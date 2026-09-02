import { useEffect, useState } from "react";
import { Panel } from "../_shared/ui";

const ZONES = [
  { name: "New York", tz: "America/New_York" },
  { name: "London", tz: "Europe/London" },
  { name: "Paris", tz: "Europe/Paris" },
  { name: "Dubai", tz: "Asia/Dubai" },
  { name: "Mumbai", tz: "Asia/Kolkata" },
  { name: "Tokyo", tz: "Asia/Tokyo" },
  { name: "Sydney", tz: "Australia/Sydney" },
  { name: "LA", tz: "America/Los_Angeles" },
];

export default function WorldClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <Panel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {ZONES.map(z => (
          <div key={z.tz} style={{ padding: 10, background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: "var(--vlc-text-secondary)" }}>{z.name}</div>
            <div style={{ fontSize: 20, fontFamily: "monospace" }}>{now.toLocaleTimeString("en-GB", { timeZone: z.tz, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
            <div style={{ fontSize: 10, color: "var(--vlc-text-ghost)" }}>{now.toLocaleDateString("en-US", { timeZone: z.tz, weekday: "short", month: "short", day: "numeric" })}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
