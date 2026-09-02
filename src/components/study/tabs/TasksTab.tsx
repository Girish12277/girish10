import { useMemo, useState } from "react";
import { useStudyStore, type Priority } from "@/store/studyStore";
import { cardStyle, EmptyHint, PrimaryBtn, PriorityBadge, SectionTitle, selectStyle, TextInput } from "../ui";

export function TasksTab() {
  const tasks = useStudyStore((s) => s.tasks);
  const addTask = useStudyStore((s) => s.addTask);
  const updateTask = useStudyStore((s) => s.updateTask);
  const deleteTask = useStudyStore((s) => s.deleteTask);
  const addSubtask = useStudyStore((s) => s.addSubtask);
  const toggleSubtask = useStudyStore((s) => s.toggleSubtask);
  const patch = useStudyStore((s) => s.patch);
  const pomoStart = useStudyStore((s) => s.pomoStart);
  const activeId = useStudyStore((s) => s.pomoActiveTaskId);

  const [filter, setFilter] = useState<"all" | "open" | "done" | "today">("open");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("med");
  const [due, setDue] = useState<string>("");

  const filtered = useMemo(() => {
    const today = new Date(); today.setHours(23, 59, 59, 999);
    const todayMax = today.getTime();
    const todayMin = new Date().setHours(0, 0, 0, 0);
    return tasks
      .filter((t) => {
        if (filter === "open") return !t.done;
        if (filter === "done") return t.done;
        if (filter === "today") return !t.done && t.due != null && t.due >= todayMin && t.due <= todayMax;
        return true;
      })
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        const prW = { high: 0, med: 1, low: 2 };
        if (prW[a.priority] !== prW[b.priority]) return prW[a.priority] - prW[b.priority];
        return (a.due ?? Infinity) - (b.due ?? Infinity);
      });
  }, [tasks, filter]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), priority, due: due ? new Date(due).getTime() : null });
    setTitle(""); setDue("");
  };

  const completion = tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle action={<span className="text-[11px]" style={{ color: "var(--vlc-text-secondary)" }}>{completion}% complete</span>}>Tasks</SectionTitle>

      <form onSubmit={submit} className="flex gap-2 items-stretch">
        <TextInput placeholder="New task… (Enter to add)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
          className="px-2 py-1.5 text-[12px] rounded-md" style={selectStyle}>
          <option value="high">High</option><option value="med">Med</option><option value="low">Low</option>
        </select>
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)}
          className="px-2 py-1.5 text-[12px] rounded-md" style={selectStyle} />
        <PrimaryBtn type="submit">Add</PrimaryBtn>
      </form>

      <div className="flex gap-1">
        {(["open", "today", "done", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1 text-[11px] rounded-full font-medium transition-colors capitalize"
            style={{
              background: filter === f ? "color-mix(in oklab, var(--vlc-accent) 18%, transparent)" : "transparent",
              color: filter === f ? "var(--vlc-accent)" : "var(--vlc-text-secondary)",
              border: "1px solid " + (filter === f ? "var(--vlc-accent)" : "var(--vlc-border-subtle)"),
            }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? <EmptyHint>No tasks. Add one above to start crushing your day.</EmptyHint> : (
        <ul className="flex flex-col gap-2">
          {filtered.map((t) => {
            const overdue = t.due != null && !t.done && t.due < Date.now();
            return (
              <li key={t.id} style={cardStyle} className="study-enter">
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={t.done} onChange={() => updateTask(t.id, { done: !t.done })}
                    className="mt-1" style={{ accentColor: "var(--vlc-accent)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-[13px] font-medium" style={{ textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.55 : 1 }}>{t.title}</div>
                      <PriorityBadge p={t.priority} />
                      {t.due && (
                        <span className="text-[10.5px] vlc-num px-1.5 py-0.5 rounded"
                          style={{ color: overdue ? "#ff6b6b" : "var(--vlc-text-secondary)", background: "var(--vlc-bg-sunken)" }}>
                          {new Date(t.due).toLocaleDateString()}
                        </span>
                      )}
                      {t.pomosSpent > 0 && (
                        <span className="text-[10.5px]" style={{ color: "var(--vlc-text-secondary)" }}>🍅 {t.pomosSpent}</span>
                      )}
                    </div>
                    {t.subtasks.length > 0 && (
                      <ul className="mt-2 pl-1 space-y-1">
                        {t.subtasks.map((s) => (
                          <li key={s.id} className="flex items-center gap-2 text-[12px]">
                            <input type="checkbox" checked={s.done} onChange={() => toggleSubtask(t.id, s.id)} style={{ accentColor: "var(--vlc-accent)" }} />
                            <span style={{ textDecoration: s.done ? "line-through" : "none", opacity: s.done ? 0.55 : 1 }}>{s.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      <SubtaskAdder onAdd={(title) => addSubtask(t.id, title)} />
                      {!t.done && (
                        <button
                          onClick={() => { patch({ pomoActiveTaskId: t.id, hubTab: "pomodoro" }); pomoStart("focus"); }}
                          className="text-[11px] font-semibold"
                          style={{ color: activeId === t.id ? "var(--vlc-accent)" : "var(--vlc-text-secondary)" }}>
                          ▶ Focus on this
                        </button>
                      )}
                    </div>
                  </div>
                  <button onClick={() => deleteTask(t.id)} aria-label="Delete" className="opacity-40 hover:opacity-100 text-[12px]">✕</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SubtaskAdder({ onAdd }: { onAdd: (title: string) => void }) {
  const [v, setV] = useState("");
  const [open, setOpen] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} className="text-[11px]" style={{ color: "var(--vlc-text-disabled)" }}>+ subtask</button>
  );
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (v.trim()) { onAdd(v.trim()); setV(""); setOpen(false); } }} className="flex gap-1 flex-1">
      <TextInput autoFocus placeholder="Subtask…" value={v} onChange={(e) => setV(e.target.value)} onBlur={() => { if (!v) setOpen(false); }} />
    </form>
  );
}
