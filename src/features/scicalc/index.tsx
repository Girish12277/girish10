import { useEffect, useState } from "react";

/**
 * TCSion Scientific Calculator — vendored under /vendor/scicalc/ so it works
 * fully offline once the service worker precache has run.
 *
 * Source: https://www.tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html
 * The HTML/CSS/JS were downloaded verbatim; nothing is reimplemented. The
 * iframe is locked to the calculator's native 463px container width plus a
 * small margin so nothing is cut or scrolls.
 */

const CALC_WIDTH = 463;
const CALC_HEIGHT = 398;

export default function ScientificCalculator() {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  return (
    <div style={{ padding: 0, background: "var(--vlc-bg-elevated)" }}>
      <div
        style={{
          width: CALC_WIDTH,
          height: CALC_HEIGHT,
          background: "#e6e6e6",
          overflow: "hidden",
          borderRadius: 4,
          margin: "0 auto",
        }}
      >
        <iframe
          src="/vendor/scicalc/Calculator.html"
          title="Scientific Calculator"
          width={CALC_WIDTH}
          height={CALC_HEIGHT}
          scrolling="no"
          style={{
            display: "block",
            width: CALC_WIDTH,
            height: CALC_HEIGHT,
            border: 0,
            background: "#e6e6e6",
          }}
          // Sandbox: allow scripts (jQuery + calc logic) but no top-nav, no popups.
          sandbox="allow-scripts allow-same-origin"
          loading="eager"
        />
      </div>
      <div
        style={{
          padding: "6px 10px",
          fontSize: 10,
          color: "var(--vlc-text-ghost)",
          textAlign: "center",
          fontFamily: "var(--vlc-font-mono, ui-monospace, monospace)",
        }}
      >
        Source: TCSion · {online ? "Online" : "Offline mode (cached)"}
      </div>
    </div>
  );
}