import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '../src/skins');

const files = [
  'megaHeroes.ts',
  'wave6Heroes.ts',
  'premiumHeroes.ts',
  'premiumWave.ts',
  'wave7Heroes.ts',
  'heroes.ts'
];

for (const file of files) {
  const p = path.join(srcDir, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    // Replace extraCss template literals
    // Note: in heroes.ts, it's extraCss: `...`
    // In megaHeroes.ts, it's extraCss: `\n      [data-skin="${s.id}"] ... \n    `
    content = content.replace(/extraCss:\s*`[\s\S]*?`,?/g, 'extraCss: "",');
    // Some might use double quotes or single quotes for empty
    fs.writeFileSync(p, content, 'utf8');
    console.log(`Processed ${file}`);
  }
}
