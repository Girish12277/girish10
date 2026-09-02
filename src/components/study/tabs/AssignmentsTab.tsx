import { useMemo, useState } from "react";
import { useStudyStore } from "@/store/studyStore";
import { cardStyle, SectionTitle, TextInput, NumInput, PrimaryBtn, EmptyHint } from "../ui";

export function AssignmentsTab() {
  const items = useStudyStore((s) => s.assignments);
  const add = useStudyStore((s) => s.addAssignment);
  const upd = useStudyStore((s) => s.updateAssignment);
  const del = useStudyStore((s) => s.deleteAssignment);

  const [course, setCourse] = useState(""); const [title, setTitle] = useState("");
  const [due, setDue] = useState(""); const [est, setEst] = useState(60);

  const sorted = useMemo(() => items.slice().sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.due - b.due;
  }), [items]);

  const urgency = (a: { due: number; estimateMin: number; progress: number }) => {
    const hoursLeft = (a.due - Date.now()) / 3_600_000;
    const hoursWork = a.estimateMin * (1 - a.progress / 100) / 60;
    if (hoursLeft <= 0) return "overdue";
    if (hoursLeft < hoursWork * 1.2) return "critical";
    if (hoursLeft < hoursWork * 2) return "urgent";
    return "ok";
  };
  const urgencyColor: Record<string, string> = {
    overdue: "#ff6b6b", critical: "#ff8a4d", urgent: "#f59e0b", ok: "var(--vlc-text-secondary)",
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>Assignments</SectionTitle>
      <div style={cardStyle} className="grid grid-cols-2 gap-2">
        <TextInput placeholder="Course (e.g. CS101)" value={course} onChange={(e) => setCourse(e.target.value)} />
        <TextInput placeholder="Assignment title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)}
          className="px-2 py-1.5 text-[12px] rounded-md" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }} />
        <div className="flex gap-2 items-center text-[12px]">
          Estimate (min): <NumInput value={est} min={5} max={6000} onChange={setEst} />
          <div className="flex-1" />
          <PrimaryBtn onClick={() => {
            if (!title.trim() || !course.trim() || !due) return;
            add({ course: course.trim(), title: title.trim(), due: new Date(due).getTime(), estimateMin: est });
            setCourse(""); setTitle(""); setDue("");
          }}>Add</PrimaryBtn>
        </div>
      </div>
      {sorted.length === 0 ? <EmptyHint>No assignments yet.</EmptyHint> : (
        <ul className="flex flex-col gap-2">
          {sorted.map((a) => {
            const u = urgency(a);
            const dueIn = a.due - Date.now();
            const dueStr = dueIn < 0 ? "Overdue" : dueIn < 86400_000 ? `${Math.round(dueIn / 3600_000)}h` : `${Math.round(dueIn / 86400_000)}d`;
            return (
              <li key={a.id} style={cardStyle}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-wider" style={{ color: "var(--vlc-text-secondary)" }}>{a.course}</div>
                    <div className="text-[13px] font-semibold flex items-center gap-2">
                      <input type="checkbox" checked={a.done} onChange={() => upd(a.id, { done: !a.done, progress: !a.done ? 100 : a.progress })} style={{ accentColor: "var(--vlc-accent)" }} />
                      <span style={{ textDecoration: a.done ? "line-through" : "none" }}>{a.title}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--vlc-bg-sunken)" }}>
                      <div style={{ width: `${a.progress}%`, height: "100%", background: "var(--vlc-accent)" }} />
                    </div>
                    <input type="range" min={0} max={100} value={a.progress} onChange={(e) => upd(a.id, { progress: Number(e.target.value) })}
                      className="w-full mt-1" style={{ accentColor: "var(--vlc-accent)" }} />
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: urgencyColor[u] }}>{u}</div>
                    <div className="text-[11px]" style={{ color: "var(--vlc-text-secondary)" }}>{dueStr}</div>
                    <button onClick={() => del(a.id)} className="opacity-40 hover:opacity-100 text-[11px] mt-1">✕</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
