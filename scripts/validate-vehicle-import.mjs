import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/validate-vehicle-import.mjs <normalized-vehicles.json>');
  process.exit(2);
}

const file = path.resolve(process.cwd(), input);
let payload;
try {
  payload = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (error) {
  console.error(`Could not parse ${file}: ${error.message}`);
  process.exit(2);
}

const vehicles = Array.isArray(payload) ? payload : payload?.vehicles;
if (!Array.isArray(vehicles)) {
  console.error('Expected a JSON array or an object with a `vehicles` array.');
  process.exit(2);
}

const required = [
  'id', 'make', 'model', 'generation', 'years', 'recommendedYears', 'bodyStyle',
  'fuelType', 'transmission', 'engineSummary', 'recommendedPowertrain',
  'horsepower', 'acceleration0to100', 'fuelEconomy', 'cargoCapacityLiters',
  'seats', 'drivetrain', 'typicalPriceMin', 'typicalPriceMax', 'goodBuyPrice',
  'excellentBuyPrice', 'marketPriceType', 'reliabilityRating', 'runningCostLevel',
  'comfortLevel', 'safetyRating', 'practicalityScore', 'techScore',
  'pros', 'cons', 'bestFor', 'notIdealFor', 'knownIssues', 'inspectionChecklist',
  'defaultExplanation'
];

const errors = [];
const warnings = [];
const ids = new Set();
const now = Date.now();

for (const [index, vehicle] of vehicles.entries()) {
  const label = vehicle?.id || `row ${index + 1}`;
  if (!vehicle || typeof vehicle !== 'object') {
    errors.push(`${label}: record is not an object`);
    continue;
  }

  for (const field of required) {
    if (!(field in vehicle) || vehicle[field] === null || vehicle[field] === undefined) {
      errors.push(`${label}: missing required field ${field}`);
    }
  }

  if (vehicle.id) {
    if (ids.has(vehicle.id)) errors.push(`${label}: duplicate id`);
    ids.add(vehicle.id);
  }

  if (Number.isFinite(vehicle.typicalPriceMin) && Number.isFinite(vehicle.typicalPriceMax) && vehicle.typicalPriceMin > vehicle.typicalPriceMax) {
    errors.push(`${label}: typicalPriceMin is greater than typicalPriceMax`);
  }
  if (Number.isFinite(vehicle.goodBuyPrice) && Number.isFinite(vehicle.typicalPriceMax) && vehicle.goodBuyPrice > vehicle.typicalPriceMax * 1.25) {
    warnings.push(`${label}: goodBuyPrice is unusually above the reference maximum`);
  }
  if (Number.isFinite(vehicle.reliabilityRating) && (vehicle.reliabilityRating < 1 || vehicle.reliabilityRating > 5)) {
    errors.push(`${label}: reliabilityRating must be 1–5`);
  }
  if (Number.isFinite(vehicle.safetyRating) && (vehicle.safetyRating < 1 || vehicle.safetyRating > 5)) {
    errors.push(`${label}: safetyRating must be 1–5`);
  }
  if (Number.isFinite(vehicle.seats) && (vehicle.seats < 1 || vehicle.seats > 20)) {
    errors.push(`${label}: seats looks invalid`);
  }

  const provenance = vehicle.provenance;
  if (!provenance?.specifications) {
    errors.push(`${label}: specifications provenance is required for production data`);
  }

  for (const [domain, source] of Object.entries(provenance || {})) {
    if (!source) continue;
    if (!source.provider) errors.push(`${label}: provenance.${domain}.provider is missing`);
    if (!source.kind) errors.push(`${label}: provenance.${domain}.kind is missing`);
    if (!source.retrievedAt) {
      errors.push(`${label}: provenance.${domain}.retrievedAt is missing`);
    } else {
      const ts = Date.parse(source.retrievedAt);
      if (Number.isNaN(ts)) errors.push(`${label}: provenance.${domain}.retrievedAt is not a valid date`);
      if (!Number.isNaN(ts) && ts > now + 24 * 60 * 60 * 1000) warnings.push(`${label}: provenance.${domain}.retrievedAt is in the future`);
    }
    if ((source.kind === 'commercial' || source.kind === 'marketplace') && !source.sourceRecordId) {
      warnings.push(`${label}: provenance.${domain}.sourceRecordId is missing`);
    }
  }

  if (vehicle.marketPriceType && !provenance?.pricing) {
    warnings.push(`${label}: pricing fields exist without pricing provenance`);
  }
  if ((vehicle.greekRoadTaxEur !== undefined || vehicle.athensRingExempt !== undefined) && !provenance?.taxation) {
    warnings.push(`${label}: Greek tax/restriction fields exist without taxation provenance`);
  }
  if (vehicle.safetyRating && !provenance?.safety) {
    warnings.push(`${label}: safetyRating exists without safety provenance/rating year metadata`);
  }
}

console.log(`Checked ${vehicles.length} vehicle record(s).`);
for (const warning of warnings) console.warn(`WARN  ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
