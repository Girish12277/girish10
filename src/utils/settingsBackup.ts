/**
 * Versioned settings backup / restore.
 *
 * Phase 1 of the mega-upgrade plan: every persisted slice already lives in
 * `localStorage` under a `vlc-*` key (player) or `vlc-study-v1` (study hub).
 * This module gives us:
 *   1. a single schema version pin so future migrations can transform
 *      payloads instead of silently wiping them, and
 *   2. a one-shot export / import that lets a user move their entire setup
 *      (skins, layouts, hotkeys, bookmarks, study data) between devices
 *      *before* Phase 3 wires real cloud sync.
 *
 * Format is intentionally a flat envelope so it's easy to diff and merge:
 *   { version: 1, exportedAt: <iso>, app: "vlc-web-player", data: { key: value } }
 */

export const SCHEMA_VERSION = 1;
export const SCHEMA_KEY = "vlc-schema-version";
const BACKUP_PREFIXES = ["vlc-", "vlc-study"];

export type BackupEnvelope = {
  version: number;
  exportedAt: string;
  app: "vlc-web-player";
  data: Record<string, unknown>;
};

const isBackupKey = (k: string) => BACKUP_PREFIXES.some((p) => k.startsWith(p)) && k !== SCHEMA_KEY;

/** Read every persisted vlc-* slice into a portable JSON envelope. */
export function exportSettings(): BackupEnvelope {
  const data: Record<string, unknown> = {};
  if (typeof localStorage !== "undefined") {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !isBackupKey(k)) continue;
      const raw = localStorage.getItem(k);
      if (raw == null) continue;
      try { data[k] = JSON.parse(raw); } catch { data[k] = raw; }
    }
  }
  return { version: SCHEMA_VERSION, exportedAt: new Date().toISOString(), app: "vlc-web-player", data };
}

/** Trigger a browser download of the current settings as JSON. */
export function downloadSettings(filename = `vlc-settings-${new Date().toISOString().slice(0, 10)}.json`) {
  const env = exportSettings();
  const blob = new Blob([JSON.stringify(env, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Restore a previously exported envelope. Returns the number of keys
 * written. Caller is expected to reload the page so every Zustand store
 * re-hydrates from the fresh localStorage values.
 */
export function importSettings(envelope: unknown): number {
  if (!envelope || typeof envelope !== "object") throw new Error("Invalid backup file");
  const env = envelope as Partial<BackupEnvelope>;
  if (env.app !== "vlc-web-player" || typeof env.data !== "object" || env.data == null) {
    throw new Error("Not a VLC Web Player backup");
  }
  const migrated = migrate(env.data as Record<string, unknown>, env.version ?? 0);
  let count = 0;
  for (const [k, v] of Object.entries(migrated)) {
    if (!isBackupKey(k)) continue; // refuse to write outside our namespace
    try {
      localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
      count++;
    } catch { /* quota — keep going so partial restore beats none */ }
  }
  localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
  return count;
}

/**
 * Forward-compatible migration hook. Today every payload is already at
 * v1 so this is a no-op, but adding the seam now means future cloud-sync
 * payloads can be reshaped here instead of in every consumer.
 */
function migrate(data: Record<string, unknown>, from: number): Record<string, unknown> {
  let cur = data;
  let v = from;
  // Example slot — when SCHEMA_VERSION advances to 2, add:
  //   if (v < 2) { cur = migrateV1toV2(cur); v = 2; }
  void v;
  return cur;
}

/** Run once at boot so the on-disk schema marker matches the running code. */
export function ensureSchemaPinned() {
  if (typeof localStorage === "undefined") return;
  try {
    const cur = localStorage.getItem(SCHEMA_KEY);
    if (cur !== String(SCHEMA_VERSION)) localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
  } catch { /* private mode — ignore */ }
}