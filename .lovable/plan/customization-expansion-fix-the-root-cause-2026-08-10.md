# Customization Expansion — Fix the Root Cause

## How customization works today

Three independent layers already exist:

1. **Visibility registry** — `src/utils/uiCustomization.ts` lists element ids (`chrome.titleBar`, `seek.thumb`, ...). The store keeps `uiVisibility: Record<string, boolean>`; components call `isVisible(vis, id)` to render or not.
2. **Skins** — token objects merged into one managed `<style>` tag by `src/skins/SkinProvider.tsx`.
3. **God Mode** — preset picks + free token overrides in `src/skins/godMode.ts`, rendered by `GodModePanel`.

The panels (`PreferencesPanel`, `sections/CustomizationSections`) render toggles straight from the registry.

## The actual root cause

The registry is **not the source of truth for rendering** — it is only a list. A toggle exists as soon as someone adds a row to the array, whether or not any component reads it. Audit result: **25 of the ~70 registered toggles are dead** — the id appears nowhere except the registry:

```text
chrome.contextMenu   chrome.osd        menu.music
osd.messages  osd.bigClock  osd.volumeBurst  osd.speedBurst
seek.timeline seek.buffered seek.thumb seek.chapters
seek.bookmarks seek.abLoop  seek.hoverPreview
dock.playlist dock.effects dock.codec dock.bookmarks dock.skins
panel.titlebar panel.closeButton panel.dragHandle panel.resizeHandle
title.onlineBadge title.installButton
```

Meanwhile many rendered elements (study chip, OSD sub-parts, mini-app chrome, video overlays) have no id at all. So the panel simultaneously over-promises and under-covers. Adding more rows will not fix that; the fix is to make the registry **enforced**.

## Approach comparison

- **A. Keep adding rows** — what has been done so far. Rejected: dead toggles keep accumulating silently.
- **B. Wrap every element in a `<Customizable id>` component** — clean, but touches every file and changes DOM nesting (risk to layout/CSS in a heavily skinned app). Rejected.
- **C. (recommended) Keep `isVisible` inline, add a build-time guard.** A tiny script (same shape as `scripts/audit-contrast.mjs`) greps `src/` for every registry id and fails when an id is unused, or when a component references an id missing from the registry. Then close the 25 gaps and grow the registry behind that guard.

C reuses existing patterns, adds zero runtime cost, no new dependency, and makes the class of bug impossible to reintroduce.

## Incremental steps (each independently testable)

**Step 1 — Guard.** Add `scripts/audit-ui-registry.mjs` + `check:ui-registry` script. It prints dead ids and unregistered ids. Initially run in report mode. Files: `scripts/audit-ui-registry.mjs`, `package.json`.

**Step 2 — Wire the seek bar (7 ids).** `SeekBar.tsx` honours timeline / buffered / thumb / chapters / bookmarks / abLoop / hoverPreview.

**Step 3 — Wire OSD (5 ids).** `OSDDisplay.tsx` + `AppLayout` honour `chrome.osd`, messages, bigClock, volumeBurst, speedBurst.

**Step 4 — Wire dock tabs + panels (9 ids).** `DockRail.tsx` filters its tabs; `FloatingPanel`/`Panel` honour titlebar, close button, drag handle, resize handle.

**Step 5 — Wire the leftovers (4 ids).** `chrome.contextMenu` in the stage context menu, `menu.music`, `title.onlineBadge`, `title.installButton` in `TitleBar`.

**Step 6 — Flip the guard to failing** once zero dead ids remain.

**Step 7 — Expand coverage (~40 new ids), in registry groups**, each added *with* its `isVisible` call in the same step: study chip and its sub-parts, mini-app launcher chips, video overlays (letterbox, watermark, loading spinner, subtitle layer), control-bar extras, command-palette sections, empty-state pieces, dock badges.

**Step 8 — Panel ergonomics.** `CustomizationSections`: group collapse, per-group "hide all / show all / reset", search already present, plus a count of hidden items per group.

## Beyond show/hide (optional, after step 8)

Same enforced-registry idea applied to **density and order**: a `uiDensity` scale token (compact/cozy/roomy) mapped to existing spacing vars, and drag-order for control-bar buttons persisted as an id array. Recommend deferring to a separate PR — it changes layout code, not just conditionals.

## Risks and edge cases

- Hiding `seek.timeline` or `ctrl.playPause` can strand a user with no way to play. Mitigation: keyboard shortcuts already cover both, and Preferences stays reachable from the menu bar; a "Reset customization" action already exists.
- Missing entry means visible (`vis[id] !== false`), so backwards compatibility with saved localStorage maps is preserved — no migration needed.
- Hidden elements must not break focus order or shortcuts that target them; each step verifies keyboard flow.
- Guard is grep-based, so ids must stay string literals (they already are). The guard fails loudly if someone builds an id dynamically.

## Verification

- `bun run check:ui-registry` reports zero dead / zero unregistered.
- Typecheck clean.
- Manual: toggle every group off then on, reload, confirm persistence and that nothing throws.
