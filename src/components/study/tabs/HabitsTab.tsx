import { useMemo, useState } from "react";
import { useStudyStore } from "@/store/studyStore";
import { cardStyle, SectionTitle, TextInput, PrimaryBtn, EmptyHint } from "../ui";

export function HabitsTab() {
  const habits = useStudyStore((s) => s.habits);
  const addHabit = useStudyStore((s) => s.addHabit);
  const toggle = useStudyStore((s) => s.toggleHabitToday);
  const deleteHabit = useStudyStore((s) => s.deleteHabit);

  const [title, setTitle] = useState(""); const [emoji, setEmoji] = useState("✨");

  const last7 = useMemo(() => {
    const arr: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      arr.push(d.toISOString().slice(0, 10));
    }
    return arr;
  }, []);

  const streak = (h: { history: Record<string, boolean> }) => {
    let count = 0;
    for (let i = 0; ; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      if (h.history[k]) count++; else break;
    }
    return count;
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>Daily Habits</SectionTitle>
      <div style={cardStyle} className="flex gap-2">
        <TextInput placeholder="Emoji" value={emoji} onChange={(e) => setEmoji(e.target.value.slice(0, 2))} style={{ maxWidth: 60 }} />
        <TextInput placeholder="New habit (e.g. Read 20 pages)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <PrimaryBtn onClick={() => { if (title.trim()) { addHabit({ title: title.trim(), emoji: emoji || "✨", daysOfWeek: [0, 1, 2, 3, 4, 5, 6] }); setTitle(""); } }}>Add</PrimaryBtn>
      </div>
      {habits.length === 0 ? <EmptyHint>Tiny daily habits compound. Add one.</EmptyHint> : (
        <ul className="flex flex-col gap-2">
          {habits.map((h) => {
            const today = new Date().toISOString().slice(0, 10);
            const doneToday = !!h.history[today];
            return (
              <li key={h.id} style={cardStyle}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggle(h.id)} className="text-[20px] leading-none"
                    style={{ filter: doneToday ? "none" : "grayscale(1)", opacity: doneToday ? 1 : 0.5 }}>{h.emoji}</button>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{h.title}</div>
                    <div className="text-[10.5px]" style={{ color: "var(--vlc-text-secondary)" }}>🔥 {streak(h)} day streak</div>
                  </div>
                  <div className="flex gap-1">
                    {last7.map((d) => (
                      <div key={d} title={d}
                        style={{
                          width: 12, height: 12, borderRadius: 3,
                          background: h.history[d] ? "var(--vlc-accent)" : "color-mix(in oklab, var(--vlc-text-primary) 10%, transparent)",
                        }} />
                    ))}
                  </div>
                  <button onClick={() => deleteHabit(h.id)} className="opacity-40 hover:opacity-100 text-[11px]">✕</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
