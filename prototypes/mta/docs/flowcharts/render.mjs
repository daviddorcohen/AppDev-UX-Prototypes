import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(__dirname).filter(f => f.endsWith('.mmd'));

for (const file of files) {
  const mmdContent = readFileSync(join(__dirname, file), 'utf-8').trim();
  const pngFile = file.replace('.mmd', '.png');
  
  const encoded = Buffer.from(mmdContent).toString('base64url');
  const url = `https://mermaid.ink/img/${encoded}?type=png&bgColor=white&scale=2`;
  
  console.log(`Rendering ${file} -> ${pngFile}`);
  
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
    const buf = Buffer.from(await resp.arrayBuffer());
    writeFileSync(join(__dirname, pngFile), buf);
    console.log(`  OK (${(buf.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`  FAILED: ${err.message}`);
  }
}

console.log('\nDone!');
