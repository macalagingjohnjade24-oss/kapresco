/**
 * Verify every require() path in src/data/images.ts actually resolves to a file,
 * and that the referenced keys exist in products.ts.
 * Run from the project root: node check-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const imagesSrc = fs.readFileSync('src/data/images.ts', 'utf8');

const re = /(\w+):\s*require\('([^']+)'\)/g;
const entries = [...imagesSrc.matchAll(re)].map((m) => ({ key: m[1], rel: m[2] }));

let missing = 0;
let tiny = 0;
const rows = [];

for (const e of entries) {
  const abs = path.resolve('src/data', e.rel);
  if (!fs.existsSync(abs)) {
    missing++;
    rows.push(`MISSING  ${e.key.padEnd(20)} ${e.rel}`);
    continue;
  }
  const size = fs.statSync(abs).size;
  if (size < 3000) {
    tiny++;
    rows.push(`TINY     ${e.key.padEnd(20)} ${e.rel} ${size}B`);
  } else {
    rows.push(`ok       ${e.key.padEnd(20)} ${path.basename(e.rel)} ${(size / 1024).toFixed(0)}KB`);
  }
}

console.log(rows.join('\n'));
console.log(`\n${entries.length} entries, ${missing} MISSING, ${tiny} suspiciously small.`);

// Which image keys does products.ts ask for, and do they exist?
const prodSrc = fs.readFileSync('src/data/products.ts', 'utf8');
const keys = new Set(entries.map((e) => e.key));
const used = new Set();
for (const m of prodSrc.matchAll(/image:\s*'?([\w]+)'?/g)) used.add(m[1]);
for (const m of prodSrc.matchAll(/image:\s*\[?([\w,\s'"]+)/g)) {
  for (const part of m[1].split(/[,\s'"]+/)) if (part) used.add(part);
}

const unknown = [...used].filter((u) => u && !keys.has(u));
console.log(`\nProduct image keys referenced: ${[...used].filter(Boolean).length}`);
console.log(unknown.length ? `UNKNOWN KEYS: ${unknown.join(', ')}` : 'All product image keys exist.');

// Orphan assets: files on disk never referenced.
const referencedAbs = new Set(entries.map((e) => path.resolve('src/data', e.rel)));
const figmaDir = 'assets/figma';
const onDisk = fs.existsSync(figmaDir)
  ? fs.readdirSync(figmaDir).map((f) => path.resolve(figmaDir, f))
  : [];
const orphans = onDisk.filter((f) => !referencedAbs.has(f));
console.log(`\n${onDisk.length} files in assets/figma, ${orphans.length} never referenced.`);
if (orphans.length) console.log(orphans.map((f) => `  ${path.basename(f)}`).join('\n'));