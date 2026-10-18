// Run: npm run test:pricing
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { importCsv, toInt, toYear, canonModel } from './importer.ts';
import { buildIndex, checkPrice } from './engine.ts';

test('numbers as written on Greek sites', () => {
  assert.equal(toInt('8.500 €'), 8500);
  assert.equal(toInt('8,500'), 8500);
  assert.equal(toInt('€ 12.900,00'), 12900);
  assert.equal(toInt('120.000 km'), 120000);
  assert.equal(toInt('Ρωτήστε'), null);
  assert.equal(toYear('03/2016'), 2016);
  assert.equal(toYear('2016-03-01'), 2016);
});

test('model names', () => {
  assert.equal(canonModel('Toyota Yaris', 'Toyota'), 'Yaris');
  assert.equal(canonModel('116i', 'BMW'), 'Σειρά 1');
  assert.equal(canonModel('A 180', 'Mercedes-Benz'), 'A-Class');
  assert.equal(canonModel('c-hr', 'Toyota'), 'C-HR');
});

test('Greek headers, semicolons, quotes', () => {
  const csv = '﻿Κωδικός;Μάρκα;Μοντέλο;Χρονολογία;Χιλιόμετρα;Τιμή;Καύσιμο;Σασμάν;Περιοχή\n' +
    '1;Toyota;Yaris;03/2014;"98.000 χλμ";"8.900 €";Βενζίνη;Χειροκίνητο;Αθήνα\n' +
    '2;VW;Golf;2012;150000;7500;Diesel;Automatic;"Θεσσαλονίκη, Καλαμαριά"\n' +
    '3;Fiat;Panda;2010;;Ρωτήστε;Βενζίνη;;\n' +
    '1;Toyota;Yaris;2014;98000;8900;;;\n';
  const { listings, report } = importCsv(csv);
  assert.equal(report.delimiter, ';');
  assert.equal(report.kept, 2);
  assert.equal(report.dropped['χωρίς τιμή'], 1);
  assert.equal(report.dropped['διπλή αγγελία'], 1);
  assert.deepEqual(
    listings.map((l) => [l.make, l.model, l.year, l.km, l.price, l.fuel, l.gearbox]),
    [
      ['Toyota', 'Yaris', 2014, 98000, 8900, 'Βενζίνη', 'Χειροκίνητο'],
      ['Volkswagen', 'Golf', 2012, 150000, 7500, 'Πετρέλαιο', 'Αυτόματο'],
    ],
  );
});

test('collector export is understood', () => {
  const csv = 'key,source,make,model,year,km,price_first,price_last,fuel,gearbox,region,origin,sold\n' +
    'fb-group:1,fb-group,Toyota,Yaris,2008,149000,8000,7500,Βενζίνη,Χειροκίνητο,Αττική,,1\n';
  const { listings } = importCsv(csv);
  assert.equal(listings[0].price, 7500);
  assert.equal(listings[0].sold, true);
  assert.equal(listings[0].source, 'fb-group');
});

// Engine on synthetic data with known true effects.
const dir = mkdtempSync(join(tmpdir(), 'cc-'));
const sample = join(dir, 'sample.csv');
execFileSync('node', ['scripts/make-sample-listings.mjs', sample]);
const { listings } = importCsv(readFileSync(sample, 'utf8'));
const index = buildIndex(listings, { refYear: 2026, synthetic: true });

test('engine recovers the effects used to make the sample', () => {
  assert.ok(Math.abs(index.slopes.auto - 0.06) < 0.03, 'auto ' + index.slopes.auto);
  assert.ok(Math.abs(index.slopes.imported + 0.07) < 0.03, 'imported ' + index.slopes.imported);
  assert.ok(Math.abs(index.slopes.fuel['Υβριδικό'] - 0.14) < 0.05, 'hybrid');
  assert.ok(index.slopes.age < -0.05 && index.slopes.age > -0.12, 'age ' + index.slopes.age);
});

test('index holds no ads, only aggregates', () => {
  const s = JSON.stringify(index);
  assert.ok(!s.includes('50000001'), 'ad id leaked');
  assert.ok(s.length < 60000);
});

test('a typical Yaris price comes out fair, a cheap one suspicious', () => {
  // true model: 17500 * exp(-0.075 * 10) ≈ 8270 for a 2016 with typical km
  const base = { make: 'Toyota', model: 'Yaris', year: 2016, km: 140000, fuel: 'Βενζίνη', gearbox: 'Χειροκίνητο', origin: 'Ελληνικό' };
  const r = checkPrice(index, { ...base, price: 8300 })!;
  assert.ok(r.bands.mid > 7000 && r.bands.mid < 9600, 'mid ' + r.bands.mid);
  assert.equal(r.verdict, 'fair');
  assert.equal(r.confidence, 'high');
  assert.equal(checkPrice(index, { ...base, price: 4500 })!.verdict, 'suspicious');
  assert.ok(['high', 'veryHigh'].includes(checkPrice(index, { ...base, price: 11500 })!.verdict!));
});

test('fewer km raises the fair price', () => {
  const a = checkPrice(index, { make: 'Volkswagen', model: 'Golf', year: 2015, km: 60000 })!;
  const b = checkPrice(index, { make: 'Volkswagen', model: 'Golf', year: 2015, km: 220000 })!;
  assert.ok(a.bands.mid > b.bands.mid);
  assert.ok(a.factors.some((f) => f.effect > 0));
});

test('unknown model of a known make falls back with low confidence', () => {
  const r = checkPrice(index, { make: 'Toyota', model: 'Supra', year: 2015, price: 30000 })!;
  assert.equal(r.found, 'make');
  assert.equal(r.confidence, 'low');
  assert.equal(checkPrice(index, { make: 'Lada', model: 'Niva', year: 2010 }), null);
});

test('loose model names match', () => {
  assert.equal(checkPrice(index, { make: 'Toyota', model: 'Yaris Hybrid', year: 2018 })!.found, 'model');
});
