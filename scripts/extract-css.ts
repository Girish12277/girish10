import { HEROES } from '../src/skins/heroes';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '../src/skins/css');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let count = 0;
for (const h of HEROES) {
  if (h.extraCss && h.extraCss.trim()) {
    fs.writeFileSync(path.join(outDir, h.id + '.css'), h.extraCss.trim() + '\n');
    count++;
  }
}
console.log(`Extracted CSS for ${count} heroes.`);
