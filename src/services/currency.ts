import { Currency } from '../types';
import { activeLocale } from './format';

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

const currencyFormatter = (currency: Currency) =>
  new Intl.NumberFormat(activeLocale(), {
    style: 'currency',
    currency: CURRENCY_RATES[currency].code,
    maximumFractionDigits: 0
  });

/** Formats a EUR amount in the chosen currency using the active UI locale (e.g. "12.000 €" in Greek). */
export function formatPrice(amountEUR: number, currency: Currency): string {
  return currencyFormatter(currency).format(convertFromEUR(amountEUR, currency));
}

export function formatPriceRange(minEUR: number, maxEUR: number, currency: Currency): string {
  const formatter = currencyFormatter(currency);
  return `${formatter.format(convertFromEUR(minEUR, currency))} – ${formatter.format(convertFromEUR(maxEUR, currency))}`;
}
