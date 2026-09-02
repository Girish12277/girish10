#!/usr/bin/env node
// Guards the UI customization registry against drift.
//
// A toggle in src/utils/uiCustomization.ts is only real if some component
// reads it via isVisible(vis, "<id>"). This script fails when:
//   - a registered id is never referenced anywhere else in src/  (dead toggle)
//   - a component references an id that is not registered        (orphan gate)
//
// Ids must stay string literals; a dynamically-built id will trip the guard.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const REGISTRY = "src/utils/uiCustomization.ts";
const ID_RE = /"([a-z][a-zA-Z0-9]*\.[a-zA-Z0-9]+)"/g;

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(p)) out.push(p);
  }
  return out;
};

const registrySrc = readFileSync(REGISTRY, "utf8");
const registered = new Set(
  [...registrySrc.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]),
);

const referenced = new Set();
for (const file of walk("src")) {
  if (file.replace(/\\/g, "/") === REGISTRY) continue;
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/isVisible\(\s*[A-Za-z0-9_.]+\s*,\s*"([^"]+)"\s*\)/g)) referenced.add(m[1]);
  for (const m of src.matchAll(/\bv\(\s*"([^"]+)"\s*\)/g)) referenced.add(m[1]);
  for (const m of src.matchAll(/visKey:\s*"([^"]+)"/g)) referenced.add(m[1]);
  // Ids can also be carried as plain literals in a table that is later fed to
  // isVisible (e.g. the MenuBar menu tuples). Only trust such literals in files
  // that actually participate in the visibility system.
  if (src.includes("isVisible") || src.includes("uiVisibility")) {
    for (const m of src.matchAll(ID_RE)) if (registered.has(m[1])) referenced.add(m[1]);
  }
}

const dead = [...registered].filter((id) => !referenced.has(id)).sort();
const orphan = [...referenced].filter((id) => !registered.has(id)).sort();

if (dead.length) {
  console.error(`\n✖ ${dead.length} dead toggle(s) — registered but nothing reads them:`);
  for (const id of dead) console.error(`   ${id}`);
}
if (orphan.length) {
  console.error(`\n✖ ${orphan.length} orphan gate(s) — read by a component but not registered:`);
  for (const id of orphan) console.error(`   ${id}`);
}
if (dead.length || orphan.length) {
  console.error(`\nFix: wire the id with isVisible(vis, "<id>") or remove it from ${REGISTRY}.\n`);
  process.exit(1);
}
console.log(`✔ UI registry clean — ${registered.size} toggles, all wired.`);
