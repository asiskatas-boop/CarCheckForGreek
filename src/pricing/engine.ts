/*
 * ChekCAReto price engine.
 *
 * Fit: log(price) = model level + shared slopes for age, log(km), fuel,
 * gearbox and origin (+ a per-model age adjustment when there is enough data).
 * Shared slopes come from all models together, so even models with few ads
 * get a sensible curve; each model's level comes from its own ads, pulled
 * toward its make when it has only a few.
 *
 * The index holds only these numbers and counts, never the ads themselves.
 */
import type { Listing, Fuel } from './importer.ts';

export interface ModelEntry {
  make: string;
  model: string;
  n: number;
  level: number; // log-price level
  ageAdj: number; // extra age slope for this model
  meanAge: number;
  resid: number[]; // residual quantiles p10 p25 p50 p75 p90
  years: Record<string, number>; // listings per year
  kmPerYear: number | null; // this model's typical km per year of age
}

export interface PriceIndex {
  version: 1;
  generatedAt: string;
  refYear: number; // ages are measured from this year
  synthetic: boolean;
  sources: Record<string, number>;
  total: number;
  slopes: { age: number; lkm: number; auto: number; imported: number; fuel: Record<string, number> };
  resid: number[]; // all-models residual quantiles
  kmByAge: number[]; // typical km for age 0..30
  makes: Record<string, { level: number; n: number }>;
  models: Record<string, ModelEntry>; // key: make|model (lower case)
  askingToSale: number | null; // typical final/first price ratio seen in sold ads
}

export const modelKey = (make: string, model: string) => (make + '|' + model).toLowerCase();

const FUELS: Fuel[] = ['Πετρέλαιο', 'Υβριδικό', 'Plug-in υβριδικό', 'Ηλεκτρικό', 'Υγραέριο', 'Φυσικό αέριο']; // baseline: Βενζίνη
const lkm = (km: number) => Math.log(km + 5000);

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}
const quantiles = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return [0.1, 0.25, 0.5, 0.75, 0.9].map((q) => quantile(s, q));
};
const median = (xs: number[]) => quantile([...xs].sort((a, b) => a - b), 0.5);

