import React, { useState } from 'react';
import {
  ScoredRecommendation,
  Currency,
  Vehicle,
  UserPreferences,
  SmartFilterState,
  MarketRegion
} from '../types';
import { VehicleCard } from './VehicleCard';
import { ConversationalRefiner } from './ConversationalRefiner';
import {
  SlidersHorizontal,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { GET_LISTINGS_FOR_VEHICLE } from '../data/listings';
import { DataTrustNote } from './DataTrustNote';
import { bodyLabel, fuelLabel, plural, transmissionLabel } from '../services/format';
import { formatPrice } from '../services/currency';
import { dynamicAnswerLabel } from '../data/lifestyleChoices';
import { useDebouncedValue } from '../hooks/useUrlState';
import { X } from 'lucide-react';

const EMPTY_FILTERS: SmartFilterState = {
  makes: [],
  bodyStyles: [],
  fuelTypes: [],
  transmissions: [],
  searchQuery: '',
  maxPriceEUR: undefined
};

interface RecommendationResultsProps {
  recommendations: ScoredRecommendation[];
  userPreferences: UserPreferences;
  currency: Currency;
  marketRegion?: MarketRegion;
  onOpenDetails: (vehicle: Vehicle) => void;
  onToggleCompare: (vehicleId: string) => void;
  comparedIds: string[];
  onToggleSave: (vehicleId: string) => void;
  savedIds: string[];
  onViewListings: (vehicleId: string) => void;
  onRestartDiscovery: () => void;
  onApplyChatRefinement: (result: { advisorResponse: string; filterOverrides?: any }) => void;
  lastAdvisorMessage?: string;
  smartFilters: SmartFilterState;
  setSmartFilters: React.Dispatch<React.SetStateAction<SmartFilterState>>;
}

const labelFor = (value: string, isGreek: boolean) => {
  const greek: Record<string, string> = {
    '1.5k-5k': '€1.500–€5.000', '5k-10k': '€5.000–€10.000', 'under-10k': 'Έως €10.000',
    '10k-20k': '€10.000–€20.000', '20k-30k': '€20.000–€30.000', '30k-40k': '€30.000–€40.000',
    '40k-60k': '€40.000–€60.000', '60k-plus': '€60.000+', custom: 'Προσαρμοσμένο', 'not-sure': 'Δεν είμαι σίγουρος',
    'daily-commuting': 'Καθημερινές μετακινήσεις', 'city-driving': 'Οδήγηση στην πόλη', 'family-use': 'Οικογένεια',
    'long-road-trips': 'Μεγάλα ταξίδια', 'weekend-driving': 'Βόλτες ΣΚ', business: 'Επαγγελματική χρήση',
    'carrying-equipment': 'Μεταφορά εξοπλισμού', 'outdoor-activities': 'Outdoor δραστηριότητες', 'performance-fun': 'Επιδόσεις / fun',
    'first-car': 'Πρώτο αυτοκίνητο', 'luxury-comfort': 'Πολυτέλεια & άνεση', reliability: 'Αξιοπιστία',
    'low-running-costs': 'Χαμηλό κόστος χρήσης', 'fuel-economy': 'Οικονομία καυσίμου', performance: 'Επιδόσεις', comfort: 'Άνεση',
    technology: 'Τεχνολογία', safety: 'Ασφάλεια', practicality: 'Πρακτικότητα', luxury: 'Πολυτέλεια', design: 'Σχεδίαση',
    'resale-value': 'Μεταπωλητική αξία', 'environmental-impact': 'Περιβαλλοντικό αποτύπωμα'
  };
  return isGreek ? (greek[value] || value) : value.replaceAll('-', ' ');
};

export const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  recommendations,
  userPreferences,
  currency,
  marketRegion = 'global',
  onOpenDetails,
  onToggleCompare,
  comparedIds,
  onToggleSave,
  savedIds,
  onViewListings,
  onRestartDiscovery,
  onApplyChatRefinement,
  lastAdvisorMessage,
  smartFilters,
  setSmartFilters
}) => {
  const isGreek = marketRegion === 'greece';
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Derive filter choices from the actual recommendation set so imported/new makes never disappear.
  const allMakes = Array.from(new Set(recommendations.map((rec) => rec.vehicle.make))).sort((a, b) => a.localeCompare(b));
  const allFuelTypes = Array.from(new Set(recommendations.map((rec) => rec.vehicle.fuelType))).sort((a, b) => a.localeCompare(b));

  const toggleFilterMake = (make: string) => {
    setSmartFilters((prev) => ({
      ...prev,
      makes: prev.makes.includes(make) ? prev.makes.filter((m) => m !== make) : [...prev.makes, make]
    }));
  };

  const toggleFilterFuel = (fuel: string) => {
    setSmartFilters((prev) => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(fuel as any)
        ? prev.fuelTypes.filter((f) => f !== fuel)
        : [...prev.fuelTypes, fuel as any]
    }));
  };

  // Every active filter is listed as a removable chip, including ones the advisor set
  // (body style, transmission, search, price cap) that have no control in the filter panel.
  const activeFilters: { key: string; label: string; remove: () => void }[] = [
    ...smartFilters.makes.map((make) => ({ key: `make-${make}`, label: make, remove: () => toggleFilterMake(make) })),
    ...smartFilters.fuelTypes.map((fuel) => ({ key: `fuel-${fuel}`, label: fuelLabel(fuel, marketRegion), remove: () => toggleFilterFuel(fuel) })),
    ...smartFilters.bodyStyles.map((body) => ({
      key: `body-${body}`,
      label: bodyLabel(body, marketRegion),
      remove: () => setSmartFilters((prev) => ({ ...prev, bodyStyles: prev.bodyStyles.filter((b) => b !== body) }))
    })),
    ...smartFilters.transmissions.map((t) => ({
      key: `transmission-${t}`,
      label: transmissionLabel(t, marketRegion),
      remove: () => setSmartFilters((prev) => ({ ...prev, transmissions: prev.transmissions.filter((x) => x !== t) }))
    })),
    ...(smartFilters.maxPriceEUR
      ? [{
          key: 'max-price',
          label: `${isGreek ? 'Έως' : 'Up to'} ${formatPrice(smartFilters.maxPriceEUR, currency)}`,
          remove: () => setSmartFilters((prev) => ({ ...prev, maxPriceEUR: undefined }))
        }]
      : []),
    ...(smartFilters.searchQuery
      ? [{
          key: 'search',
          label: `“${smartFilters.searchQuery}”`,
          remove: () => setSmartFilters((prev) => ({ ...prev, searchQuery: '' }))
        }]
      : [])
  ];
  const hasActiveFilters = activeFilters.length > 0;
  const clearFilters = () => setSmartFilters(EMPTY_FILTERS);

  // Filter recommendations based on smart filters
  const filteredRecommendations = recommendations.filter((rec) => {
    const v = rec.vehicle;
    if (smartFilters.makes.length > 0 && !smartFilters.makes.includes(v.make)) {
      return false;
    }
    if (smartFilters.fuelTypes.length > 0 && !smartFilters.fuelTypes.includes(v.fuelType)) {
      return false;
    }
    if (smartFilters.bodyStyles.length > 0 && !smartFilters.bodyStyles.includes(v.bodyStyle)) {
      return false;
    }
    if (smartFilters.transmissions.length > 0) {
      const supportsRequestedTransmission = smartFilters.transmissions.some((requested) =>
        v.transmission === requested || v.transmission === 'Both available'
      );
      if (!supportsRequestedTransmission) return false;
    }
    if (smartFilters.maxPriceEUR && v.typicalPriceMin > smartFilters.maxPriceEUR) {
      return false;
    }
    if (smartFilters.searchQuery) {
      const q = smartFilters.searchQuery.toLowerCase();
      const match =
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.bodyStyle.toLowerCase().includes(q) ||
        v.fuelType.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const countText = isGreek
    ? `${plural(filteredRecommendations.length, marketRegion, { one: 'όχημα ταιριάζει', other: 'οχήματα ταιριάζουν' })} στο προφίλ σου`
    : `${plural(filteredRecommendations.length, marketRegion, { one: 'tailored vehicle matches', other: 'tailored vehicles match' })} your profile`;
  const announcedCount = useDebouncedValue(countText);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <h1 className="sr-only">{isGreek ? 'Προτάσεις αυτοκινήτων για το προφίλ σου' : 'Car recommendations for your profile'}</h1>
      {/* Profile Bar */}
      <div className="mb-6 p-4 surface-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-[var(--color-accent-text)] mb-2">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>{isGreek ? 'Το προφίλ οδήγησής σου' : 'Your driving profile'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-[var(--color-text-muted)]">
            <span>{isGreek ? 'Προϋπολογισμός' : 'Budget'}: <strong className="text-[var(--color-text)]">{labelFor(userPreferences.budgetId, isGreek)}</strong></span>
            <span>{isGreek ? 'Χρήση' : 'Use'}: <strong className="text-[var(--color-text)]">{userPreferences.usages.map((v) => labelFor(v, isGreek)).join(', ') || (isGreek ? 'Γενική' : 'General')}</strong></span>
            <span>{isGreek ? 'Προτεραιότητες' : 'Priorities'}: <strong className="text-[var(--color-text)]">{userPreferences.priorities.map((v) => labelFor(v, isGreek)).join(', ') || (isGreek ? 'Ισορροπημένα' : 'Balanced')}</strong></span>
            {userPreferences.dynamicAnswer && <span>{isGreek ? 'Επιπλέον' : 'Also'}: <strong className="text-[var(--color-text)]">{dynamicAnswerLabel(userPreferences.dynamicAnswer, marketRegion)}</strong></span>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button type="button" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters} aria-controls={showFilters ? 'smart-filters-panel' : undefined} className={`min-h-11 px-4 rounded-xl text-[15px] font-semibold border flex items-center gap-2 ${showFilters || hasActiveFilters ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]' : 'border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text)]'}`}>
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />{isGreek ? 'Έξυπνα φίλτρα' : 'Smart filters'}{hasActiveFilters && <span className="tabular-nums">({activeFilters.length})</span>}
          </button>
          <button type="button" onClick={onRestartDiscovery} className="min-h-11 px-4 rounded-xl text-[15px] font-semibold border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-2">
            <RotateCcw className="w-4 h-4" aria-hidden="true" />{isGreek ? 'Νέες απαντήσεις' : 'Redo questions'}
          </button>
        </div>
      </div>

      {/* Expandable Smart Filters Drawer */}
      {showFilters && (
        <div id="smart-filters-panel" className="mb-6 p-5 surface-card space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[var(--color-text)]">
              {isGreek ? 'Φίλτρα προτεινόμενων οχημάτων' : 'Filter recommended vehicles'}
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="min-h-11 px-2 text-[15px] text-[var(--color-danger)] hover:underline"
              >
                {isGreek ? 'Καθαρισμός φίλτρων' : 'Reset filters'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Filter by Make */}
            <div>
              <span id="filter-makes-label" className="text-[13px] text-[var(--color-text-muted)] font-semibold block mb-2">{isGreek ? 'Κατασκευαστές' : 'Manufacturers'}</span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="filter-makes-label">
                {allMakes.map((m) => {
                  const active = smartFilters.makes.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleFilterMake(m)}
                      aria-pressed={active} className={`min-h-11 px-3 rounded-full text-[13px] font-semibold border ${active ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]' : 'border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text)]'}`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Fuel Type */}
            <div>
              <span id="filter-fuel-label" className="text-[13px] text-[var(--color-text-muted)] font-semibold block mb-2">{isGreek ? 'Καύσιμο / κίνηση' : 'Powertrain / fuel'}</span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="filter-fuel-label">
                {allFuelTypes.map((fuel) => {
                  const active = smartFilters.fuelTypes.includes(fuel as any);
                  return (
                    <button
                      key={fuel}
                      type="button"
                      onClick={() => toggleFilterFuel(fuel)}
                      aria-pressed={active} className={`min-h-11 px-3 rounded-full text-[13px] font-semibold border ${active ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]' : 'border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text)]'}`}
                    >
                      {fuelLabel(fuel, marketRegion)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label={isGreek ? 'Ενεργά φίλτρα' : 'Active filters'}>
          <span className="text-[13px] font-semibold text-[var(--color-text-muted)]">{isGreek ? 'Ενεργά φίλτρα:' : 'Active filters:'}</span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={filter.remove}
              className="min-h-11 px-3 rounded-full border border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[13px] font-semibold text-[var(--color-accent-text)] inline-flex items-center gap-1.5"
              aria-label={isGreek ? `Αφαίρεση φίλτρου: ${filter.label}` : `Remove filter: ${filter.label}`}
            >
              {filter.label}
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          ))}
          <button type="button" onClick={clearFilters} className="min-h-11 px-2 text-[13px] font-semibold text-[var(--color-text)] underline underline-offset-4">
            {isGreek ? 'Καθαρισμός όλων' : 'Clear all'}
          </button>
        </div>
      )}

      <div className="mb-5"><DataTrustNote marketRegion={marketRegion} compact /></div>

      {/* Conversational Refiner Bar */}
      <ConversationalRefiner
        currentPreferences={userPreferences}
        marketRegion={marketRegion}
        onApplyRefinements={onApplyChatRefinement}
        lastAdvisorMessage={lastAdvisorMessage}
      />

      {/* Recommendation Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-text)] tracking-tight">
              {isGreek ? 'Προτάσεις για εσένα' : 'Curated recommendations'}
            </h2>
            <p className="text-[13px] text-[var(--color-text-muted)]" aria-hidden="true">{countText}</p>
            <div className="sr-only-live" role="status" aria-live="polite">{announcedCount}</div>
          </div>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[var(--color-border)] rounded-2xl">
            <h3 className="text-base font-bold text-[var(--color-text)]">
              {isGreek ? 'Δεν βρέθηκαν ακριβείς αντιστοιχίες' : 'No exact matches with active filters'}
            </h3>
            <p className="text-[15px] text-[var(--color-text-muted)] mt-2 mb-4">
              {isGreek ? 'Καθάρισε κάποια φίλτρα ή ζήτησε από τον σύμβουλο να διευρύνει την αναζήτηση.' : 'Clear specific filters or ask the advisor to broaden the search.'}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-11 px-4 rounded-full bg-[var(--color-accent)] text-white text-[15px] font-semibold"
            >
              {isGreek ? 'Καθαρισμός φίλτρων' : 'Clear filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((rec) => (
              <VehicleCard
                key={rec.vehicle.id}
                recommendation={rec}
                currency={currency}
                marketRegion={marketRegion}
                onOpenDetails={onOpenDetails}
                onToggleCompare={onToggleCompare}
                isCompared={comparedIds.includes(rec.vehicle.id)}
                onToggleSave={onToggleSave}
                isSaved={savedIds.includes(rec.vehicle.id)}
                onViewListings={onViewListings}
                listingCount={GET_LISTINGS_FOR_VEHICLE(rec.vehicle.id).length}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
