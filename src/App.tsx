/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Currency,
  MarketRegion,
  UserPreferences,
  Vehicle,
  ScoredRecommendation,
  SmartFilterState,
  MarketplaceListing
} from './types';
import { VEHICLES } from './data/vehicles';
import { MARKETPLACE_LISTINGS } from './data/listings';
import { recommendVehicles } from './services/recommendationEngine';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { Questionnaire } from './components/Questionnaire';
import { RecommendationResults } from './components/RecommendationResults';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { ComparisonModal } from './components/ComparisonModal';
import { MarketplaceListings } from './components/MarketplaceListings';
import { GarageDrawer } from './components/GarageDrawer';
import { AllVehiclesCatalog } from './components/AllVehiclesCatalog';

const DEFAULT_PREFERENCES: UserPreferences = {
  budgetId: '1.5k-5k',
  paymentMethod: 'cash',
  currency: 'EUR',
  marketRegion: 'greece',
  usages: ['city-driving', 'daily-commuting'],
  priorities: ['reliability', 'low-running-costs', 'fuel-economy'],
  lifestyle: ['easy-parking']
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'advisor' | 'all-cars' | 'marketplace' | 'garage'>(() => {
    if (typeof window === 'undefined') return 'advisor';
    if (window.location.hash === '#vehicles') return 'all-cars';
    if (window.location.hash === '#marketplace') return 'marketplace';
    return 'advisor';
  });
  const [discoveryState, setDiscoveryState] = useState<'hero' | 'questionnaire' | 'results'>('hero');
  const [marketRegion, setMarketRegion] = useState<MarketRegion>(() => {
    try {
      const stored = localStorage.getItem('carcheck_market_region');
      return (stored as MarketRegion) || 'greece';
    } catch {
      return 'greece';
    }
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      const stored = localStorage.getItem('carcheck_currency');
      return (stored as Currency) || 'EUR';
    } catch {
      return 'EUR';
    }
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem('carcheck_user_preferences');
      return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [recommendations, setRecommendations] = useState<ScoredRecommendation[]>(() => {
    return recommendVehicles({ ...userPreferences, marketRegion });
  });

  // Saved Garage IDs
  const [savedVehicleIds, setSavedVehicleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('carcheck_saved_vehicles');
      return stored ? JSON.parse(stored) : ['toyota-corolla-hybrid-e210'];
    } catch {
      return ['toyota-corolla-hybrid-e210'];
    }
  });

  const [savedListingIds, setSavedListingIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('carcheck_saved_listings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Comparison State
  const [comparedVehicleIds, setComparedVehicleIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Detail Modal State
  const [selectedVehicleForDetail, setSelectedVehicleForDetail] = useState<Vehicle | null>(null);

  // Marketplace filtered vehicle
  const [marketplaceVehicleFilter, setMarketplaceVehicleFilter] = useState<string | undefined>(undefined);

  // Garage Drawer Open
  const [isGarageOpen, setIsGarageOpen] = useState<boolean>(false);

  // Last advisor conversational response
  const [lastAdvisorMessage, setLastAdvisorMessage] = useState<string | undefined>(undefined);

  // Smart Filters
  const [smartFilters, setSmartFilters] = useState<SmartFilterState>({
    makes: [],
    bodyStyles: [],
    fuelTypes: [],
    transmissions: [],
    searchQuery: ''
  });

  // CarCheck intentionally uses a single warm, light appearance.
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }, []);

  // Keep the primary views bookmarkable and make browser Back/Forward useful without adding a routing dependency.
  useEffect(() => {
    const hash = currentTab === 'all-cars' ? '#vehicles' : currentTab === 'marketplace' ? '#marketplace' : '#advisor';
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
  }, [currentTab]);

  useEffect(() => {
    const syncViewFromUrl = () => {
      const hash = window.location.hash;
      setCurrentTab(hash === '#vehicles' ? 'all-cars' : hash === '#marketplace' ? 'marketplace' : 'advisor');
    };
    window.addEventListener('popstate', syncViewFromUrl);
    window.addEventListener('hashchange', syncViewFromUrl);
    return () => {
      window.removeEventListener('popstate', syncViewFromUrl);
      window.removeEventListener('hashchange', syncViewFromUrl);
    };
  }, []);

  // Keep document language and market metadata in sync with the selected region.
  useEffect(() => {
    const isGreek = marketRegion === 'greece';
    document.documentElement.lang = isGreek ? 'el' : 'en';
    document.title = isGreek
      ? 'CarCheck — Σύμβουλος Αγοράς Αυτοκινήτου'
      : 'CarCheck — Intelligent Car Discovery & Advisor';
  }, [marketRegion]);

  // Synchronize Currency with localStorage
  useEffect(() => {
    localStorage.setItem('carcheck_currency', currency);
    setUserPreferences((prev) => {
      if (prev.currency === currency) return prev;
      const updated = { ...prev, currency };
      localStorage.setItem('carcheck_user_preferences', JSON.stringify(updated));
      return updated;
    });
  }, [currency]);

  // Synchronize Market Region with localStorage
  useEffect(() => {
    localStorage.setItem('carcheck_market_region', marketRegion);
    setUserPreferences((prev) => {
      const updated = { ...prev, marketRegion };
      localStorage.setItem('carcheck_user_preferences', JSON.stringify(updated));
      setRecommendations(recommendVehicles(updated));
      return updated;
    });
  }, [marketRegion]);

  // Synchronize Saved vehicles with localStorage
  useEffect(() => {
    localStorage.setItem('carcheck_saved_vehicles', JSON.stringify(savedVehicleIds));
  }, [savedVehicleIds]);

  // Synchronize Saved listings with localStorage
  useEffect(() => {
    localStorage.setItem('carcheck_saved_listings', JSON.stringify(savedListingIds));
  }, [savedListingIds]);

  // Compute recommendations whenever user preferences change
  const handleUpdatePreferences = (newPrefs: UserPreferences) => {
    const updated = { ...newPrefs, marketRegion };
    setUserPreferences(updated);
    localStorage.setItem('carcheck_user_preferences', JSON.stringify(updated));
    const newRecs = recommendVehicles(updated);
    setRecommendations(newRecs);
    setDiscoveryState('results');
    setCurrentTab('advisor');
  };

  // Toggle Save Vehicle to Garage
  const handleToggleSaveVehicle = (id: string) => {
    setSavedVehicleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Save Listing
  const handleToggleSaveListing = (id: string) => {
    setSavedListingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Vehicle in Comparison (Max 3)
  const handleToggleCompare = (id: string) => {
    setComparedVehicleIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        // Replace oldest or cap at 3
        return [prev[1], prev[2], id];
      }
      return [...prev, id];
    });
  };

  // Quick Preset Click from Hero Landing
  const handleQuickPreset = (presetKey: string) => {
    let presetPrefs = { ...DEFAULT_PREFERENCES, marketRegion };

    switch (presetKey) {
      case 'greek-budget-city':
        presetPrefs = {
          budgetId: '1.5k-5k',
          paymentMethod: 'cash',
          currency: 'EUR',
          marketRegion: 'greece',
          usages: ['city-driving', 'first-car', 'daily-commuting'],
          priorities: ['low-running-costs', 'reliability', 'fuel-economy'],
          lifestyle: ['easy-parking', 'drive-alone'],
          dynamicAnswer: 'Strict compact size for tight street parking'
        };
        break;
      case 'greek-zero-tax':
        presetPrefs = {
          budgetId: '10k-20k',
          paymentMethod: 'any',
          currency: 'EUR',
          marketRegion: 'greece',
          usages: ['city-driving', 'daily-commuting'],
          priorities: ['fuel-economy', 'environmental-impact', 'low-running-costs'],
          lifestyle: ['easy-parking'],
          dynamicAnswer: 'Zero road tax and Athens green ring circulation'
        };
        break;
      case 'city-reliability':
        presetPrefs = {
          budgetId: '10k-20k',
          paymentMethod: 'any',
          currency,
          marketRegion,
          usages: ['city-driving', 'daily-commuting'],
          priorities: ['reliability', 'low-running-costs', 'fuel-economy'],
          lifestyle: ['easy-parking', 'drive-alone'],
          dynamicAnswer: 'Strict compact size for tight street parking'
        };
        break;
      case 'family-wagon':
        presetPrefs = {
          budgetId: '20k-30k',
          paymentMethod: 'any',
          currency,
          marketRegion,
          usages: ['family-use', 'long-road-trips', 'carrying-equipment'],
          priorities: ['practicality', 'comfort', 'safety'],
          lifestyle: ['small-family', 'child-seats', 'lots-of-luggage'],
          dynamicAnswer: 'Family of 4 with luggage'
        };
        break;
      case 'sub10k-first-car':
        presetPrefs = {
          budgetId: '1.5k-5k',
          paymentMethod: 'cash',
          currency,
          marketRegion,
          usages: ['first-car', 'city-driving', 'daily-commuting'],
          priorities: ['low-running-costs', 'reliability', 'fuel-economy'],
          lifestyle: ['drive-alone', 'easy-parking'],
          dynamicAnswer: 'Mostly drive alone'
        };
        break;
      case 'electric-tech':
        presetPrefs = {
          budgetId: '30k-40k',
          paymentMethod: 'financing',
          currency,
          marketRegion,
          usages: ['daily-commuting', 'long-road-trips'],
          priorities: ['technology', 'performance', 'environmental-impact'],
          lifestyle: ['motorway-driving'],
          dynamicAnswer: 'Rapid instant acceleration'
        };
        break;
    }

    handleUpdatePreferences(presetPrefs);
  };

  // Handle Conversational Refinement (calls from child or chat)
  const handleApplyChatRefinement = (result: {
    advisorResponse: string;
    filterOverrides?: any;
  }) => {
    setLastAdvisorMessage(result.advisorResponse);

    if (result.filterOverrides) {
      const overrides = result.filterOverrides;
      const updatedPrefs = { ...userPreferences };

      if (overrides.maxPriceEUR) {
        if (overrides.maxPriceEUR <= 12000) updatedPrefs.budgetId = 'under-10k';
        else if (overrides.maxPriceEUR <= 22000) updatedPrefs.budgetId = '10k-20k';
        else if (overrides.maxPriceEUR <= 32000) updatedPrefs.budgetId = '20k-30k';
        else if (overrides.maxPriceEUR <= 45000) updatedPrefs.budgetId = '30k-40k';
      }

      if (overrides.addPriority && !updatedPrefs.priorities.includes(overrides.addPriority)) {
        updatedPrefs.priorities = [overrides.addPriority, ...updatedPrefs.priorities.slice(0, 2)];
      }

      if (overrides.excludeFuelType) {
        const allowedFuelTypes = ['Petrol', 'Hybrid', 'Plug-in Hybrid', 'Electric'] as SmartFilterState['fuelTypes'];
        setSmartFilters((prev) => ({
          ...prev,
          fuelTypes: allowedFuelTypes.filter((fuel) => fuel !== overrides.excludeFuelType)
        }));
      }

      if (overrides.fuelType) {
        const types = Array.isArray(overrides.fuelType) ? overrides.fuelType : [overrides.fuelType];
        setSmartFilters((prev) => ({
          ...prev,
          fuelTypes: types
        }));
      }

      if (overrides.bodyStyle) {
        const styles = Array.isArray(overrides.bodyStyle) ? overrides.bodyStyle : [overrides.bodyStyle];
        setSmartFilters((prev) => ({
          ...prev,
          bodyStyles: styles
        }));
      }

      if (overrides.maxPriceEUR) {
        setSmartFilters((prev) => ({ ...prev, maxPriceEUR: overrides.maxPriceEUR }));
      }

      if (overrides.bodyStyles) {
        setSmartFilters((prev) => ({ ...prev, bodyStyles: overrides.bodyStyles }));
      }

      if (overrides.fuelTypes) {
        setSmartFilters((prev) => ({ ...prev, fuelTypes: overrides.fuelTypes }));
      }

      if (overrides.transmissions) {
        setSmartFilters((prev) => ({ ...prev, transmissions: overrides.transmissions }));
      }

      if (typeof overrides.searchQuery === 'string') {
        setSmartFilters((prev) => ({ ...prev, searchQuery: overrides.searchQuery }));
      }

      setUserPreferences(updatedPrefs);
      localStorage.setItem('carcheck_user_preferences', JSON.stringify(updatedPrefs));
      const reRecs = recommendVehicles(updatedPrefs);
      setRecommendations(reRecs);
    }
  };

  // View Listings for a specific vehicle
  const handleViewListings = (vehicleId: string) => {
    setMarketplaceVehicleFilter(vehicleId);
    setCurrentTab('marketplace');
  };

  const comparedVehicles = VEHICLES.filter((v) => comparedVehicleIds.includes(v.id));

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)] text-[var(--color-text)] transition-colors pb-20 md:pb-0">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'garage') {
            setIsGarageOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        savedCount={savedVehicleIds.length + savedListingIds.length}
        compareCount={comparedVehicleIds.length}
        openCompareModal={() => setIsCompareModalOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
        marketRegion={marketRegion}
        setMarketRegion={setMarketRegion}
        onResetDiscovery={() => {
          setDiscoveryState('questionnaire');
          setCurrentTab('advisor');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'advisor' && (
          <>
            {discoveryState === 'hero' && (
              <HeroLanding
                onStartDiscovery={() => setDiscoveryState('questionnaire')}
                onBrowseAll={() => setCurrentTab('all-cars')}
                onQuickPreset={handleQuickPreset}
                currency={currency}
                marketRegion={marketRegion}
              />
            )}

            {discoveryState === 'questionnaire' && (
              <Questionnaire
                initialPreferences={userPreferences}
                onComplete={handleUpdatePreferences}
                currency={currency}
                marketRegion={marketRegion}
              />
            )}

            {discoveryState === 'results' && (
              <RecommendationResults
                recommendations={recommendations}
                userPreferences={userPreferences}
                currency={currency}
                marketRegion={marketRegion}
                onOpenDetails={(v) => setSelectedVehicleForDetail(v)}
                onToggleCompare={handleToggleCompare}
                comparedIds={comparedVehicleIds}
                onToggleSave={handleToggleSaveVehicle}
                savedIds={savedVehicleIds}
                onViewListings={handleViewListings}
                onRestartDiscovery={() => setDiscoveryState('questionnaire')}
                onApplyChatRefinement={handleApplyChatRefinement}
                lastAdvisorMessage={lastAdvisorMessage}
                smartFilters={smartFilters}
                setSmartFilters={setSmartFilters}
              />
            )}
          </>
        )}

        {currentTab === 'all-cars' && (
          <AllVehiclesCatalog
            currency={currency}
            onOpenDetails={(v) => setSelectedVehicleForDetail(v)}
            onToggleCompare={handleToggleCompare}
            comparedIds={comparedVehicleIds}
            onToggleSave={handleToggleSaveVehicle}
            savedIds={savedVehicleIds}
            onViewListings={handleViewListings}
            marketRegion={marketRegion}
          />
        )}

        {currentTab === 'marketplace' && (
          <MarketplaceListings
            currency={currency}
            onOpenVehicleDetails={(v) => setSelectedVehicleForDetail(v)}
            savedListingIds={savedListingIds}
            onToggleSaveListing={handleToggleSaveListing}
            filterVehicleId={marketplaceVehicleFilter}
            onClearVehicleFilter={() => setMarketplaceVehicleFilter(undefined)}
            marketRegion={marketRegion}
          />
        )}
      </main>

      {/* Dedicated Vehicle Detail Modal */}
      {selectedVehicleForDetail && (
        <VehicleDetailModal
          vehicle={selectedVehicleForDetail}
          onClose={() => setSelectedVehicleForDetail(null)}
          currency={currency}
          marketRegion={marketRegion}
          isSaved={savedVehicleIds.includes(selectedVehicleForDetail.id)}
          onToggleSave={handleToggleSaveVehicle}
          isCompared={comparedVehicleIds.includes(selectedVehicleForDetail.id)}
          onToggleCompare={handleToggleCompare}
          onSelectListing={() => {
            handleViewListings(selectedVehicleForDetail.id);
            setSelectedVehicleForDetail(null);
          }}
        />
      )}

      {/* Comparison Modal */}
      {isCompareModalOpen && (
        <ComparisonModal
          vehicles={comparedVehicles}
          onClose={() => setIsCompareModalOpen(false)}
          currency={currency}
          userPreferences={userPreferences}
          onRemoveVehicle={(id) => handleToggleCompare(id)}
          marketRegion={marketRegion}
        />
      )}

      {/* Garage Shortlist Drawer */}
      <GarageDrawer
        isOpen={isGarageOpen}
        onClose={() => setIsGarageOpen(false)}
        savedVehicleIds={savedVehicleIds}
        savedListingIds={savedListingIds}
        onRemoveVehicle={handleToggleSaveVehicle}
        onRemoveListing={handleToggleSaveListing}
        currency={currency}
        onOpenDetails={(v) => setSelectedVehicleForDetail(v)}
        marketRegion={marketRegion}
        onStartComparison={(vehicles) => {
          setComparedVehicleIds(vehicles.map((v) => v.id));
          setIsCompareModalOpen(true);
        }}
      />

      <footer className="border-t border-[var(--color-border)] py-8 text-sm text-[var(--color-text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-[var(--color-text)]">CarCheck Advisor</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{marketRegion === 'greece' ? 'Ανεξάρτητη καθοδήγηση για αγορά αυτοκινήτου' : 'Independent car-buying guidance'}</span>
          </div>
          <span className="text-xs max-w-xl sm:text-right">
            {marketRegion === 'greece'
              ? 'Οι τιμές, οι αγγελίες και τα φορολογικά στοιχεία είναι ενδεικτικά στιγμιότυπα. Επιβεβαίωσέ τα στην αρχική πηγή πριν από αγορά.'
              : 'Prices, listings, and market data are reference snapshots. Verify current details with the original source before purchasing.'}
          </span>
        </div>
      </footer>

    </div>
  );
}
