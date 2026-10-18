/*
 * Reads listing CSVs (car.gr scraper, ChekCAReto Collector export) into clean,
 * normalized listings, and reports what was dropped and why.
 * No dependencies; runs in the browser and in Node.
 */

export type Fuel = 'Βενζίνη' | 'Πετρέλαιο' | 'Υβριδικό' | 'Plug-in υβριδικό' | 'Ηλεκτρικό' | 'Υγραέριο' | 'Φυσικό αέριο';
export type Gearbox = 'Αυτόματο' | 'Χειροκίνητο';
export type Origin = 'Ελληνικό' | 'Εισαγωγής';

export interface Listing {
  id: string;
  source: string;
  url: string | null;
  make: string;
  model: string;
  version: string | null;
  year: number;
  km: number | null;
  price: number;
  fuel: Fuel | null;
  gearbox: Gearbox | null;
  cc: number | null;
  hp: number | null;
  body: string | null;
  region: string | null;
  seller: 'private' | 'dealer' | null;
  origin: Origin | null;
  seenAt: string | null;
  sold: boolean;
}

export interface ImportReport {
  file: string;
  delimiter: string;
  rows: number;
  kept: number;
  columns: Record<string, string | null>; // our field -> header found
  unknownHeaders: string[];
  dropped: Record<string, number>;
  missing: Record<string, number>; // kept rows lacking an optional field
  examples: Record<string, string[]>; // a few raw values per drop reason
}

const THIS_YEAR = new Date().getFullYear();

// ---------- text helpers ----------

export function norm(s: unknown): string {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ς/g, 'σ')
    .replace(/[   ]/g, ' ')
    .trim();
}

const headerKey = (h: string) => norm(h).replace(/[^a-zα-ω0-9]/g, '');

// ---------- CSV ----------

export function detectDelimiter(firstLine: string): string {
  const counts = [',', ';', '\t', '|'].map((d) => [d, firstLine.split(d).length - 1] as const);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? counts[0][0] : ',';
}

/** RFC 4180-ish parser: quotes, escaped quotes, newlines inside quotes, BOM. */
export function parseCsv(text: string, delimiter?: string): { header: string[]; rows: string[][]; delimiter: string } {
  const src = text.replace(/^﻿/, '');
  const firstLine = src.slice(0, src.search(/\r?\n/) >>> 0 || src.length);
  const d = delimiter || detectDelimiter(firstLine);
  const out: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let q = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (q) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else q = false;
      } else cell += ch;
    } else if (ch === '"' && cell === '') q = true;
    else if (ch === d) {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);
      cell = '';
      if (row.some((c) => c.trim() !== '')) out.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== '')) out.push(row);
  const header = (out.shift() || []).map((h) => h.trim());
  return { header, rows: out, delimiter: d };
}

// ---------- column mapping ----------

const COLUMNS: Record<string, string[]> = {
  id: ['id', 'adid', 'listingid', 'key', 'postid', 'κωδικοσ', 'κωδικοσαγγελιασ', 'αγγελια'],
  url: ['url', 'link', 'href', 'συνδεσμοσ'],
  make: ['make', 'brand', 'manufacturer', 'μαρκα', 'κατασκευαστησ'],
  model: ['model', 'μοντελο'],
  version: ['version', 'trim', 'variant', 'εκδοση', 'τυποσ'],
  year: ['year', 'registration', 'firstregistration', 'regyear', 'modelyear', 'ετοσ', 'χρονολογια', 'ταξινομηση', 'ετοσκυκλοφοριασ', 'χρονια'],
  km: ['km', 'kms', 'mileage', 'kilometers', 'kilometres', 'odometer', 'χιλιομετρα', 'χλμ'],
  price: ['price', 'pricelast', 'priceeur', 'pricee', 'τιμη', 'τιμηευρω'],
  fuel: ['fuel', 'fueltype', 'καυσιμο'],
  gearbox: ['gearbox', 'transmission', 'κιβωτιο', 'κιβωτιοταχυτητων', 'σασμαν'],
  cc: ['cc', 'engine', 'enginecc', 'displacement', 'κυβικα', 'κυβισμοσ'],
  hp: ['hp', 'power', 'ps', 'bhp', 'ιπποι', 'ιπποδυναμη'],
  body: ['body', 'bodytype', 'category', 'αμαξωμα', 'κατηγορια'],
  region: ['region', 'location', 'city', 'place', 'area', 'περιοχη', 'νομοσ', 'πολη', 'τοποθεσια'],
  seller: ['seller', 'sellertype', 'πωλητησ', 'τυποσπωλητη'],
  origin: ['origin', 'προελευση', 'εισαγωγη'],
  seenAt: ['date', 'scrapedat', 'seenat', 'lastseen', 'firstseen', 'createdat', 'ημερομηνια'],
  source: ['source', 'πηγη'],
  sold: ['sold', 'πουληθηκε', 'maybegone'],
};

