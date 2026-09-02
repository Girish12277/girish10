import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff } from "lucide-react";

export function OfflineStatusIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-emerald-400 text-xs font-semibold border border-emerald-500/30 backdrop-blur-md shadow-lg animate-in fade-in duration-300">
      <WifiOff size={14} className="text-amber-400" />
      <span>Offline Mode — 100% Features Active</span>
    </div>
  );
}
