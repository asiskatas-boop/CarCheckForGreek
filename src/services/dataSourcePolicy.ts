import { DataProvenance } from '../types';

export type VehicleDataDomain = 'specifications' | 'pricing' | 'taxation' | 'emissions' | 'safety' | 'recalls' | 'images';

export const PREFERRED_DATA_SOURCES: Record<VehicleDataDomain, { primary: string; fallback?: string; notes: string }> = {
  specifications: { primary: 'JATO Specifications', notes: 'Use market-specific make/model/range/variant identifiers and retain the JATO record/instance id.' },
  pricing: { primary: 'autobizMarket', fallback: 'licensed marketplace partner feed', notes: 'Store valuation date, mileage assumptions, condition assumptions, and market.' },
  taxation: { primary: 'AADE', notes: 'Calculate from certified registration/CO2 data; do not store a timeless tax number without its basis.' },
  emissions: { primary: 'EEA / Certificate of Conformity', notes: 'Prefer the vehicle licence or CoC for a specific car; use EEA for model/registration-level reference data.' },
  safety: { primary: 'Euro NCAP', notes: 'Persist rating year/protocol together with stars and sub-scores.' },
  recalls: { primary: 'EU Safety Gate', fallback: 'manufacturer recall checker', notes: 'Match by make/model/date/VIN where available and persist alert identifiers.' },
  images: { primary: 'CarImages.org / Wikimedia Commons', notes: 'Run the one-time rights-manifest importer, self-host the selected image, and preserve the exact credit and licence URL.' }
};

export const makeProvenance = (input: Omit<DataProvenance, 'retrievedAt'> & { retrievedAt?: string }): DataProvenance => ({
  ...input,
  retrievedAt: input.retrievedAt ?? new Date().toISOString()
});
