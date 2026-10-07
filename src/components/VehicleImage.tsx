import React, { useMemo, useState } from 'react';
import { CarFront, ImageOff } from 'lucide-react';
import { MarketRegion, Vehicle } from '../types';
import { CAR_IMAGE_MANIFEST } from '../data/carImages.generated';

interface VehicleImageProps {
  vehicle: Vehicle;
  year?: number;
  alt?: string;
  className?: string;
  eager?: boolean;
  decorative?: boolean;
  showReferenceLabel?: boolean;
  marketRegion?: MarketRegion;
  allowAttributionRequired?: boolean;
}

const suppliedImageUrl = (vehicle: Vehicle) => {
  const value = vehicle.imageUrl?.trim();
  if (!value) return null;
  // The seed data contains generic Unsplash photos. Never present those as an exact model.
  if (/images\.unsplash\.com|source\.unsplash\.com/i.test(value)) return null;
  return value;
};

export const VehicleImage: React.FC<VehicleImageProps> = ({
  vehicle,
  alt,
  className = '',
  eager = false,
  decorative = false,
  showReferenceLabel = false,
  marketRegion = 'global',
  allowAttributionRequired = true
}) => {
  const isGreek = marketRegion === 'greece';
  const carImage = CAR_IMAGE_MANIFEST[vehicle.id];
  const eligibleCarImage = carImage && (allowAttributionRequired || !carImage.attributionRequired) ? carImage : undefined;
  const declaredSrc = useMemo(() => suppliedImageUrl(vehicle), [vehicle]);
  const [carImageFailed, setCarImageFailed] = useState(false);
  const [declaredFailed, setDeclaredFailed] = useState(false);

  const generatedSrc = eligibleCarImage && !carImageFailed ? `${import.meta.env.BASE_URL}${eligibleCarImage.src.replace(/^\/+/, '')}` : null;
  const fallbackSrc = declaredSrc && !declaredFailed ? declaredSrc : null;
  const src = generatedSrc || fallbackSrc;
  const usingCarImages = Boolean(src && generatedSrc && src === generatedSrc);
  const requiresCredit = Boolean(usingCarImages && eligibleCarImage?.attributionRequired);
  const accessibleAlt = decorative ? '' : (alt || `${vehicle.make} ${vehicle.model}`);

  if (!src && decorative) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-[var(--color-image-fallback)] text-[var(--color-text-muted)] ${className}`} aria-hidden="true">
        <CarFront className="h-5 w-5" aria-hidden="true" />
      </div>
    );
  }

  if (!src) {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--color-image-fallback)] ${className}`}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : accessibleAlt}
        aria-hidden={decorative ? 'true' : undefined}
      >
        <div className="flex max-w-[80%] flex-col items-center gap-2 text-center text-[var(--color-text-muted)]">
          {(carImageFailed || declaredFailed) ? <ImageOff className="h-7 w-7" aria-hidden="true" /> : <CarFront className="h-8 w-8" aria-hidden="true" />}
          <span className="text-sm font-semibold text-[var(--color-text)]">{vehicle.make} {vehicle.model}</span>
          <span className="text-[13px] leading-snug">
            {(carImageFailed || declaredFailed)
              ? (isGreek ? 'Η εικόνα του οχήματος δεν είναι διαθέσιμη' : 'Vehicle image unavailable')
              : (isGreek ? 'Δεν βρέθηκε εικόνα αναφοράς για αυτό το μοντέλο' : 'No reference image found for this model')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <figure className="flex h-full w-full flex-col overflow-hidden bg-[var(--color-image-fallback)]">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <img
          src={src}
          alt={accessibleAlt}
          className={`h-full w-full object-contain ${className}`}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          onError={() => {
            if (usingCarImages) setCarImageFailed(true);
            else setDeclaredFailed(true);
          }}
        />

        {showReferenceLabel && (
          <span className="absolute bottom-2 left-2 rounded-full border border-white/80 bg-[rgba(255,253,249,0.92)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text)] backdrop-blur-sm shadow-sm">
            {isGreek ? 'Εικόνα αναφοράς μοντέλου' : 'Model reference image'}
          </span>
        )}
      </div>

      {requiresCredit && eligibleCarImage && (
        <figcaption className="flex shrink-0 flex-wrap items-center gap-x-1 gap-y-0.5 border-t border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2 py-1 text-[9px] leading-tight text-[var(--color-text-muted)] sm:text-[10px]">
          <a
            href={eligibleCarImage.sourcePageUrl}
            target="_blank"
            rel="noreferrer"
            className="break-words underline decoration-transparent underline-offset-2 hover:decoration-current focus-visible:decoration-current"
            title={eligibleCarImage.creditText}
          >
            {eligibleCarImage.creditText}
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={eligibleCarImage.licenseUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 underline decoration-transparent underline-offset-2 hover:decoration-current focus-visible:decoration-current"
          >
            {eligibleCarImage.licenseCode}
          </a>
        </figcaption>
      )}
    </figure>
  );
};
