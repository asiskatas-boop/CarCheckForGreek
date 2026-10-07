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
import { VehicleImage } from './VehicleImage';
import { DataTrustNote } from './DataTrustNote';

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
          <VehicleImage vehicle={vehicle} alt={`${vehicle.make} ${vehicle.model}`} marketRegion={marketRegion} eager showReferenceLabel className="object-center" />
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
              <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-accent-text)] mb-1">
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
                className={`min-h-11 px-3.5 rounded-xl text-[13px] font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer ${
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
                className={`min-h-11 px-3.5 rounded-xl text-[13px] font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer ${
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
              className={`min-h-12 px-2 text-[15px] font-bold border-b-2 transition-colors whitespace-nowrap ${
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
              <DataTrustNote marketRegion={marketRegion} compact />

              {isGreek && vehicle.carGrSearchUrl && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <div>
                    <p className="text-[15px] font-bold text-[var(--color-text)]">Έλεγξε την τρέχουσα αγορά</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-text-muted)]">Οι τιμές στη βάση του CarCheck είναι ενδεικτικές. Άνοιξε νέα αναζήτηση για τη σημερινή προσφορά και επιβεβαίωσε κάθε αγγελία στην πηγή.</p>
                  </div>
                  <a href={vehicle.carGrSearchUrl} target="_blank" rel="noreferrer" className="min-h-11 px-4 rounded-xl text-[13px] font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-colors flex items-center justify-center gap-1.5 shrink-0">
                    <span>Άνοιγμα Car.gr</span><ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              )}

              {/* Pricing Intelligence Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">
                    {isGreek ? 'Ενδεικτική Τιμή Αγοράς' : 'Reference Market Price'}
                  </span>
                  <div className="text-lg font-bold text-[var(--color-text)] mt-0.5">
                    {formatPriceRange(vehicle.typicalPriceMin, vehicle.typicalPriceMax, currency)}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {isGreek ? `Ενδεικτική εκτίμηση (${vehicle.marketPriceType})` : `Reference ${vehicle.marketPriceType} market estimate`}
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-[var(--color-accent-text)] font-semibold">
                    {isGreek ? 'Στόχος «Καλής Αγοράς»' : 'Good-Buy Target'}
                  </span>
                  <div className="text-lg font-extrabold text-[var(--color-accent-text)] mt-0.5">
                    {isGreek ? 'Έως' : 'Up to'} {formatPrice(vehicle.goodBuyPrice, currency)}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {isGreek ? 'Στόχος αξίας για καλή κατάσταση και χιλιόμετρα' : 'Value target for condition & mileage'}
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-[var(--color-success)] font-semibold">
                    {isGreek ? 'Εξαιρετικός Στόχος' : 'Excellent-Buy Target'}
                  </span>
                  <div className="text-lg font-extrabold text-[var(--color-success)] mt-0.5">
                    {isGreek ? 'Έως' : 'Up to'} {formatPrice(vehicle.excellentBuyPrice, currency)}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {isGreek ? 'Χαμηλότερα από το ενδεικτικό εύρος' : 'Below the reference market range'}
                  </p>
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div>
                <h4 className="text-[15px] font-bold text-[var(--color-text)] uppercase tracking-wider mb-3">
                  {isGreek ? 'Βασικά Τεχνικά Χαρακτηριστικά' : 'Key Technical Specifications'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
                  <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <span className="text-[var(--color-text-muted)] font-medium">{isGreek ? 'Ισχύς & Κινητήρας' : 'Power & Engine'}</span>
                    <div className="font-bold text-[var(--color-text)] mt-1 text-[15px]">
                      {vehicle.horsepower} hp
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">{vehicle.fuelType}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <span className="text-[var(--color-text-muted)] font-medium">0–100 km/h (62 mph)</span>
                    <div className="font-bold text-[var(--color-text)] mt-1 text-[15px]">
                      {vehicle.acceleration0to100} {isGreek ? 'δευτ.' : 'seconds'}
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">{vehicle.drivetrain} · {isGreek ? 'κίνηση' : 'drivetrain'}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <span className="text-[var(--color-text-muted)] font-medium">{isGreek ? 'Κατανάλωση Καυσίμου / Ενέργειας' : 'Fuel / Energy Economy'}</span>
                    <div className="font-bold text-[var(--color-text)] mt-1 text-[15px]">
                      {vehicle.fuelEconomy}
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">{isGreek ? 'Ενδεικτική πραγματική κατανάλωση' : 'Reference real-world average'}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
                    <span className="text-[var(--color-text-muted)] font-medium">{isGreek ? 'Πορτμπαγκάζ & Θέσεις' : 'Boot & Seating'}</span>
                    <div className="font-bold text-white mt-1 text-[15px]">
                      {vehicle.cargoCapacityLiters} L · {vehicle.seats} {isGreek ? 'θέσεις' : 'seats'}
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">{isGreek ? 'Μέγιστο' : 'Max'} {vehicle.maxCargoCapacityLiters || 1200} L {isGreek ? 'με αναδίπλωση' : 'folded'}</span>
                  </div>
                </div>

                {/* Greek Market Specific Specs Banner */}
                {isGreek && (
                  <div className="mt-4 p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                    <div>
                      <span className="text-[var(--color-text-muted)] uppercase font-bold text-[10px] tracking-[1.1px]">
                        Τέλη Κυκλοφορίας (Ελλάδα)
                      </span>
                      <div className="text-[15px] font-extrabold text-[var(--color-accent-text)] mt-0.5">
                        {vehicle.greekRoadTaxEur === 0 ? '0€ / Έτος (Απαλλαγή)' : `${vehicle.greekRoadTaxEur}€ / Έτος`}
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">Βάσει CO2 / κυβικών</span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] uppercase font-bold text-[10px] tracking-[1.1px]">
                        Πράσινος Δακτύλιος Αθηνών
                      </span>
                      <div className="text-[15px] font-extrabold text-white mt-0.5">
                        {vehicle.athensRingExempt ? '✓ Ελεύθερη Είσοδος Καθημερινά' : 'Μονά / Ζυγά'}
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">Κυκλοφορία στο κέντρο</span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] uppercase font-bold text-[10px] tracking-[1.1px]">
                        Κυβισμός & Τεκμήριο
                      </span>
                      <div className="text-[15px] font-extrabold text-white mt-0.5">
                        {vehicle.engineDisplacementCc ? `${vehicle.engineDisplacementCc} cc` : 'Ηλεκτρικό'}
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">Ετήσια φορολογική κλίμακα</span>
                    </div>
                  </div>
                )}
              </div>

              {/* {isGreek ? 'Ταιριάζει Καλύτερα Σε' : 'Best For'} vs {isGreek ? 'Λιγότερο Κατάλληλο Για' : 'Not Ideal For'} */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 text-[var(--color-success)] font-bold text-[13px] uppercase tracking-wider mb-2.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isGreek ? 'Ταιριάζει Καλύτερα Σε' : 'Best For'}</span>
                  </div>
                  <ul className="space-y-1.5 text-[13px] text-[var(--color-text)]">
                    {vehicle.bestFor.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[var(--color-success)] font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 text-[var(--color-danger)] font-bold text-[13px] uppercase tracking-wider mb-2.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{isGreek ? 'Λιγότερο Κατάλληλο Για' : 'Not Ideal For'}</span>
                  </div>
                  <ul className="space-y-1.5 text-[13px] text-[var(--color-text)]">
                    {vehicle.notIdealFor.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[var(--color-danger)] font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h5 className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    {isGreek ? 'Κύρια Πλεονεκτήματα' : 'Key Strengths'}
                  </h5>
                  <ul className="space-y-2 text-[13px] text-[var(--color-text)]">
                    {vehicle.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[var(--color-success)] font-bold mt-0.5">✓</span>
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    {isGreek ? 'Συμβιβασμοί που Αξίζει να Σκεφτείς' : 'Trade-offs to Consider'}
                  </h5>
                  <ul className="space-y-2 text-[13px] text-[var(--color-text)]">
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
              <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                <h4 className="text-[15px] font-bold text-[var(--color-text)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-success)]" />
                  <span>{isGreek ? `Οδηγός Ελέγχου πριν την Αγορά — ${vehicle.model}` : `Pre-Purchase Inspection Guide for ${vehicle.model}`}</span>
                </h4>
                <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
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
                          ? 'border-[var(--color-success)] bg-[var(--color-surface-subtle)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
                                : 'border-[var(--color-border)] bg-[var(--color-surface-subtle)]'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[13px] sm:text-[15px] text-[var(--color-text)]">
                                {item.component}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${
                                  item.importance === 'Critical'
                                    ? 'text-[var(--color-danger)]'
                                    : item.importance === 'Important'
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-[var(--color-text-muted)]'
                                }`}
                              >
                                {isGreek ? (item.importance === 'Critical' ? 'Κρίσιμο' : item.importance === 'Important' ? 'Σημαντικό' : 'Συμβουλευτικό') : item.importance}
                              </span>
                            </div>
                            <p className="text-[13px] text-[var(--color-text)] mt-1 leading-relaxed">
                              {item.check}
                            </p>
                            <div className="mt-2 text-xs text-[var(--color-success)] font-medium bg-[var(--color-surface-subtle)] px-2 py-1 rounded inline-block">
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
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div className="flex items-center gap-2 text-[var(--color-success)] text-[13px] font-bold uppercase tracking-wider mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{isGreek ? 'Προτεινόμενες Χρονιές' : 'Recommended Model Years'}</span>
                  </div>
                  <div className="text-[15px] font-extrabold text-[var(--color-text)]">
                    {vehicle.recommendedYears}
                  </div>
                  <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
                    {isGreek ? 'Συνήθως καλύτερος συνδυασμός εργοστασιακών βελτιώσεων και απόσβεσης.' : 'Usually the better balance of factory revisions and depreciation.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div className="flex items-center gap-2 text-[var(--color-danger)] text-[13px] font-bold uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{isGreek ? 'Χρονιές ή Εκδόσεις προς Προσοχή' : 'Years or Trims to Avoid'}</span>
                  </div>
                  <div className="text-[15px] font-extrabold text-[var(--color-text)]">
                    {vehicle.yearsToAvoid || (isGreek ? 'Δεν έχουν επισημανθεί συγκεκριμένες χρονιές υψηλού ρίσκου' : 'No high-risk model years identified')}
                  </div>
                  <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
                    {isGreek ? 'Εκδόσεις που χρειάζονται επιπλέον έλεγχο λόγω γνωστών θεμάτων ή χαμηλότερης ζήτησης.' : 'Versions that deserve extra checks because of known issues or weaker demand.'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[15px] font-bold text-[var(--color-text)] uppercase tracking-wider mb-3">
                  {isGreek ? 'Καταγεγραμμένα Γνωστά Θέματα' : 'Documented Community & Fleet Concerns'}
                </h4>
                <div className="space-y-2">
                  {vehicle.knownIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[13px] text-[var(--color-text)] flex items-start gap-3"
                    >
                      <Wrench className="w-4 h-4 text-[var(--color-text-muted)] shrink-0 mt-0.5" />
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
                  <h4 className="text-[15px] font-bold text-[var(--color-text)]">
                    {isGreek ? `Ενδεικτικές Αγγελίες για ${vehicle.make} ${vehicle.model}` : `Reference Listings for ${vehicle.make} ${vehicle.model}`}
                  </h4>
                  <p className="text-[13px] text-[var(--color-text-muted)]">
                    {isGreek ? 'Αποθηκευμένα παραδείγματα για σύγκριση με το ενδεικτικό εύρος τιμής' : 'Saved listing examples compared with the reference market range'}
                  </p>
                </div>
              </div>

              {listings.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[var(--color-border)] rounded-2xl">
                  <p className="text-[13px] text-[var(--color-text-muted)]">
                    {isGreek ? 'Δεν υπάρχουν αποθηκευμένα παραδείγματα για αυτή την έκδοση.' : 'No saved listing examples match this exact variant.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {listings.map((l) => (
                    <div
                      key={l.id}
                      className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`text-[13px] font-bold uppercase tracking-wider ${
                              l.dealRating === 'Excellent Price'
                                ? 'text-teal-600 dark:text-teal-400'
                                : l.dealRating === 'Good Price'
                                ? 'text-[var(--color-success)]'
                                : 'text-[var(--color-text-muted)]'
                            }`}
                          >
                            {isGreek ? (l.dealRating === 'Excellent Price' ? 'Εξαιρετική τιμή' : l.dealRating === 'Good Price' ? 'Καλή τιμή' : l.dealRating === 'Fair Price' ? 'Δίκαιη τιμή' : 'Πάνω από αγορά') : l.dealRating}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">{isGreek ? 'αποθηκευμένο δείγμα' : 'saved snapshot'}</span>
                        </div>

                        <h5 className="font-bold text-[15px] text-[var(--color-text)] leading-snug">
                          {l.title}
                        </h5>

                        <div className="text-[13px] text-[var(--color-text-muted)] mt-1">
                          {l.year} · {l.mileageKm.toLocaleString()} km · {l.transmission} · {l.location}
                        </div>

                        <div className="mt-2 text-base font-extrabold text-[var(--color-text)]">
                          {formatPrice(l.price, currency)}
                        </div>

                        <p className="text-[13px] text-[var(--color-text-muted)] mt-2 italic bg-[var(--color-surface-subtle)] p-2.5 rounded-lg border border-[var(--color-border)]">
                          "{l.dealExplanation}"
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[13px]">
                        <span className="text-[var(--color-text-muted)] font-medium">{isGreek ? 'Δείγμα αγοράς' : 'Market sample'}</span>
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
