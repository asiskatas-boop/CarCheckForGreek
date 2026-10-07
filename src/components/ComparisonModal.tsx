import React, { useState, useEffect } from 'react';
import { Vehicle, Currency, UserPreferences } from '../types';
import { formatPrice, formatPriceRange } from '../services/currency';
import {
  X,
  Scale,
  Sparkles,
  Check,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface ComparisonModalProps {
  vehicles: Vehicle[];
  onClose: () => void;
  currency: Currency;
  userPreferences: UserPreferences;
  onRemoveVehicle: (id: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  vehicles,
  onClose,
  currency,
  userPreferences,
  onRemoveVehicle
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<{
    headline?: string;
    tradeOffs?: string[];
    verdict?: string;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  useEffect(() => {
    if (vehicles.length >= 2) {
      fetchAiAdvisory();
    }
  }, [vehicles.map((v) => v.id).join(',')]);

  const fetchAiAdvisory = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/compare-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicles,
          userPreferences
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
      }
    } catch (e) {
      console.warn('AI comparison advisory error:', e);
    } finally {
      setLoadingAi(false);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full text-center">
          <Scale className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Vehicles Selected
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Select up to 3 cars from the recommendation cards or vehicle catalog to compare them side by side.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Side-by-Side Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing {vehicles.length} vehicle{vehicles.length === 1 ? '' : 's'} tailored to your profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-7">
          {/* Top Vehicle Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 overflow-hidden"
              >
                <button
                  onClick={() => onRemoveVehicle(v.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 bg-slate-200 dark:bg-slate-800">
                  <img
                    src={v.imageUrl}
                    alt={v.model}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  {v.generation} · {v.years}
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {v.make} {v.model}
                </h4>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  Good buy: Under {formatPrice(v.goodBuyPrice, currency)}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Criteria Comparison Matrix */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
            {/* Row 1: Typical Price Range */}
            <div className="grid grid-cols-4 p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 font-medium">
              <div className="text-slate-500 font-bold uppercase tracking-wider">Market Price</div>
              {vehicles.map((v) => (
                <div key={v.id} className="font-bold text-slate-900 dark:text-white">
                  {formatPriceRange(v.typicalPriceMin, v.typicalPriceMax, currency)}
                </div>
              ))}
            </div>

            {/* Row 2: Reliability Rating */}
            <div className="grid grid-cols-4 p-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Reliability</div>
              {vehicles.map((v) => (
                <div key={v.id} className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span className={v.reliabilityRating === 5 ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}>
                    {v.reliabilityRating} / 5
                  </span>
                  {v.reliabilityRating === 5 && <span className="text-[10px] text-emerald-600 font-semibold">(Top-tier)</span>}
                </div>
              ))}
            </div>

            {/* Row 3: Fuel Economy & Type */}
            <div className="grid grid-cols-4 p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="text-slate-500 font-medium">Fuel & Consumption</div>
              {vehicles.map((v) => (
                <div key={v.id} className="text-slate-800 dark:text-slate-200 font-medium">
                  <div>{v.fuelType}</div>
                  <div className="text-slate-500 text-[11px]">{v.fuelEconomy}</div>
                </div>
              ))}
            </div>

            {/* Row 4: Power & Acceleration */}
            <div className="grid grid-cols-4 p-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Horsepower & 0–100</div>
              {vehicles.map((v) => (
                <div key={v.id} className="font-medium text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-slate-900 dark:text-white">{v.horsepower} hp</span> · {v.acceleration0to100}s
                </div>
              ))}
            </div>

            {/* Row 5: Boot Space & Practicality */}
            <div className="grid grid-cols-4 p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="text-slate-500 font-medium">Boot Capacity</div>
              {vehicles.map((v) => (
                <div key={v.id} className="font-medium text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-slate-900 dark:text-white">{v.cargoCapacityLiters} Liters</span>
                  <div className="text-[11px] text-slate-500">{v.seats} seats · {v.bodyStyle}</div>
                </div>
              ))}
            </div>

            {/* Row 6: Running Cost Category */}
            <div className="grid grid-cols-4 p-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="text-slate-500 font-medium">Running Cost Level</div>
              {vehicles.map((v) => (
                <div key={v.id} className="font-bold text-slate-900 dark:text-white">
                  {v.runningCostLevel}
                </div>
              ))}
            </div>

            {/* Row 7: Drivetrain & Gearbox */}
            <div className="grid grid-cols-4 p-3.5 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="text-slate-500 font-medium">Transmission & Drivetrain</div>
              {vehicles.map((v) => (
                <div key={v.id} className="text-slate-700 dark:text-slate-300">
                  {v.transmission} · {v.drivetrain}
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Conclusion: "Which one should you choose?" */}
          <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Which one should you choose?</span>
              </div>
              {loadingAi && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
            </div>

            {aiAnalysis ? (
              <div className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                {aiAnalysis.headline && (
                  <p className="font-bold text-slate-900 dark:text-white leading-snug">
                    {aiAnalysis.headline}
                  </p>
                )}

                {aiAnalysis.tradeOffs && (
                  <ul className="space-y-1.5 pl-2">
                    {aiAnalysis.tradeOffs.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {aiAnalysis.verdict && (
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-emerald-500/20 text-xs sm:text-sm font-medium leading-relaxed">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Advisor Verdict: </span>
                    {aiAnalysis.verdict}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <p>
                  Because you prioritized {userPreferences.priorities.join(' & ') || 'value'}, the decision
                  hinges on your daily routine. If you do frequent stop-and-go commuting, choose the{' '}
                  <strong className="text-slate-900 dark:text-white">{vehicles[0]?.make} {vehicles[0]?.model}</strong> for its
                  lower operating friction. If passenger or luggage cargo takes precedence, opt for the{' '}
                  <strong className="text-slate-900 dark:text-white">{vehicles[1]?.make || vehicles[0]?.make} {vehicles[1]?.model || vehicles[0]?.model}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