export function mapColumns(header: string[]): { map: Record<string, number>; found: Record<string, string | null>; unknown: string[] } {
  const keys = header.map(headerKey);
  const map: Record<string, number> = {};
  const found: Record<string, string | null> = {};
  for (const [field, aliases] of Object.entries(COLUMNS)) {
    let idx = -1;
    for (const a of aliases) {
      idx = keys.indexOf(a);
      if (idx >= 0) break;
    }
    // "sold" and "maybe_gone" both mean sold-ish; prefer an explicit "sold".
    if (idx >= 0) {
      map[field] = idx;
      found[field] = header[idx];
    } else found[field] = null;
  }
  const used = new Set(Object.values(map));
  const unknown = header.filter((_, i) => !used.has(i));
  return { map, found, unknown };
}

// ---------- value normalizers ----------

export function toInt(v: string | undefined | null): number | null {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  // "8.500 €", "8,500", "120.000 km", "8500.00"
  const m = s.match(/\d[\d.,\s]*/);
  if (!m) return null;
  let num = m[0].replace(/\s/g, '');
  if (/^\d{1,3}([.,]\d{3})+([.,]\d{1,2})?$/.test(num)) num = num.replace(/[.,]\d{1,2}$/, (x) => (x.length <= 3 ? '' : x)).replace(/[.,]/g, '');
  else if (/^\d+[.,]\d{1,2}$/.test(num)) num = num.replace(/[.,]\d{1,2}$/, '');
  else num = num.replace(/[.,]/g, '');
  const n = parseInt(num, 10);
  return Number.isFinite(n) ? n : null;
}

export function toYear(v: string | undefined | null): number | null {
  if (v == null) return null;
  const m = String(v).match(/(19[5-9]\d|20[0-4]\d)/);
  return m ? parseInt(m[1], 10) : null;
}

export function toFuel(v: string | undefined | null): Fuel | null {
  const t = norm(v);
  if (!t) return null;
  if (/plug|phev|επαναφορτ/.test(t)) return 'Plug-in υβριδικό';
  if (/hybrid|υβριδ|hev/.test(t)) return 'Υβριδικό';
  if (/ηλεκτρ|electric|^ev$|bev/.test(t)) return 'Ηλεκτρικό';
  if (/υγραερ|lpg|αεριο\s*υγρ/.test(t)) return 'Υγραέριο';
  if (/φυσικ|cng/.test(t)) return 'Φυσικό αέριο';
  if (/πετρελ|diesel|ντιζελ/.test(t)) return 'Πετρέλαιο';
  if (/βενζ|petrol|gasoline|benzin/.test(t)) return 'Βενζίνη';
  return null;
}

export function toGearbox(v: string | undefined | null): Gearbox | null {
  const t = norm(v);
  if (!t) return null;
  if (/αυτοματ|automatic|auto|ημιαυτ|semi|dsg|cvt|tiptronic|robot/.test(t)) return 'Αυτόματο';
  if (/χειροκιν|manual|μηχανικ/.test(t)) return 'Χειροκίνητο';
  return null;
}

export function toOrigin(v: string | undefined | null): Origin | null {
  const t = norm(v);
  if (!t) return null;
  if (/εισαγωγ|import|ξεν|foreign|γερμαν|μεταχειρισμενο εισ/.test(t)) return 'Εισαγωγής';
  if (/ελλην|greek|αντιπροσωπ|καινουρ/.test(t)) return 'Ελληνικό';
  return null;
}

