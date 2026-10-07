import React, { useState } from 'react';
import { Vehicle, Currency, MarketplaceListing, MarketRegion } from '../types';
import { formatPrice, formatPriceRange } from '../services/currency';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  Scale,
  Gauge,
  Fuel,
  Info,
  Calendar,
  Wrench,
  Check,
  ExternalLink
} from 'lucide-react';
import { GET_LISTINGS_FOR_VEHICLE } from '../data/listings';
import { AccessibleDialog } from './AccessibleDialog';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  currency: Currency;
  marketRegion?: MarketRegion;
  isSaved: boolean;
  onToggleSave: (vehicleId: string) => void;
  isCompared: boolean;
  onToggleCompare: (vehicleId: string) => void;
  onSelectListing?: (listing: MarketplaceListing) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  currency,
  marketRegion = 'global',
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
  onSelectListing
}) => {
  const isGreek = marketRegion === 'greece';
  const [activeTab, setActiveTab] = useState<'overview' | 'inspection' | 'issues' | 'listings'>('overview');
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<Record<string, boolean>>({});

  if (!vehicle) return null;

  const listings = GET_LISTINGS_FOR_VEHICLE(vehicle.id);
  const tabs = [
    { id: 'overview' as const, label: isGreek ? 'Επισκόπηση & Τεχνικά' : 'Overview & Specs' },
    { id: 'inspection' as const, label: isGreek ? `Checklist Ελέγχου (${vehicle.inspectionChecklist.length})` : `Inspection Checklist (${vehicle.inspectionChecklist.length})` },
    { id: 'issues' as const, label: isGreek ? 'Γνωστά Θέματα & Χρονιές' : 'Known Issues & Years' },
    { id: 'listings' as const, label: isGreek ? `Ενδεικτικές Αγγελίες (${listings.length})` : `Reference Listings (${listings.length})` }
  ];

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, tabId: typeof tabs[number]['id']) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === tabId);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
      ? tabs.length - 1
      : event.key === 'ArrowRight'
      ? (currentIndex + 1) % tabs.length
      : (currentIndex - 1 + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    document.getElementById(`vehicle-tab-${nextTab.id}`)?.focus();
  };

  const toggleChecklistItem = (comp: string) => {
    setCheckedChecklistItems((prev) => ({
      ...prev,
      [comp]: !prev[comp]
    }));
  };

  return (
    <AccessibleDialog
      open={Boolean(vehicle)}
      onClose={onClose}
      labelledBy="vehicle-detail-title"
      overlayClassName="overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      panelClassName="relative w-full max-w-4xl bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
    >
        {/* Modal Top Bar */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-slate-950">
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 touch-target rounded-xl flex items-center justify-center bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
            aria-label={isGreek ? 'Κλείσιμο λεπτομερειών οχήματος' : 'Close vehicle details'}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Title Overlay */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-accent-text)] mb-1">
                <span>{vehicle.generation}</span>
                <span aria-hidden="true">·</span>
                <span>{vehicle.years}</span>
                <span aria-hidden="true">·</span>
                <span>{vehicle.bodyStyle}</span>
              </div>
              <h2 id="vehicle-detail-title" className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {vehicle.make} {vehicle.model}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleCompare(vehicle.id)}
                aria-pressed={isCompared}
                className={`min-h-11 px-3.5 rounded-xl text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isCompared
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isCompared ? (isGreek ? 'Στη σύγκριση' : 'Compared') : (isGreek ? 'Σύγκριση' : 'Compare')}</span>
              </button>

              <button
                onClick={() => onToggleSave(vehicle.id)}
                aria-pressed={isSaved}
                className={`min-h-11 px-3.5 rounded-xl text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isSaved ? (isGreek ? 'Στο Garage' : 'In Garage') : (isGreek ? 'Αποθήκευση' : 'Save')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div
          role="tablist"
          aria-label={isGreek ? 'Ενότητες οχήματος' : 'Vehicle sections'}
          className="px-5 border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)] flex items-center gap-2 sm:gap-4 overflow-x-auto shrink-0"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`vehicle-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={activeTab === tab.id}
              aria-controls={`vehicle-panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
              className={`min-h-12 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[var(--color-accent)] text-[var(--color-accent-text)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Tab Content */}
        <div id={`vehicle-panel-${activeTab}`} role="tabpanel" aria-labelledby={`vehicle-tab-${activeTab}`} tabIndex={0} className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Car.gr saved market reference strip */}
              {isGreek && (
                <div className="p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--color-text)]">{isGreek ? 'Αναφορά αγοράς Car.gr' : 'Car.gr market reference'}</span>
                      {vehicle.carGrClassifiedCount && (
                        <span className="text-xs font-medium text-[var(--color-accent-text)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full">
                          {isGreek ? 'Αποθηκευμένο δείγμα αγοράς' : 'Saved market sample'}
                        </span>
                      )}
                    </div>
                    {vehicle.carGrPriceBenchmark && (
                      <div className="text-xs text-[var(--color-text-muted)] mt-1">
                        Ενδεικτικό εύρος τιμών στην αποθηκευμένη αναφορά: <strong className="text-[var(--color-text)]">{vehicle.carGrPriceBenchmark}</strong>
                      </div>
                    )}
                  </div>
                  <a
                    href={vehicle.carGrSearchUrl || 'https://www.car.gr'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-[var(--color-accent)] hover:brightness-110 text-white transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Άνοιγμα αγγελιών στο Car.gr</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Pricing Intelligence Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">
                    {isGreek ? 'Ενδεικτική Τιμή Αγοράς' : 'Reference Market Price'}
                  </span>
                  <div className="text-lg font-bold text-[var(--color-text)] mt-0.5">
                    {formatPriceRange(vehicle.typicalPriceMin, vehicle.typicalPriceMax, currency)}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                    {isGreek ? `Ενδεικτική εκτίμηση (${vehicle.marketPriceType})` : `Reference ${vehicle.marketPriceType} market estimate`}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--color-accent-text)] font-semibold">
                    {isGreek ? 'Στόχος «Καλής Αγοράς»' : 'Good-Buy Target'}
                  </span>
                  <div className="text-lg font-extrabold text-[var(--color-accent-text)] mt-0.5">
                    {isGreek ? 'Έως' : 'Up to'} {formatPrice(vehicle.goodBuyPrice, currency)}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                    {isGreek ? 'Στόχος αξίας για καλή κατάσταση και χιλιόμετρα' : 'Value target for condition & mileage'}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--color-success)] font-semibold">
                    {isGreek ? 'Εξαιρετικός Στόχος' : 'Excellent-Buy Target'}
                  </span>
                  <div className="text-lg font-extrabold text-[var(--color-success)] mt-0.5">
                    {isGreek ? 'Έως' : 'Up to'} {formatPrice(vehicle.excellentBuyPrice, currency)}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                    {isGreek ? 'Χαμηλότερα από το ενδεικτικό εύρος' : 'Below the reference market range'}
                  </p>
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  {isGreek ? 'Βασικά Τεχνικά Χαρακτηριστικά' : 'Key Technical Specifications'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <span className="text-slate-500 font-medium">{isGreek ? 'Ισχύς & Κινητήρας' : 'Power & Engine'}</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                      {vehicle.horsepower} hp
                    </div>
                    <span className="text-[11px] text-slate-500">{vehicle.fuelType}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <span className="text-slate-500 font-medium">0–100 km/h (62 mph)</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                      {vehicle.acceleration0to100} {isGreek ? 'δευτ.' : 'seconds'}
                    </div>
                    <span className="text-[11px] text-slate-500">{vehicle.drivetrain} · {isGreek ? 'κίνηση' : 'drivetrain'}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <span className="text-slate-500 font-medium">{isGreek ? 'Κατανάλωση Καυσίμου / Ενέργειας' : 'Fuel / Energy Economy'}</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                      {vehicle.fuelEconomy}
                    </div>
                    <span className="text-[11px] text-slate-500">{isGreek ? 'Ενδεικτική πραγματική κατανάλωση' : 'Reference real-world average'}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
                    <span className="text-[var(--color-text-muted)] font-medium">{isGreek ? 'Πορτμπαγκάζ & Θέσεις' : 'Boot & Seating'}</span>
                    <div className="font-bold text-white mt-1 text-sm">
                      {vehicle.cargoCapacityLiters} L · {vehicle.seats} {isGreek ? 'θέσεις' : 'seats'}
                    </div>
                    <span className="text-[11px] text-[var(--color-text-muted)]">{isGreek ? 'Μέγιστο' : 'Max'} {vehicle.maxCargoCapacityLiters || 1200} L {isGreek ? 'με αναδίπλωση' : 'folded'}</span>
                  </div>
                </div>

                {/* Greek Market Specific Specs Banner */}
                {isGreek && (
                  <div className="mt-4 p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[var(--color-text-muted)] uppercase font-bold text-[10px] tracking-[1.1px]">
                        Τέλη Κυκλοφορίας (Ελλάδα)
                      </span>
                      <div className="text-sm font-extrabold text-[var(--color-accent-text)] mt-0.5">
                        {vehicle.greekRoadTaxEur === 0 ? '0€ / Έτος (Απαλλαγή)' : `${vehicle.greekRoadTaxEur}€ / Έτος`}
                      </div>
                      <span className="text-[11px] text-[var(--color-text-muted)]">Βάσει CO2 / κυβικών</span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] uppercase font-bold text-[10px] tracking-[1.1px]">
                        Πράσινος Δακτύλιος Αθηνών
                      </span>
                      <div className="text-sm font-extrabold text-white mt-0.5">
                        {vehicle.athensRingExempt ? '✓ Ελεύθερη Είσοδος Καθημερινά' : 'Μονά / Ζυγά'}
                      </div>
                      <span className="text-[11px] text-[var(--color-text-muted)]">Κυκλοφορία στο κέντρο</span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] uppercase font-bold text-[10px] tracking-[1.1px]">
                        Κυβισμός & Τεκμήριο
                      </span>
                      <div className="text-sm font-extrabold text-white mt-0.5">
                        {vehicle.engineDisplacementCc ? `${vehicle.engineDisplacementCc} cc` : 'Ηλεκτρικό'}
                      </div>
                      <span className="text-[11px] text-[var(--color-text-muted)]">Ετήσια φορολογική κλίμακα</span>
                    </div>
                  </div>
                )}
              </div>

              {/* {isGreek ? 'Ταιριάζει Καλύτερα Σε' : 'Best For'} vs {isGreek ? 'Λιγότερο Κατάλληλο Για' : 'Not Ideal For'} */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isGreek ? 'Ταιριάζει Καλύτερα Σε' : 'Best For'}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {vehicle.bestFor.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-500/20">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{isGreek ? 'Λιγότερο Κατάλληλο Για' : 'Not Ideal For'}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {vehicle.notIdealFor.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {isGreek ? 'Κύρια Πλεονεκτήματα' : 'Key Strengths'}
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {vehicle.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {isGreek ? 'Συμβιβασμοί που Αξίζει να Σκεφτείς' : 'Trade-offs to Consider'}
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {vehicle.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">✕</span>
                        <span className="leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSPECTION CHECKLIST */}
          {activeTab === 'inspection' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{isGreek ? `Οδηγός Ελέγχου πριν την Αγορά — ${vehicle.model}` : `Pre-Purchase Inspection Guide for ${vehicle.model}`}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {isGreek
                    ? 'Χρησιμοποίησε το checklist κατά την επίσκεψη ή το test drive και σημείωσε όσα επιβεβαιώνεις.'
                    : 'Use this checklist while viewing or test-driving a used car and mark each item as you verify it.'}
                </p>
              </div>

              <div className="space-y-3">
                {vehicle.inspectionChecklist.map((item, idx) => {
                  const isChecked = !!checkedChecklistItems[item.component];
                  return (
                    <button
                      key={idx}
                      type="button"
                      aria-pressed={isChecked}
                      onClick={() => toggleChecklistItem(item.component)}
                      className={`w-full p-4 rounded-xl border transition-colors text-left ${
                        isChecked
                          ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                {item.component}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${
                                  item.importance === 'Critical'
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : item.importance === 'Important'
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-slate-500'
                                }`}
                              >
                                {isGreek ? (item.importance === 'Critical' ? 'Κρίσιμο' : item.importance === 'Important' ? 'Σημαντικό' : 'Συμβουλευτικό') : item.importance}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                              {item.check}
                            </p>
                            <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded inline-block">
                              {isGreek ? 'Συμβουλή: ' : 'Advisor tip: '}{item.tip}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: KNOWN ISSUES & YEARS */}
          {activeTab === 'issues' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{isGreek ? 'Προτεινόμενες Χρονιές' : 'Recommended Model Years'}</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {vehicle.recommendedYears}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isGreek ? 'Συνήθως καλύτερος συνδυασμός εργοστασιακών βελτιώσεων και απόσβεσης.' : 'Usually the better balance of factory revisions and depreciation.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{isGreek ? 'Χρονιές ή Εκδόσεις προς Προσοχή' : 'Years or Trims to Avoid'}</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {vehicle.yearsToAvoid || (isGreek ? 'Δεν έχουν επισημανθεί συγκεκριμένες χρονιές υψηλού ρίσκου' : 'No high-risk model years identified')}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isGreek ? 'Εκδόσεις που χρειάζονται επιπλέον έλεγχο λόγω γνωστών θεμάτων ή χαμηλότερης ζήτησης.' : 'Versions that deserve extra checks because of known issues or weaker demand.'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  {isGreek ? 'Καταγεγραμμένα Γνωστά Θέματα' : 'Documented Community & Fleet Concerns'}
                </h4>
                <div className="space-y-2">
                  {vehicle.knownIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3"
                    >
                      <Wrench className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MARKETPLACE LISTINGS */}
          {activeTab === 'listings' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isGreek ? `Ενδεικτικές Αγγελίες για ${vehicle.make} ${vehicle.model}` : `Reference Listings for ${vehicle.make} ${vehicle.model}`}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isGreek ? 'Αποθηκευμένα παραδείγματα για σύγκριση με το ενδεικτικό εύρος τιμής' : 'Saved listing examples compared with the reference market range'}
                  </p>
                </div>
              </div>

              {listings.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                  <p className="text-xs text-slate-500">
                    {isGreek ? 'Δεν υπάρχουν αποθηκευμένα παραδείγματα για αυτή την έκδοση.' : 'No saved listing examples match this exact variant.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {listings.map((l) => (
                    <div
                      key={l.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                              l.dealRating === 'Excellent Price'
                                ? 'text-teal-600 dark:text-teal-400'
                                : l.dealRating === 'Good Price'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {isGreek ? (l.dealRating === 'Excellent Price' ? 'Εξαιρετική τιμή' : l.dealRating === 'Good Price' ? 'Καλή τιμή' : l.dealRating === 'Fair Price' ? 'Δίκαιη τιμή' : 'Πάνω από αγορά') : l.dealRating}
                          </span>
                          <span className="text-[11px] text-slate-400">{isGreek ? 'αποθηκευμένο δείγμα' : 'saved snapshot'}</span>
                        </div>

                        <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                          {l.title}
                        </h5>

                        <div className="text-xs text-slate-500 mt-1">
                          {l.year} · {l.mileageKm.toLocaleString()} km · {l.transmission} · {l.location}
                        </div>

                        <div className="mt-2 text-base font-extrabold text-slate-900 dark:text-white">
                          {formatPrice(l.price, currency)}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                          "{l.dealExplanation}"
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">{l.sellerName}</span>
                        <button
                          onClick={() => onSelectListing && onSelectListing(l)}
                          className="min-h-11 px-2 font-semibold text-[var(--color-accent-text)] hover:underline cursor-pointer"
                        >
                          {isGreek ? 'Προβολή αγγελιών →' : 'View listings →'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
    </AccessibleDialog>
  );
};
