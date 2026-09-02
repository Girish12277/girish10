import { useState } from "react";

export default function Calculator() {
  const [expr, setExpr] = useState("");
  const [out, setOut] = useState("");

  const evalSafe = (s: string): string => {
    try {
      // strict subset: digits, operators, parens, decimal, spaces
      if (!/^[\d+\-*/().%\s]*$/.test(s)) return "—";
      if (!s.trim()) return "";
      // eslint-disable-next-line no-new-func
      const v = Function(`"use strict"; return (${s})`)();
      if (typeof v !== "number" || !isFinite(v)) return "—";
      return String(+v.toFixed(10));
    } catch { return "—"; }
  };

  const push = (k: string) => { const ne = expr + k; setExpr(ne); setOut(evalSafe(ne)); };
  const clear = () => { setExpr(""); setOut(""); };
  const back = () => { const ne = expr.slice(0, -1); setExpr(ne); setOut(evalSafe(ne)); };
  const equals = () => { const r = evalSafe(expr); if (r && r !== "—") { setExpr(r); setOut(""); } };

  const btns = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"];

  return (
    <div className="p-3 space-y-3">
      <div style={{ background: "var(--vlc-bg-base)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 8, padding: 10, minHeight: 64, fontFamily: "var(--vlc-font-mono)" }}>
        <div className="text-right text-[12px]" style={{ color: "var(--vlc-text-secondary)", wordBreak: "break-all" }}>{expr || "0"}</div>
        <div className="text-right text-[20px] font-semibold" style={{ color: "var(--vlc-text-primary)" }}>{out || "\u00A0"}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clear} className="col-span-2 py-2 rounded text-[13px]" style={{ background: "var(--vlc-bg-elevated)", color: "var(--vlc-accent)", border: "1px solid var(--vlc-border-subtle)" }}>AC</button>
        <button onClick={back} className="py-2 rounded text-[13px]" style={{ background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }}>⌫</button>
        <button onClick={() => push("(")} className="py-2 rounded text-[13px]" style={{ background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-subtle)", color: "var(--vlc-text-primary)" }}>(</button>
        {btns.map((b) => (
          <button key={b} onClick={() => b === "=" ? equals() : push(b)} className="py-3 rounded text-[14px] font-mono"
            style={{ background: b === "=" ? "var(--vlc-accent)" : "var(--vlc-bg-elevated)", color: b === "=" ? "var(--vlc-bg-base)" : "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }}>{b}</button>
        ))}
      </div>
    </div>
  );
}
