import React, { useState } from 'react';
import { MarketplaceListing, Currency, Vehicle } from '../types';
import { formatPrice } from '../services/currency';
import { MARKETPLACE_LISTINGS } from '../data/listings';
import { VEHICLES } from '../data/vehicles';
import {
  Tag,
  MapPin,
  Calendar,
  Gauge,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';

interface MarketplaceListingsProps {
  currency: Currency;
  onOpenVehicleDetails: (vehicle: Vehicle) => void;
  savedListingIds: string[];
  onToggleSaveListing: (listingId: string) => void;
  filterVehicleId?: string;
  onClearVehicleFilter?: () => void;
}

export const MarketplaceListings: React.FC<MarketplaceListingsProps> = ({
  currency,
  onOpenVehicleDetails,
  savedListingIds,
  onToggleSaveListing,
  filterVehicleId,
  onClearVehicleFilter
}) => {
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeller, setSelectedSeller] = useState<'all' | 'dealer' | 'private'>('all');

  const filteredListings = MARKETPLACE_LISTINGS.filter((l) => {
    if (filterVehicleId && l.vehicleId !== filterVehicleId) return false;
    if (selectedRating !== 'all' && l.dealRating !== selectedRating) return false;
    if (selectedSeller === 'dealer' && l.sellerType !== 'Verified Dealer') return false;
    if (selectedSeller === 'private' && l.sellerType !== 'Private Seller') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.sellerName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getTargetVehicle = (vehicleId: string) => {
    return VEHICLES.find((v) => v.id === vehicleId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Available Cars & Market Listings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real marketplace listings with automated Deal Rating analysis compared against typical market values
          </p>
        </div>

        {filterVehicleId && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
            <span>Filtered for this vehicle</span>
            <button
              onClick={onClearVehicleFilter}
              className="font-bold underline hover:text-emerald-950 cursor-pointer"
            >
              Show all
            </button>
          </div>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="mb-6 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location, or dealer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Rating filter */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-0.5 text-xs">
            {['all', 'Excellent Price', 'Good Price'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRating(r)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedRating === r
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {r === 'all' ? 'All Deals' : r}
              </button>
            ))}
          </div>

          {/* Seller filter */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-0.5 text-xs">
            {[
              { id: 'all', label: 'All Sellers' },
              { id: 'dealer', label: 'Verified Dealers' },
              { id: 'private', label: 'Private Sellers' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSeller(s.id as any)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedSeller === s.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => {
          const targetVehicle = getTargetVehicle(listing.vehicleId);
          const isSaved = savedListingIds.includes(listing.id);

          return (
            <div
              key={listing.id}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Deal rating badge */}
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                    <span
                      className={
                        listing.dealRating === 'Excellent Price'
                          ? 'text-teal-400'
                          : listing.dealRating === 'Good Price'
                          ? 'text-emerald-400'
                          : 'text-slate-300'
                      }
                    >
                      {listing.dealRating}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => onToggleSaveListing(listing.id)}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white'
                    }`}
                    title={isSaved ? 'Saved in Garage' : 'Save listing'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-3 text-white text-xs font-medium">
                    {listing.sellerType} · {listing.sellerName}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>{listing.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{listing.mileageKm.toLocaleString()} km</span>
                    <span aria-hidden="true">·</span>
                    <span>{listing.transmission}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {listing.title}
                  </h3>

                  <div className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                    {formatPrice(listing.price, currency)}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{listing.location}</span>
                  </div>

                  {/* Deal Explanation */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{listing.dealExplanation}"
                  </div>

                  {/* Equipment Preview */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {listing.keyEquipment.slice(0, 3).map((eq, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex flex-wrap items-center gap-2">
                {targetVehicle && (
                  <button
                    onClick={() => onOpenVehicleDetails(targetVehicle)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Car Model Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {listing.carGrDirectUrl && (
                  <a
                    href={listing.carGrDirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-xs font-semibold transition-colors"
                  >
                    <span>Car.gr {listing.carGrClassifiedId || 'Αγγελία'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
