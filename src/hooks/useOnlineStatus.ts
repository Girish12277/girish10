import { useEffect, useState } from "react";

/**
 * Live online/offline status — wraps `navigator.onLine` with `online` /
 * `offline` events. SSR-safe (returns `true` on the server so the first
 * paint never flashes an "offline" pill).
 */
export function useOnlineStatus(): boolean {
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
  return online;
}
