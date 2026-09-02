import { useState } from "react";
import { useStudyStore } from "@/store/studyStore";
import { cardStyle, SectionTitle, TextInput, PrimaryBtn, EmptyHint } from "../ui";

export function GoalsTab() {
  const goals = useStudyStore((s) => s.goals);
  const addGoal = useStudyStore((s) => s.addGoal);
  const updateGoal = useStudyStore((s) => s.updateGoal);
  const deleteGoal = useStudyStore((s) => s.deleteGoal);
  const toggleMilestone = useStudyStore((s) => s.toggleMilestone);

  const [title, setTitle] = useState(""); const [why, setWhy] = useState(""); const [deadline, setDeadline] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>SMART Goals</SectionTitle>
      <div style={cardStyle} className="flex flex-col gap-2">
        <TextInput placeholder="Goal (e.g. Score 90% on Chem mid-term)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextInput placeholder="Why does this matter to me?" value={why} onChange={(e) => setWhy(e.target.value)} />
        <div className="flex gap-2 items-center">
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
            className="px-2 py-1.5 text-[12px] rounded-md" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }} />
          <PrimaryBtn onClick={() => {
            if (!title.trim()) return;
            addGoal({ title: title.trim(), why, target: 100, deadline: deadline ? new Date(deadline).getTime() : null });
            setTitle(""); setWhy(""); setDeadline("");
          }}>Add goal</PrimaryBtn>
        </div>
      </div>

      {goals.length === 0 ? <EmptyHint>Set a goal you can measure.</EmptyHint> : (
        <ul className="flex flex-col gap-3">
          {goals.map((g) => (
            <li key={g.id} style={cardStyle}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold">{g.title}</div>
                  {g.why && <div className="text-[11px] mt-0.5" style={{ color: "var(--vlc-text-secondary)" }}>{g.why}</div>}
                </div>
                <button onClick={() => deleteGoal(g.id)} className="opacity-40 hover:opacity-100 text-[11px]">✕</button>
              </div>
              <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: "var(--vlc-bg-sunken)" }}>
                <div style={{ width: `${g.current}%`, height: "100%", background: "var(--vlc-accent)", transition: "width 200ms ease" }} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input type="range" min={0} max={100} value={g.current} onChange={(e) => updateGoal(g.id, { current: Number(e.target.value) })}
                  className="flex-1" style={{ accentColor: "var(--vlc-accent)" }} />
                <span className="text-[11px] vlc-num tabular-nums w-10 text-right">{g.current}%</span>
              </div>
              {g.milestones.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {g.milestones.map((m) => (
                    <li key={m.id} className="flex items-center gap-2 text-[12px]">
                      <input type="checkbox" checked={m.done} onChange={() => toggleMilestone(g.id, m.id)} style={{ accentColor: "var(--vlc-accent)" }} />
                      <span style={{ textDecoration: m.done ? "line-through" : "none" }}>{m.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
