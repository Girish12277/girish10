import { useStudyStore } from "@/store/studyStore";
import { cardStyle, SectionTitle, TextInput, StatCard } from "../ui";

export function BuddyTab() {
  const settings = useStudyStore((s) => s.settings);
  const patch = useStudyStore((s) => s.patch);
  const streak = useStudyStore((s) => s.buddyStreak);
  const totalMin = useStudyStore((s) => s.buddyTotalMin);
  const cycles = useStudyStore((s) => s.pomoCycles);
  const phrases = [
    "One pomodoro at a time.",
    "You're 1% better than yesterday.",
    "Future-you is watching. Make them proud.",
    "Done > perfect.",
    "Small reps, big results.",
  ];
  // Stable per-hour rotation (no hydration mismatch).
  const phrase = phrases[Math.floor(Date.now() / 3_600_000) % phrases.length];

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>Study Buddy</SectionTitle>
      <div style={{ ...cardStyle, padding: 20 }} className="text-center">
        <div className="text-[44px] leading-none mb-2">🦉</div>
        <div className="text-[16px] font-semibold">{settings.buddyName}</div>
        <div className="text-[12px] mt-1" style={{ color: "var(--vlc-text-secondary)" }}>{settings.buddyGoal}</div>
        <div className="mt-4 text-[12px] italic" style={{ color: "var(--vlc-accent)" }}>"{phrase}"</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Streak" value={`${streak}d`} />
        <StatCard label="Total min" value={String(totalMin)} />
        <StatCard label="Cycles" value={String(cycles)} />
      </div>
      <div style={cardStyle}>
        <div className="text-[11px] uppercase tracking-widest mb-2" style={{ color: "var(--vlc-text-disabled)" }}>Customize</div>
        <div className="grid grid-cols-2 gap-2">
          <TextInput placeholder="Buddy name" value={settings.buddyName} onChange={(e) => patch({ settings: { ...settings, buddyName: e.target.value } })} />
          <TextInput placeholder="Big goal" value={settings.buddyGoal} onChange={(e) => patch({ settings: { ...settings, buddyGoal: e.target.value } })} />
        </div>
      </div>
    </div>
  );
}
