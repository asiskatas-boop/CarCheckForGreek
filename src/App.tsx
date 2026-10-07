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
import { ScreensExportModal } from './components/ScreensExportModal';

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
  const [currentTab, setCurrentTab] = useState<'advisor' | 'all-cars' | 'marketplace' | 'garage'>('advisor');
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

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('carcheck_theme');
      if (stored) return stored === 'dark';
      return true; // default dark for premium automotive feel
    } catch {
      return true;
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
    return recommendVehicles(DEFAULT_PREFERENCES);
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

  // Screen Export Modal Open
  const [isExportScreensOpen, setIsExportScreensOpen] = useState<boolean>(false);

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

  // Synchronize Dark Mode with document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('carcheck_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Synchronize Currency with localStorage
  useEffect(() => {
    localStorage.setItem('carcheck_currency', currency);
  }, [currency]);

  // Synchronize Market Region with localStorage
  useEffect(() => {
    localStorage.setItem('carcheck_market_region', marketRegion);
    setUserPreferences((prev) => ({ ...prev, marketRegion }));
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
        setSmartFilters((prev) => ({
          ...prev,
          fuelTypes: prev.fuelTypes.filter((f) => f !== overrides.excludeFuelType)
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

      setUserPreferences(updatedPrefs);
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
    <div className="min-h-screen flex flex-col bg-[#181818] text-white transition-colors">
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
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onResetDiscovery={() => {
          setDiscoveryState('questionnaire');
          setCurrentTab('advisor');
        }}
        onOpenExportScreens={() => setIsExportScreensOpen(true)}
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
        onStartComparison={(vehicles) => {
          setComparedVehicleIds(vehicles.map((v) => v.id));
          setIsCompareModalOpen(true);
        }}
      />

      {/* Quiet, anti-slop footer */}
      <footer className="border-t border-[#e5e5ea] dark:border-[#2d2d30] py-8 text-xs text-[#86868b] text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1d1d1f] dark:text-[#e5e5ea]">CarCheck Advisor</span>
            <span>·</span>
            <span>Unbiased car discovery without classified clutter</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsExportScreensOpen(true)}
              className="text-[#0066cc] dark:text-[#2997ff] font-semibold hover:underline cursor-pointer"
            >
              {marketRegion === 'greece' ? '📄 Εξαγωγή & Εκτύπωση 10 Οθονών (PDF/HTML)' : '📄 Export All 10 Screens (PDF / HTML)'}
            </button>
            <span>·</span>
            <span>Prices verified for 2026</span>
          </div>
        </div>
      </footer>

      {/* Screen Portfolio & Exporter Modal */}
      <ScreensExportModal
        isOpen={isExportScreensOpen}
        onClose={() => setIsExportScreensOpen(false)}
        marketRegion={marketRegion}
        currency={currency}
      />
    </div>
  );
}
