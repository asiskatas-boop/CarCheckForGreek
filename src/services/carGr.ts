import { MarketplaceListing, Vehicle } from '../types';

/**
 * car.gr model pages live at /used-cars/{make}/{model}.html. Its search page
 * ignores text `make=`/`model=` parameters (it expects internal numeric ids),
 * which is why the old links only applied the price filter.
 *
 * Slugs per CarCheck vehicle. `model` is left out where we are not sure of
 * car.gr's slug, so the link falls back to that make's page instead of a wrong model.
 */
const CAR_GR_SLUGS: Record<string, { make: string; model?: string }> = {
  'toyota-corolla-hybrid-e210': { make: 'toyota', model: 'corolla' },
  'skoda-octavia-combi-mk4': { make: 'skoda', model: 'octavia' },
  'mazda-cx5-gen2': { make: 'mazda', model: 'cx-5' },
  'tesla-model-3-highland': { make: 'tesla', model: 'model-3' },
  'volkswagen-golf-mk8': { make: 'volkswagen', model: 'golf' },
  'dacia-sandero-stepway-mk3': { make: 'dacia', model: 'sandero' },
  'toyota-yaris-cross-hybrid': { make: 'toyota', model: 'yaris-cross' },
  'bmw-3-series-touring-g21': { make: 'bmw' },
  'hyundai-ioniq-5': { make: 'hyundai', model: 'ioniq-5' },
  'volvo-xc60-recharge-t6': { make: 'volvo', model: 'xc60' },
  'honda-civic-ehev-mk11': { make: 'honda', model: 'civic' },
  'ford-fiesta-mk8': { make: 'ford', model: 'fiesta' },
  'porsche-macan-gen1': { make: 'porsche', model: 'macan' },
  'toyota-yaris-hybrid-mk3': { make: 'toyota', model: 'yaris' },
  'skoda-kodiaq-mk1': { make: 'skoda', model: 'kodiaq' },
  'tesla-model-y-longrange': { make: 'tesla', model: 'model-y' },
  'toyota-yaris-mk1-xp10': { make: 'toyota', model: 'yaris' },
  'fiat-punto-panda-12-fire': { make: 'fiat', model: 'punto' },
  'nissan-micra-k12': { make: 'nissan', model: 'micra' },
  'hyundai-getz-11-13': { make: 'hyundai', model: 'getz' }
};

const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)[0]
    .replace(/[^a-z0-9-]/g, '');

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export function carGrVehicleUrl(vehicle: Vehicle, price?: { from?: number; to?: number }): string {
  const slugs = CAR_GR_SLUGS[vehicle.id] ?? { make: slugify(vehicle.make), model: slugify(vehicle.model) };
  const path = slugs.model ? `${slugs.make}/${slugs.model}.html` : `${slugs.make}.html`;
  const params = new URLSearchParams();
  if (price?.from) params.set('price-from', String(price.from));
  if (price?.to) params.set('price-to', String(price.to));
  const query = params.toString();
  return `https://www.car.gr/used-cars/${path}${query ? `?${query}` : ''}`;
}

/** Search for cars like this listing: same model, priced around the listing price. */
export function carGrListingUrl(listing: MarketplaceListing, vehicle: Vehicle | undefined): string | undefined {
  if (!vehicle) return listing.carGrDirectUrl;
  return carGrVehicleUrl(vehicle, {
    from: Math.max(0, roundTo(listing.price * 0.8, 500)),
    to: roundTo(listing.price * 1.2, 500)
  });
}
