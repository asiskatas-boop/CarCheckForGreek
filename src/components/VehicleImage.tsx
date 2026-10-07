import React, { useMemo, useState } from 'react';
import { CarFront, ImageOff } from 'lucide-react';
import { MarketRegion, Vehicle } from '../types';

interface VehicleImageProps {
  vehicle: Vehicle;
  year?: number;
  alt?: string;
  className?: string;
  eager?: boolean;
  decorative?: boolean;
  showReferenceLabel?: boolean;
  marketRegion?: MarketRegion;
}

type ImageProfile = {
  modelFamily: string;
  modelRange?: string;
  modelVariant?: string;
  modelYear?: number;
  powerTrain?: string;
};

const IMAGE_PROFILES: Record<string, ImageProfile> = {
  'toyota-corolla-hybrid-e210': { modelFamily: 'corolla', modelYear: 2022, powerTrain: 'hybrid' },
  'skoda-octavia-combi-mk4': { modelFamily: 'octavia', modelVariant: 'estate', modelYear: 2022 },
  'mazda-cx5-gen2': { modelFamily: 'cx-5', modelVariant: 'suv', modelYear: 2021 },
  'tesla-model-3-highland': { modelFamily: 'model-3', modelYear: 2024, powerTrain: 'electric' },
  'volkswagen-golf-mk8': { modelFamily: 'golf', modelVariant: 'hatchback', modelYear: 2022 },
  'dacia-sandero-stepway-mk3': { modelFamily: 'sandero', modelRange: 'stepway', modelYear: 2023 },
  'toyota-yaris-cross-hybrid': { modelFamily: 'yaris-cross', modelVariant: 'suv', modelYear: 2023, powerTrain: 'hybrid' },
  'bmw-3-series-touring-g21': { modelFamily: '3-series', modelVariant: 'estate', modelYear: 2021 },
  'hyundai-ioniq-5': { modelFamily: 'ioniq-5', modelVariant: 'suv', modelYear: 2023, powerTrain: 'electric' },
  'volvo-xc60-recharge-t6': { modelFamily: 'xc60', modelVariant: 'suv', modelYear: 2022, powerTrain: 'hybrid' },
  'honda-civic-ehev-mk11': { modelFamily: 'civic', modelVariant: 'hatchback', modelYear: 2023, powerTrain: 'hybrid' },
  'ford-fiesta-mk8': { modelFamily: 'fiesta', modelVariant: 'hatchback', modelYear: 2019 },
  'porsche-macan-gen1': { modelFamily: 'macan', modelVariant: 'suv', modelYear: 2018 },
  'toyota-yaris-hybrid-mk3': { modelFamily: 'yaris', modelVariant: 'hatchback', modelYear: 2016, powerTrain: 'hybrid' },
  'skoda-kodiaq-mk1': { modelFamily: 'kodiaq', modelVariant: 'suv', modelYear: 2020 },
  'tesla-model-y-longrange': { modelFamily: 'model-y', modelVariant: 'suv', modelYear: 2024, powerTrain: 'electric' },
  'toyota-yaris-mk1-xp10': { modelFamily: 'yaris', modelVariant: 'hatchback', modelYear: 2004 },
  'nissan-micra-k12': { modelFamily: 'micra', modelVariant: 'hatchback', modelYear: 2007 },
  'hyundai-getz-11-13': { modelFamily: 'getz', modelVariant: 'hatchback', modelYear: 2008 }
};

const providerKey = import.meta.env.VITE_IMAGIN_CUSTOMER_KEY?.trim();

const imageUrl = (vehicle: Vehicle, requestedYear: number | undefined, width: number, marketRegion: MarketRegion | string) => {
  if (!providerKey) return null;
  const profile = IMAGE_PROFILES[vehicle.id];
  if (!profile) return null;

  const params = new URLSearchParams({
    customer: providerKey,
    make: vehicle.make.toLowerCase(),
    modelFamily: profile.modelFamily,
    modelYear: String(requestedYear || profile.modelYear || new Date().getFullYear()),
    angle: '23',
    zoomType: 'relative',
    width: String(width),
    fileType: 'webp'
  });

  if (marketRegion === 'greece') params.set('countryCode', 'GR');

  if (profile.modelRange) params.set('modelRange', profile.modelRange);
  if (profile.modelVariant) params.set('modelVariant', profile.modelVariant);
  if (profile.powerTrain) params.set('powerTrain', profile.powerTrain);

  return `https://cdn.imagin.studio/getImage?${params.toString()}`;
};

export const VehicleImage: React.FC<VehicleImageProps> = ({
  vehicle,
  year,
  alt,
  className = '',
  eager = false,
  decorative = false,
  showReferenceLabel = false,
  marketRegion = 'global'
}) => {
  const isGreek = marketRegion === 'greece';
  const [failed, setFailed] = useState(false);
  const src = useMemo(() => imageUrl(vehicle, year, 1200, marketRegion), [vehicle, year, marketRegion]);
  const srcSet = useMemo(() => {
    if (!src) return undefined;
    return [400, 800, 1200]
      .map((width) => `${imageUrl(vehicle, year, width, marketRegion)} ${width}w`)
      .join(', ');
  }, [src, vehicle, year, marketRegion]);

  const accessibleAlt = decorative ? '' : (alt || `${vehicle.make} ${vehicle.model}`);

  if (!src || failed) {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--color-image-fallback)] ${className}`}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : accessibleAlt}
        aria-hidden={decorative ? 'true' : undefined}
      >
        <div className="flex max-w-[80%] flex-col items-center gap-2 text-center text-[var(--color-text-muted)]">
          {src ? <ImageOff className="h-7 w-7" aria-hidden="true" /> : <CarFront className="h-8 w-8" aria-hidden="true" />}
          <span className="text-sm font-semibold text-[var(--color-text)]">{vehicle.make} {vehicle.model}</span>
          <span className="text-[13px] leading-snug">{src ? (isGreek ? 'Η εικόνα του οχήματος δεν είναι διαθέσιμη' : 'Vehicle image unavailable') : (isGreek ? 'Η ακριβής εικόνα μοντέλου εμφανίζεται μόλις συνδεθεί ο πάροχος εικόνων' : 'Accurate model imagery appears after the image provider is configured')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={src}
        srcSet={srcSet}
        sizes="(max-width: 768px) 100vw, 50vw"
        alt={accessibleAlt}
        className={`h-full w-full object-cover ${className}`}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        onError={() => setFailed(true)}
      />
      {showReferenceLabel && (
        <span className="absolute bottom-2 left-2 rounded-full border border-white/25 bg-slate-950/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {isGreek ? 'Εικόνα αναφοράς μοντέλου' : 'Model reference image'}
        </span>
      )}
    </div>
  );
};
