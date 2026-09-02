import { useMemo, useState } from "react";
import { Panel, Row } from "../_shared/ui";

const EMOJIS = "😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 🥰 😗 😙 😚 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 🥱 😴 😌 😛 😜 😝 🤤 😒 😓 😔 😕 🙃 🤑 😲 🙁 😖 😞 😟 😤 😢 😭 😦 😧 😨 😩 🤯 😬 😰 😱 🥵 🥶 😳 🤪 😵 🥴 😠 😡 🤬 😷 🤒 🤕 🤢 🤮 🤧 😇 🥳 🥺 🤠 🤡 🥸 🤥 🤫 🤭 🧐 🤓 😈 👿 👻 💀 ☠️ 👽 👾 🤖 🎃 ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 ✨ 🌟 ⭐ 💫 🔥 ✅ ❌ ⚠️ 🚀 🎉 🎊 🎁 🏆 🥇 🥈 🥉 ⚽ 🏀 🏈 ⚾ 🎾 🏐 🍕 🍔 🍟 🌭 🍿 🥓 🍳 🥞 🧇 🥨 🥐 🍞 🥖 🧀 🥪 🌮 🌯 🥗 🍝 🍜 🍲 🍛 🍣 🍱 🥟 🍤 🍙 🍚 🍘 🍥 🥠 🍢 🍡 🍧 🍨 🍦 🥧 🧁 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🥤 🧋 🥃 🍷 🍸 🍹 🍺 🍻 🥂 🍾 ☕ 🍵 🥤".split(/\s+/).filter(Boolean);

export default function EmojiPicker() {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState("");
  const list = useMemo(() => EMOJIS.filter((e) => !q || e.includes(q.trim())), [q]);
  const copy = (e: string) => { navigator.clipboard?.writeText(e).catch(() => {}); setCopied(e); setTimeout(() => setCopied(""), 800); };
  return (
    <Panel>
      <Row>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" style={{ flex: 1, padding: 6, background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} />
        {copied && <span style={{ fontSize: 11, color: "var(--vlc-accent-text)" }}>copied {copied}</span>}
      </Row>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 4, maxHeight: 320, overflowY: "auto" }}>
        {list.map((e, i) => (
          <button key={i} onClick={() => copy(e)} style={{ fontSize: 22, background: "transparent", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6, cursor: "pointer", padding: 4 }}>{e}</button>
        ))}
      </div>
    </Panel>
  );
}
