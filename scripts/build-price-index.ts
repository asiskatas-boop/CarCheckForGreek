// Build public/price-index.json (aggregates only) from listing CSVs.
// Usage: node --experimental-strip-types scripts/build-price-index.ts a.csv [b.csv ...] [--out public/price-index.json] [--synthetic]
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { importCsv, type Listing } from '../src/pricing/importer.ts';
import { buildIndex } from '../src/pricing/engine.ts';

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const out = outIdx >= 0 ? args[outIdx + 1] : 'public/price-index.json';
const synthetic = args.includes('--synthetic');
const files = args.filter((a, i) => !a.startsWith('--') && i !== outIdx + 1);
if (!files.length) {
  console.error('Give at least one CSV file.');
  process.exit(1);
}

const all: Listing[] = [];
for (const f of files) {
  const source = /collector|chekcareto|facebook|fb/i.test(basename(f)) ? 'facebook' : 'car.gr';
  const { listings, report } = importCsv(readFileSync(f, 'utf8'), { file: basename(f), source });
  all.push(...listings);
  console.log(`\n${report.file}: ${report.rows} rows, kept ${report.kept} (delimiter "${report.delimiter}")`);
  console.log('  columns:', Object.entries(report.columns).map(([k, v]) => `${k}=${v ?? '–'}`).join(', '));
  if (report.unknownHeaders.length) console.log('  ignored columns:', report.unknownHeaders.join(', '));
  for (const [r, n] of Object.entries(report.dropped)) console.log(`  dropped ${n}: ${r}   e.g. ${report.examples[r][0]}`);
  for (const [f2, n] of Object.entries(report.missing)) console.log(`  kept but missing ${f2}: ${n}`);
}
const index = buildIndex(all, { synthetic });
writeFileSync(out, JSON.stringify(index));
const top = Object.values(index.models).sort((a, b) => b.n - a.n).slice(0, 8);
console.log(`\nindex: ${Object.keys(index.models).length} models from ${index.total} ads -> ${out} (${(JSON.stringify(index).length / 1024).toFixed(0)} KB)`);
console.log('slopes:', JSON.stringify(index.slopes, (k, v) => (typeof v === 'number' ? Math.round(v * 1000) / 1000 : v)));
for (const m of top) console.log(`  ${m.make} ${m.model}: ${m.n} ads`);
