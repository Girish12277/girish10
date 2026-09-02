import { useMemo, useState } from "react";
import { List, LayoutGrid, Crosshair, Trash2 } from "lucide-react";
import { useStudyStore, type Priority } from "@/store/studyStore";
import { cardStyle, EmptyHint, PrimaryBtn, PriorityBadge, SectionTitle, selectStyle, TextInput } from "../ui";
import { KanbanBoard } from "./KanbanBoard";

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

  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
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
      <SectionTitle action={
        <div className="flex items-center gap-3">
          <div className="flex bg-sunken rounded-lg p-0.5" style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-subtle)" }}>
            <button
              onClick={() => setViewMode("list")}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all group"
              style={{
                background: viewMode === "list" ? "var(--vlc-accent)" : "transparent",
                color: viewMode === "list" ? "var(--vlc-bg-base)" : "var(--vlc-text-secondary)",
              }}
            >
              <List className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> List
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all group"
              style={{
                background: viewMode === "kanban" ? "var(--vlc-accent)" : "transparent",
                color: viewMode === "kanban" ? "var(--vlc-bg-base)" : "var(--vlc-text-secondary)",
              }}
            >
              <LayoutGrid className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Kanban
            </button>
          </div>
          <span className="text-[11px]" style={{ color: "var(--vlc-text-secondary)" }}>{completion}% complete</span>
        </div>
      }>
        Tasks & Kanban
      </SectionTitle>

      <form onSubmit={submit} className="flex gap-2 items-stretch">
        <TextInput placeholder="New task… (Enter to add)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
          className="px-2 py-1.5 text-[12px] rounded-md" style={selectStyle}>
          <option value="high">High</option><option value="med">Med</option><option value="low">Low</option>
        </select>
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)}
          className="px-2 py-1.5 text-[12px] rounded-md" style={selectStyle} />
        <PrimaryBtn type="submit">Add Task</PrimaryBtn>
      </form>

      {viewMode === "kanban" ? (
        <KanbanBoard />
      ) : (
        <>
          <div className="flex gap-1.5 text-[11px]">
            {(["open", "today", "all", "done"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-2.5 py-1 rounded-md capitalize font-medium transition-all"
                style={{
                  background: filter === f ? "var(--vlc-accent-dim)" : "transparent",
                  color: filter === f ? "var(--vlc-accent)" : "var(--vlc-text-secondary)",
                }}>
                {f}
              </button>
            ))}
          </div>

          {!filtered.length && <EmptyHint>No tasks match this filter.</EmptyHint>}

          <div className="flex flex-col gap-2">
            {filtered.map((t) => {
              const isActive = activeId === t.id;
              return (
                <div key={t.id} style={cardStyle} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={t.done} onChange={(e) => updateTask(t.id, { done: e.target.checked })} className="rounded cursor-pointer" />
                    <span className="flex-1 text-[13px] font-medium" style={{ color: t.done ? "var(--vlc-text-disabled)" : "var(--vlc-text-primary)", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</span>
                    <PriorityBadge p={t.priority} />
                    {t.due && <span className="text-[10.5px] tabular-nums" style={{ color: "var(--vlc-text-secondary)" }}>{new Date(t.due).toLocaleDateString()}</span>}
                    {!t.done && (
                      <button onClick={() => { patch({ pomoActiveTaskId: t.id, hubTab: "pomodoro" }); pomoStart(); }}
                        className="group flex items-center gap-1 px-2.5 py-1 text-[10.5px] rounded-md font-semibold transition-all press"
                        style={{ background: isActive ? "var(--vlc-accent)" : "var(--vlc-bg-sunken)", color: isActive ? "var(--vlc-bg-base)" : "var(--vlc-accent)" }}>
                        <Crosshair className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                        {isActive ? "Focusing" : "Focus"}
                      </button>
                    )}
                    <button onClick={() => deleteTask(t.id)} className="opacity-40 hover:opacity-100 hover:scale-115 transition-all p-1">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                  {t.subtasks && t.subtasks.length > 0 && (
                    <div className="pl-6 flex flex-col gap-1 text-[11.5px]">
                      {t.subtasks.map((st) => (
                        <label key={st.id} className="flex items-center gap-2">
                          <input type="checkbox" checked={st.done} onChange={() => toggleSubtask(t.id, st.id)} />
                          <span style={{ textDecoration: st.done ? "line-through" : "none", color: st.done ? "var(--vlc-text-disabled)" : "var(--vlc-text-secondary)" }}>{st.title}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
