import React from 'react';
import { ScoredRecommendation, Currency, Vehicle, MarketRegion } from '../types';
import { formatPrice, formatPriceRange } from '../services/currency';
import { Bookmark, Scale, ChevronRight, ExternalLink, Check, MapPin } from 'lucide-react';
import { VehicleImage } from './VehicleImage';
import { runningCostLabel, bodyLabel, fuelLabel, formatNumber, plural, transmissionLabel } from '../services/format';

interface VehicleCardProps {
  recommendation: ScoredRecommendation;
  currency: Currency;
  marketRegion?: MarketRegion;
  onOpenDetails: (vehicle: Vehicle) => void;
  onToggleCompare: (vehicleId: string) => void;
  isCompared: boolean;
  onToggleSave: (vehicleId: string) => void;
  isSaved: boolean;
  onViewListings: (vehicleId: string) => void;
  listingCount: number;
}

const categoryLabel = (category: string | undefined, isGreek: boolean) => {
  if (!category) return '';
  const el: Record<string, string> = {
    'Best Overall': 'Καλύτερη συνολικά', 'Best Value': 'Καλύτερη αξία', 'Most Reliable': 'Πιο αξιόπιστη',
    'Alternative Choice': 'Εναλλακτική', 'Electric Highlight': 'Ηλεκτρική επιλογή', 'Practical Champion': 'Πιο πρακτική'
  };
  return isGreek ? (el[category] || category) : category;
};

