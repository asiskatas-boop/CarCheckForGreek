import React from 'react';
import {
  Bookmark,
  Scale,
  RotateCcw,
  Globe2,
  Sparkles,
  CarFront,
  Store
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
  onResetDiscovery: () => void;
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
  onResetDiscovery
}) => {
  const isGreek = marketRegion === 'greece';
  const navItems = [
    { id: 'advisor' as const, label: isGreek ? 'Σύμβουλος' : 'Advisor', icon: Sparkles },
    { id: 'all-cars' as const, label: isGreek ? 'Μοντέλα' : 'Vehicles', icon: CarFront },
    { id: 'marketplace' as const, label: isGreek ? 'Αγγελίες' : 'Listings', icon: Store }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/92 backdrop-blur-md text-[var(--color-text)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-6 sm:gap-8 min-w-0">
            <button
              type="button"
              onClick={() => setCurrentTab('advisor')}
              className="touch-target flex items-center gap-2.5 text-left group shrink-0"
              aria-label={isGreek ? 'CarCheck — μετάβαση στον σύμβουλο αγοράς' : 'CarCheck — go to advisor'}
            >
              <span className="w-9 h-9 rounded-xl bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent-on)] font-extrabold tracking-tight text-xs shadow-sm transition-colors group-hover:bg-[var(--color-accent-hover)]">
                CC
              </span>
              <span className="hidden xs:block sm:block">
                <span className="font-bold text-lg tracking-tight text-[var(--color-text)]">
                  Car<span className="text-[var(--color-accent-text)]">Check</span>
                </span>
                <span className="hidden lg:block text-[11px] text-[var(--color-text-muted)] leading-tight">
                  {isGreek ? 'Σύμβουλος αγοράς αυτοκινήτου' : 'Independent vehicle advisor'}
                </span>
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-1" aria-label={isGreek ? 'Κύρια πλοήγηση' : 'Primary navigation'}>
              {navItems.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  aria-current={currentTab === item.id ? 'page' : undefined}
                  className={`min-h-11 px-4 text-sm font-semibold rounded-xl transition-colors ${
                    currentTab === item.id
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-1 text-xs font-semibold"
              role="group"
              aria-label={isGreek ? 'Περιοχή αγοράς' : 'Market region'}
            >
              <button
                type="button"
                onClick={() => setMarketRegion('global')}
                aria-pressed={marketRegion === 'global'}
                className={`min-h-11 px-2.5 rounded-lg transition-colors ${
                  marketRegion === 'global'
                    ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
                title={isGreek ? 'Ευρωπαϊκή αγορά' : 'European market'}
              >
                EU
              </button>
              <button
                type="button"
                onClick={() => setMarketRegion('greece')}
                aria-pressed={marketRegion === 'greece'}
                className={`min-h-11 px-2.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  marketRegion === 'greece'
                    ? 'bg-[var(--color-accent)] text-white shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
                title="Ελληνική αγορά: τέλη, τεκμήρια, Δακτύλιος και ενδεικτικά δεδομένα αγγελιών"
              >
                <Globe2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Ελλάδα</span>
                <span className="sm:hidden">GR</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-1 text-xs font-semibold" role="group" aria-label={isGreek ? 'Νόμισμα' : 'Currency'}>
              {(['EUR', 'USD', 'GBP'] as Currency[]).map((curr) => (
                <button
                  type="button"
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  aria-pressed={currency === curr}
                  className={`min-w-11 min-h-11 rounded-lg transition-colors ${
                    currency === curr
                      ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                  aria-label={curr}
                >
                  {curr === 'EUR' ? '€' : curr === 'USD' ? '$' : '£'}
                </button>
              ))}
            </div>

            {compareCount > 0 && (
              <button
                type="button"
                onClick={openCompareModal}
                className="touch-target inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-bold transition-colors"
                aria-label={`${isGreek ? 'Σύγκριση' : 'Compare'} ${compareCount}`}
              >
                <Scale className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{isGreek ? 'Σύγκριση' : 'Compare'}</span>
                <span>{compareCount}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentTab('garage')}
              className="touch-target relative hidden md:inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              aria-label={isGreek ? `Αποθηκευμένα (${savedCount})` : `Saved garage (${savedCount})`}
            >
              <Bookmark className="w-4 h-4" aria-hidden="true" />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-[var(--color-accent)] text-white font-bold text-[10px] rounded-full flex items-center justify-center" aria-hidden="true">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onResetDiscovery}
              className="touch-target hidden sm:inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              aria-label={isGreek ? 'Νέα αναζήτηση αυτοκινήτου' : 'Restart discovery'}
              title={isGreek ? 'Νέα αναζήτηση' : 'Restart discovery'}
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/96 backdrop-blur-md px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
        aria-label={isGreek ? 'Κύρια πλοήγηση κινητού' : 'Mobile primary navigation'}
      >
        <div className="grid grid-cols-4 max-w-lg mx-auto gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`min-h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors ${
                  active
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setCurrentTab('garage')}
            className="relative min-h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] transition-colors"
            aria-label={isGreek ? `Αποθηκευμένα (${savedCount})` : `Saved (${savedCount})`}
          >
            <Bookmark className="w-5 h-5" aria-hidden="true" />
            <span>{isGreek ? 'Garage' : 'Saved'}</span>
            {savedCount > 0 && (
              <span className="absolute top-1.5 right-[24%] min-w-4 h-4 px-1 bg-[var(--color-accent)] text-white text-[9px] rounded-full flex items-center justify-center" aria-hidden="true">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
