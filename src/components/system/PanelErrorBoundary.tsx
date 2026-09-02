import { Component, type ErrorInfo, type ReactNode } from "react";
import { usePlayerStore } from "@/store/playerStore";

/**
 * Wraps a lazy panel/dialog tree. If any child throws during render, we
 * swallow it at the panel boundary, surface a toast via the OSD pipeline,
 * and render a tiny inline recovery card instead of taking down the whole
 * app shell. Phase 1 of the mega-upgrade plan: every panel must be
 * crash-resilient before we start adding cloud sync / AI features that can
 * fail in novel ways.
 */
type Props = { name: string; children: ReactNode };
type State = { error: Error | null };

export class PanelErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Best-effort structured log + user-visible toast.
    // eslint-disable-next-line no-console
    console.error(`[panel:${this.props.name}]`, error, info.componentStack);
    try {
      usePlayerStore.getState().pushOSD(`${this.props.name} crashed — recovered`);
    } catch {
      /* store unavailable during very early boot — ignore */
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        role="alert"
        className="fixed right-4 bottom-4 z-[95] p-3 text-[12px]"
        style={{
          width: 280,
          background: "var(--vlc-bg-elevated)",
          border: "1px solid var(--vlc-border-normal)",
          borderRadius: "var(--vlc-radius-md)",
          boxShadow: "var(--vlc-shadow-popup)",
          color: "var(--vlc-text-primary)",
        }}
      >
        <div className="font-semibold">{this.props.name} hit an error</div>
        <div className="mt-1 text-[11px]" style={{ color: "var(--vlc-text-secondary)" }}>
          The panel was unloaded to keep the player running.
        </div>
        <div className="mt-2 flex justify-end">
          <button
            onClick={this.reset}
            className="px-2 py-1 text-[11px] rounded"
            style={{ background: "var(--vlc-accent)", color: "var(--vlc-bg-base)", fontWeight: 700 }}
          >
            Reload panel
          </button>
        </div>
      </div>
    );
  }
}