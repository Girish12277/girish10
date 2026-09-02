import { usePlayerStore } from "@/store/playerStore";
import { isVisible } from "@/utils/uiCustomization";

/**
 * OSDDisplay — on-screen-display message stack.
 *
 * Phase 5 upgrade:
 *  - Context-aware icons for common OSD messages (volume, play, pause, seek, etc.)
 *  - Countdown progress bar that visually shows auto-dismiss timing.
 *  - Stacked messages with stagger delay for smooth appearance.
 *  - CSS keyframe entrance (no animation runtime — this renders on every
 *    session, so it must stay out of the initial bundle).
 *  - Reduced-motion path collapses to opacity (handled globally in styles.css).
 */

const OSD_LIFETIME = 1500; // matches playerStore pushOSD timeout

/** Map message content patterns to contextual icons */
function getOSDIcon(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("volume")) return "🔊";
  if (t.includes("mute")) return "🔇";
  if (t.includes("play") || t.includes("resumed")) return "▶";
  if (t.includes("pause")) return "⏸";
  if (t.includes("stop")) return "⏹";
  if (t.includes("seek") || t.includes("◀") || t.includes("▶▶") || t.includes("10s")) return "⏩";
  if (t.includes("repeat")) return "🔁";
  if (t.includes("speed")) return "⚡";
  if (t.includes("fullscreen")) return "⛶";
  if (t.includes("snapshot") || t.includes("screenshot")) return "📸";
  if (t.includes("bookmark")) return "🔖";
  if (t.includes("subtitle")) return "💬";
  if (t.includes("a-b loop")) return "🔂";
  if (t.includes("skin") || t.includes("theme")) return "🎨";
  if (t.includes("opened") || t.includes("file")) return "📂";
  if (t.includes("update")) return "🔄";
  if (t.includes("end of playlist")) return "🏁";
  return "●"; // default dot
}

export function OSDDisplay() {
  const osd = usePlayerStore((s) => s.osd);
  const vis = usePlayerStore((s) => s.uiVisibility);
  if (!isVisible(vis, "chrome.osd") || !isVisible(vis, "osd.messages")) return null;
  return (
    <div
      data-vlc-osd
      aria-live="polite"
      aria-atomic="false"
      className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1.5 z-30"
    >
      {osd.map((m, i) => {
        const icon = getOSDIcon(m.text);
        const isDefaultDot = icon === "●";
        return (
          <div
            key={m.id}
            className="vlc-osd-pill glass-panel inline-flex items-center gap-2 rounded-full"
            style={{
              padding: "6px 14px 6px 10px",
              border: "1px solid var(--vlc-border-normal)",
              boxShadow: "var(--vlc-shadow-3)",
              color: "var(--vlc-text-primary)",
              fontSize: 12.5,
              fontFamily: "var(--vlc-font-ui)",
              maxWidth: "60vw",
              animationDelay: `${i * 40}ms`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Auto-dismiss progress bar */}
            <span
              aria-hidden="true"
              className="vlc-osd-progress"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 2,
                background: "var(--vlc-accent)",
                opacity: 0.5,
                borderRadius: "var(--vlc-radius-full)",
                animationDuration: `${OSD_LIFETIME}ms`,
              }}
            />

            {/* Icon */}
            {isDefaultDot ? (
              <span
                aria-hidden="true"
                className="inline-block rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  flexShrink: 0,
                  background: "var(--vlc-accent)",
                  boxShadow: "0 0 8px color-mix(in oklab, var(--vlc-accent) 60%, transparent)",
                }}
              />
            ) : (
              <span
                aria-hidden="true"
                style={{
                  fontSize: 13,
                  lineHeight: 1,
                  flexShrink: 0,
                  filter: "drop-shadow(0 0 4px color-mix(in oklab, var(--vlc-accent) 30%, transparent))",
                }}
              >
                {icon}
              </span>
            )}

            <span className="truncate">{m.text}</span>
          </div>
        );
      })}
    </div>
  );
}
