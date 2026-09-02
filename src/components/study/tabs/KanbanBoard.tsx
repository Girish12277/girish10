import { useStudyStore, type Task } from "@/store/studyStore";

export function KanbanBoard() {
  const tasks = useStudyStore((s) => s.tasks);
  const updateTask = useStudyStore((s) => s.updateTask);
  const deleteTask = useStudyStore((s) => s.deleteTask);
  const patch = useStudyStore((s) => s.patch);
  const pomoStart = useStudyStore((s) => s.pomoStart);

  const todoTasks = tasks.filter((t) => !t.done && t.pomosSpent === 0);
  const inProgressTasks = tasks.filter((t) => !t.done && t.pomosSpent > 0);
  const completedTasks = tasks.filter((t) => t.done);

  const renderColumn = (title: string, items: Task[], badgeColor: string) => (
    <div
      className="flex-1 flex flex-col gap-3 p-3 rounded-xl min-h-[360px]"
      style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-subtle)" }}
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--vlc-text-secondary)" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: badgeColor }} />
          {title}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-secondary)" }}>
          {items.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[420px] pr-1">
        {items.map((t) => (
          <div
            key={t.id}
            className="p-3 rounded-lg flex flex-col gap-2 transition-all hover:scale-[1.01]"
            style={{ background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-normal)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[12px] font-medium leading-tight" style={{ color: t.done ? "var(--vlc-text-disabled)" : "var(--vlc-text-primary)", textDecoration: t.done ? "line-through" : "none" }}>
                {t.title}
              </span>
              <button onClick={() => deleteTask(t.id)} className="text-[11px] opacity-40 hover:opacity-100">✕</button>
            </div>

            <div className="flex items-center justify-between text-[10px] mt-1 pt-2 border-t" style={{ borderColor: "var(--vlc-border-subtle)" }}>
              <span className="uppercase font-bold tracking-wider px-1.5 py-0.5 rounded" style={{ background: t.priority === "high" ? "#ef4444" : t.priority === "med" ? "#f59e0b" : "#10b981", color: "#fff" }}>
                {t.priority}
              </span>
              <div className="flex gap-2">
                {!t.done && (
                  <button
                    onClick={() => {
                      patch({ pomoActiveTaskId: t.id, hubTab: "pomodoro" });
                      pomoStart();
                    }}
                    className="px-2 py-0.5 rounded font-bold"
                    style={{ background: "var(--vlc-accent)", color: "var(--vlc-bg-base)" }}
                  >
                    🎯 Focus
                  </button>
                )}
                <button
                  onClick={() => updateTask(t.id, { done: !t.done })}
                  className="px-2 py-0.5 rounded font-semibold"
                  style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-secondary)" }}
                >
                  {t.done ? "Reopen" : "Done"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {renderColumn("To Do", todoTasks, "#38BDF8")}
      {renderColumn("In Progress", inProgressTasks, "#F59E0B")}
      {renderColumn("Completed", completedTasks, "#10B981")}
    </div>
  );
}
