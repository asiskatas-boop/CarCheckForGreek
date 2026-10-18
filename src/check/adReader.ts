/*
 * Reads a pasted ad (text or link) with the same rules as the Collector
 * extension, so both always agree.
 */
import '../../collector/src/parser.js';

export interface ReadFields {
  make: string | null;
  model: string | null;
  year: number | null;
  km: number | null;
  price: number | null;
  fuel: string | null;
  gearbox: string | null;
  origin: string | null;
  place: string | null;
}

interface CCParserApi {
  parseAd(text: string): { fields: ReadFields & Record<string, unknown>; kind: string; missing: string[] };
}

const parser = (globalThis as unknown as { CCParser: CCParserApi }).CCParser;

const EMPTY: ReadFields = { make: null, model: null, year: null, km: null, price: null, fuel: null, gearbox: null, origin: null, place: null };

/** car.gr links carry make and model in the address, e.g. .../view/12345-toyota-yaris-1-0 */
function fromLink(url: URL): string {
  const slug = decodeURIComponent(url.pathname).split('/').filter(Boolean).pop() || '';
  return slug.replace(/^\d+-?/, '').replace(/[-_]+/g, ' ');
}

export function readAd(input: string): { fields: ReadFields; from: 'text' | 'link'; kind: string } {
  const s = input.trim();
  if (!s) return { fields: EMPTY, from: 'text', kind: 'sale' };
  let text = s;
  let from: 'text' | 'link' = 'text';
  if (/^https?:\/\//i.test(s) && !/\s/.test(s)) {
    from = 'link';
    try {
      text = fromLink(new URL(s));
    } catch {
      text = s;
    }
  }
  const r = parser.parseAd(text);
  const f = r.fields;
  return {
    fields: {
      make: f.make,
      model: f.model,
      year: f.year,
      km: f.km,
      price: f.price,
      fuel: f.fuel,
      gearbox: f.gearbox,
      origin: f.origin,
      place: (f.place as string | null) ?? null,
    },
    from,
    kind: r.kind,
  };
}