function toSeller(v: string | undefined | null): Listing['seller'] {
  const t = norm(v);
  if (!t) return null;
  if (/ιδιωτ|private|owner/.test(t)) return 'private';
  if (/εμπορ|dealer|εταιρ|business|αντιπροσ/.test(t)) return 'dealer';
  return null;
}

const MAKE_ALIASES: Record<string, string> = {
  vw: 'Volkswagen', volkswagen: 'Volkswagen', φολκσβαγκεν: 'Volkswagen',
  mercedes: 'Mercedes-Benz', 'mercedes-benz': 'Mercedes-Benz', 'mercedes benz': 'Mercedes-Benz', benz: 'Mercedes-Benz',
  citroen: 'Citroen', bmw: 'BMW', mini: 'Mini', 'mini cooper': 'Mini', mg: 'MG', byd: 'BYD', ds: 'DS', kia: 'Kia', seat: 'Seat',
  skoda: 'Skoda', 'alfa romeo': 'Alfa Romeo', alfa: 'Alfa Romeo', 'land rover': 'Land Rover', 'range rover': 'Land Rover',
  toyota: 'Toyota', opel: 'Opel', peugeot: 'Peugeot', renault: 'Renault', fiat: 'Fiat', ford: 'Ford', nissan: 'Nissan',
  hyundai: 'Hyundai', mazda: 'Mazda', honda: 'Honda', suzuki: 'Suzuki', audi: 'Audi', smart: 'Smart', dacia: 'Dacia',
  volvo: 'Volvo', mitsubishi: 'Mitsubishi', chevrolet: 'Chevrolet', daewoo: 'Daewoo', lancia: 'Lancia', jeep: 'Jeep',
  daihatsu: 'Daihatsu', subaru: 'Subaru', porsche: 'Porsche', tesla: 'Tesla', cupra: 'Cupra', lexus: 'Lexus', jaguar: 'Jaguar',
};

const titleCase = (s: string) => s.replace(/\S+/g, (w) => (/\d/.test(w) || w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()));

export function canonMake(v: string | undefined | null): string | null {
  const t = norm(v).replace(/\s+/g, ' ');
  if (!t) return null;
  return MAKE_ALIASES[t] || titleCase(String(v).trim().replace(/\s+/g, ' '));
}

// Model names as people and sites write them -> one spelling.
const MODEL_FIX: Record<string, string> = {
  'c-hr': 'C-HR', chr: 'C-HR', 'rav 4': 'RAV4', 'rav-4': 'RAV4', rav4: 'RAV4', 'up!': 'Up', up: 'Up',
  't-roc': 'T-Roc', troc: 'T-Roc', 't-cross': 'T-Cross', 'x-trail': 'X-Trail', xtrail: 'X-Trail',
  'cr-v': 'CR-V', crv: 'CR-V', 'hr-v': 'HR-V', hrv: 'HR-V', 'cx-3': 'CX-3', 'cx-5': 'CX-5', 'cx-30': 'CX-30', 'mx-5': 'MX-5',
  "cee'd": 'Ceed', ceed: 'Ceed', 'c-max': 'C-Max', 's-max': 'S-Max', 'b-max': 'B-Max', ix35: 'ix35', ix20: 'ix20',
  i10: 'i10', i20: 'i20', i30: 'i30', 'grande punto': 'Grande Punto', '500x': '500X', '500l': '500L',
};

export function canonModel(v: string | undefined | null, make: string | null): string | null {
  let t = String(v ?? '').trim().replace(/\s+/g, ' ');
  if (!t) return null;
  // "Toyota Yaris" in the model column
  if (make && norm(t).startsWith(norm(make) + ' ')) t = t.slice(make.length + 1);
  const n = norm(t);
  if (MODEL_FIX[n]) return MODEL_FIX[n];
  // BMW: 116i, 320d -> Σειρά 1/3; Mercedes A 180 -> A-Class
  if (make === 'BMW') {
    const s = n.match(/^([1-8])\s*(?:series|σειρα|\d\d)/);
    if (s) return 'Σειρά ' + s[1];
  }
  if (make === 'Mercedes-Benz') {
    const s = n.match(/^([abcegs])\s*(?:-?\s*class|-?\s*κλαση|\s*\d{3})/);
    if (s) return s[1].toUpperCase() + '-Class';
  }
  return /^[a-z]/i.test(t) || /^[α-ω]/i.test(t) ? titleCase(t) : t;
}

