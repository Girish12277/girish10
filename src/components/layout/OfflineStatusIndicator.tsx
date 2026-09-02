import { useState, useEffect } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff, X } from "lucide-react";

export function OfflineStatusIndicator() {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (!isOnline) {
      setDismissed(false);
      // Auto dismiss notification toast after 5 seconds so it doesn't block controls
      const timer = setTimeout(() => {
        setDismissed(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setDismissed(false);
    }
  }, [isOnline]);

  if (isOnline || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-3 left-3 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-emerald-400 text-xs font-semibold border border-emerald-500/30 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <WifiOff size={14} className="text-amber-400 shrink-0" />
      <span>Offline Mode — 100% Features Active</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-1 p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        aria-label="Dismiss notification"
        title="Dismiss notification"
      >
        <X size={12} />
      </button>
    </div>
  );
}
