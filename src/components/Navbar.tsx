import React from 'react';
import {
  Compass,
  Bookmark,
  Scale,
  Sun,
  Moon,
  RotateCcw,
  Globe,
  Download
} from 'lucide-react';
import { Currency, MarketRegion } from '../types';

interface NavbarProps {
  currentTab: 'advisor' | 'all-cars' | 'marketplace' | 'garage';
  setCurrentTab: (tab: 'advisor' | 'all-cars' | 'marketplace' | 'garage') => void;
  savedCount: number;
  compareCount: number;
  openCompareModal: () => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  marketRegion: MarketRegion;
  setMarketRegion: (region: MarketRegion) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onResetDiscovery: () => void;
  onOpenExportScreens: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  savedCount,
  compareCount,
  openCompareModal,
  currency,
  setCurrency,
  marketRegion,
  setMarketRegion,
  isDarkMode,
  setIsDarkMode,
  onResetDiscovery,
  onOpenExportScreens
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e5e5ea] dark:border-[#2d2d30] bg-white/85 dark:bg-[#161617]/90 backdrop-blur-md transition-colors text-[#1d1d1f] dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6 sm:gap-8">
          <button
            onClick={() => setCurrentTab('advisor')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#0066cc] flex items-center justify-center text-white font-bold tracking-tight text-xs shadow-xs group-hover:bg-[#0071e3] transition-colors">
              CC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-[-0.28px] text-[#1d1d1f] dark:text-white">
                  Car<span className="text-[#0066cc] dark:text-[#2997ff]">Check</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide bg-[#f5f5f7] dark:bg-[#272729] text-[#6e6e73] dark:text-[#a1a1a6] px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10">
                  {marketRegion === 'greece' ? '🇬🇷 Ελλάδα' : 'Smart Advisor'}
                </span>
              </div>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'advisor', label: marketRegion === 'greece' ? 'Σύμβουλος Αγοράς' : 'Smart Advisor' },
              { id: 'all-cars', label: marketRegion === 'greece' ? 'Όλα τα Μοντέλα' : 'All Vehicles' },
              { id: 'marketplace', label: marketRegion === 'greece' ? 'Αγγελίες Car.gr' : 'Available Cars' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id as any)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  currentTab === item.id
                    ? 'bg-[#f5f5f7] dark:bg-[#272729] text-[#0066cc] dark:text-[#2997ff] font-semibold'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Greek Market vs Global Market Switcher */}
          <div className="flex items-center rounded-full border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#272729] p-0.5 text-xs font-medium">
            <button
              onClick={() => setMarketRegion('global')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                marketRegion === 'global'
                  ? 'bg-white dark:bg-[#38383a] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                  : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
              title="Global European market analysis"
            >
              🇪🇺 EU
            </button>
            <button
              onClick={() => setMarketRegion('greece')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                marketRegion === 'greece'
                  ? 'bg-[#0066cc] text-white shadow-xs font-semibold'
                  : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
              title="Greek market analysis: Car.gr, Τέλη κυκλοφορίας, Δακτύλιος, ΚΤΕΟ, Τεκμήρια"
            >
              <span>🇬🇷</span>
              <span className="hidden sm:inline">Ελλάδα</span>
            </button>
          </div>

          {/* Currency selector */}
          <div className="hidden sm:flex items-center rounded-full border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#272729] p-0.5 text-xs font-medium">
            {(['EUR', 'USD', 'GBP'] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  currency === curr
                    ? 'bg-white dark:bg-[#38383a] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                {curr === 'EUR' ? '€' : curr === 'USD' ? '$' : '£'}
              </button>
            ))}
          </div>

          {/* Compare Button */}
          {compareCount > 0 && (
            <button
              onClick={openCompareModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] active:scale-95 text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs"
              title="Compare selected vehicles"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{marketRegion === 'greece' ? 'Σύγκριση' : 'Compare'} ({compareCount})</span>
            </button>
          )}

          {/* Export Screens / Portfolio button */}
          <button
            onClick={onOpenExportScreens}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#0066cc]/30 bg-[#0066cc]/10 hover:bg-[#0066cc]/20 text-[#0066cc] dark:text-[#2997ff] text-xs font-semibold transition-all cursor-pointer"
            title={marketRegion === 'greece' ? 'Εξαγωγή όλων των οθονών σε PDF / HTML' : 'Export all screens to PDF / HTML'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{marketRegion === 'greece' ? 'Εξαγωγή Οθονών' : 'Export Screens'}</span>
          </button>

          <button
            onClick={onOpenExportScreens}
            className="sm:hidden p-2 rounded-full border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#272729] text-[#0066cc] dark:text-[#2997ff] transition-colors cursor-pointer"
            title="Export Screens"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Garage link */}
          <button
            onClick={() => setCurrentTab('garage')}
            className={`relative p-2 rounded-full border transition-all cursor-pointer ${
              currentTab === 'garage'
                ? 'border-[#0066cc] bg-[#0066cc] text-white'
                : 'border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#272729] text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
            title="Saved Garage Shortlist"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0066cc] text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Reset Questionnaire */}
          <button
            onClick={onResetDiscovery}
            className="p-2 rounded-full border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#272729] text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
            title="Restart Discovery"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

