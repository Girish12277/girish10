import { useEffect, useState, useCallback } from "react";

/**
 * Captures the `beforeinstallprompt` event for the manual install affordance.
 *
 * - Stashes the event so we can fire `.prompt()` later from a user gesture.
 * - Detects already-installed state (display-mode: standalone) so we hide the
 *   button in already-installed contexts.
 * - Listens for `appinstalled` to flip state without a reload.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

let deferred: BeforeInstallPromptEvent | null = null;
const subs = new Set<() => void>();

function notify() { subs.forEach((cb) => cb()); }

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

export interface InstallPromptApi {
  canInstall: boolean;
  installed: boolean;
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

export function useInstallPrompt(): InstallPromptApi {
  const [, force] = useState(0);
  useEffect(() => {
    const cb = () => force((n) => n + 1);
    subs.add(cb);
    return () => { subs.delete(cb); };
  }, []);
  const installed = isStandalone();
  const canInstall = !installed && deferred !== null;
  const promptInstall = useCallback(async () => {
    if (!deferred) return "unavailable" as const;
    try {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      deferred = null;
      notify();
      return outcome;
    } catch {
      return "unavailable" as const;
    }
  }, []);
  return { canInstall, installed, promptInstall };
}
