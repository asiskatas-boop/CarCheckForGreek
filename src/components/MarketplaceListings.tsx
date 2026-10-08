import React from 'react';
import { useDebouncedValue, useUrlParam } from '../hooks/useUrlState';
import { dealRatingLabel, formatNumber, plural, transmissionLabel } from '../services/format';
import { Currency, Vehicle, MarketRegion } from '../types';
import { formatPrice } from '../services/currency';
import { MARKETPLACE_LISTINGS } from '../data/listings';
import { VEHICLES } from '../data/vehicles';
import { MapPin, Bookmark, ChevronRight, Search, ExternalLink, RotateCcw, Info, ImageOff } from 'lucide-react';
import { VehicleImage } from './VehicleImage';
import { DataTrustNote } from './DataTrustNote';
import { carGrListingUrl } from '../services/carGr';

interface MarketplaceListingsProps {
  currency: Currency;
  marketRegion?: MarketRegion;
  onOpenVehicleDetails: (vehicle: Vehicle) => void;
  savedListingIds: string[];
  onToggleSaveListing: (listingId: string) => void;
  filterVehicleId?: string;
  onClearVehicleFilter?: () => void;
}

const ratingLabel = (rating: string, isGreek: boolean) => dealRatingLabel(rating, isGreek ? 'greece' : 'global');

const greekDealSummary = (rating: string) => {
  if (rating === 'Excellent Price') return 'Η ζητούμενη τιμή φαίνεται χαμηλή σε σχέση με το ενδεικτικό εύρος της βάσης. Έλεγξε ιστορικό, κατάσταση και στοιχεία αγγελίας πριν προχωρήσεις.';
  if (rating === 'Good Price') return 'Η ζητούμενη τιμή φαίνεται ανταγωνιστική σε σχέση με το ενδεικτικό εύρος. Επιβεβαίωσε εξοπλισμό, χιλιόμετρα και ιστορικό συντήρησης.';
  return 'Η ζητούμενη τιμή κινείται κοντά στο ενδεικτικό εύρος. Σύγκρινε αντίστοιχα οχήματα και κάνε ανεξάρτητο τεχνικό έλεγχο.';
};

