import React from 'react';
import {
  ScoredRecommendation,
  Currency,
  Vehicle,
  MarketRegion
} from '../types';
import { formatPrice, formatPriceRange } from '../services/currency';
import {
  Bookmark,
  Scale,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

interface VehicleCardProps {
  recommendation: ScoredRecommendation;
  currency: Currency;
  marketRegion?: MarketRegion;
  onOpenDetails: (vehicle: Vehicle) => void;
  onToggleCompare: (vehicleId: string) => void;
  isCompared: boolean;
  onToggleSave: (vehicleId: string) => void;
  isSaved: boolean;
  onViewListings: (vehicleId: string) => void;
  listingCount: number;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  recommendation,
  currency,
  marketRegion = 'global',
  onOpenDetails,
  onToggleCompare,
  isCompared,
  onToggleSave,
  isSaved,
  onViewListings,
  listingCount
}) => {
  const isGreek = marketRegion === 'greece';
  const { vehicle, matchScore, category, personalizedReason } = recommendation;

  return (
    <div className="group rounded-[18px] border border-[#e5e5ea] dark:border-[#2d2d30] bg-white dark:bg-[#1d1d1f] overflow-hidden transition-all duration-300 flex flex-col justify-between hover:border-[#0066cc]/40 dark:hover:border-[#0066cc]/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      <div>
        {/* Image & Quick Action Header */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5f5f7] dark:bg-[#121214]">
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Editorial Category Pill Tag */}
          {category && (
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-[#1d1d1f] dark:text-white rounded-full shadow-xs border border-black/5 dark:border-white/10">
              <span className={category === 'Best Overall' ? 'text-[#0066cc] font-bold' : ''}>
                {category}
              </span>
            </div>
          )}

          {/* Match Score Capsule */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-md border border-black/5 dark:border-white/10 px-2.5 py-1 flex items-center gap-1.5 rounded-full shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-[#86868b] tracking-wider">
              Match
            </span>
            <span className="text-xs font-bold text-[#0066cc] dark:text-[#2997ff]">
              {matchScore}%
            </span>
          </div>

          {/* Quick Floating Actions (Save & Compare) */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <button
              onClick={() => onToggleCompare(vehicle.id)}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isCompared
                  ? 'bg-[#0066cc] text-white'
                  : 'bg-white/80 dark:bg-[#1d1d1f]/80 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Compare side by side'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onToggleSave(vehicle.id)}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#0066cc] text-white'
                  : 'bg-white/80 dark:bg-[#1d1d1f]/80 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
              title={isSaved ? 'Saved to Garage' : 'Save to Garage'}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Caption */}
          <div className="absolute bottom-3 left-3 text-white">
            <div className="text-xs font-medium text-white/90 drop-shadow-sm">
              {vehicle.generation} · {vehicle.years}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Metadata Specs Header */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#86868b] mb-1 font-medium">
            <span>{vehicle.bodyStyle}</span>
            <span aria-hidden="true">·</span>
            <span>{vehicle.fuelType}</span>
            <span aria-hidden="true">·</span>
            <span>{vehicle.transmission}</span>
            {vehicle.engineDisplacementCc && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#1d1d1f] dark:text-white font-semibold">{vehicle.engineDisplacementCc} cc</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-[-0.28px]">
            {vehicle.make} {vehicle.model}
          </h3>

          {/* Greek Market Badges */}
          {isGreek && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium">
              {vehicle.greekRoadTaxEur === 0 ? (
                <span className="text-[#03904a] bg-[#03904a]/10 dark:bg-[#03904a]/20 px-2 py-0.5 rounded-full font-semibold">
                  ✓ 0€ Τέλη Κυκλοφορίας
                </span>
              ) : vehicle.greekRoadTaxEur ? (
                <span className="text-[#86868b] bg-[#f5f5f7] dark:bg-[#272729] px-2 py-0.5 rounded-full">
                  Τέλη: {vehicle.greekRoadTaxEur}€/έτος
                </span>
              ) : null}

              {vehicle.athensRingExempt && (
                <span className="text-[#0066cc] dark:text-[#2997ff] bg-[#0066cc]/10 dark:bg-[#0066cc]/20 px-2 py-0.5 rounded-full font-semibold">
                  ✓ Ελεύθερος Δακτύλιος
                </span>
              )}

              {vehicle.carGrClassifiedCount && (
                <a
                  href={vehicle.carGrSearchUrl || 'https://www.car.gr'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0066cc] dark:text-[#2997ff] hover:bg-[#0066cc]/15 flex items-center gap-1 bg-[#0066cc]/10 dark:bg-[#0066cc]/20 px-2 py-0.5 rounded-full transition-colors font-semibold"
                  title="Δες τις τρέχουσες αγγελίες στο Car.gr"
                >
                  <span>{vehicle.carGrClassifiedCount}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          )}

          {/* Recommended Engine */}
          <p className="text-xs text-[#86868b] mt-2.5 leading-relaxed">
            Powertrain: <span className="text-[#1d1d1f] dark:text-white font-medium">{vehicle.recommendedPowertrain}</span>
          </p>

          {/* Pricing Grid */}
          <div className="mt-3.5 p-3.5 rounded-[12px] bg-[#f5f5f7] dark:bg-[#272729]">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#86868b] font-semibold">
                  {isGreek ? 'ΜΕΣΗ ΤΙΜΗ ΑΓΟΡΑΣ' : 'TYPICAL MARKET'}
                </span>
                <div className="text-sm font-bold text-[#1d1d1f] dark:text-white mt-0.5">
                  {formatPriceRange(vehicle.typicalPriceMin, vehicle.typicalPriceMax, currency)}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#0066cc] dark:text-[#2997ff] font-semibold">
                  {isGreek ? 'ΣΤΟΧΟΣ GOOD BUY' : 'GOOD BUY TARGET'}
                </span>
                <div className="text-sm font-extrabold text-[#0066cc] dark:text-[#2997ff] mt-0.5">
                  Under {formatPrice(vehicle.goodBuyPrice, currency)}
                </div>
              </div>
            </div>
            {vehicle.carGrPriceBenchmark && isGreek && (
              <div className="mt-1.5 pt-1.5 border-t border-[#e5e5ea] dark:border-[#38383a] text-[10px] text-[#86868b] flex items-center justify-between">
                <span>Έρευνα Car.gr:</span>
                <span className="font-semibold text-[#1d1d1f] dark:text-[#e5e5ea]">{vehicle.carGrPriceBenchmark}</span>
              </div>
            )}
          </div>

          {/* Key Indicators Bar */}
          <div className="mt-3.5 grid grid-cols-4 gap-2 text-center text-xs py-2 border-y border-[#e5e5ea] dark:border-[#2d2d30]">
            <div>
              <div className="text-[10px] text-[#86868b] uppercase font-semibold">Reliability</div>
              <div className="font-bold text-[#1d1d1f] dark:text-white mt-0.5">
                {vehicle.reliabilityRating}/5
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#86868b] uppercase font-semibold">Cost Level</div>
              <div className="font-bold text-[#1d1d1f] dark:text-white mt-0.5">
                {vehicle.runningCostLevel}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#86868b] uppercase font-semibold">Economy</div>
              <div className="font-bold text-[#1d1d1f] dark:text-white mt-0.5 truncate" title={vehicle.fuelEconomy}>
                {vehicle.fuelEconomy.split('(')[0].trim()}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#86868b] uppercase font-semibold">Boot</div>
              <div className="font-bold text-[#1d1d1f] dark:text-white mt-0.5">
                {vehicle.cargoCapacityLiters} L
              </div>
            </div>
          </div>

          {/* Why CarCheck Recommends It - A lot shorter text as requested */}
          <div className="mt-3.5 pt-2.5">
            <div className="text-[11px] font-semibold text-[#0066cc] dark:text-[#2997ff] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>{isGreek ? 'Γιατι το προτεινει το CarCheck:' : 'Why CarCheck recommends it:'}</span>
            </div>
            <p className="text-[13px] text-[#1d1d1f] dark:text-[#e5e5ea] font-medium leading-relaxed">
              {personalizedReason}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 pt-0 mt-2 flex items-center gap-2">
        <button
          onClick={() => onOpenDetails(vehicle)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] active:scale-95 text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs"
        >
          <span>{isGreek ? 'Οδηγός & Έλεγχος ΚΤΕΟ' : 'View Specs & Checks'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {listingCount > 0 && (
          <button
            onClick={() => onViewListings(vehicle.id)}
            className="px-4 py-2.5 rounded-full border border-[#0066cc] hover:bg-[#0066cc]/10 text-xs font-semibold text-[#0066cc] dark:text-[#2997ff] transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="View verified marketplace listings for this model"
          >
            {listingCount} {isGreek ? 'Αγγελίες' : 'Listings'}
          </button>
        )}
      </div>
    </div>
  );
};
