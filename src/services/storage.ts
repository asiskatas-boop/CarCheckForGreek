import type { Currency, MarketRegion, UserPreferences } from '../types';

const VALID_CURRENCIES: Currency[] = ['EUR', 'USD', 'GBP'];
const VALID_REGIONS: MarketRegion[] = ['global', 'greece'];

export function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in private/sandboxed previews. The app should still run.
  }
}

export function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadCurrency(fallback: Currency = 'EUR'): Currency {
  const value = safeGetItem('carcheck_currency') as Currency | null;
  return value && VALID_CURRENCIES.includes(value) ? value : fallback;
}

export function loadMarketRegion(fallback: MarketRegion = 'greece'): MarketRegion {
  const value = safeGetItem('carcheck_market_region') as MarketRegion | null;
  return value && VALID_REGIONS.includes(value) ? value : fallback;
}

export function loadStringArray(key: string, fallback: string[] = []): string[] {
  const value = safeParseJson<unknown>(safeGetItem(key), fallback);
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallback;
}

export function normalizePreferences(value: unknown, fallback: UserPreferences): UserPreferences {
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Partial<UserPreferences>;

  const usages = Array.isArray(candidate.usages)
    ? candidate.usages.filter((item): item is UserPreferences['usages'][number] => typeof item === 'string')
    : fallback.usages;
  const priorities = Array.isArray(candidate.priorities)
    ? candidate.priorities.filter((item): item is UserPreferences['priorities'][number] => typeof item === 'string').slice(0, 3)
    : fallback.priorities;
  const lifestyle = Array.isArray(candidate.lifestyle)
    ? candidate.lifestyle.filter((item): item is UserPreferences['lifestyle'][number] => typeof item === 'string')
    : fallback.lifestyle;

  const currency = VALID_CURRENCIES.includes(candidate.currency as Currency)
    ? (candidate.currency as Currency)
    : fallback.currency;
  const marketRegion = VALID_REGIONS.includes(candidate.marketRegion as MarketRegion)
    ? (candidate.marketRegion as MarketRegion)
    : fallback.marketRegion;

  return {
    ...fallback,
    ...candidate,
    currency,
    marketRegion,
    usages,
    priorities,
    lifestyle
  } as UserPreferences;
}

export function loadPreferences(fallback: UserPreferences): UserPreferences {
  const parsed = safeParseJson<unknown>(safeGetItem('carcheck_user_preferences'), fallback);
  return normalizePreferences(parsed, fallback);
}

export function loadStringRecord(key: string): Record<string, string> {
  const value = safeParseJson<unknown>(safeGetItem(key), {});
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(([, item]) => typeof item === 'string')
  ) as Record<string, string>;
}

export function loadBooleanRecord(key: string): Record<string, boolean> {
  const value = safeParseJson<unknown>(safeGetItem(key), {});
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(([, item]) => typeof item === 'boolean')
  ) as Record<string, boolean>;
}
