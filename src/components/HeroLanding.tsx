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
    { id: 'greek-budget-city', icon: CarFront, label: isGreek ? 'Πόλης 1.500–3.500 €' : 'Budget city car €1,500–€3,500' },
    { id: 'greek-zero-tax', icon: Leaf, label: isGreek ? '0 € τέλη & Δακτύλιος' : 'Zero road tax & city ring' },
    { id: 'city-reliability', icon: HeartHandshake, label: isGreek ? 'Αξιόπιστο υβριδικό 10.000–20.000 €' : 'Reliable hybrid €10,000–€20,000' },
    { id: 'family-wagon', icon: Luggage, label: isGreek ? 'Οικογενειακό με χώρους 20.000–30.000 €' : 'Family space €20,000–€30,000' },
    { id: 'electric-tech', icon: BatteryCharging, label: isGreek ? 'Ηλεκτρικό 30.000–40.000 €' : 'Electric tech €30,000–€40,000' }
  ];

  return (
    <div className="relative overflow-hidden bg-[var(--color-canvas)] text-[var(--color-text)]">
      <section className="relative w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]" aria-labelledby="hero-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 grid lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)] gap-10 lg:gap-14 items-center">
          <div className="max-w-3xl">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold tracking-normal text-[var(--color-accent-text)] mb-4">
              <span>{isGreek ? 'Σύμβουλος αγοράς αυτοκινήτου' : 'Independent vehicle advisor'}</span>
              <span aria-hidden="true">·</span>
              <span>{isGreek ? 'Ελλάδα & Ευρώπη' : 'Greece & Europe'}</span>
              <span aria-hidden="true">·</span>
              <span>{isGreek ? 'Έλεγχος πηγών πριν την αγορά' : 'Source checks before you buy'}</span>
            </p>

            <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.025em] text-[var(--color-text)] leading-[1.08]">
              {isGreek ? 'Βρες το σωστό αυτοκίνητο χωρίς να χαθείς στις αγγελίες.' : 'Find the right car without getting lost in listings.'}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
              {isGreek
                ? 'Απάντησε σε 4 σύντομες ερωτήσεις και σύγκρινε λίγες, σχετικές επιλογές. Το CarCheck οργανώνει budget, χρήση, κόστος, αξιοπιστία και ελληνικούς περιορισμούς σε μία ήρεμη εικόνα.'
                : 'Answer four short questions and compare a small set of relevant choices. CarCheck organizes budget, use, ownership cost, reliability, and market constraints into one calm view.'}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button type="button" onClick={onStartDiscovery} className="min-h-12 inline-flex items-center justify-center gap-2.5 px-7 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[15px] font-semibold transition-colors group">
                <span>{isGreek ? 'Βρες το αυτοκίνητό μου' : 'Find my car'}</span>
                <ArrowRight className="w-4 h-4 motion-safe:group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </button>
              <button type="button" onClick={onBrowseAll} className="min-h-12 inline-flex items-center justify-center gap-2 px-6 rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[var(--color-text)] text-[15px] font-semibold hover:border-[var(--color-border-strong)] transition-colors">
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                <span>{isGreek ? 'Περιήγηση στα μοντέλα' : 'Browse vehicles'}</span>
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-6 sm:p-7" aria-label={isGreek ? 'Τι θα δεις' : 'What you will see'}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]">
              <CarFront className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-semibold tracking-tight text-[var(--color-text)]">{isGreek ? 'Λιγότερος θόρυβος. Περισσότερη βεβαιότητα.' : 'Less noise. More confidence.'}</h2>
            <div className="mt-5 space-y-4">
              {[
                [isGreek ? 'Καθαρό shortlist' : 'Focused shortlist', isGreek ? 'Λίγες επιλογές με ξεκάθαρο γιατί.' : 'A few choices with a clear reason why.'],
                [isGreek ? 'Εικόνες ανά μοντέλο' : 'Model-specific imagery', isGreek ? 'Χωρίς άσχετες stock φωτογραφίες.' : 'No unrelated stock photos presented as the car.'],
                [isGreek ? 'Πηγές με ημερομηνία' : 'Source-aware data', isGreek ? 'Οι κρίσιμες τιμές πρέπει να έχουν πηγή και ημερομηνία.' : 'Critical values should carry a source and retrieval date.']
              ].map(([title, body]) => (
                <div key={title} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-success)]" aria-hidden="true" />
                  <div><p className="text-[15px] font-bold text-[var(--color-text)]">{title}</p><p className="mt-0.5 text-[14px] leading-relaxed text-[var(--color-text-muted)]">{body}</p></div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {[
            { icon: Zap, title: isGreek ? 'Budget από 1.500 €' : 'From €1,500', body: isGreek ? 'Επιλογές από οικονομικά αυτοκίνητα πόλης έως σύγχρονα υβριδικά.' : 'Options from inexpensive city cars to modern hybrids.' },
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
          <h2 id="quick-starts-title" className="text-sm font-bold text-[var(--color-text)] mb-3">{isGreek ? 'Γρήγορη εκκίνηση' : 'Quick starts'}</h2>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-labelledby="quick-starts-title">
            {presets.map(({ id, icon: Icon, label }) => (
              <button key={id} type="button" onClick={() => onQuickPreset(id)} className="min-h-11 px-4 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)] transition-colors inline-flex items-center gap-2">
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