/** Solve (X'X + λI) b = X'y by Gaussian elimination. */
function ridge(X: number[][], y: number[], lambda = 1e-3): number[] {
  const p = X[0].length;
  const A = Array.from({ length: p }, () => new Array(p + 1).fill(0));
  for (let i = 0; i < X.length; i++) {
    const xi = X[i];
    for (let a = 0; a < p; a++) {
      if (xi[a] === 0) continue;
      for (let b = 0; b < p; b++) A[a][b] += xi[a] * xi[b];
      A[a][p] += xi[a] * y[i];
    }
  }
  for (let a = 0; a < p; a++) A[a][a] += lambda;
  for (let c = 0; c < p; c++) {
    let piv = c;
    for (let r = c + 1; r < p; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    const d = A[c][c] || 1e-12;
    for (let r = 0; r < p; r++) {
      if (r === c) continue;
      const f = A[r][c] / d;
      if (f) for (let k = c; k <= p; k++) A[r][k] -= f * A[c][k];
    }
  }
  return A.map((row, i) => row[p] / (row[i] || 1e-12));
}

interface Row {
  key: string;
  make: string;
  age: number;
  lkm: number;
  auto: number;
  imported: number;
  fuel: number[];
  y: number;
}

function features(r: Row): number[] {
  return [r.age, r.lkm, r.auto, r.imported, ...r.fuel];
}

export interface BuildOptions {
  refYear?: number;
  synthetic?: boolean;
  minModelAds?: number; // models with fewer ads are kept only as part of their make
}

export function buildIndex(listings: Listing[], opts: BuildOptions = {}): PriceIndex {
  const refYear = opts.refYear ?? new Date().getFullYear();
  const minModelAds = opts.minModelAds ?? 5;

  // Typical km for each age (fills missing km and powers "fewer km than usual").
  const byAge: number[][] = Array.from({ length: 31 }, () => []);
  for (const l of listings) if (l.km != null) byAge[Math.min(30, Math.max(0, refYear - l.year))].push(l.km);
  const kmByAge: number[] = [];
  for (let a = 0; a <= 30; a++) {
    const m = byAge[a].length >= 5 ? median(byAge[a]) : null;
    kmByAge[a] = m ?? Math.round((a || 0.5) * 14000);
  }
  for (let a = 1; a <= 30; a++) if (kmByAge[a] < kmByAge[a - 1]) kmByAge[a] = kmByAge[a - 1]; // monotone

  const toRow = (l: Listing): Row => {
    const age = Math.max(0, refYear - l.year);
    const km = l.km ?? kmByAge[Math.min(30, age)];
    return {
      key: modelKey(l.make, l.model),
      make: l.make,
      age,
      lkm: lkm(km),
      auto: l.gearbox === 'Αυτόματο' ? 1 : 0,
      imported: l.origin === 'Εισαγωγής' ? 1 : 0,
      fuel: FUELS.map((f) => (l.fuel === f ? 1 : 0)),
      y: Math.log(l.price),
    };
  };

  let rows = listings.map(toRow);
  let slopes: number[] = [];
  let levels = new Map<string, number>();

  const fit = () => {
    // Fixed effects: remove each model's mean, then fit shared slopes.
    const groups = new Map<string, Row[]>();
    for (const r of rows) (groups.get(r.key) || groups.set(r.key, []).get(r.key)!).push(r);
    const X: number[][] = [];
    const y: number[] = [];
    const means = new Map<string, { x: number[]; y: number }>();
    for (const [k, g] of groups) {
      const p = features(g[0]).length;
      const mx = new Array(p).fill(0);
      let my = 0;
      for (const r of g) {
        features(r).forEach((v, i) => (mx[i] += v / g.length));
        my += r.y / g.length;
      }
      means.set(k, { x: mx, y: my });
      if (g.length < 2) continue;
      for (const r of g) {
        X.push(features(r).map((v, i) => v - mx[i]));
        y.push(r.y - my);
      }
    }
    slopes = X.length > 10 ? ridge(X, y, 1e-2) : [-0.08, -0.12, 0.05, -0.05, 0, 0, 0, 0, 0, 0];
    levels = new Map();
    for (const [k, m] of means) levels.set(k, m.y - m.x.reduce((s, v, i) => s + v * slopes[i], 0));
  };

  const resid = (r: Row) => r.y - (levels.get(r.key)! + features(r).reduce((s, v, i) => s + v * slopes[i], 0));

  fit();
  // Drop wild outliers (typos, "1 €", leasing ads) and refit once.
  const res0 = rows.map(resid);
  const mad = median(res0.map((v) => Math.abs(v - median(res0)))) || 0.1;
  rows = rows.filter((_, i) => Math.abs(res0[i]) <= 4 * 1.4826 * mad);
  fit();

  // Make levels (for shrinking small models and for unknown models of a known make).
  const makeAgg = new Map<string, { sum: number; n: number }>();
  const groups = new Map<string, Row[]>();
  for (const r of rows) (groups.get(r.key) || groups.set(r.key, []).get(r.key)!).push(r);
  for (const [k, g] of groups) {
    const m = makeAgg.get(g[0].make) || { sum: 0, n: 0 };
    m.sum += levels.get(k)! * g.length;
    m.n += g.length;
    makeAgg.set(g[0].make, m);
  }
  const makes: PriceIndex['makes'] = {};
  for (const [mk, m] of makeAgg) makes[mk.toLowerCase()] = { level: m.sum / m.n, n: m.n };

  const allResid = rows.map(resid);
  const models: Record<string, ModelEntry> = {};
  const original = new Map<string, Listing>();
  for (const l of listings) if (!original.has(modelKey(l.make, l.model))) original.set(modelKey(l.make, l.model), l);

  for (const [k, g] of groups) {
    if (g.length < minModelAds) continue;
    const L = original.get(k)!;
    const n = g.length;
    const shrink = 5;
    const makeLevel = makes[L.make.toLowerCase()].level;
    const level = (levels.get(k)! * n + makeLevel * shrink) / (n + shrink);
    const meanAge = g.reduce((s, r) => s + r.age, 0) / n;
    // Per-model age adjustment: does this model lose value faster or slower?
    let ageAdj = 0;
    if (n >= 40) {
      let sxy = 0;
      let sxx = 0;
      for (const r of g) {
        const e = r.y - (level + features(r).reduce((s, v, i) => s + v * slopes[i], 0));
        sxy += (r.age - meanAge) * e;
        sxx += (r.age - meanAge) ** 2;
      }
      if (sxx > 0) ageAdj = (sxy / sxx) * (n / (n + 60));
    }
    const pred = (r: Row) => level + features(r).reduce((s, v, i) => s + v * slopes[i], 0) + ageAdj * (r.age - meanAge);
    const res = g.map((r) => r.y - pred(r));
    // Few ads: blend with all-models spread so the range isn't falsely narrow.
    const own = quantiles(res);
    const all = quantiles(allResid);
    const w = Math.min(1, n / 40);
    const years: Record<string, number> = {};
    for (const r of g) years[refYear - r.age] = (years[refYear - r.age] || 0) + 1;
    const kms = listings.filter((l) => modelKey(l.make, l.model) === k && l.km != null && refYear - l.year >= 1).map((l) => l.km! / (refYear - l.year));
    models[k] = {
      make: L.make,
      model: L.model,
      n,
      level,
      ageAdj,
      meanAge,
      resid: own.map((v, i) => v * w + all[i] * (1 - w)),
      years,
      kmPerYear: kms.length >= 10 ? Math.round(median(kms)) : null,
    };
  }

  const sources: Record<string, number> = {};
  for (const l of listings) sources[l.source] = (sources[l.source] || 0) + 1;

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    refYear,
    synthetic: !!opts.synthetic,
    sources,
    total: rows.length,
    slopes: {
      age: slopes[0],
      lkm: slopes[1],
      auto: slopes[2],
      imported: slopes[3],
      fuel: Object.fromEntries(FUELS.map((f, i) => [f, slopes[4 + i]])),
    },
    resid: quantiles(allResid),
    kmByAge,
    makes,
    models,
    askingToSale: null,
  };
}

