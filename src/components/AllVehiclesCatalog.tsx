import React, { useState } from 'react';
import { Vehicle, Currency, BodyStyle, FuelType } from '../types';
import { VEHICLES } from '../data/vehicles';
import { formatPrice, formatPriceRange } from '../services/currency';
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Scale,
  Bookmark,
  ShieldCheck,
  Check
} from 'lucide-react';
import { GET_LISTINGS_FOR_VEHICLE } from '../data/listings';

interface AllVehiclesCatalogProps {
  currency: Currency;
  onOpenDetails: (vehicle: Vehicle) => void;
  onToggleCompare: (vehicleId: string) => void;
  comparedIds: string[];
  onToggleSave: (vehicleId: string) => void;
  savedIds: string[];
  onViewListings: (vehicleId: string) => void;
}

export const AllVehiclesCatalog: React.FC<AllVehiclesCatalogProps> = ({
  currency,
  onOpenDetails,
  onToggleCompare,
  comparedIds,
  onToggleSave,
  savedIds,
  onViewListings
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBody, setSelectedBody] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'reliability' | 'power'>('reliability');

  const bodyStyles = ['Hatchback', 'Estate / Wagon', 'Compact SUV', 'Mid-size SUV', 'Large SUV', 'City car', 'Sedan', 'Crossover'];
  const fuelTypes = ['Hybrid', 'Petrol', 'Electric', 'Diesel', 'Plug-in Hybrid'];

  const filteredVehicles = VEHICLES.filter((v) => {
    if (selectedBody !== 'all' && v.bodyStyle !== selectedBody) return false;
    if (selectedFuel !== 'all' && v.fuelType !== selectedFuel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.engineSummary.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.typicalPriceMin - b.typicalPriceMin;
    if (sortBy === 'price-desc') return b.typicalPriceMax - a.typicalPriceMax;
    if (sortBy === 'power') return b.horsepower - a.horsepower;
    return b.reliabilityRating - a.reliabilityRating;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Comprehensive Vehicle Catalog
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore all analyzed vehicles with verified price ranges, reliability ratings, and pre-purchase checklists
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search make or model (e.g. Toyota, Octavia, Tesla)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Body selector */}
          <select
            value={selectedBody}
            onChange={(e) => setSelectedBody(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Body Styles</option>
            {bodyStyles.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Fuel selector */}
          <select
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Powertrains</option>
            {fuelTypes.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="reliability">Highest Reliability</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="power">Most Horsepower</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => {
          const isCompared = comparedIds.includes(vehicle.id);
          const isSaved = savedIds.includes(vehicle.id);
          const listingCount = GET_LISTINGS_FOR_VEHICLE(vehicle.id).length;

          return (
            <div
              key={vehicle.id}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.model}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 left-3 text-white text-xs font-medium">
                    {vehicle.generation} · {vehicle.years}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleCompare(vehicle.id)}
                      className={`p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                        isCompared
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-900/80 text-slate-300 hover:text-white'
                      }`}
                      title="Compare"
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleSave(vehicle.id)}
                      className={`p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-900/80 text-slate-300 hover:text-white'
                      }`}
                      title="Save to garage"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
                    <span>{vehicle.bodyStyle}</span>
                    <span aria-hidden="true">·</span>
                    <span>{vehicle.fuelType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{vehicle.drivetrain}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {vehicle.make} {vehicle.model}
                  </h3>

                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                        Typical Price
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {formatPriceRange(vehicle.typicalPriceMin, vehicle.typicalPriceMax, currency)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 block">
                        Good Buy
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        Under {formatPrice(vehicle.goodBuyPrice, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500">Power</span>
                      <div className="font-bold text-slate-900 dark:text-white">{vehicle.horsepower} hp</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Reliability</span>
                      <div className="font-bold text-slate-900 dark:text-white">{vehicle.reliabilityRating}/5</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Boot</span>
                      <div className="font-bold text-slate-900 dark:text-white">{vehicle.cargoCapacityLiters}L</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenDetails(vehicle)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Full Model Guide & Checks</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {listingCount > 0 && (
                  <button
                    onClick={() => onViewListings(vehicle.id)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-500 cursor-pointer"
                  >
                    {listingCount} Listing{listingCount > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
