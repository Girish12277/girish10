import { useMemo } from "react";
import { useStudyStore } from "@/store/studyStore";

export function HeatmapChart() {
  const sessions = useStudyStore((s) => s.sessions);

  // Build 365-day map of study minutes per date (YYYY-MM-DD)
  const heatmapData = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      if (!s.end) continue;
      const dateStr = new Date(s.end).toISOString().split("T")[0];
      const mins = Math.max(0, (s.end - s.start) / 60000);
      map.set(dateStr, (map.get(dateStr) ?? 0) + mins);
    }

    // Generate array of past 365 days
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const mins = map.get(dateKey) ?? 0;
      days.push({ dateKey, mins });
    }
    return days;
  }, [sessions]);

  const getIntensityColor = (mins: number) => {
    if (mins === 0) return "var(--vlc-bg-sunken)";
    if (mins < 30) return "color-mix(in oklab, var(--vlc-accent) 30%, transparent)";
    if (mins < 60) return "color-mix(in oklab, var(--vlc-accent) 60%, transparent)";
    if (mins < 120) return "var(--vlc-accent)";
    return "color-mix(in oklab, var(--vlc-accent) 90%, #fff)";
  };

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-normal)" }}>
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--vlc-text-secondary)" }}>
        <span>365-Day Study Contribution Heatmap</span>
        <div className="flex items-center gap-1 text-[10px]" style={{ color: "var(--vlc-text-ghost)" }}>
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--vlc-bg-sunken)" }} />
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "color-mix(in oklab, var(--vlc-accent) 30%, transparent)" }} />
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--vlc-accent)" }} />
          <span>More</span>
        </div>
      </div>

      {/* 52-week horizontal grid */}
      <div className="overflow-x-auto pb-1">
        <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
          {heatmapData.map((d) => (
            <div
              key={d.dateKey}
              title={`${d.dateKey}: ${Math.round(d.mins)} mins studied`}
              className="w-2.5 h-2.5 rounded-sm transition-all hover:scale-125"
              style={{ background: getIntensityColor(d.mins), border: "1px solid var(--vlc-border-subtle)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
