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

type NavTab = 'advisor' | 'all-cars' | 'marketplace';

const NAV_HREF: Record<NavTab, string> = {
  advisor: '#advisor',
  'all-cars': '#vehicles',
  marketplace: '#marketplace'
};

// Let modified clicks (new tab/window) fall through to the browser; handle plain clicks in-app.
const isPlainClick = (event: React.MouseEvent) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

interface NavbarProps {
  currentTab: NavTab;
  isGarageOpen: boolean;
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
  isGarageOpen,
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
  const savedLabel = isGreek ? 'Αποθηκευμένα' : 'Saved';
  const navigate = (tab: NavTab) => (event: React.MouseEvent) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    setCurrentTab(tab);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/92 backdrop-blur-md text-[var(--color-text)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-6 sm:gap-8 min-w-0">
            <a
              href={NAV_HREF.advisor}
              onClick={navigate('advisor')}
              translate="no"
              className="touch-target flex items-center gap-2.5 text-left group shrink-0"
              aria-label={isGreek ? 'CarCheck — αρχική σελίδα συμβούλου' : 'CarCheck — advisor home'}
            >
              <span className="w-9 h-9 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent-text)] font-semibold tracking-tight text-xs transition-colors group-hover:border-[var(--color-border-strong)]">
                CC
              </span>
              <span className="block">
                <span className="font-bold text-lg tracking-tight text-[var(--color-text)]">
                  Car<span className="text-[var(--color-accent-text)]">Check</span>
                </span>
                <span className="hidden lg:block text-[11px] text-[var(--color-text-muted)] leading-tight">
                  {isGreek ? 'Σύμβουλος αγοράς αυτοκινήτου' : 'Independent vehicle advisor'}
                </span>
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-1" aria-label={isGreek ? 'Κύρια πλοήγηση' : 'Primary navigation'}>
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={NAV_HREF[item.id]}
                  onClick={navigate(item.id)}
                  aria-current={currentTab === item.id ? 'page' : undefined}
                  className={`min-h-11 px-4 inline-flex items-center text-sm font-semibold rounded-xl transition-colors ${
                    currentTab === item.id
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {item.label}
                </a>
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
                title={isGreek ? 'Ελληνική αγορά: τέλη, τεκμήρια, Δακτύλιος και ενδεικτικά δεδομένα αγγελιών' : 'Greek market: road tax, deemed-income rules, Athens ring and reference listings'}
              >
                <Globe2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline" lang="el">Ελλάδα</span>
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

            <label className="lg:hidden">
              <span className="sr-only">{isGreek ? 'Νόμισμα' : 'Currency'}</span>
              <select
                name="currency"
                value={currency}
                onChange={(event) => setCurrency(event.target.value as Currency)}
                className="min-h-11 rounded-xl border border-[var(--color-border-control)] bg-[var(--color-surface-subtle)] text-[var(--color-text)] px-2 text-xs font-semibold"
              >
                <option value="EUR">€ EUR</option>
                <option value="USD">$ USD</option>
                <option value="GBP">£ GBP</option>
              </select>
            </label>

            {compareCount > 0 && (
              <button
                type="button"
                onClick={openCompareModal}
                aria-haspopup="dialog"
                className="touch-target inline-flex items-center justify-center gap-1.5 px-3 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-bold transition-colors"
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
              aria-haspopup="dialog"
              aria-expanded={isGarageOpen}
              className={`touch-target relative hidden md:inline-flex items-center justify-center rounded-xl border transition-colors ${
                isGarageOpen
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
              aria-label={`${savedLabel} (${savedCount})`}
            >
              <Bookmark className="w-4 h-4" aria-hidden="true" />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-[var(--color-accent)] text-white font-bold text-[11px] tabular-nums rounded-full flex items-center justify-center" aria-hidden="true">
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
              <a
                key={item.id}
                href={NAV_HREF[item.id]}
                onClick={navigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`min-h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors ${
                  active
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
          <button
            type="button"
            onClick={() => setCurrentTab('garage')}
            aria-haspopup="dialog"
            aria-expanded={isGarageOpen}
            className={`relative min-h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors ${
              isGarageOpen
                ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
            }`}
            aria-label={`${savedLabel} (${savedCount})`}
          >
            <Bookmark className="w-5 h-5" aria-hidden="true" />
            <span>{savedLabel}</span>
            {savedCount > 0 && (
              <span className="absolute top-1 right-[20%] min-w-5 h-5 px-1 bg-[var(--color-accent)] text-white text-[11px] tabular-nums rounded-full flex items-center justify-center" aria-hidden="true">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
