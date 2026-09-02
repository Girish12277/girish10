import { useState, useEffect } from "react";

export function useOnlineStatus() {
  // Always default to true during SSR to prevent pre-rendering offline banners
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Sync with actual client navigator status after mount
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
