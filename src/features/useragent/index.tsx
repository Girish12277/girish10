import { Panel } from "../_shared/ui";

export default function UserAgent() {
  const rows: [string, string][] = [
    ["User Agent", navigator.userAgent],
    ["Platform", navigator.platform],
    ["Language", navigator.language],
    ["Languages", navigator.languages.join(", ")],
    ["Online", String(navigator.onLine)],
    ["Cookies enabled", String(navigator.cookieEnabled)],
    ["Hardware threads", String(navigator.hardwareConcurrency)],
    ["Screen", `${screen.width}×${screen.height} @${window.devicePixelRatio}x`],
    ["Viewport", `${innerWidth}×${innerHeight}`],
    ["Timezone", Intl.DateTimeFormat().resolvedOptions().timeZone],
    ["Color depth", `${screen.colorDepth}-bit`],
  ];
  return (
    <Panel>
      <table style={{ width: "100%", fontSize: 12 }}>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}><td style={{ opacity: 0.7, padding: "4px 8px 4px 0", verticalAlign: "top" }}>{k}</td><td style={{ wordBreak: "break-all" }}>{v}</td></tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
