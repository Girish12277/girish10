import { useMemo } from "react";
import { useStudyStore } from "@/store/studyStore";
import { cardStyle, SectionTitle, StatCard } from "../ui";
import { HeatmapChart } from "./HeatmapChart";

export function StatsTab() {
  const sessions = useStudyStore((s) => s.sessions);
  const tasks = useStudyStore((s) => s.tasks);
  const habits = useStudyStore((s) => s.habits);
  const streak = useStudyStore((s) => s.buddyStreak);
  const totalMin = useStudyStore((s) => s.buddyTotalMin);

  const last7Days = useMemo(() => {
    const buckets: { day: string; min: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const next = d.getTime() + 86400_000;
      const min = sessions
        .filter((s) => s.mode === "focus" && s.end >= d.getTime() && s.end < next)
        .reduce((acc, s) => acc + (s.end - s.start) / 60_000, 0);
      buckets.push({ day: d.toLocaleDateString(undefined, { weekday: "short" }), min: Math.round(min) });
    }
    return buckets;
  }, [sessions]);

  const max = Math.max(60, ...last7Days.map((b) => b.min));
  const tasksDone = tasks.filter((t) => t.done).length;

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle>Productivity Analytics & Heatmap</SectionTitle>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Focus min today" value={String(last7Days[last7Days.length - 1]?.min ?? 0)} />
        <StatCard label="Current Streak" value={`🔥 ${streak}d`} />
        <StatCard label="Total Focus Time" value={`${totalMin} mins`} />
        <StatCard label="Tasks Completed" value={`${tasksDone}/${tasks.length}`} />
      </div>

      {/* 365-Day GitHub Contribution Heatmap */}
      <HeatmapChart />

      <div style={cardStyle}>
        <div className="text-[11px] uppercase font-bold tracking-widest mb-3" style={{ color: "var(--vlc-text-disabled)" }}>
          Last 7 Days · Focus Minutes
        </div>
        <div className="flex items-end gap-3" style={{ height: 140 }}>
          {last7Days.map((b) => (
            <div key={b.day} className="flex-1 flex flex-col items-center gap-1.5">
              <div style={{
                width: "100%", height: `${(b.min / max) * 100}%`, minHeight: 4,
                background: "linear-gradient(to top, var(--vlc-accent), color-mix(in oklab, var(--vlc-accent) 40%, transparent))",
                borderRadius: 6,
              }} />
              <div className="text-[10.5px] font-semibold" style={{ color: "var(--vlc-text-disabled)" }}>{b.day}</div>
              <div className="text-[10px] font-bold vlc-num tabular-nums">{b.min}m</div>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div className="text-[11px] uppercase font-bold tracking-widest mb-2" style={{ color: "var(--vlc-text-disabled)" }}>Active Habits & Goals</div>
        <div className="text-[12px] font-medium" style={{ color: "var(--vlc-text-secondary)" }}>{habits.length} habits tracked across active study sessions.</div>
      </div>
    </div>
  );
}