// ---------- import ----------

export interface ImportOptions {
  file?: string;
  source?: string; // default source label when the CSV has no source column
  minPrice?: number;
  maxPrice?: number;
}

export function importCsv(text: string, opts: ImportOptions = {}): { listings: Listing[]; report: ImportReport } {
  const { header, rows, delimiter } = parseCsv(text);
  const { map, found, unknown } = mapColumns(header);
  const minPrice = opts.minPrice ?? 300;
  const maxPrice = opts.maxPrice ?? 300000;
  const report: ImportReport = {
    file: opts.file || 'csv',
    delimiter: delimiter === '\t' ? 'tab' : delimiter,
    rows: rows.length,
    kept: 0,
    columns: found,
    unknownHeaders: unknown,
    dropped: {},
    missing: {},
    examples: {},
  };
  const drop = (reason: string, raw: string) => {
    report.dropped[reason] = (report.dropped[reason] || 0) + 1;
    const ex = (report.examples[reason] ||= []);
    if (ex.length < 3) ex.push(raw.slice(0, 120));
  };
  const get = (r: string[], f: string) => (map[f] != null ? r[map[f]] : undefined);

  const listings: Listing[] = [];
  const seen = new Set<string>();
  rows.forEach((r, i) => {
    const raw = r.join(' | ');
    const make = canonMake(get(r, 'make'));
    const model = canonModel(get(r, 'model'), make);
    if (!make || !model) return drop('χωρίς μάρκα ή μοντέλο', raw);
    const price = toInt(get(r, 'price'));
    if (price == null) return drop('χωρίς τιμή', raw);
    if (price < minPrice || price > maxPrice) return drop('τιμή εκτός ορίων', raw);
    const year = toYear(get(r, 'year'));
    if (year == null) return drop('χωρίς χρονιά', raw);
    if (year < 1980 || year > THIS_YEAR + 1) return drop('χρονιά εκτός ορίων', raw);
    let km = toInt(get(r, 'km'));
    if (km != null && km < 1000 && km > 0 && THIS_YEAR - year > 1) km *= 1000; // "120" meaning 120.000
    if (km != null && km > 900000) return drop('χιλιόμετρα εκτός ορίων', raw);
    const source = (get(r, 'source') || opts.source || 'car.gr').trim() || 'car.gr';
    const id = (get(r, 'id') || '').trim() || `${source}:${i}`;
    const dedupKey = source + ':' + id;
    if (seen.has(dedupKey)) return drop('διπλή αγγελία', raw);
    seen.add(dedupKey);
    const soldRaw = norm(get(r, 'sold'));
    const l: Listing = {
      id,
      source,
      url: (get(r, 'url') || '').trim() || null,
      make,
      model,
      version: (get(r, 'version') || '').trim() || null,
      year,
      km,
      price,
      fuel: toFuel(get(r, 'fuel')),
      gearbox: toGearbox(get(r, 'gearbox')),
      cc: toInt(get(r, 'cc')),
      hp: toInt(get(r, 'hp')),
      body: (get(r, 'body') || '').trim() || null,
      region: (get(r, 'region') || '').trim() || null,
      seller: toSeller(get(r, 'seller')),
      origin: toOrigin(get(r, 'origin')),
      seenAt: (get(r, 'seenAt') || '').trim() || null,
      sold: soldRaw === '1' || soldRaw === 'true' || soldRaw === 'ναι' || soldRaw === 'yes',
    };
    for (const f of ['km', 'fuel', 'gearbox', 'origin', 'region'] as const) if (l[f] == null) report.missing[f] = (report.missing[f] || 0) + 1;
    listings.push(l);
  });
  report.kept = listings.length;
  return { listings, report };
}
