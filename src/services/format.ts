import { MarketRegion } from '../types';

/**
 * Locale helpers. The active UI language is mirrored onto <html lang> by App,
 * so formatters that are not handed a region can still follow it.
 */
export const localeForRegion = (region: MarketRegion): string => (region === 'greece' ? 'el-GR' : 'en-GB');

export const activeLocale = (): string => {
  if (typeof document === 'undefined') return 'el-GR';
  return document.documentElement.lang === 'en' ? 'en-GB' : 'el-GR';
};

export const formatNumber = (value: number, region?: MarketRegion, options?: Intl.NumberFormatOptions): string =>
  new Intl.NumberFormat(region ? localeForRegion(region) : activeLocale(), options).format(value);

/** Picks the correct plural form, e.g. plural(1, region, ['listing', 'listings']). */
export const plural = (count: number, region: MarketRegion, forms: { one: string; other: string }): string => {
  const rule = new Intl.PluralRules(localeForRegion(region)).select(count);
  return `${formatNumber(count, region)} ${rule === 'one' ? forms.one : forms.other}`;
};

const FUEL_EL: Record<string, string> = {
  Hybrid: 'Υβριδικό',
  Petrol: 'Βενζίνη',
  Electric: 'Ηλεκτρικό',
  Diesel: 'Diesel',
  'Plug-in Hybrid': 'Plug-in υβριδικό'
};

const BODY_EL: Record<string, string> = {
  Hatchback: 'Χάτσμπακ',
  'Estate / Wagon': 'Στέισον βάγκον',
  'Compact SUV': 'Compact SUV',
  'Mid-size SUV': 'Μεσαίο SUV',
  'Large SUV': 'Μεγάλο SUV',
  'City car': 'Αυτοκίνητο πόλης',
  Sedan: 'Σεντάν',
  Crossover: 'Crossover'
};

const TRANSMISSION_EL: Record<string, string> = {
  Automatic: 'Αυτόματο',
  Manual: 'Χειροκίνητο',
  'Both available': 'Αυτόματο ή χειροκίνητο'
};

const DRIVETRAIN_EL: Record<string, string> = {
  FWD: 'Προσθιοκίνητο',
  RWD: 'Πισωκίνητο',
  AWD: 'Τετρακίνητο',
  '4WD': 'Τετρακίνητο'
};

const RUNNING_COST_EL: Record<string, string> = {
  'Very Low': 'Πολύ χαμηλό',
  Low: 'Χαμηλό',
  Medium: 'Μέτριο',
  High: 'Υψηλό',
  'Very High': 'Πολύ υψηλό'
};

const translate = (table: Record<string, string>) => (value: string | undefined, region: MarketRegion): string => {
  if (!value) return '';
  return region === 'greece' ? table[value] ?? value : value;
};

export const fuelLabel = translate(FUEL_EL);
export const bodyLabel = translate(BODY_EL);
export const transmissionLabel = translate(TRANSMISSION_EL);
export const drivetrainLabel = translate(DRIVETRAIN_EL);
export const runningCostLabel = translate(RUNNING_COST_EL);

export const DEAL_RATING_EL: Record<string, string> = {
  'Excellent Price': 'Εξαιρετική τιμή',
  'Good Price': 'Καλή τιμή',
  'Fair Price': 'Δίκαιη τιμή',
  'Above Market': 'Πάνω από την αγορά'
};

export const dealRatingLabel = (rating: string, region: MarketRegion): string =>
  region === 'greece' ? DEAL_RATING_EL[rating] ?? 'Δίκαιη τιμή' : rating;
