import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Gauge,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { Currency, MarketRegion } from '../types';

interface HeroLandingProps {
  onStartDiscovery: () => void;
  onBrowseAll: () => void;
  onQuickPreset: (presetKey: string) => void;
  currency: Currency;
  marketRegion: MarketRegion;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartDiscovery,
  onBrowseAll,
  onQuickPreset,
  marketRegion
}) => {
  const isGreek = marketRegion === 'greece';

  return (
    <div className="relative overflow-hidden bg-[#181818] text-white">
      {/* Full-bleed cinematic hero photograph as page chrome (per Ferrari design spec) */}
      <div className="relative w-full h-[480px] sm:h-[560px] md:h-[620px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=85"
          alt="Cinematic luxury automotive photography"
          className="w-full h-full object-cover object-center brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/45 to-black/30" />

        {/* Floating cinematic hero typography over bottom of photo */}
        <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#0066cc] dark:text-[#2997ff] mb-3">
            <span>{isGreek ? 'Ευφυής Σύμβουλος Αγοράς Αυτοκινήτου' : 'Intelligent Automotive Discovery'}</span>
            <span aria-hidden="true">·</span>
            <span>{isGreek ? 'Budget από 1.500€' : 'Budget from €1,500'}</span>
            <span aria-hidden="true">·</span>
            <span>{isGreek ? 'Τέλη & Δακτύλιος' : 'Independent Data'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.28px] text-white leading-[1.08]">
            {isGreek ? (
              <>
                Βρες το σωστό αυτοκίνητο για σένα σε{' '}
                <span className="text-[#2997ff] font-bold">60 δευτερόλεπτα.</span>
              </>
            ) : (
              <>
                Find the right car for you in{' '}
                <span className="text-[#2997ff] font-bold">60 seconds.</span>
              </>
            )}
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
            {isGreek
              ? 'Απάντησε σε 3–4 απλές ερωτήσεις. Το CarCheck αναλύει το budget σου (από 1.500€ έως 60.000€+), τα τέλη κυκλοφορίας, το τεκμήριο και τον Δακτύλιο Αθηνών, προτείνοντας τα ιδανικά οχήματα.'
              : 'Answer 3–4 simple questions. CarCheck understands your lifestyle, evaluates market prices (from €1,500 to €60,000+), and recommends sensible vehicles with crystal-clear explanations.'}
          </p>

          {/* Apple Action Blue CTA button with full pill radius */}
          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onStartDiscovery}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] active:scale-95 text-white text-sm font-semibold tracking-wide shadow-md transition-all cursor-pointer group"
            >
              <span>{isGreek ? 'Βρες το Αυτοκίνητό Μου' : 'Find My Car'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onBrowseAll}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/20 dark:bg-[#1d1d1f]/40 backdrop-blur-md border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-all cursor-pointer active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4 text-white/80" />
              <span>{isGreek ? 'Όλα τα Οχήματα' : 'Browse All Vehicles'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Body layout below hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Value Proof Bar with Apple Utility Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-5 rounded-[18px] bg-[#f5f5f7] dark:bg-[#272729] border border-[#e5e5ea] dark:border-[#38383a]">
            <div className="flex items-center gap-2 text-[#0066cc] dark:text-[#2997ff] mb-1.5">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {isGreek ? 'Από 1.500€' : 'From €1,500'}
              </span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              {isGreek
                ? 'Από αξιόπιστα αυτοκίνητα πόλης 1.500€ έως premium υβριδικά.'
                : 'Budget options covering reliable €1,500 runabouts up to luxury.'}
            </p>
          </div>

          <div className="p-5 rounded-[18px] bg-[#f5f5f7] dark:bg-[#272729] border border-[#e5e5ea] dark:border-[#38383a]">
            <div className="flex items-center gap-2 text-[#0066cc] dark:text-[#2997ff] mb-1.5">
              <Gauge className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {isGreek ? 'Ελληνική Αγορά' : 'Match Score'}
              </span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              {isGreek
                ? 'Υπολογισμός τελών κυκλοφορίας, τεκμηρίων και πράσινου δακτυλίου.'
                : 'Weighted ranking based strictly on your individual priorities.'}
            </p>
          </div>

          <div className="p-5 rounded-[18px] bg-[#f5f5f7] dark:bg-[#272729] border border-[#e5e5ea] dark:border-[#38383a]">
            <div className="flex items-center gap-2 text-[#0066cc] dark:text-[#2997ff] mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {isGreek ? 'Έλεγχος ΚΤΕΟ' : 'Inspection Guide'}
              </span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              {isGreek
                ? 'Έλεγχος βερνικιού από ήλιο, A/C, καδένας χρονισμού και ΚΤΕΟ.'
                : 'Step-by-step verification checklist for pre-purchase inspections.'}
            </p>
          </div>

          <div className="p-5 rounded-[18px] bg-[#f5f5f7] dark:bg-[#272729] border border-[#e5e5ea] dark:border-[#38383a]">
            <div className="flex items-center gap-2 text-[#0066cc] dark:text-[#2997ff] mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {isGreek ? 'Διαφανείς Τιμές' : 'Real Deal Price'}
              </span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              {isGreek
                ? 'Τιμές αγοράς Good Buy & αγγελίες Car.gr.'
                : 'Clear pricing benchmarks with verified marketplace listings.'}
            </p>
          </div>
        </div>

        {/* Quick Launch Scenarios */}
        <div className="mt-10 text-left">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#86868b] mb-3">
            {isGreek ? 'Γρήγορη εκκίνηση ανά ανάγκη:' : 'Explore popular lifestyles in one click:'}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                id: 'greek-budget-city',
                label: isGreek ? '🚗 Αυτοκίνητο Πόλης 1.500€–3.500€ (Yaris / Punto / Micra)' : 'Budget City Hero €1.5k–€3.5k'
              },
              {
                id: 'greek-zero-tax',
                label: isGreek ? '🌿 0€ Τέλη Κυκλοφορίας & Ελεύθερος Δακτύλιος' : 'Zero Road Tax & City Green Ring'
              },
              {
                id: 'city-reliability',
                label: isGreek ? 'Αξιόπιστο Υβριδικό 10.000€–20.000€' : 'City Commuter · Max Reliability (€10k–€20k)'
              },
              {
                id: 'family-wagon',
                label: isGreek ? 'Οικογενειακό 4 Ατόμων & Αποσκευές (20.000€–30.000€)' : 'Family of 4 with Big Luggage (€20k–€30k)'
              },
              {
                id: 'electric-tech',
                label: isGreek ? 'Ηλεκτρικό & Supercharging (30.000€–40.000€)' : 'Electric Tech & Supercharging (€30k–€40k)'
              }
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => onQuickPreset(preset.id)}
                className="px-4 py-2 rounded-full border border-[#e5e5ea] dark:border-[#38383a] bg-[#f5f5f7] dark:bg-[#272729] text-xs font-medium text-[#1d1d1f] dark:text-[#e5e5ea] hover:border-[#0066cc] hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-all cursor-pointer active:scale-95"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
