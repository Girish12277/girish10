import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudyStore } from "@/store/studyStore";
import { PrimaryBtn, SectionTitle, selectStyle, TextInput } from "../ui";

const minToStr = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function PlannerTab() {
  const blocks = useStudyStore((s) => s.blocks);
  const addBlock = useStudyStore((s) => s.addBlock);
  const deleteBlock = useStudyStore((s) => s.deleteBlock);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Hours to show in the grid (e.g. 6am to 12am)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const [form, setForm] = useState({ day: 0, start: "09:00", end: "10:00", title: "" });
  const toMin = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const startMin = toMin(form.start), endMin = toMin(form.end);
    if (endMin <= startMin) return;
    
    // Pick a vibrant color based on title hash
    const colors = ["#ff6b6b", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
    const hash = form.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];

    addBlock({ day: form.day, startMin, endMin, title: form.title.trim(), color });
    setForm({ ...form, title: "" });
  };

  // Current time line
  const [nowMin, setNowMin] = useState(() => {
    const d = new Date(); return d.getHours() * 60 + d.getMinutes();
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date(); setNowMin(d.getHours() * 60 + d.getMinutes());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const todayIdx = (new Date().getDay() + 6) % 7;

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>Visual Weekly Planner</SectionTitle>
      
      <form onSubmit={submit} className="flex gap-2 flex-wrap p-3 rounded-xl border border-transparent shadow-sm"
        style={{ background: "color-mix(in oklab, var(--vlc-bg-sunken) 60%, transparent)", border: "1px solid var(--vlc-border-subtle)" }}>
        <select value={form.day} onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
          className="px-2 py-1.5 text-[12px] rounded-md font-medium" style={selectStyle}>
          {days.map((d, i) => <option key={d} value={i}>{i === todayIdx ? `${d} (Today)` : d}</option>)}
        </select>
        <input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })}
          className="px-2 py-1.5 text-[12px] rounded-md font-medium" style={selectStyle} />
        <input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })}
          className="px-2 py-1.5 text-[12px] rounded-md font-medium" style={selectStyle} />
        <div className="flex-1 min-w-[200px]">
          <TextInput placeholder="Block title (e.g. Calc 101)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <PrimaryBtn type="submit">Schedule</PrimaryBtn>
      </form>

      <div className="relative rounded-xl overflow-y-auto" style={{ height: 600, background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-subtle)" }}>
        <div className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] min-w-[700px]">
          
          {/* Header Row */}
          <div className="sticky top-0 z-20 bg-inherit border-b" style={{ borderColor: "var(--vlc-border-subtle)", background: "var(--vlc-bg-sunken)" }} />
          {days.map((d, i) => (
            <div key={d} className="sticky top-0 z-20 text-center py-2 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md"
              style={{
                background: "color-mix(in oklab, var(--vlc-bg-sunken) 90%, transparent)",
                borderBottom: "1px solid var(--vlc-border-subtle)",
                borderLeft: i === 0 ? "none" : "1px solid var(--vlc-border-subtle)",
                color: i === todayIdx ? "var(--vlc-accent)" : "var(--vlc-text-secondary)"
              }}>
              {d}
              {i === todayIdx && <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-current" />}
            </div>
          ))}

          {/* Grid Body */}
          <div className="relative" style={{ height: 1440 }}>
            {/* Time labels */}
            {hours.map((h) => (
              <div key={h} className="absolute w-full flex justify-end pr-2 text-[9px] font-medium"
                style={{ top: `${(h * 60 / 1440) * 100}%`, transform: "translateY(-50%)", color: "var(--vlc-text-disabled)" }}>
                {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
              </div>
            ))}
          </div>

          {days.map((d, i) => {
            const dayBlocks = blocks.filter((b) => b.day === i);
            return (
              <div key={d} className="relative" style={{ height: 1440, borderLeft: "1px solid var(--vlc-border-subtle)", background: i === todayIdx ? "color-mix(in oklab, var(--vlc-accent) 2%, transparent)" : "transparent" }}>
                
                {/* Horizontal hour lines */}
                {hours.map((h) => (
                  <div key={h} className="absolute w-full border-t" style={{ top: `${(h * 60 / 1440) * 100}%`, borderColor: "var(--vlc-border-subtle)", opacity: 0.5 }} />
                ))}

                {/* Blocks */}
                <AnimatePresence>
                  {dayBlocks.map((b) => {
                    const topPct = (b.startMin / 1440) * 100;
                    const heightPct = ((b.endMin - b.startMin) / 1440) * 100;
                    return (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ scale: 1.02, zIndex: 10 }}
                        className="absolute left-[2px] right-[2px] rounded-md p-1.5 overflow-hidden shadow-sm group cursor-pointer border"
                        style={{
                          top: `${topPct}%`,
                          height: `${heightPct}%`,
                          background: `color-mix(in oklab, ${b.color} 20%, var(--vlc-bg-elevated))`,
                          borderColor: `color-mix(in oklab, ${b.color} 40%, transparent)`,
                          color: "var(--vlc-text-primary)",
                          minHeight: 24, // Prevents tiny blocks from collapsing completely
                        }}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: b.color }} />
                        <div className="pl-1 leading-tight flex flex-col h-full">
                          <div className="text-[11px] font-semibold truncate leading-tight drop-shadow-sm">{b.title}</div>
                          <div className="text-[9px] opacity-70 tabular-nums font-medium mt-auto truncate">{minToStr(b.startMin)} – {minToStr(b.endMin)}</div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteBlock(b.id); }} aria-label="Delete"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-[10px] w-4 h-4 rounded-full flex items-center justify-center transition-colors"
                          style={{ background: "color-mix(in oklab, var(--vlc-text-primary) 15%, transparent)" }}>✕</button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Current Time Line */}
                {i === todayIdx && (
                  <div className="absolute left-0 right-0 z-10 pointer-events-none flex items-center"
                    style={{ top: `${(nowMin / 1440) * 100}%`, transform: "translateY(-50%)" }}>
                    <div className="w-2 h-2 rounded-full shadow-sm" style={{ background: "#ff4757" }} />
                    <div className="flex-1 h-[2px]" style={{ background: "#ff4757", opacity: 0.7 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