// ---------------- checking a price ----------------

export type Verdict = 'suspicious' | 'good' | 'fair' | 'high' | 'veryHigh';

export const VERDICT_LABEL: Record<Verdict, string> = {
  suspicious: 'Ύποπτα φθηνή',
  good: 'Καλή τιμή',
  fair: 'Λογική τιμή',
  high: 'Ακριβή',
  veryHigh: 'Πολύ ακριβή',
};

export interface CheckInput {
  make: string;
  model: string;
  year: number;
  km?: number | null;
  price?: number | null;
  fuel?: string | null;
  gearbox?: string | null;
  origin?: string | null;
}

export interface Factor {
  label: string;
  effect: number; // e.g. +0.07 = 7% more than a typical one
}

export interface CheckResult {
  found: 'model' | 'make';
  modelName: string;
  bands: { p10: number; low: number; mid: number; high: number; p90: number };
  basedOn: number; // ads of this model within ±2 years
  modelAds: number;
  yearsCovered: [number, number] | null;
  confidence: 'high' | 'medium' | 'low';
  verdict: Verdict | null;
  position: number | null; // 0..1 where the asking price sits between p10 and p90
  diff: number | null; // asking minus mid, euros
  negotiate: { start: number; target: number } | null;
  typicalKm: number;
  factors: Factor[];
  synthetic: boolean;
}

const round = (v: number) => (v >= 10000 ? Math.round(v / 100) * 100 : Math.round(v / 50) * 50);

export function findModel(index: PriceIndex, make: string, model: string): ModelEntry | null {
  const exact = index.models[modelKey(make, model)];
  if (exact) return exact;
  // Loose match: "yaris hybrid" -> "yaris", "golf variant" -> "golf"
  const mk = make.toLowerCase();
  const mo = model.toLowerCase();
  let best: ModelEntry | null = null;
  for (const e of Object.values(index.models)) {
    if (e.make.toLowerCase() !== mk) continue;
    const em = e.model.toLowerCase();
    if ((mo.startsWith(em + ' ') || em.startsWith(mo + ' ')) && (!best || em.length > best.model.length)) best = e;
  }
  return best;
}

