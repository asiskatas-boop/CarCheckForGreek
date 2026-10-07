import { Currency } from '../types';

export const CURRENCY_RATES: Record<Currency, { symbol: string; rateFromEUR: number; code: string }> = {
  EUR: { symbol: '€', rateFromEUR: 1.0, code: 'EUR' },
  USD: { symbol: '$', rateFromEUR: 1.08, code: 'USD' },
  GBP: { symbol: '£', rateFromEUR: 0.85, code: 'GBP' }
};

export function convertFromEUR(amountEUR: number, targetCurrency: Currency): number {
  const rate = CURRENCY_RATES[targetCurrency]?.rateFromEUR ?? 1.0;
  return Math.round(amountEUR * rate);
}

export function convertToEUR(amount: number, fromCurrency: Currency): number {
  const rate = CURRENCY_RATES[fromCurrency]?.rateFromEUR ?? 1.0;
  return Math.round(amount / rate);
}

export function formatPrice(amountEUR: number, currency: Currency): string {
  const converted = convertFromEUR(amountEUR, currency);
  const symbol = CURRENCY_RATES[currency].symbol;

  return `${symbol}${converted.toLocaleString()}`;
}

export function formatPriceRange(minEUR: number, maxEUR: number, currency: Currency): string {
  const cMin = convertFromEUR(minEUR, currency);
  const cMax = convertFromEUR(maxEUR, currency);
  const symbol = CURRENCY_RATES[currency].symbol;

  return `${symbol}${cMin.toLocaleString()} – ${symbol}${cMax.toLocaleString()}`;
}
