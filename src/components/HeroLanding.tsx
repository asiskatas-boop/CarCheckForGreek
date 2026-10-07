import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Gauge,
  CheckCircle2,
  SlidersHorizontal,
  CarFront,
  Leaf,
  HeartHandshake,
  Luggage,
  BatteryCharging
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
  const presets = [
    { id: 'greek-budget-city', icon: CarFront, label: isGreek ? 'Πόλης 1.500€–3.500€' : 'Budget city car €1.5k–€3.5k' },
    { id: 'greek-zero-tax', icon: Leaf, label: isGreek ? '0€ τέλη & Δακτύλιος' : 'Zero road tax & city ring' },
    { id: 'city-reliability', icon: HeartHandshake, label: isGreek ? 'Αξιόπιστο υβριδικό 10k–20k' : 'Reliable hybrid €10k–€20k' },
    { id: 'family-wagon', icon: Luggage, label: isGreek ? 'Οικογενειακό με χώρους 20k–30k' : 'Family space €20k–€30k' },
    { id: 'electric-tech', icon: BatteryCharging, label: isGreek ? 'Ηλεκτρικό 30k–40k' : 'Electric tech €30k–€40k' }
  ];

  return (
    <div className="relative overflow-hidden bg-[var(--color-canvas)] text-[var(--color-text)]">
      <section className="relative w-full min-h-[500px] sm:min-h-[580px] md:min-h-[620px] overflow-hidden bg-slate-950" aria-labelledby="hero-title">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=82"
          srcSet="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=78 900w, https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80 1400w, https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=82 1800w"
          sizes="100vw"
          alt={isGreek ? 'Αυτοκίνητο σε ανοιχτό δρόμο' : 'Car on an open road'}
          className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/30" />

        <div className="relative z-10 min-h-[500px] sm:min-h-[580px] md:min-h-[620px] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-10 sm:pb-14">
          <div className="max-w-4xl">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold tracking-wide text-red-200 mb-3">
              <span>{isGreek ? 'Σύμβουλος αγοράς αυτοκινήτου' : 'Independent vehicle advisor'}</span>
              <span aria-hidden="true">·</span>
              <span>{isGreek ? 'Budget από 1.500€' : 'Budget from €1,500'}</span>
              <span aria-hidden="true">·</span>
              <span>{isGreek ? 'Ελληνικά κόστη & περιορισμοί' : 'Market costs & constraints'}</span>
            </p>

            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.06]">
              {isGreek ? 'Βρες το σωστό αυτοκίνητο για τη ζωή και το budget σου.' : 'Find the right car for your life and budget.'}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
              {isGreek
                ? 'Απάντησε σε 4 σύντομες ερωτήσεις. Το CarCheck συνδυάζει budget, χρήση, αξιοπιστία, κόστος και ελληνικούς παράγοντες για να περιορίσει τις επιλογές σου.'
                : 'Answer four short questions. CarCheck combines budget, use, reliability, ownership cost, and market constraints to narrow your choices.'}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button type="button" onClick={onStartDiscovery} className="min-h-12 inline-flex items-center justify-center gap-2.5 px-7 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-bold shadow-lg transition-colors group">
                <span>{isGreek ? 'Βρες το αυτοκίνητό μου' : 'Find my car'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
              <button type="button" onClick={onBrowseAll} className="min-h-12 inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/30 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                <span>{isGreek ? 'Περιήγηση σε όλα τα οχήματα' : 'Browse all vehicles'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {[
            { icon: Zap, title: isGreek ? 'Budget από 1.500€' : 'From €1,500', body: isGreek ? 'Επιλογές από οικονομικά αυτοκίνητα πόλης έως σύγχρονα υβριδικά.' : 'Options from inexpensive city cars to modern hybrids.' },
            { icon: Gauge, title: isGreek ? 'Ελληνική αγορά' : 'Personal fit', body: isGreek ? 'Τέλη, τεκμήρια και Δακτύλιος μπαίνουν στην αξιολόγηση όπου υπάρχουν δεδομένα.' : 'Recommendations are weighted around your actual priorities.' },
            { icon: ShieldCheck, title: isGreek ? 'Οδηγός ελέγχου' : 'Inspection guide', body: isGreek ? 'Checklist πριν την αγορά για συνηθισμένα σημεία φθοράς και γνωστές αδυναμίες.' : 'Pre-purchase checklist for common wear points and known issues.' },
            { icon: CheckCircle2, title: isGreek ? 'Διαφανείς τιμές' : 'Price context', body: isGreek ? 'Ενδεικτικά εύρη και σύνδεσμοι πηγών — όχι ισχυρισμός ζωντανής διαθεσιμότητας.' : 'Reference ranges and source links — not a claim of live availability.' }
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 text-[var(--color-accent-text)] mb-2">
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-bold">{title}</span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-left">
          <p className="text-sm font-bold text-[var(--color-text)] mb-3">{isGreek ? 'Γρήγορη εκκίνηση' : 'Quick starts'}</p>
          <div className="flex flex-wrap items-center gap-2">
            {presets.map(({ id, icon: Icon, label }) => (
              <button key={id} type="button" onClick={() => onQuickPreset(id)} className="min-h-11 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)] transition-colors inline-flex items-center gap-2">
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