export const VehicleCard: React.FC<VehicleCardProps> = ({
  recommendation, currency, marketRegion = 'global', onOpenDetails, onToggleCompare, isCompared,
  onToggleSave, isSaved, onViewListings, listingCount
}) => {
  const isGreek = marketRegion === 'greece';
  const { vehicle, matchScore, category, personalizedReason } = recommendation;
  const name = `${vehicle.make} ${vehicle.model}`;

  return (
    <article className="group surface-card overflow-hidden flex flex-col justify-between hover:border-[var(--color-border-strong)] transition-colors">
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface-subtle)]">
          <VehicleImage vehicle={vehicle} alt={`${vehicle.make} ${vehicle.model}`} marketRegion={marketRegion} showReferenceLabel className="object-center" />
          {category && <div className="absolute top-3 left-3 bg-[rgba(255,253,249,0.92)] backdrop-blur-md px-3 py-1.5 text-[13px] font-semibold text-[var(--color-text)] rounded-full border border-white/80 shadow-sm">{categoryLabel(category, isGreek)}</div>}
          <div className="absolute top-3 right-3 bg-[rgba(255,253,249,0.92)] backdrop-blur-md border border-white/80 px-3 py-1.5 flex items-center gap-1.5 rounded-full text-[var(--color-text)] shadow-sm">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">{isGreek ? 'Ταίριασμα' : 'Match'}</span><span className="text-[13px] font-semibold">{matchScore}%</span>
          </div>
          <div className="absolute bottom-10 right-3 flex items-center gap-2">
            <button type="button" onClick={() => onToggleCompare(vehicle.id)} aria-pressed={isCompared} aria-label={isGreek ? `Σύγκριση: ${name}` : `Compare ${name}`} className={`touch-target rounded-xl backdrop-blur-md flex items-center justify-center ${isCompared ? 'bg-[var(--color-accent)] text-white' : 'bg-[rgba(255,253,249,0.92)] text-[var(--color-text)] hover:bg-[var(--color-surface-raised)] border border-white/80 shadow-sm'}`}><Scale className="w-4 h-4" aria-hidden="true" /></button>
            <button type="button" onClick={() => onToggleSave(vehicle.id)} aria-pressed={isSaved} aria-label={isGreek ? `Αποθήκευση: ${name}` : `Save ${name}`} className={`touch-target rounded-xl backdrop-blur-md flex items-center justify-center ${isSaved ? 'bg-[var(--color-accent)] text-white' : 'bg-[rgba(255,253,249,0.92)] text-[var(--color-text)] hover:bg-[var(--color-surface-raised)] border border-white/80 shadow-sm'}`}><Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" /></button>
          </div>
          <p className="absolute bottom-10 left-3 rounded-full bg-[rgba(255,253,249,0.92)] border border-white/80 px-3 py-1.5 text-[13px] font-medium text-[var(--color-text)] backdrop-blur-md shadow-sm">{vehicle.generation} · {vehicle.years}</p>
        </div>

        <div className="p-5">
          <p className="text-[15px] text-[var(--color-text-muted)] mb-1">{bodyLabel(vehicle.bodyStyle, marketRegion)} · {fuelLabel(vehicle.fuelType, marketRegion)} · {transmissionLabel(vehicle.transmission, marketRegion)}{vehicle.engineDisplacementCc ? ` · ${formatNumber(vehicle.engineDisplacementCc, marketRegion)} cc` : ''}</p>
          <h3 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">{vehicle.make} {vehicle.model}</h3>

          {isGreek && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] font-semibold">
              {vehicle.greekRoadTaxEur === 0 ? <span className="text-[var(--color-success)] bg-[var(--color-success-soft)] px-2.5 py-1 rounded-full">0€ τέλη κυκλοφορίας</span> : vehicle.greekRoadTaxEur ? <span className="text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] px-2.5 py-1 rounded-full">Τέλη {formatNumber(vehicle.greekRoadTaxEur, marketRegion, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}/έτος</span> : null}
              {vehicle.athensRingExempt && <span className="text-[var(--color-text)] bg-[var(--color-surface-subtle)] px-2.5 py-1 rounded-full flex items-center gap-1"><MapPin className="w-3 h-3" aria-hidden="true" />Ελεύθερος Δακτύλιος</span>}
              {vehicle.carGrSearchUrl && (
                <a href={vehicle.carGrSearchUrl} target="_blank" rel="noreferrer" className="min-h-11 px-2.5 rounded-full border border-[var(--color-border)] text-[var(--color-text)] flex items-center gap-1.5 hover:border-[var(--color-accent)]">
                  <span>Έλεγχος τρέχουσας αγοράς</span><span className="sr-only"> για {name} (ανοίγει σε νέα καρτέλα)</span><ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              )}
            </div>
          )}

          <p className="text-[15px] text-[var(--color-text-muted)] mt-3">{isGreek ? 'Προτεινόμενο σύνολο:' : 'Recommended powertrain:'} <span className="text-[var(--color-text)] font-semibold">{vehicle.recommendedPowertrain}</span></p>

          <div className="mt-4 p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] grid grid-cols-2 gap-4">
            <div><span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-bold">{isGreek ? 'Ενδεικτική αγορά' : 'Reference market'}</span><div className="text-[15px] font-bold text-[var(--color-text)] mt-1">{formatPriceRange(vehicle.typicalPriceMin, vehicle.typicalPriceMax, currency)}</div></div>
            <div className="text-right"><span className="text-xs uppercase tracking-wider text-[var(--color-accent-text)] font-bold">{isGreek ? 'Στόχος καλής αγοράς' : 'Good-buy target'}</span><div className="text-[15px] font-semibold text-[var(--color-accent-text)] mt-1">{isGreek ? 'Έως' : 'Up to'} {formatPrice(vehicle.goodBuyPrice, currency)}</div></div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {[
              [isGreek ? 'Αξιοπιστία' : 'Reliability', `${vehicle.reliabilityRating}/5`],
              [isGreek ? 'Κόστος' : 'Cost', runningCostLabel(vehicle.runningCostLevel, marketRegion)],
              [isGreek ? 'Κατανάλωση' : 'Economy', vehicle.fuelEconomy.split('(')[0].trim()],
              [isGreek ? 'Χώρος' : 'Boot', `${formatNumber(vehicle.cargoCapacityLiters, marketRegion)} L`]
            ].map(([label, value]) => <div key={label} className="p-2 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border)]"><div className="text-xs text-[var(--color-text-muted)] font-semibold">{label}</div><div className="text-[13px] font-bold text-[var(--color-text)] mt-1 break-words">{value}</div></div>)}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="text-[13px] font-bold text-[var(--color-accent-text)] uppercase tracking-wider mb-1 flex items-center gap-1.5"><Check className="w-3.5 h-3.5" aria-hidden="true" />{isGreek ? 'Γιατί ταιριάζει' : 'Why it fits'}</div>
            <p className="text-[15px] text-[var(--color-text)] leading-relaxed">{personalizedReason}</p>
          </div>
        </div>
      </div>

      <footer className="p-5 pt-0 flex flex-col sm:flex-row items-stretch gap-2">
        <button type="button" onClick={() => onOpenDetails(vehicle)} className="min-h-11 flex-1 inline-flex items-center justify-center gap-2 px-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[15px] font-bold"><span>{isGreek ? 'Λεπτομέρειες & έλεγχος' : 'Specs & checks'}</span><ChevronRight className="w-4 h-4" aria-hidden="true" /></button>
        {listingCount > 0 && <button type="button" onClick={() => onViewListings(vehicle.id)} className="min-h-11 px-4 rounded-full border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[15px] font-semibold text-[var(--color-text)]" title={isGreek ? 'Προβολή αποθηκευμένων δειγμάτων αγγελιών για το μοντέλο' : 'View saved listing samples for this model'}>{plural(listingCount, marketRegion, isGreek ? { one: 'δείγμα', other: 'δείγματα' } : { one: 'sample', other: 'samples' })}</button>}
      </footer>
    </article>
  );
};