export function checkPrice(index: PriceIndex, input: CheckInput): CheckResult | null {
  const entry = findModel(index, input.make, input.model);
  const make = index.makes[input.make.toLowerCase()];
  if (!entry && !make) return null;
  const s = index.slopes;
  const age = Math.max(0, index.refYear - input.year);
  const typicalKm =
    entry && entry.kmPerYear != null ? Math.round(entry.kmPerYear * Math.max(age, 0.5)) : index.kmByAge[Math.min(30, age)];
  const km = input.km ?? typicalKm;
  const fuelEffect = input.fuel && s.fuel[input.fuel] != null ? s.fuel[input.fuel] : 0;
  const auto = input.gearbox === 'Αυτόματο' ? 1 : 0;
  const imported = input.origin === 'Εισαγωγής' ? 1 : 0;
  const level = entry ? entry.level : make!.level;
  const ageAdj = entry ? entry.ageAdj * (age - entry.meanAge) : 0;
  const base = level + s.age * age + s.lkm * lkm(km) + s.auto * auto + s.imported * imported + fuelEffect + ageAdj;
  const q = entry ? entry.resid : index.resid.map((v) => v * 1.3);
  const b = { p10: Math.exp(base + q[0]), low: Math.exp(base + q[1]), mid: Math.exp(base + q[2]), high: Math.exp(base + q[3]), p90: Math.exp(base + q[4]) };
  const bands = { p10: round(b.p10), low: round(b.low), mid: round(b.mid), high: round(b.high), p90: round(b.p90) };

  let basedOn = 0;
  let yearsCovered: [number, number] | null = null;
  if (entry) {
    const ys = Object.keys(entry.years).map(Number);
    yearsCovered = [Math.min(...ys), Math.max(...ys)];
    for (const [y, c] of Object.entries(entry.years)) if (Math.abs(Number(y) - input.year) <= 2) basedOn += c;
  }
  const outside = !!yearsCovered && (input.year < yearsCovered[0] - 1 || input.year > yearsCovered[1] + 1);
  const confidence: CheckResult['confidence'] = !entry || outside ? 'low' : basedOn >= 30 ? 'high' : basedOn >= 10 ? 'medium' : 'low';

  const factors: Factor[] = [];
  if (input.km != null) {
    const e = Math.exp(s.lkm * (lkm(input.km) - lkm(typicalKm))) - 1;
    if (Math.abs(e) >= 0.02) factors.push({ label: input.km < typicalKm ? 'Λιγότερα χιλιόμετρα από το συνηθισμένο' : 'Περισσότερα χιλιόμετρα από το συνηθισμένο', effect: e });
  }
  if (auto && Math.abs(s.auto) >= 0.02) factors.push({ label: 'Αυτόματο κιβώτιο', effect: Math.exp(s.auto) - 1 });
  if (imported && Math.abs(s.imported) >= 0.02) factors.push({ label: 'Εισαγωγής', effect: Math.exp(s.imported) - 1 });
  if (input.fuel && Math.abs(fuelEffect) >= 0.02) factors.push({ label: input.fuel, effect: Math.exp(fuelEffect) - 1 });

  let verdict: Verdict | null = null;
  let position: number | null = null;
  let diff: number | null = null;
  let negotiate: CheckResult['negotiate'] = null;
  const P = input.price;
  if (P != null && P > 0) {
    verdict = P < b.p10 ? 'suspicious' : P < b.low ? 'good' : P <= b.high ? 'fair' : P <= b.p90 ? 'high' : 'veryHigh';
    position = Math.max(0, Math.min(1, (P - b.p10) / (b.p90 - b.p10 || 1)));
    diff = Math.round((P - b.mid) / 50) * 50;
    const target = Math.min(P, b.mid);
    const start = Math.min(P * 0.95, Math.max(b.low, P * 0.85));
    negotiate = { start: round(Math.min(start, target)), target: round(target) };
  }

  return {
    found: entry ? 'model' : 'make',
    modelName: entry ? `${entry.make} ${entry.model}` : `${input.make} ${input.model}`,
    bands,
    basedOn,
    modelAds: entry ? entry.n : make!.n,
    yearsCovered,
    confidence,
    verdict,
    position,
    diff,
    negotiate,
    typicalKm: Math.round(typicalKm / 1000) * 1000,
    factors,
    synthetic: index.synthetic,
  };
}