export const MarketplaceListings: React.FC<MarketplaceListingsProps> = ({
  currency,
  marketRegion = 'global',
  onOpenVehicleDetails,
  savedListingIds,
  onToggleSaveListing,
  filterVehicleId,
  onClearVehicleFilter
}) => {
  const isGreek = marketRegion === 'greece';
  const [selectedRating, setSelectedRating] = useUrlParam('rating', 'all');
  const [searchQuery, setSearchQuery] = useUrlParam('q', '');

  const filteredListings = MARKETPLACE_LISTINGS.filter((listing) => {
    if (filterVehicleId && listing.vehicleId !== filterVehicleId) return false;
    if (selectedRating !== 'all' && listing.dealRating !== selectedRating) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (![listing.title, listing.location].some((value) => value.toLowerCase().includes(query))) return false;
    }
    return true;
  });

  const countText = isGreek
    ? `${plural(filteredListings.length, marketRegion, { one: 'αγγελία', other: 'αγγελίες' })} στο αποθηκευμένο δείγμα`
    : `${plural(filteredListings.length, marketRegion, { one: 'listing', other: 'listings' })} in the saved dataset`;
  const announcedCount = useDebouncedValue(countText);

  const resetFilters = () => {
    setSelectedRating('all');
    setSearchQuery('');
    onClearVehicleFilter?.();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 animate-fadeIn">
      <div className="mb-4 sm:mb-6 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
            {isGreek ? 'Ενδεικτικές Αγγελίες & Σύγκριση Τιμής' : 'Reference Listings & Price Comparison'}
          </h1>
          <p className="text-[15px] text-[var(--color-text-muted)] mt-1 max-w-3xl">
            {isGreek
              ? 'Στιγμιότυπα αγγελιών από τη βάση του CarCheck για σύγκριση με ενδεικτικές τιμές αγοράς. Δεν αποτελούν ζωντανή ροή διαθεσιμότητας.'
              : 'Listing snapshots from the CarCheck dataset for comparison against reference market values. This is not a live availability feed.'}
          </p>
        </div>
        <div className="hidden sm:flex items-start gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3 text-[13px] text-[var(--color-text-muted)] max-w-md">
          <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{isGreek ? 'Άνοιξε την αρχική πηγή για τρέχουσα τιμή και διαθεσιμότητα πριν επικοινωνήσεις με πωλητή.' : 'Open the original source to confirm current price and availability before contacting a seller.'}</span>
        </div>
      </div>


      {filterVehicleId && (
        <div className="mb-4 flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 text-[15px] text-[var(--color-accent-text)]">
          <span className="font-semibold">{isGreek ? 'Φιλτραρισμένο για το συγκεκριμένο μοντέλο' : 'Filtered for this vehicle'}</span>
          <button type="button" onClick={onClearVehicleFilter} className="min-h-11 px-3 rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] font-bold underline underline-offset-4">
            {isGreek ? 'Προβολή όλων' : 'Show all'}
          </button>
        </div>
      )}

      <section aria-label={isGreek ? 'Φίλτρα αγγελιών' : 'Listing filters'} className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-3 sm:gap-4 items-end">
        <label className="text-[15px] font-semibold text-[var(--color-text)]">
          <span className="block mb-1.5">{isGreek ? 'Αναζήτηση αγγελιών' : 'Search listings'}</span>
          <span className="relative block">
            <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input type="search" name="q" autoComplete="off" spellCheck={false} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={isGreek ? 'Μοντέλο ή περιοχή…' : 'Model or location…'} className="w-full min-h-11 pl-9 pr-3 rounded-xl border border-[var(--color-border-control)] bg-[var(--color-surface-subtle)] text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]" />
          </span>
        </label>

        <fieldset>
          <legend className="text-[15px] font-semibold text-[var(--color-text)] mb-1.5">{isGreek ? 'Αξιολόγηση τιμής' : 'Deal rating'}</legend>
          <div className="flex flex-wrap items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-1 text-[13px] gap-1">
            {['all', 'Excellent Price', 'Good Price'].map((rating) => (
              <button type="button" key={rating} onClick={() => setSelectedRating(rating)} aria-pressed={selectedRating === rating} className={`min-h-11 px-3 rounded-lg transition-colors font-semibold ${selectedRating === rating ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
                {rating === 'all' ? (isGreek ? 'Όλες' : 'All') : ratingLabel(rating, isGreek)}
              </button>
            ))}
          </div>
        </fieldset>

      </section>

      <p className="mb-4 text-[15px] text-[var(--color-text-muted)]" aria-hidden="true">{countText}</p>
      <div className="sr-only-live" role="status" aria-live="polite">{announcedCount}</div>

      {filteredListings.length === 0 ? (
        <div className="surface-card py-14 px-6 text-center">
          <Search className="w-8 h-8 mx-auto text-[var(--color-text-muted)]" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-bold text-[var(--color-text)]">{isGreek ? 'Δεν βρέθηκαν αγγελίες' : 'No listings found'}</h2>
          <p className="mt-2 text-[15px] text-[var(--color-text-muted)]">{isGreek ? 'Άλλαξε φίλτρα ή εμφάνισε ξανά όλο το αποθηκευμένο δείγμα.' : 'Change the filters or show the full saved dataset again.'}</p>
          <button type="button" onClick={resetFilters} className="mt-5 min-h-11 px-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[15px] font-bold inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            {isGreek ? 'Καθαρισμός φίλτρων' : 'Clear filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const targetVehicle = VEHICLES.find((vehicle) => vehicle.id === listing.vehicleId);
            const isSaved = savedListingIds.includes(listing.id);
            const carGrUrl = carGrListingUrl(listing, targetVehicle);
            return (
              <article key={listing.id} className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition-colors hover:border-[var(--color-border-strong)] flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface-subtle)]">
                    {targetVehicle ? (
                      <VehicleImage
                        vehicle={targetVehicle}
                        year={listing.year}
                        alt={isGreek ? `Εικόνα αναφοράς μοντέλου: ${targetVehicle.make} ${targetVehicle.model}` : `Model reference image: ${targetVehicle.make} ${targetVehicle.model}`}
                        marketRegion={marketRegion}
                        showReferenceLabel
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--color-image-fallback)] text-[var(--color-text-muted)]" role="img" aria-label={listing.title}>
                        <ImageOff className="h-7 w-7" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-[rgba(255,253,249,0.92)] backdrop-blur-md px-3 py-1.5 rounded-full text-[13px] font-semibold text-[var(--color-text)] border border-white/80 shadow-sm">{ratingLabel(listing.dealRating, isGreek)}</div>
                    <button type="button" onClick={() => onToggleSaveListing(listing.id)} aria-pressed={isSaved} aria-label={isGreek ? `Αποθήκευση αγγελίας: ${listing.title}` : `Save listing: ${listing.title}`} className={`absolute top-3 right-3 touch-target min-w-11 rounded-xl backdrop-blur-md transition-colors inline-flex items-center justify-center ${isSaved ? 'bg-[var(--color-accent)] text-white' : 'bg-[rgba(255,253,249,0.92)] text-[var(--color-text)] hover:bg-[var(--color-surface-raised)] border border-white/80 shadow-sm'}`}>
                      <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
                    </button>
                    <div className="absolute bottom-10 left-3 right-3 w-fit max-w-[calc(100%-1.5rem)] rounded-full bg-[rgba(255,253,249,0.92)] border border-white/80 px-3 py-1.5 text-[13px] font-medium text-[var(--color-text)] backdrop-blur-md shadow-sm truncate">{isGreek ? 'Δείγμα αγοράς' : 'Market sample'} · {listing.location}</div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[15px] text-[var(--color-text-muted)] mb-1"><span>{listing.year}</span><span aria-hidden="true">·</span><span>{formatNumber(listing.mileageKm, marketRegion)} km</span><span aria-hidden="true">·</span><span>{transmissionLabel(listing.transmission, marketRegion)}</span></div>
                    <h2 className="text-lg font-bold text-[var(--color-text)] tracking-tight leading-snug">{listing.title}</h2>
                    <div className="mt-2 text-xl font-semibold text-[var(--color-text)]">{formatPrice(listing.price, currency)}</div>
                    <div className="flex items-center gap-1.5 text-[15px] text-[var(--color-text-muted)] mt-1"><MapPin className="w-4 h-4" aria-hidden="true" /><span>{listing.location}</span></div>
                    <div className="mt-4 p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[15px] text-[var(--color-text-muted)] leading-relaxed">{isGreek ? greekDealSummary(listing.dealRating) : listing.dealExplanation}</div>
                    <div className="mt-3 flex flex-wrap gap-1.5">{listing.keyEquipment.slice(0, 3).map((item) => <span key={item} className="text-[13px] px-2 py-1 rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]">{item}</span>)}</div>
                  </div>
                </div>

                <div className="p-4 pt-4 sm:p-5 border-t border-[var(--color-border)] mt-2 flex flex-wrap items-center gap-2">
                  {targetVehicle && <button type="button" onClick={() => onOpenVehicleDetails(targetVehicle)} className="min-h-11 flex-1 inline-flex items-center justify-center gap-1.5 px-4 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] text-[15px] font-bold hover:bg-[var(--color-surface-subtle)] transition-colors"><span>{isGreek ? 'Οδηγός μοντέλου' : 'Model guide'}</span><ChevronRight className="w-4 h-4" aria-hidden="true" /></button>}
                  {carGrUrl && <a href={carGrUrl} target="_blank" rel="noreferrer" className="min-h-11 inline-flex items-center justify-center gap-1.5 px-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[15px] font-bold transition-colors"><span>{isGreek ? 'Έλεγχος στην πηγή' : 'Check source'}</span><span className="sr-only">{isGreek ? ` για ${listing.title} (ανοίγει σε νέα καρτέλα)` : ` for ${listing.title} (opens in a new tab)`}</span><ExternalLink className="w-4 h-4" aria-hidden="true" /></a>}
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
