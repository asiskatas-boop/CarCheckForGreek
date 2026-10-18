// Writes a SYNTHETIC listings CSV in the car.gr template format, so the
// price engine and pages can be built and tested before real data arrives.
// Usage: node scripts/make-sample-listings.mjs data/sample/listings-synthetic.csv
import { writeFileSync } from 'node:fs';

const out = process.argv[2] || 'data/sample/listings-synthetic.csv';
let seed = 42;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const pick = (xs) => xs[Math.floor(rnd() * xs.length)];

// make, model, price new (€), yearly value loss, first year, weight, fuels, auto share
const MODELS = [
  ['Toyota', 'Yaris', 17500, 0.075, 2000, 10, ['Βενζίνη', 'Υβριδικό', 'Πετρέλαιο'], 0.35],
  ['Toyota', 'Corolla', 25000, 0.08, 2002, 5, ['Βενζίνη', 'Υβριδικό', 'Πετρέλαιο'], 0.4],
  ['Toyota', 'Aygo', 13000, 0.08, 2006, 5, ['Βενζίνη'], 0.15],
  ['Toyota', 'Auris', 20000, 0.09, 2007, 4, ['Βενζίνη', 'Υβριδικό', 'Πετρέλαιο'], 0.3],
  ['Volkswagen', 'Golf', 26000, 0.085, 2000, 9, ['Βενζίνη', 'Πετρέλαιο'], 0.35],
  ['Volkswagen', 'Polo', 18500, 0.085, 2000, 8, ['Βενζίνη', 'Πετρέλαιο'], 0.2],
  ['Opel', 'Corsa', 16500, 0.1, 2000, 8, ['Βενζίνη', 'Πετρέλαιο', 'Υγραέριο'], 0.1],
  ['Opel', 'Astra', 22000, 0.105, 2000, 5, ['Βενζίνη', 'Πετρέλαιο'], 0.15],
  ['Peugeot', '208', 18500, 0.1, 2012, 6, ['Βενζίνη', 'Πετρέλαιο'], 0.2],
  ['Peugeot', '207', 15500, 0.1, 2006, 4, ['Βενζίνη', 'Πετρέλαιο'], 0.1],
  ['Citroen', 'C3', 17500, 0.105, 2002, 6, ['Βενζίνη', 'Πετρέλαιο'], 0.12],
  ['Renault', 'Clio', 17500, 0.1, 2000, 7, ['Βενζίνη', 'Πετρέλαιο'], 0.15],
  ['Fiat', 'Panda', 13500, 0.09, 2004, 7, ['Βενζίνη', 'Υγραέριο', 'Φυσικό αέριο'], 0.05],
  ['Fiat', 'Punto', 14500, 0.11, 2000, 4, ['Βενζίνη', 'Πετρέλαιο'], 0.05],
  ['Ford', 'Fiesta', 17000, 0.105, 2002, 7, ['Βενζίνη', 'Πετρέλαιο'], 0.1],
  ['Ford', 'Focus', 22000, 0.11, 2000, 5, ['Βενζίνη', 'Πετρέλαιο'], 0.2],
  ['Hyundai', 'i10', 13500, 0.085, 2008, 6, ['Βενζίνη'], 0.15],
  ['Hyundai', 'i20', 16500, 0.09, 2009, 5, ['Βενζίνη', 'Πετρέλαιο'], 0.15],
  ['Kia', 'Picanto', 13000, 0.085, 2004, 5, ['Βενζίνη'], 0.15],
  ['Nissan', 'Micra', 15000, 0.095, 2003, 6, ['Βενζίνη'], 0.15],
  ['Nissan', 'Qashqai', 28000, 0.09, 2007, 5, ['Βενζίνη', 'Πετρέλαιο'], 0.4],
  ['Suzuki', 'Swift', 15500, 0.08, 2005, 5, ['Βενζίνη', 'Υβριδικό'], 0.1],
  ['Seat', 'Ibiza', 17000, 0.095, 2002, 6, ['Βενζίνη', 'Πετρέλαιο'], 0.15],
  ['Skoda', 'Octavia', 25000, 0.09, 2004, 4, ['Βενζίνη', 'Πετρέλαιο'], 0.4],
  ['Mercedes-Benz', 'A-Class', 32000, 0.095, 2005, 4, ['Βενζίνη', 'Πετρέλαιο'], 0.6],
  ['BMW', 'Σειρά 1', 32000, 0.1, 2005, 4, ['Βενζίνη', 'Πετρέλαιο'], 0.55],
  ['Audi', 'A3', 31000, 0.095, 2004, 4, ['Βενζίνη', 'Πετρέλαιο'], 0.5],
  ['Smart', 'Fortwo', 15000, 0.1, 2003, 3, ['Βενζίνη'], 0.9],
  ['Dacia', 'Sandero', 13000, 0.08, 2009, 4, ['Βενζίνη', 'Υγραέριο'], 0.05],
  ['Mini', 'Cooper', 26000, 0.085, 2002, 3, ['Βενζίνη'], 0.4],
];
const REGIONS = ['Αθήνα', 'Πειραιάς', 'Θεσσαλονίκη', 'Πάτρα', 'Ηράκλειο', 'Λάρισα', 'Βόλος', 'Ιωάννινα', 'Χανιά', 'Καλαμάτα'];
const FUEL_EFFECT = { Βενζίνη: 0, Πετρέλαιο: 0.06, Υβριδικό: 0.14, Υγραέριο: -0.05, 'Φυσικό αέριο': -0.03 };
const YEAR_NOW = 2026;
const total = MODELS.reduce((s, m) => s + m[5], 0);

const rows = [['id', 'url', 'make', 'model', 'version', 'year', 'km', 'price', 'fuel', 'gearbox', 'cc', 'hp', 'body', 'region', 'seller_type', 'origin', 'scraped_at']];
let id = 50000000;
for (let i = 0; i < 4000; i++) {
  let r = rnd() * total;
  const m = MODELS.find((x) => (r -= x[5]) < 0) || MODELS[0];
  const [make, model, pNew, loss, first, , fuels, autoShare] = m;
  const year = Math.min(YEAR_NOW, Math.max(first, Math.round(YEAR_NOW - 1 - Math.abs(gauss()) * 8)));
  const age = YEAR_NOW - year;
  const km = Math.max(500, Math.round((age + 0.4) * 13500 * Math.exp(gauss() * 0.35) / 100) * 100);
  const fuel = pick(fuels);
  const auto = rnd() < autoShare;
  const imported = rnd() < 0.3;
  const kmEffect = -0.11 * (Math.log(km + 5000) - Math.log((age + 0.4) * 13500 + 5000));
  const price = Math.round(pNew * Math.exp(-loss * age + kmEffect + FUEL_EFFECT[fuel] + (auto ? 0.06 : 0) + (imported ? -0.07 : 0) + gauss() * 0.12) / 50) * 50;
  rows.push([
    String(id++), '', make, model, '', String(year), km.toLocaleString('el-GR') + ' km', price.toLocaleString('el-GR') + ' €', fuel,
    auto ? 'Αυτόματο' : 'Χειροκίνητο', String(pick([1000, 1200, 1400, 1600])), String(pick([70, 90, 110, 130])), 'Hatchback',
    pick(REGIONS), rnd() < 0.6 ? 'Ιδιώτης' : 'Έμπορος', imported ? 'Εισαγωγής' : 'Ελληνικό', '2026-10-15',
  ]);
}
const csv = rows.map((r) => r.map((c) => (/[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c)).join(',')).join('\n');
writeFileSync(out, '﻿' + csv);
console.log('wrote', rows.length - 1, 'synthetic listings to', out);
