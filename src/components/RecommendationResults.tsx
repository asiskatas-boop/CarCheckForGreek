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
  Sparkles,
  Filter,
  Check,
  ChevronDown
} from 'lucide-react';
import { GET_LISTINGS_FOR_VEHICLE } from '../data/listings';

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

  // Available unique makes & body styles from recommendations
  const allMakes = ['Toyota', 'Škoda', 'Mazda', 'Tesla', 'Volkswagen', 'BMW', 'Hyundai', 'Volvo', 'Honda', 'Ford', 'Dacia', 'Porsche'];
  const allFuelTypes = ['Hybrid', 'Petrol', 'Electric', 'Diesel', 'Plug-in Hybrid'];

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

  // Filter recommendations based on smart filters
  const filteredRecommendations = recommendations.filter((rec) => {
    const v = rec.vehicle;
    if (smartFilters.makes.length > 0 && !smartFilters.makes.includes(v.make)) {
      return false;
    }
    if (smartFilters.fuelTypes.length > 0 && !smartFilters.fuelTypes.includes(v.fuelType)) {
      return false;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Profile Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[#e5e5ea] dark:border-[#2d2d30] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0066cc] dark:text-[#2997ff] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Vehicle Profile Built</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#86868b] font-medium">
            <span>Budget: <strong className="text-[#1d1d1f] dark:text-white">{userPreferences.budgetId}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Usages: <strong className="text-[#1d1d1f] dark:text-white">{userPreferences.usages.join(', ') || 'General'}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Priorities: <strong className="text-[#1d1d1f] dark:text-white">{userPreferences.priorities.join(', ') || 'Balanced'}</strong></span>
            {userPreferences.dynamicAnswer && (
              <>
                <span aria-hidden="true">·</span>
                <span>Tailored for: <strong className="text-[#1d1d1f] dark:text-white">{userPreferences.dynamicAnswer}</strong></span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showFilters || smartFilters.makes.length > 0 || smartFilters.fuelTypes.length > 0
                ? 'border-[#0066cc] bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff]'
                : 'border-[#e5e5ea] dark:border-[#2d2d30] bg-white dark:bg-[#272729] text-[#1d1d1f] dark:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Smart Filters</span>
          </button>

          <button
            onClick={onRestartDiscovery}
            className="px-3.5 py-2 rounded-full text-xs font-semibold border border-[#e5e5ea] dark:border-[#2d2d30] bg-white dark:bg-[#272729] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Redo Questions</span>
          </button>
        </div>
      </div>

      {/* Expandable Smart Filters Drawer */}
      {showFilters && (
        <div className="mb-6 p-5 rounded-2xl bg-white dark:bg-[#1d1d1f] border border-[#e5e5ea] dark:border-[#2d2d30] shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f] dark:text-white">
              Filter Recommended Vehicles
            </h4>
            {(smartFilters.makes.length > 0 || smartFilters.fuelTypes.length > 0 || smartFilters.maxPriceEUR) && (
              <button
                onClick={() =>
                  setSmartFilters({
                    makes: [],
                    bodyStyles: [],
                    fuelTypes: [],
                    transmissions: [],
                    searchQuery: ''
                  })
                }
                className="text-xs text-rose-500 hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Filter by Make */}
            <div>
              <span className="text-xs text-[#86868b] font-semibold block mb-2">Manufacturers:</span>
              <div className="flex flex-wrap gap-1.5">
                {allMakes.map((m) => {
                  const active = smartFilters.makes.includes(m);
                  return (
                    <button
                      key={m}
                      onClick={() => toggleFilterMake(m)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'border-[#0066cc] bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff]'
                          : 'border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Fuel Type */}
            <div>
              <span className="text-xs text-[#86868b] font-semibold block mb-2">Powertrain / Fuel:</span>
              <div className="flex flex-wrap gap-1.5">
                {allFuelTypes.map((fuel) => {
                  const active = smartFilters.fuelTypes.includes(fuel as any);
                  return (
                    <button
                      key={fuel}
                      onClick={() => toggleFilterFuel(fuel)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'border-[#0066cc] bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff]'
                          : 'border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white'
                      }`}
                    >
                      {fuel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversational Refiner Bar */}
      <ConversationalRefiner
        currentPreferences={userPreferences}
        onApplyRefinements={onApplyChatRefinement}
        lastAdvisorMessage={lastAdvisorMessage}
      />

      {/* Recommendation Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Curated Recommendations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredRecommendations.length} tailored vehicle{filteredRecommendations.length === 1 ? '' : 's'} matching your profile
            </p>
          </div>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No exact matches with active filters
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try clearing specific filters or ask the advisor to broaden the search.
            </p>
            <button
              onClick={() =>
                setSmartFilters({
                  makes: [],
                  bodyStyles: [],
                  fuelTypes: [],
                  transmissions: [],
                  searchQuery: ''
                })
              }
              className="px-4 py-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Clear Filters
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
