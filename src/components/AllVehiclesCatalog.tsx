import React, { useState } from 'react';
import { useDebouncedValue, useUrlParam } from '../hooks/useUrlState';
import { Vehicle, Currency, MarketRegion } from '../types';
import { VEHICLES } from '../data/vehicles';
import { formatPrice, formatPriceRange } from '../services/currency';
import { Search, ChevronRight, Scale, Bookmark, ShieldCheck, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { GET_LISTINGS_FOR_VEHICLE } from '../data/listings';
import { VehicleImage } from './VehicleImage';
import { DataTrustNote } from './DataTrustNote';
import { bodyLabel, drivetrainLabel, formatNumber, fuelLabel, plural } from '../services/format';

interface AllVehiclesCatalogProps {
  currency: Currency;
  marketRegion?: MarketRegion;
  onOpenDetails: (vehicle: Vehicle) => void;
  onToggleCompare: (vehicleId: string) => void;
  comparedIds: string[];
  onToggleSave: (vehicleId: string) => void;
  savedIds: string[];
  onViewListings: (vehicleId: string) => void;
}

export const AllVehiclesCatalog: React.FC<AllVehiclesCatalogProps> = ({
  currency,
  marketRegion = 'global',
  onOpenDetails,
  onToggleCompare,
  comparedIds,
  onToggleSave,
  savedIds,
  onViewListings
}) => {
  const isGreek = marketRegion === 'greece';
  const [searchQuery, setSearchQuery] = useUrlParam('q', '');
  const [selectedBody, setSelectedBody] = useUrlParam('body', 'all');
  const [selectedFuel, setSelectedFuel] = useUrlParam('fuel', 'all');
  const [sortParam, setSortBy] = useUrlParam('sort', 'reliability');
  const sortBy = (['price-asc', 'price-desc', 'reliability', 'power'].includes(sortParam) ? sortParam : 'reliability') as 'price-asc' | 'price-desc' | 'reliability' | 'power';

  const bodyStyles = ['Hatchback', 'Estate / Wagon', 'Compact SUV', 'Mid-size SUV', 'Large SUV', 'City car', 'Sedan', 'Crossover'];
  const fuelTypes = ['Hybrid', 'Petrol', 'Electric', 'Diesel', 'Plug-in Hybrid'];

  const filteredVehicles = VEHICLES.filter((vehicle) => {
    if (selectedBody !== 'all' && vehicle.bodyStyle !== selectedBody) return false;
    if (selectedFuel !== 'all' && vehicle.fuelType !== selectedFuel) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (![vehicle.make, vehicle.model, vehicle.engineSummary].some((value) => value.toLowerCase().includes(query))) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.typicalPriceMin - b.typicalPriceMin;
    if (sortBy === 'price-desc') return b.typicalPriceMax - a.typicalPriceMax;
    if (sortBy === 'power') return b.horsepower - a.horsepower;
    return b.reliabilityRating - a.reliabilityRating;
  });

  // On phones the dropdowns sit behind a toggle so the cars are visible straight away.
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const activeFilterCount = (selectedBody !== 'all' ? 1 : 0) + (selectedFuel !== 'all' ? 1 : 0) + (sortBy !== 'reliability' ? 1 : 0);
  const mobileHidden = showMobileFilters ? '' : 'hidden md:block';

  const countText = isGreek
    ? plural(filteredVehicles.length, marketRegion, { one: 'όχημα', other: 'οχήματα' })
    : plural(filteredVehicles.length, marketRegion, { one: 'vehicle', other: 'vehicles' });
  const announcedCount = useDebouncedValue(countText);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBody('all');
    setSelectedFuel('all');
    setSortBy('reliability');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 animate-fadeIn">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
          {isGreek ? 'Κατάλογος Οχημάτων' : 'Vehicle Catalog'}
        </h1>
        <p className="hidden sm:block text-[15px] text-[var(--color-text-muted)] mt-1 max-w-3xl">
          {isGreek
            ? 'Εξερεύνησε τα οχήματα που έχουμε αναλύσει, με ενδεικτικές τιμές, αξιοπιστία και οδηγό ελέγχου πριν την αγορά.'
            : 'Explore analyzed vehicles with reference price ranges, reliability ratings, and pre-purchase inspection guidance.'}
        </p>
      </div>

      <section aria-label={isGreek ? 'Φίλτρα οχημάτων' : 'Vehicle filters'} className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] grid grid-cols-1 md:grid-cols-4 gap-3">
        <label className="md:col-span-1 text-[15px] font-semibold text-[var(--color-text)]">
          <span className="sr-only md:not-sr-only md:block md:mb-1.5">{isGreek ? 'Αναζήτηση' : 'Search'}</span>
          <span className="relative block">
            <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              name="q"
              autoComplete="off"
              spellCheck={false}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={isGreek ? 'Toyota, Octavia, Tesla…' : 'Toyota, Octavia, Tesla…'}
              className="w-full min-h-11 pl-9 pr-3 rounded-xl border border-[var(--color-border-control)] bg-[var(--color-surface-subtle)] text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
            />
          </span>
        </label>

        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          aria-expanded={showMobileFilters}
          className="md:hidden min-h-11 px-4 rounded-xl border border-[var(--color-border-control)] bg-[var(--color-surface-subtle)] text-[15px] font-semibold text-[var(--color-text)] inline-flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          {isGreek ? 'Φίλτρα & ταξινόμηση' : 'Filters & sort'}
          {activeFilterCount > 0 && <span className="tabular-nums">({activeFilterCount})</span>}
        </button>

        <label className={`${mobileHidden} text-[15px] font-semibold text-[var(--color-text)]`}>
          <span className="block mb-1.5">{isGreek ? 'Αμάξωμα' : 'Body style'}</span>
          <select name="body" value={selectedBody} onChange={(event) => setSelectedBody(event.target.value)} className="w-full min-h-11 px-3 rounded-xl border border-[var(--color-border-control)] bg-[var(--color-surface-subtle)] text-[15px] text-[var(--color-text)]">
            <option value="all">{isGreek ? 'Όλα τα αμαξώματα' : 'All body styles'}</option>
            {bodyStyles.map((body) => <option key={body} value={body}>{bodyLabel(body, marketRegion)}</option>)}
          </select>
        </label>

        <label className={`${mobileHidden} text-[15px] font-semibold text-[var(--color-text)]`}>
          <span className="block mb-1.5">{isGreek ? 'Καύσιμο' : 'Powertrain'}</span>
          <select name="fuel" value={selectedFuel} onChange={(event) => setSelectedFuel(event.target.value)} className="w-full min-h-11 px-3 rounded-xl border border-[var(--color-border-control)] bg-[var(--color-surface-subtle)] text-[15px] text-[var(--color-text)]">
            <option value="all">{isGreek ? 'Όλοι οι τύποι' : 'All powertrains'}</option>
            {fuelTypes.map((fuel) => <option key={fuel} value={fuel}>{fuelLabel(fuel, marketRegion)}</option>)}
          </select>
        </label>

        <label className={`${mobileHidden} text-[15px] font-semibold text-[var(--color-text)]`}>
          <span className="block mb-1.5">{isGreek ? 'Ταξινόμηση' : 'Sort by'}</span>
          <select name="sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full min-h-11 px-3 rounded-xl border border-[var(--color-border-control)] bg-[var(--color-surface-subtle)] text-[15px] text-[var(--color-text)]">
            <option value="reliability">{isGreek ? 'Υψηλότερη αξιοπιστία' : 'Highest reliability'}</option>
            <option value="price-asc">{isGreek ? 'Τιμή: χαμηλή → υψηλή' : 'Price: low to high'}</option>
            <option value="price-desc">{isGreek ? 'Τιμή: υψηλή → χαμηλή' : 'Price: high to low'}</option>
            <option value="power">{isGreek ? 'Περισσότερη ισχύς' : 'Most horsepower'}</option>
          </select>
        </label>
      </section>

      <p className="mb-4 text-[15px] text-[var(--color-text-muted)]" aria-hidden="true">{countText}</p>
      <div className="sr-only-live" role="status" aria-live="polite">{announcedCount}</div>

      {filteredVehicles.length === 0 ? (
        <div className="surface-card py-14 px-6 text-center">
          <Search className="w-8 h-8 mx-auto text-[var(--color-text-muted)]" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-bold text-[var(--color-text)]">{isGreek ? 'Δεν βρέθηκαν οχήματα' : 'No vehicles found'}</h2>
          <p className="mt-2 text-[15px] text-[var(--color-text-muted)]">{isGreek ? 'Δοκίμασε λιγότερα φίλτρα ή καθάρισε την αναζήτηση.' : 'Try fewer filters or clear the search.'}</p>
          <button type="button" onClick={resetFilters} className="mt-5 min-h-11 px-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[15px] font-bold inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            {isGreek ? 'Καθαρισμός φίλτρων' : 'Clear filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const isCompared = comparedIds.includes(vehicle.id);
            const isSaved = savedIds.includes(vehicle.id);
            const listingCount = GET_LISTINGS_FOR_VEHICLE(vehicle.id).length;
            return (
              <article key={vehicle.id} className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition-colors hover:border-[var(--color-border-strong)] flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface-subtle)]">
                    <VehicleImage vehicle={vehicle} alt={`${vehicle.make} ${vehicle.model}`} marketRegion={marketRegion} showReferenceLabel />
                    <div className="absolute bottom-10 left-3 rounded-full bg-[rgba(255,253,249,0.92)] border border-white/80 px-3 py-1.5 text-[13px] font-medium text-[var(--color-text)] backdrop-blur-md shadow-sm">{vehicle.generation} · {vehicle.years}</div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button type="button" onClick={() => onToggleCompare(vehicle.id)} aria-pressed={isCompared} aria-label={isGreek ? `Σύγκριση: ${vehicle.make} ${vehicle.model}` : `Compare ${vehicle.make} ${vehicle.model}`} className={`touch-target min-w-11 rounded-xl backdrop-blur-md transition-colors inline-flex items-center justify-center ${isCompared ? 'bg-[var(--color-accent)] text-white' : 'bg-[rgba(255,253,249,0.92)] text-[var(--color-text)] hover:bg-[var(--color-surface-raised)] border border-white/80 shadow-sm'}`}>
                        <Scale className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => onToggleSave(vehicle.id)} aria-pressed={isSaved} aria-label={isGreek ? `Αποθήκευση: ${vehicle.make} ${vehicle.model}` : `Save ${vehicle.make} ${vehicle.model}`} className={`touch-target min-w-11 rounded-xl backdrop-blur-md transition-colors inline-flex items-center justify-center ${isSaved ? 'bg-[var(--color-accent)] text-white' : 'bg-[rgba(255,253,249,0.92)] text-[var(--color-text)] hover:bg-[var(--color-surface-raised)] border border-white/80 shadow-sm'}`}>
                        <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[15px] text-[var(--color-text-muted)] mb-1 font-medium">
                      <span>{bodyLabel(vehicle.bodyStyle, marketRegion)}</span><span aria-hidden="true">·</span><span>{fuelLabel(vehicle.fuelType, marketRegion)}</span><span aria-hidden="true">·</span><span>{drivetrainLabel(vehicle.drivetrain, marketRegion)}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">{vehicle.make} {vehicle.model}</h2>

                    <div className="mt-3 p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-between gap-4">
                      <div><span className="text-[13px] font-semibold text-[var(--color-text-muted)] block">{isGreek ? 'Ενδεικτικό εύρος' : 'Reference range'}</span><span className="text-[15px] font-bold text-[var(--color-text)]">{formatPriceRange(vehicle.typicalPriceMin, vehicle.typicalPriceMax, currency)}</span></div>
                      <div className="text-right"><span className="text-[13px] font-semibold text-[var(--color-success)] block">{isGreek ? 'Στόχος καλής αγοράς' : 'Good-buy target'}</span><span className="text-[15px] font-semibold text-[var(--color-success)]">{isGreek ? 'Κάτω από ' : 'Under '}{formatPrice(vehicle.goodBuyPrice, currency)}</span></div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[15px] py-3 border-y border-[var(--color-border)]">
                      <div><span className="text-[13px] text-[var(--color-text-muted)]">{isGreek ? 'Ισχύς' : 'Power'}</span><div className="font-bold text-[var(--color-text)]">{vehicle.horsepower} hp</div></div>
                      <div><span className="text-[13px] text-[var(--color-text-muted)]">{isGreek ? 'Αξιοπιστία' : 'Reliability'}</span><div className="font-bold text-[var(--color-text)]">{vehicle.reliabilityRating}/5</div></div>
                      <div><span className="text-[13px] text-[var(--color-text-muted)]">{isGreek ? 'Χώρος' : 'Boot'}</span><div className="font-bold text-[var(--color-text)]">{formatNumber(vehicle.cargoCapacityLiters, marketRegion)} L</div></div>
                    </div>

                    <p className="mt-3 text-[15px] text-[var(--color-text-muted)] line-clamp-2">{vehicle.defaultExplanation}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 sm:p-5 sm:pt-0 flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => onOpenDetails(vehicle)} className="min-h-11 flex-1 inline-flex items-center justify-center gap-1.5 px-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[15px] font-bold transition-colors">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>{isGreek ? 'Οδηγός & έλεγχος' : 'Guide & checks'}</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  {listingCount > 0 && <button type="button" onClick={() => onViewListings(vehicle.id)} className="min-h-11 px-4 rounded-xl border border-[var(--color-border)] text-[15px] font-bold text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors">{plural(listingCount, marketRegion, isGreek ? { one: 'ενδεικτική αγγελία', other: 'ενδεικτικές αγγελίες' } : { one: 'listing', other: 'listings' })}</button>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-8"><DataTrustNote marketRegion={marketRegion} compact /></div>
    </div>
  );
};
