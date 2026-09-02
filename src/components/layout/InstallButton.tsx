import { Download } from "@/components/icons";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { usePlayerStore } from "@/store/playerStore";
import { Tooltip } from "@/components/ui/vlc-tooltip";

/**
 * Surfaces the deferred `beforeinstallprompt` so users can install the PWA
 * on demand. Renders nothing until the browser fires the event, which
 * keeps the dock rail clean on platforms where install isn't applicable.
 */
export function InstallButton() {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const pushOSD = usePlayerStore((s) => s.pushOSD);

  if (installed || !canInstall) return null;

  const onClick = async () => {
    const outcome = await promptInstall();
    if (outcome === "accepted") pushOSD("App installed — launch from your home screen");
    else if (outcome === "dismissed") pushOSD("Install dismissed — try again any time");
  };

  return (
    <Tooltip label="Install VLC Web Player" side="left" kbd="PWA">
      <button
        type="button"
        onClick={onClick}
        aria-label="Install VLC Web Player as an app"
        className="press grid place-items-center rounded-md transition-colors"
        style={{
          width: 30, height: 30,
          color: "var(--vlc-accent)",
          background: "var(--vlc-accent-dim)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in oklab, var(--vlc-accent) 30%, transparent)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--vlc-accent-dim)"; }}
      >
        <Download size={16} />
      </button>
    </Tooltip>
  );
}
