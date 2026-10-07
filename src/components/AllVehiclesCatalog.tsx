import React, { useState } from 'react';
import { Vehicle, Currency, MarketRegion } from '../types';
import { VEHICLES } from '../data/vehicles';
import { formatPrice, formatPriceRange } from '../services/currency';
import { Search, ChevronRight, Scale, Bookmark, ShieldCheck, RotateCcw } from 'lucide-react';
import { GET_LISTINGS_FOR_VEHICLE } from '../data/listings';
import { VehicleImage } from './VehicleImage';
import { DataTrustNote } from './DataTrustNote';

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

const BODY_LABELS_GR: Record<string, string> = {
  Hatchback: 'Χάτσμπακ',
  'Estate / Wagon': 'Στέισον βάγκον',
  'Compact SUV': 'Compact SUV',
  'Mid-size SUV': 'Μεσαίο SUV',
  'Large SUV': 'Μεγάλο SUV',
  'City car': 'Αυτοκίνητο πόλης',
  Sedan: 'Σεντάν',
  Crossover: 'Crossover'
};

const FUEL_LABELS_GR: Record<string, string> = {
  Hybrid: 'Υβριδικό',
  Petrol: 'Βενζίνη',
  Electric: 'Ηλεκτρικό',
  Diesel: 'Diesel',
  'Plug-in Hybrid': 'Plug-in υβριδικό'
};

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBody, setSelectedBody] = useState('all');
  const [selectedFuel, setSelectedFuel] = useState('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'reliability' | 'power'>('reliability');

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

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBody('all');
    setSelectedFuel('all');
    setSortBy('reliability');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
          {isGreek ? 'Κατάλογος Οχημάτων' : 'Vehicle Catalog'}
        </h1>
        <p className="text-[15px] text-[var(--color-text-muted)] mt-1 max-w-3xl">
          {isGreek
            ? 'Εξερεύνησε τα οχήματα που έχουμε αναλύσει, με ενδεικτικές τιμές, αξιοπιστία και οδηγό ελέγχου πριν την αγορά.'
            : 'Explore analyzed vehicles with reference price ranges, reliability ratings, and pre-purchase inspection guidance.'}
        </p>
      </div>

      <div className="mb-5"><DataTrustNote marketRegion={marketRegion} compact /></div>

      <section aria-label={isGreek ? 'Φίλτρα οχημάτων' : 'Vehicle filters'} className="mb-6 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] grid grid-cols-1 md:grid-cols-4 gap-3">
        <label className="md:col-span-1 text-[15px] font-semibold text-[var(--color-text)]">
          <span className="block mb-1.5">{isGreek ? 'Αναζήτηση' : 'Search'}</span>
          <span className="relative block">
            <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={isGreek ? 'Toyota, Octavia, Tesla…' : 'Toyota, Octavia, Tesla…'}
              className="w-full min-h-11 pl-9 pr-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
            />
          </span>
        </label>

        <label className="text-[15px] font-semibold text-[var(--color-text)]">
          <span className="block mb-1.5">{isGreek ? 'Αμάξωμα' : 'Body style'}</span>
          <select value={selectedBody} onChange={(event) => setSelectedBody(event.target.value)} className="w-full min-h-11 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[15px] text-[var(--color-text)]">
            <option value="all">{isGreek ? 'Όλα τα αμαξώματα' : 'All body styles'}</option>
            {bodyStyles.map((body) => <option key={body} value={body}>{isGreek ? BODY_LABELS_GR[body] ?? body : body}</option>)}
          </select>
        </label>

        <label className="text-[15px] font-semibold text-[var(--color-text)]">
          <span className="block mb-1.5">{isGreek ? 'Καύσιμο' : 'Powertrain'}</span>
          <select value={selectedFuel} onChange={(event) => setSelectedFuel(event.target.value)} className="w-full min-h-11 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[15px] text-[var(--color-text)]">
            <option value="all">{isGreek ? 'Όλοι οι τύποι' : 'All powertrains'}</option>
            {fuelTypes.map((fuel) => <option key={fuel} value={fuel}>{isGreek ? FUEL_LABELS_GR[fuel] ?? fuel : fuel}</option>)}
          </select>
        </label>

        <label className="text-[15px] font-semibold text-[var(--color-text)]">
          <span className="block mb-1.5">{isGreek ? 'Ταξινόμηση' : 'Sort by'}</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="w-full min-h-11 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[15px] text-[var(--color-text)]">
            <option value="reliability">{isGreek ? 'Υψηλότερη αξιοπιστία' : 'Highest reliability'}</option>
            <option value="price-asc">{isGreek ? 'Τιμή: χαμηλή → υψηλή' : 'Price: low to high'}</option>
            <option value="price-desc">{isGreek ? 'Τιμή: υψηλή → χαμηλή' : 'Price: high to low'}</option>
            <option value="power">{isGreek ? 'Περισσότερη ισχύς' : 'Most horsepower'}</option>
          </select>
        </label>
      </section>

      <div className="mb-4 text-[15px] text-[var(--color-text-muted)]" aria-live="polite">
        {isGreek ? `${filteredVehicles.length} οχήματα` : `${filteredVehicles.length} vehicles`}
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="surface-card py-14 px-6 text-center">
          <Search className="w-8 h-8 mx-auto text-[var(--color-text-muted)]" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-bold text-[var(--color-text)]">{isGreek ? 'Δεν βρέθηκαν οχήματα' : 'No vehicles found'}</h2>
          <p className="mt-2 text-[15px] text-[var(--color-text-muted)]">{isGreek ? 'Δοκίμασε λιγότερα φίλτρα ή καθάρισε την αναζήτηση.' : 'Try fewer filters or clear the search.'}</p>
          <button type="button" onClick={resetFilters} className="mt-5 min-h-11 px-4 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[15px] font-bold inline-flex items-center gap-2">
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
              <article key={vehicle.id} className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface-subtle)]">
                    <VehicleImage vehicle={vehicle} alt={`${vehicle.make} ${vehicle.model}`} marketRegion={marketRegion} showReferenceLabel />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 text-white text-[15px] font-medium">{vehicle.generation} · {vehicle.years}</div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button type="button" onClick={() => onToggleCompare(vehicle.id)} aria-pressed={isCompared} aria-label={isGreek ? `${isCompared ? 'Αφαίρεση από' : 'Προσθήκη σε'} σύγκριση: ${vehicle.make} ${vehicle.model}` : `${isCompared ? 'Remove from' : 'Add to'} comparison: ${vehicle.make} ${vehicle.model}`} className={`touch-target min-w-11 rounded-xl backdrop-blur-md transition-colors inline-flex items-center justify-center ${isCompared ? 'bg-[var(--color-accent)] text-white' : 'bg-slate-950/80 text-white hover:bg-slate-900'}`}>
                        <Scale className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => onToggleSave(vehicle.id)} aria-pressed={isSaved} aria-label={isGreek ? `${isSaved ? 'Αφαίρεση από' : 'Αποθήκευση στο'} Garage: ${vehicle.make} ${vehicle.model}` : `${isSaved ? 'Remove from' : 'Save to'} garage: ${vehicle.make} ${vehicle.model}`} className={`touch-target min-w-11 rounded-xl backdrop-blur-md transition-colors inline-flex items-center justify-center ${isSaved ? 'bg-[var(--color-accent)] text-white' : 'bg-slate-950/80 text-white hover:bg-slate-900'}`}>
                        <Bookmark className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[15px] text-[var(--color-text-muted)] mb-1 font-medium">
                      <span>{isGreek ? BODY_LABELS_GR[vehicle.bodyStyle] ?? vehicle.bodyStyle : vehicle.bodyStyle}</span><span aria-hidden="true">·</span><span>{isGreek ? FUEL_LABELS_GR[vehicle.fuelType] ?? vehicle.fuelType : vehicle.fuelType}</span><span aria-hidden="true">·</span><span>{vehicle.drivetrain}</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-[var(--color-text)] tracking-tight">{vehicle.make} {vehicle.model}</h2>

                    <div className="mt-3 p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-between gap-4">
                      <div><span className="text-[13px] font-semibold text-[var(--color-text-muted)] block">{isGreek ? 'Ενδεικτικό εύρος' : 'Reference range'}</span><span className="text-[15px] font-bold text-[var(--color-text)]">{formatPriceRange(vehicle.typicalPriceMin, vehicle.typicalPriceMax, currency)}</span></div>
                      <div className="text-right"><span className="text-[13px] font-semibold text-[var(--color-success)] block">{isGreek ? 'Στόχος καλής αγοράς' : 'Good-buy target'}</span><span className="text-[15px] font-extrabold text-[var(--color-success)]">{isGreek ? 'Κάτω από ' : 'Under '}{formatPrice(vehicle.goodBuyPrice, currency)}</span></div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[15px] py-3 border-y border-[var(--color-border)]">
                      <div><span className="text-[13px] text-[var(--color-text-muted)]">{isGreek ? 'Ισχύς' : 'Power'}</span><div className="font-bold text-[var(--color-text)]">{vehicle.horsepower} hp</div></div>
                      <div><span className="text-[13px] text-[var(--color-text-muted)]">{isGreek ? 'Αξιοπιστία' : 'Reliability'}</span><div className="font-bold text-[var(--color-text)]">{vehicle.reliabilityRating}/5</div></div>
                      <div><span className="text-[13px] text-[var(--color-text-muted)]">{isGreek ? 'Χώρος' : 'Boot'}</span><div className="font-bold text-[var(--color-text)]">{vehicle.cargoCapacityLiters} L</div></div>
                    </div>

                    <p className="mt-3 text-[15px] text-[var(--color-text-muted)] line-clamp-2">{vehicle.defaultExplanation}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => onOpenDetails(vehicle)} className="min-h-11 flex-1 inline-flex items-center justify-center gap-1.5 px-4 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[15px] font-bold transition-colors">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>{isGreek ? 'Οδηγός & έλεγχος' : 'Guide & checks'}</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  {listingCount > 0 && <button type="button" onClick={() => onViewListings(vehicle.id)} className="min-h-11 px-4 rounded-xl border border-[var(--color-border)] text-[15px] font-bold text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors">{listingCount} {isGreek ? 'ενδεικτικές αγγελίες' : 'listings'}</button>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
