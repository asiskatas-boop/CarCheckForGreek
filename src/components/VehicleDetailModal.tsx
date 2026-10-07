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

  const toggleChecklistItem = (comp: string) => {
    setCheckedChecklistItems((prev) => ({
      ...prev,
      [comp]: !prev[comp]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
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
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Title Overlay */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#2997ff] mb-1">
                <span>{vehicle.generation}</span>
                <span aria-hidden="true">·</span>
                <span>{vehicle.years}</span>
                <span aria-hidden="true">·</span>
                <span>{vehicle.bodyStyle}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.28px]">
                {vehicle.make} {vehicle.model}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleCompare(vehicle.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isCompared
                    ? 'bg-[#0066cc] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isCompared ? 'Compared' : 'Compare'}</span>
              </button>

              <button
                onClick={() => onToggleSave(vehicle.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-[#0066cc] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isSaved ? 'In Garage' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-5 border-b border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center gap-2 sm:gap-4 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: 'Overview & Specs' },
            { id: 'inspection', label: `Inspection Checklist (${vehicle.inspectionChecklist.length})` },
            { id: 'issues', label: 'Known Issues & Years to Avoid' },
            { id: 'listings', label: `Available Cars (${listings.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#0066cc] text-[#0066cc] dark:text-[#2997ff]'
                  : 'border-transparent text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Tab Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Car.gr Live Greek Benchmark Strip */}
              {isGreek && (
                <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#272729] border border-[#e5e5ea] dark:border-[#38383a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1d1d1f] dark:text-white">Car.gr Live Market Data</span>
                      {vehicle.carGrClassifiedCount && (
                        <span className="text-xs font-medium text-[#0066cc] dark:text-[#2997ff] bg-[#0066cc]/10 dark:bg-[#0066cc]/20 px-2 py-0.5 rounded-full">
                          {vehicle.carGrClassifiedCount}
                        </span>
                      )}
                    </div>
                    {vehicle.carGrPriceBenchmark && (
                      <div className="text-xs text-[#86868b] mt-1">
                        Τρέχον εύρος τιμών αγοράς στην Ελλάδα: <strong className="text-[#1d1d1f] dark:text-white">{vehicle.carGrPriceBenchmark}</strong>
                      </div>
                    )}
                  </div>
                  <a
                    href={vehicle.carGrSearchUrl || 'https://www.car.gr'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-[#0066cc] hover:bg-[#0071e3] text-white transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Άνοιγμα αγγελιών στο Car.gr</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Pricing Intelligence Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#272729] border border-[#e5e5ea] dark:border-[#38383a]">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">
                    Typical Market Price
                  </span>
                  <div className="text-lg font-bold text-[#1d1d1f] dark:text-white mt-0.5">
                    {formatPriceRange(vehicle.typicalPriceMin, vehicle.typicalPriceMax, currency)}
                  </div>
                  <p className="text-[11px] text-[#86868b] mt-0.5">
                    Verified {vehicle.marketPriceType} market estimate
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#0066cc] dark:text-[#2997ff] font-semibold">
                    "Good Buy" Threshold
                  </span>
                  <div className="text-lg font-extrabold text-[#0066cc] dark:text-[#2997ff] mt-0.5">
                    Under {formatPrice(vehicle.goodBuyPrice, currency)}
                  </div>
                  <p className="text-[11px] text-[#86868b] mt-0.5">
                    Solid value for condition & mileage
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#03904a] font-semibold">
                    "Excellent Buy"
                  </span>
                  <div className="text-lg font-extrabold text-[#03904a] mt-0.5">
                    Under {formatPrice(vehicle.excellentBuyPrice, currency)}
                  </div>
                  <p className="text-[11px] text-[#86868b] mt-0.5">
                    Below market average bargain
                  </p>
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Key Technical Specifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <span className="text-slate-500 font-medium">Power & Engine</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                      {vehicle.horsepower} hp
                    </div>
                    <span className="text-[11px] text-slate-500">{vehicle.fuelType}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <span className="text-slate-500 font-medium">0–100 km/h (62 mph)</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                      {vehicle.acceleration0to100} seconds
                    </div>
                    <span className="text-[11px] text-slate-500">{vehicle.drivetrain} Drivetrain</span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <span className="text-slate-500 font-medium">Fuel / Energy Economy</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                      {vehicle.fuelEconomy}
                    </div>
                    <span className="text-[11px] text-slate-500">Real-world average</span>
                  </div>

                  <div className="p-3 rounded-none border border-[#303030] bg-[#242424]">
                    <span className="text-[#969696] font-medium">Boot & Seating</span>
                    <div className="font-bold text-white mt-1 text-sm">
                      {vehicle.cargoCapacityLiters} L ({vehicle.seats} Seats)
                    </div>
                    <span className="text-[11px] text-[#969696]">Max {vehicle.maxCargoCapacityLiters || 1200}L folded</span>
                  </div>
                </div>

                {/* Greek Market Specific Specs Banner */}
                {isGreek && (
                  <div className="mt-4 p-4 rounded-none bg-[#181818] border border-[#303030] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[#969696] uppercase font-bold text-[10px] tracking-[1.1px]">
                        Τέλη Κυκλοφορίας (Ελλάδα)
                      </span>
                      <div className="text-sm font-extrabold text-[#da291c] mt-0.5">
                        {vehicle.greekRoadTaxEur === 0 ? '0€ / Έτος (Απαλλαγή)' : `${vehicle.greekRoadTaxEur}€ / Έτος`}
                      </div>
                      <span className="text-[11px] text-[#969696]">Βάσει CO2 / κυβικών</span>
                    </div>

                    <div>
                      <span className="text-[#969696] uppercase font-bold text-[10px] tracking-[1.1px]">
                        Πράσινος Δακτύλιος Αθηνών
                      </span>
                      <div className="text-sm font-extrabold text-white mt-0.5">
                        {vehicle.athensRingExempt ? '✓ Ελεύθερη Είσοδος Καθημερινά' : 'Μονά / Ζυγά'}
                      </div>
                      <span className="text-[11px] text-[#969696]">Κυκλοφορία στο κέντρο</span>
                    </div>

                    <div>
                      <span className="text-[#969696] uppercase font-bold text-[10px] tracking-[1.1px]">
                        Κυβισμός & Τεκμήριο
                      </span>
                      <div className="text-sm font-extrabold text-white mt-0.5">
                        {vehicle.engineDisplacementCc ? `${vehicle.engineDisplacementCc} cc` : 'Ηλεκτρικό'}
                      </div>
                      <span className="text-[11px] text-[#969696]">Ετήσια φορολογική κλίμακα</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Best For vs Not Ideal For */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Best For</span>
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
                    <span>Not Ideal For</span>
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
                    Key Strengths
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
                    Trade-offs to Consider
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
                  <span>Pre-Purchase Inspection Guide for {vehicle.model}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Use this interactive checklist when viewing or test driving a used model. Tap each item
                  as you verify it with the seller or test drive.
                </p>
              </div>

              <div className="space-y-3">
                {vehicle.inspectionChecklist.map((item, idx) => {
                  const isChecked = !!checkedChecklistItems[item.component];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleChecklistItem(item.component)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
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
                                {item.importance}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                              {item.check}
                            </p>
                            <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded inline-block">
                              Advisor tip: {item.tip}
                            </div>
                          </div>
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
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Recommended Model Years</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {vehicle.recommendedYears}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Sweet spot with factory revisions and lower depreciation risk.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Years or Trims to Avoid</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {vehicle.yearsToAvoid || 'No high-risk model years identified'}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Versions with known early gremlins or poor resale demand.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Documented Community & Fleet Concerns
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
                    Verified Listings for {vehicle.make} {vehicle.model}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real marketplace price intelligence compared to typical market value
                  </p>
                </div>
              </div>

              {listings.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                  <p className="text-xs text-slate-500">
                    No active listings matching this exact variant today. Check back tomorrow!
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
                            {l.dealRating}
                          </span>
                          <span className="text-[11px] text-slate-400">{l.publishedDate}</span>
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
                          className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          View Listing →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
