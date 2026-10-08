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
import { loadBooleanRecord, safeSetItem } from '../services/storage';
import { bodyLabel, dealRatingLabel, drivetrainLabel, formatNumber, fuelLabel, transmissionLabel } from '../services/format';

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
  // Checklist progress is kept per vehicle so it survives closing the modal mid-inspection.
  const checklistKey = `carcheck_checklist_${vehicle?.id ?? 'none'}`;
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<Record<string, boolean>>(() => loadBooleanRecord(checklistKey));

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
    setCheckedChecklistItems((prev) => {
      const updated = { ...prev, [comp]: !prev[comp] };
      safeSetItem(checklistKey, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AccessibleDialog
      open={Boolean(vehicle)}
      onClose={onClose}
      labelledBy="vehicle-detail-title"
      overlayClassName="flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      panelClassName="relative w-full max-w-4xl bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-xl overflow-hidden my-auto max-h-[92dvh] flex flex-col"
    >
        {/* Vehicle image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-[var(--color-image-fallback)]">
          <VehicleImage vehicle={vehicle} alt={`${vehicle.make} ${vehicle.model}`} marketRegion={marketRegion} eager showReferenceLabel className="object-center" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 touch-target rounded-full flex items-center justify-center bg-[rgba(255,253,249,0.92)] hover:bg-[var(--color-surface-raised)] text-[var(--color-text)] transition-colors cursor-pointer border border-white/80 backdrop-blur-md shadow-sm"
            aria-label={isGreek ? 'Κλείσιμο λεπτομερειών οχήματος' : 'Close vehicle details'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Apple-style title and actions live on a calm surface, not over the photo. */}
        <div className="px-5 sm:px-7 py-5 sm:py-6 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-[var(--color-text-muted)] mb-1.5">
              <span>{vehicle.generation}</span>
              <span aria-hidden="true">·</span>
              <span>{vehicle.years}</span>
              <span aria-hidden="true">·</span>
              <span>{bodyLabel(vehicle.bodyStyle, marketRegion)}</span>
            </div>
            <h2 id="vehicle-detail-title" className="text-2xl sm:text-4xl font-semibold text-[var(--color-text)] tracking-tight">
              {vehicle.make} {vehicle.model}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleCompare(vehicle.id)}
              aria-pressed={isCompared}
              className={`min-h-11 px-4 rounded-full text-[14px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isCompared
                  ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isGreek ? 'Σύγκριση' : 'Compare'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleSave(vehicle.id)}
              aria-pressed={isSaved}
              className={`min-h-11 px-4 rounded-full text-[14px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isSaved
                  ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isGreek ? 'Αποθήκευση' : 'Save'}</span>
            </button>
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
              aria-controls={activeTab === tab.id ? `vehicle-panel-${tab.id}` : undefined}
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
        <div id={`vehicle-panel-${activeTab}`} role="tabpanel" aria-labelledby={`vehicle-tab-${activeTab}`} tabIndex={0} className="p-5 sm:p-7 overflow-y-auto overscroll-contain space-y-6">
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
                  <a href={vehicle.carGrSearchUrl} target="_blank" rel="noreferrer" className="min-h-11 px-4 rounded-full text-[13px] font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-colors flex items-center justify-center gap-1.5 shrink-0">
                    <span>Άνοιγμα <span translate="no">Car.gr</span></span><span className="sr-only"> (ανοίγει σε νέα καρτέλα)</span><ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
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
                  <div className="text-lg font-semibold text-[var(--color-accent-text)] mt-0.5">
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
                  <div className="text-lg font-semibold text-[var(--color-success)] mt-0.5">
                    {isGreek ? 'Έως' : 'Up to'} {formatPrice(vehicle.excellentBuyPrice, currency)}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {isGreek ? 'Χαμηλότερα από το ενδεικτικό εύρος' : 'Below the reference market range'}
                  </p>
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div>
                <h3 className="text-[15px] font-bold text-[var(--color-text)] uppercase tracking-wider mb-3">
                  {isGreek ? 'Βασικά Τεχνικά Χαρακτηριστικά' : 'Key Technical Specifications'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
                  <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <span className="text-[var(--color-text-muted)] font-medium">{isGreek ? 'Ισχύς & Κινητήρας' : 'Power & Engine'}</span>
                    <div className="font-bold text-[var(--color-text)] mt-1 text-[15px]">
                      {formatNumber(vehicle.horsepower, marketRegion)} hp
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">{fuelLabel(vehicle.fuelType, marketRegion)}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <span className="text-[var(--color-text-muted)] font-medium">0–100 km/h (62 mph)</span>
                    <div className="font-bold text-[var(--color-text)] mt-1 text-[15px]">
                      {formatNumber(vehicle.acceleration0to100, marketRegion, { maximumFractionDigits: 1 })} {isGreek ? 'δευτ.' : 'seconds'}
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">{drivetrainLabel(vehicle.drivetrain, marketRegion)}{isGreek ? '' : ' drivetrain'}</span>
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
                    <div className="font-semibold text-[var(--color-text)] mt-1 text-[15px]">
                      {formatNumber(vehicle.cargoCapacityLiters, marketRegion)} L · {vehicle.seats} {isGreek ? 'θέσεις' : 'seats'}
                    </div>
                    {vehicle.maxCargoCapacityLiters ? (
                      <span className="text-xs text-[var(--color-text-muted)]">{isGreek ? 'Μέγιστο' : 'Max'} {formatNumber(vehicle.maxCargoCapacityLiters, marketRegion)} L {isGreek ? 'με αναδίπλωση' : 'folded'}</span>
                    ) : (
                      <span className="text-xs text-[var(--color-text-muted)]">{isGreek ? 'Μέγιστος χώρος: χωρίς στοιχεία' : 'Max folded: no data'}</span>
                    )}
                  </div>
                </div>

                {/* Greek Market Specific Specs Banner */}
                {isGreek && (
                  <div className="mt-4 p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                    <div>
                      <span className="text-[var(--color-text-muted)] uppercase font-bold text-xs tracking-wide">
                        Τέλη Κυκλοφορίας (Ελλάδα)
                      </span>
                      <div className="text-[15px] font-semibold text-[var(--color-accent-text)] mt-0.5">
                        {vehicle.greekRoadTaxEur === 0
                          ? '0 € / έτος (απαλλαγή)'
                          : vehicle.greekRoadTaxEur != null
                          ? `${formatNumber(vehicle.greekRoadTaxEur, marketRegion, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} / έτος`
                          : 'Χωρίς στοιχεία'}
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">Βάσει CO₂ / κυβικών</span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] uppercase font-bold text-xs tracking-wide">
                        Πράσινος Δακτύλιος Αθηνών
                      </span>
                      <div className="text-[15px] font-semibold text-[var(--color-text)] mt-0.5">
                        {vehicle.athensRingExempt ? 'Ελεύθερη είσοδος καθημερινά' : 'Μονά / ζυγά'}
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">Κυκλοφορία στο κέντρο</span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] uppercase font-bold text-xs tracking-wide">
                        Κυβισμός & Τεκμήριο
                      </span>
                      <div className="text-[15px] font-semibold text-[var(--color-text)] mt-0.5">
                        {vehicle.engineDisplacementCc
                          ? `${formatNumber(vehicle.engineDisplacementCc, marketRegion)} cc`
                          : vehicle.fuelType === 'Electric'
                          ? 'Ηλεκτρικό'
                          : 'Χωρίς στοιχεία'}
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
                        <span className="text-[var(--color-success)] font-bold mt-0.5" aria-hidden="true">•</span>
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
                        <span className="text-[var(--color-danger)] font-bold mt-0.5" aria-hidden="true">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    {isGreek ? 'Κύρια Πλεονεκτήματα' : 'Key Strengths'}
                  </h4>
                  <ul className="space-y-2 text-[13px] text-[var(--color-text)]">
                    {vehicle.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[var(--color-success)] font-bold mt-0.5" aria-hidden="true">✓</span>
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    {isGreek ? 'Συμβιβασμοί που Αξίζει να Σκεφτείς' : 'Trade-offs to Consider'}
                  </h4>
                  <ul className="space-y-2 text-[13px] text-[var(--color-text)]">
                    {vehicle.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[var(--color-warning)] font-bold mt-0.5" aria-hidden="true">✕</span>
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
                <h3 className="text-[15px] font-bold text-[var(--color-text)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-success)]" />
                  <span>{isGreek ? `Οδηγός Ελέγχου πριν την Αγορά — ${vehicle.model}` : `Pre-Purchase Inspection Guide for ${vehicle.model}`}</span>
                </h3>
                <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
                  {isGreek
                    ? 'Χρησιμοποίησε το checklist κατά την επίσκεψη ή το test drive και σημείωσε όσα επιβεβαιώνεις.'
                    : 'Use this checklist while viewing or test-driving a used car and mark each item as you verify it.'}
                </p>
              </div>

              <div className="space-y-3">
                {vehicle.inspectionChecklist.map((item, idx) => {
                  const isChecked = !!checkedChecklistItems[item.component];
                  const inputId = `checklist-${vehicle.id}-${idx}`;
                  const importance = isGreek
                    ? item.importance === 'Critical' ? 'Κρίσιμο' : item.importance === 'Important' ? 'Σημαντικό' : 'Συμβουλευτικό'
                    : item.importance;
                  return (
                    <div
                      key={item.component}
                      className={`relative w-full p-4 rounded-xl border transition-colors text-left has-[:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] has-[:focus-visible]:[outline-offset:3px] ${
                        isChecked
                          ? 'border-[var(--color-success)] bg-[var(--color-surface-subtle)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleChecklistItem(item.component)}
                          aria-describedby={`${inputId}-check ${inputId}-tip`}
                          className="relative z-10 mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-accent)] focus-visible:outline-none"
                        />
                        <div className="min-w-0">
                          <label htmlFor={inputId} className="flex flex-wrap items-center gap-2 cursor-pointer before:absolute before:inset-0 before:content-['']">
                            <span className="font-bold text-[13px] sm:text-[15px] text-[var(--color-text)]">{item.component}</span>
                            <span
                              className={`text-xs font-bold uppercase tracking-wide ${
                                item.importance === 'Critical'
                                  ? 'text-[var(--color-danger)]'
                                  : item.importance === 'Important'
                                  ? 'text-[var(--color-warning)]'
                                  : 'text-[var(--color-text-muted)]'
                              }`}
                            >
                              {importance}
                            </span>
                          </label>
                          <p id={`${inputId}-check`} className="text-[13px] text-[var(--color-text)] mt-1 leading-relaxed">{item.check}</p>
                          <p id={`${inputId}-tip`} className="mt-2 text-xs text-[var(--color-success)] font-medium bg-[var(--color-surface-subtle)] px-2 py-1 rounded inline-block">
                            {isGreek ? 'Συμβουλή: ' : 'Advisor tip: '}{item.tip}
                          </p>
                        </div>
                      </div>
                    </div>
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
                  <div className="text-[15px] font-semibold text-[var(--color-text)]">
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
                  <div className="text-[15px] font-semibold text-[var(--color-text)]">
                    {vehicle.yearsToAvoid || (isGreek ? 'Δεν έχουν επισημανθεί συγκεκριμένες χρονιές υψηλού ρίσκου' : 'No high-risk model years identified')}
                  </div>
                  <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
                    {isGreek ? 'Εκδόσεις που χρειάζονται επιπλέον έλεγχο λόγω γνωστών θεμάτων ή χαμηλότερης ζήτησης.' : 'Versions that deserve extra checks because of known issues or weaker demand.'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-[15px] font-bold text-[var(--color-text)] uppercase tracking-wider mb-3">
                  {isGreek ? 'Καταγεγραμμένα Γνωστά Θέματα' : 'Documented Community & Fleet Concerns'}
                </h3>
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
                  <h3 className="text-[15px] font-bold text-[var(--color-text)]">
                    {isGreek ? `Ενδεικτικές Αγγελίες για ${vehicle.make} ${vehicle.model}` : `Reference Listings for ${vehicle.make} ${vehicle.model}`}
                  </h3>
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
                      className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`text-[13px] font-bold uppercase tracking-wider ${
                              l.dealRating === 'Excellent Price'
                                ? 'text-[var(--color-success)]'
                                : l.dealRating === 'Good Price'
                                ? 'text-[var(--color-success)]'
                                : 'text-[var(--color-text-muted)]'
                            }`}
                          >
                            {dealRatingLabel(l.dealRating, marketRegion)}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">{isGreek ? 'αποθηκευμένο δείγμα' : 'saved snapshot'}</span>
                        </div>

                        <h4 className="font-bold text-[15px] text-[var(--color-text)] leading-snug">
                          {l.title}
                        </h4>

                        <div className="text-[13px] text-[var(--color-text-muted)] mt-1">
                          {l.year} · {formatNumber(l.mileageKm, marketRegion)} km · {transmissionLabel(l.transmission, marketRegion)} · {l.location}
                        </div>

                        <div className="mt-2 text-base font-semibold text-[var(--color-text)]">
                          {formatPrice(l.price, currency)}
                        </div>

                        <p className="text-[13px] text-[var(--color-text-muted)] mt-2 italic bg-[var(--color-surface-subtle)] p-2.5 rounded-lg border border-[var(--color-border)]">
                          “{l.dealExplanation}”
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[13px]">
                        <span className="text-[var(--color-text-muted)] font-medium">{isGreek ? 'Δείγμα αγοράς' : 'Market sample'}</span>
                        <button
                          type="button"
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
