// Stable short key derived from a media src URL. Used for bookmarks, resume
// positions, and any other per-file persisted data. btoa works because we
// only pass URL strings (ASCII-safe via encodeURIComponent fallback).
export function srcKey(src: string | undefined | null): string {
  if (!src) return "";
  try {
    // Handle unicode safely
    return btoa(unescape(encodeURIComponent(src))).slice(0, 24);
  } catch {
    return src.slice(0, 24);
  }
}
