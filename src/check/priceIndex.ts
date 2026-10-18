import type { PriceIndex } from '../pricing/engine.ts';

const LOCAL_KEY = 'chekcareto.priceIndex';

export type IndexSource = 'local' | 'site';

/** The index built from the user's own files on the data page wins over the site's. */
export async function loadPriceIndex(): Promise<{ index: PriceIndex; from: IndexSource } | null> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return { index: JSON.parse(raw) as PriceIndex, from: 'local' };
  } catch {
    // private mode or blocked storage: fall through to the site index
  }
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}price-index.json`, { cache: 'no-cache' });
    if (!res.ok) return null;
    return { index: (await res.json()) as PriceIndex, from: 'site' };
  } catch {
    return null;
  }
}

export function saveLocalIndex(index: PriceIndex): boolean {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(index));
    return true;
  } catch {
    return false;
  }
}

export function clearLocalIndex() {
  try {
    localStorage.removeItem(LOCAL_KEY);
  } catch {
    // ignore
  }
}

export const euro = (n: number) => new Intl.NumberFormat('el-GR').format(Math.round(n)) + ' €';
export const num = (n: number) => new Intl.NumberFormat('el-GR').format(Math.round(n));
