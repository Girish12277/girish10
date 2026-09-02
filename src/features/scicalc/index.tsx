import { useState, useEffect } from "react";

/**
 * Official TCS iON Scientific Calculator — iframe embedded with CSS scale zoom
 * and tight minimal border box formatting.
 *
 * Source: https://www.tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html
 * Local Vendored Path: /vendor/scicalc/Calculator.html
 */

const BASE_WIDTH = 465;
const BASE_HEIGHT = 324;
const SCALE = 1.08;

export default function ScientificCalculator() {
  const [iframeSrc, setIframeSrc] = useState<string>("/vendor/scicalc/Calculator.html");

  useEffect(() => {
    // Test if local vendor Calculator.html is available
    fetch("/vendor/scicalc/Calculator.html", { method: "HEAD" })
      .then((res) => {
        if (!res.ok) {
          setIframeSrc("https://www.tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html");
        }
      })
      .catch(() => {
        setIframeSrc("https://www.tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html");
      });
  }, []);

  return (
    <div
      style={{
        padding: 0,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--vlc-bg-elevated, #111)",
      }}
    >
      {/* Tight Minimal Border Box */}
      <div
        style={{
          width: Math.round(BASE_WIDTH * SCALE),
          height: Math.round(BASE_HEIGHT * SCALE),
          overflow: "hidden",
          borderRadius: 8,
          border: "1px solid var(--vlc-border-subtle, rgba(255,255,255,0.15))",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
          background: "#e6e6e6",
          position: "relative",
        }}
      >
        <iframe
          src={iframeSrc}
          title="TCS iON Scientific Calculator"
          width={BASE_WIDTH}
          height={BASE_HEIGHT}
          scrolling="no"
          style={{
            display: "block",
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            border: 0,
            background: "#e6e6e6",
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
          }}
          sandbox="allow-scripts allow-same-origin"
          loading="eager"
        />
      </div>
    </div>
  );
}