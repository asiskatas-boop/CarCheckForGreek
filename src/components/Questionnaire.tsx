import React, { useEffect, useRef, useState } from 'react';
import {
  UserPreferences,
  BudgetRangeId,
  UsageType,
  PriorityType,
  Currency,
  PaymentMethod,
  MarketRegion
} from '../types';
import { CURRENCY_RATES, convertFromEUR, convertToEUR, formatPrice } from '../services/currency';
import { plural } from '../services/format';
import { DYNAMIC_QUESTIONS, DynamicChoice, DynamicQuestionKind } from '../data/lifestyleChoices';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  HeartHandshake,
  Route,
  Building2,
  Users,
  Map,
  TentTree,
  Briefcase,
  Package,
  Trees,
  Gauge,
  ShieldCheck,
  Gem
} from 'lucide-react';

interface QuestionnaireProps {
  initialPreferences: UserPreferences;
  onComplete: (prefs: UserPreferences) => void;
  currency: Currency;
  marketRegion?: MarketRegion;
}

const MIN_BUDGET_EUR = 1500;
const MAX_PRIORITIES = 3;
const TOTAL_STEPS = 4;

// Shared card styling for native radio/checkbox inputs. The input itself is visually hidden,
// so the card shows the keyboard focus ring via :has(:focus-visible).
const choiceCardClass = (selected: boolean, extra = '') =>
  `relative block rounded-xl border text-left transition-colors cursor-pointer has-[:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] has-[:focus-visible]:[outline-offset:3px] ${
    selected
      ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-text)] shadow-xs'
      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] text-[var(--color-text)]'
  } ${extra}`;

const SelectedMark: React.FC<{ selected: boolean; size?: 'sm' | 'md' }> = ({ selected, size = 'sm' }) =>
  selected ? (
    <span className={`${size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center`}>
      <Check className={`${size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3'} stroke-[3]`} />
    </span>
  ) : null;

const inputClass =
  'w-full min-h-11 py-2 text-[15px] rounded-xl border border-[var(--color-border-control)] bg-[var(--color-surface-raised)] text-[var(--color-text)] focus:border-[var(--color-accent)]';

const USAGE_OPTIONS: { id: UsageType; en: string; el: string; icon: React.ElementType }[] = [
  { id: 'daily-commuting', en: 'Daily commuting', el: 'Καθημερινή μετακίνηση', icon: Route },
  { id: 'city-driving', en: 'City driving & parking', el: 'Κίνηση & παρκάρισμα στην πόλη', icon: Building2 },
  { id: 'family-use', en: 'Family & kids', el: 'Οικογένεια & παιδιά', icon: Users },
  { id: 'long-road-trips', en: 'Long road trips / Motorway', el: 'Ταξίδια στην εθνική', icon: Map },
  { id: 'weekend-driving', en: 'Weekend leisure', el: 'Σαββατοκύριακο & εκδρομές', icon: TentTree },
  { id: 'business', en: 'Business & client travel', el: 'Επαγγελματικά ταξίδια', icon: Briefcase },
  { id: 'carrying-equipment', en: 'Carrying bulky equipment', el: 'Μεταφορά εξοπλισμού', icon: Package },
  { id: 'outdoor-activities', en: 'Outdoor adventures & sports', el: 'Outdoor & βουνό', icon: Trees },
  { id: 'performance-fun', en: 'Performance & driving fun', el: 'Σπορ οδήγηση & επιδόσεις', icon: Gauge },
  { id: 'first-car', en: 'First car / New driver', el: 'Πρώτο αυτοκίνητο / Νέος οδηγός', icon: ShieldCheck },
  { id: 'luxury-comfort', en: 'Luxury & quiet comfort', el: 'Πολυτέλεια & ήσυχη καμπίνα', icon: Gem }
];

const PRIORITY_OPTIONS: { id: PriorityType; label: { en: string; el: string }; desc: { en: string; el: string } }[] = [
  { id: 'reliability', label: { en: 'Bulletproof Reliability', el: 'Αδιαπραγμάτευτη Αξιοπιστία' }, desc: { en: 'Minimal breakdown risk & proven durability', el: 'Ελάχιστη πιθανότητα βλαβών και αντοχή στον χρόνο' } },
  { id: 'low-running-costs', label: { en: 'Low Running Costs', el: 'Χαμηλό Κόστος Συντήρησης (Ανταλλακτικά)' }, desc: { en: 'Cheap parts, low insurance & low service bills', el: 'Φθηνά σέρβις, χαμηλά ασφάλιστρα & προσιτά ανταλλακτικά' } },
  { id: 'fuel-economy', label: { en: 'Fuel / Energy Economy', el: 'Οικονομία Καυσίμου / Ρεύματος' }, desc: { en: 'Maximum miles per gallon or kWh', el: 'Ελάχιστα λίτρα ανά 100 χλμ ή χαμηλή κατανάλωση kWh' } },
  { id: 'performance', label: { en: 'Sporty Performance', el: 'Σπορ Επιδόσεις & Οδική Συμπεριφορά' }, desc: { en: 'Sharp handling, quick acceleration & responsiveness', el: 'Άμεση επιτάχυνση, κοφτερό τιμόνι & δυναμική οδήγηση' } },
  { id: 'comfort', label: { en: 'Quiet Cabin & Composure', el: 'Άνεση & Ηχομόνωση Καμπίνας' }, desc: { en: 'Supple suspension, acoustic glass & comfortable seats', el: 'Απορροφητική ανάρτηση & ξεκούραστα καθίσματα' } },
  { id: 'practicality', label: { en: 'Maximum Practicality', el: 'Μέγιστη Πρακτικότητα & Χώροι' }, desc: { en: 'Big boot, versatile seats & storage solutions', el: 'Μεγάλο πορτμπαγκάζ και έξυπνες θήκες' } },
  { id: 'safety', label: { en: 'Top Crash Safety & ADAS', el: 'Κορυφαία Ασφάλεια Crash Test & ADAS' }, desc: { en: '5-star crash ratings & advanced driver assistance', el: '5 αστέρια Euro NCAP & ηλεκτρονικά συστήματα υποβοήθησης' } },
  { id: 'technology', label: { en: 'Modern Infotainment & Tech', el: 'Σύγχρονη Τεχνολογία & Οθόνες' }, desc: { en: 'Wireless CarPlay, great screens & smart connectivity', el: 'Apple CarPlay / Android Auto και ευκρινείς οθόνες' } },
  { id: 'resale-value', label: { en: 'High Resale Value', el: 'Υψηλή Μεταπωλητική Αξία' }, desc: { en: 'Slow depreciation curve over 3–5 years', el: 'Αργή πτώση αξίας στην αγορά μεταχειρισμένων' } },
  { id: 'environmental-impact', label: { en: 'Low Emissions / Green', el: '0€ Τέλη / Ελεύθερος Δακτύλιος' }, desc: { en: 'Zero tailpipe emissions or hybrid efficiency', el: 'Απαλλαγή από τέλη και ελεύθερη είσοδος στο κέντρο' } },
  { id: 'luxury', label: { en: 'Premium Brand Prestige', el: 'Premium Κύρος Κατασκευαστή' }, desc: { en: 'High-end interior materials and prestige badge', el: 'Υλικά υψηλής ποιότητας και κορυφαία αίσθηση' } },
  { id: 'design', label: { en: 'Standout Exterior Design', el: 'Εντυπωσιακός Σχεδιασμός' }, desc: { en: 'Eye-catching styling and road presence', el: 'Ξεχωριστή εμφάνιση και δυναμικές γραμμές' } }
];

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  initialPreferences,
  onComplete,
  currency,
  marketRegion = 'global'
}) => {
  const isGreek = marketRegion === 'greece';
  const lang = isGreek ? 'el' : 'en';
  const [step, setStep] = useState<number>(1);
  const [prefs, setPrefs] = useState<UserPreferences>(initialPreferences);
  const [customMin, setCustomMin] = useState<number>(() => Math.max(MIN_BUDGET_EUR, initialPreferences.budgetCustomMin ?? MIN_BUDGET_EUR));
  const [customMax, setCustomMax] = useState<number>(() =>
    Math.max(initialPreferences.budgetCustomMax ?? 15000, initialPreferences.budgetCustomMin ?? MIN_BUDGET_EUR)
  );
  // Raw text while the user types; clamped only when the field loses focus or the step is submitted.
  const [minDraft, setMinDraft] = useState<string>(() => String(convertFromEUR(customMin, currency)));
  const [maxDraft, setMaxDraft] = useState<string>(() => String(convertFromEUR(customMax, currency)));
  const [customMonthly, setCustomMonthly] = useState<string>('');
  const [stepError, setStepError] = useState<string>('');
  const [priorityNotice, setPriorityNotice] = useState<string>('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  const symbol = CURRENCY_RATES[currency].symbol;
  const isCustomBudget = prefs.budgetId === 'custom';
  const minBudgetLabel = formatPrice(MIN_BUDGET_EUR, currency);

  useEffect(() => {
    setPrefs((prev) => ({ ...prev, currency, marketRegion }));
    setMinDraft(String(convertFromEUR(customMin, currency)));
    setMaxDraft(String(convertFromEUR(customMax, currency)));
    // Only re-sync when the currency or region changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, marketRegion]);

  // Move focus to the new question so keyboard and screen reader users land on it.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step]);

  const budgetOptions: { id: BudgetRangeId; label: string; desc: string }[] = [
    {
      id: '1.5k-5k',
      label: `${formatPrice(1500, currency)} – ${formatPrice(5000, currency)}`,
      desc: isGreek
        ? 'Αξιόπιστα οικονομικά μοντέλα πόλης (Yaris Mk1, Punto FIRE, Micra K12, Getz) με ελάχιστα τέλη και φθηνά ανταλλακτικά'
        : 'Essential reliable runabouts (Toyota Yaris Mk1, Fiat Punto, Nissan Micra) with rock-bottom running costs'
    },
    {
      id: '5k-10k',
      label: `${formatPrice(5000, currency)} – ${formatPrice(10000, currency)}`,
      desc: isGreek
        ? 'Δοκιμασμένα αυτοκίνητα πόλης & supermini με χαμηλή κατανάλωση (Yaris Mk2/3, Fiesta, Polo, C3)'
        : 'Solid everyday hatchbacks and small cars with low depreciation'
    },
    {
      id: '10k-20k',
      label: `${formatPrice(10000, currency)} – ${formatPrice(20000, currency)}`,
      desc: isGreek
        ? 'Σύγχρονα υβριδικά (Yaris Hybrid, Auris) με 0€ τέλη κυκλοφορίας & ελεύθερο δακτύλιο'
        : 'Reliable modern hatchbacks, superminis & efficient self-charging hybrids'
    },
    {
      id: '20k-30k',
      label: `${formatPrice(20000, currency)} – ${formatPrice(30000, currency)}`,
      desc: isGreek
        ? 'Crossover & οικογενειακά (Corolla Hybrid, Yaris Cross, Octavia, CX-5)'
        : 'Sweet spot: recent compact SUVs, estates & proven electric vehicles'
    },
    {
      id: '30k-40k',
      label: `${formatPrice(30000, currency)} – ${formatPrice(40000, currency)}`,
      desc: isGreek
        ? 'Ηλεκτρικά (Tesla Model 3/Y, Ioniq 5), executive wagons & μεσαία SUV'
        : 'Long-range electric vehicles, premium wagons & family SUVs'
    },
    {
      id: '40k-60k',
      label: `${formatPrice(40000, currency)} – ${formatPrice(60000, currency)}`,
      desc: isGreek ? 'Executive premium SUV & πολυτελή (Volvo XC60, BMW 3, Macan)' : 'Executive saloons, luxury crossovers & high performance'
    },
    {
      id: '60k-plus',
      label: `${formatPrice(60000, currency)}+`,
      desc: isGreek ? 'Κορυφαία πολυτέλεια, Porsche & σπορ επιδόσεις' : 'Top-tier luxury, sports performance & flagship engineering'
    },
    {
      id: 'not-sure',
      label: isGreek ? 'Δεν είμαι σίγουρος ακόμα' : 'Not sure yet',
      desc: isGreek
        ? 'Το CarCheck θα υπολογίσει ένα λογικό εύρος με βάση τις ανάγκες σου'
        : 'We will infer a sensible range from your lifestyle answers'
    },
    {
      id: 'custom',
      label: isGreek ? `Προσαρμοσμένο ποσό (από ${minBudgetLabel})` : `Custom amount (from ${minBudgetLabel})`,
      desc: isGreek ? 'Όρισε ακριβές ελάχιστο και μέγιστο ποσό αγοράς' : 'Define exact minimum and maximum purchase targets'
    }
  ];

  // Which dynamic 4th question applies, based on earlier answers.
  const isFamily = prefs.usages.includes('family-use');
  const isCity = prefs.usages.includes('city-driving') && !isFamily;
  const isPerformance = prefs.usages.includes('performance-fun') && !isFamily && !isCity;
  const isOutdoor = (prefs.usages.includes('outdoor-activities') || prefs.usages.includes('carrying-equipment')) && !isFamily;
  const questionKind: DynamicQuestionKind = isFamily ? 'family' : isCity ? 'city' : isPerformance ? 'performance' : isOutdoor ? 'outdoor' : 'general';
  const dynamicQuestion = DYNAMIC_QUESTIONS[questionKind];

  const commitCustomBudget = (): { min: number; max: number } => {
    const minFloor = convertFromEUR(MIN_BUDGET_EUR, currency);
    const parsedMin = parseInt(minDraft, 10);
    const minEUR = Math.max(MIN_BUDGET_EUR, convertToEUR(Number.isNaN(parsedMin) ? minFloor : Math.max(minFloor, parsedMin), currency));
    const parsedMax = parseInt(maxDraft, 10);
    const maxEUR = Math.max(minEUR, Number.isNaN(parsedMax) ? customMax : convertToEUR(parsedMax, currency));
    setCustomMin(minEUR);
    setCustomMax(maxEUR);
    setMinDraft(String(convertFromEUR(minEUR, currency)));
    setMaxDraft(String(convertFromEUR(maxEUR, currency)));
    setPrefs((prev) => (prev.budgetId === 'custom' ? { ...prev, budgetCustomMin: minEUR, budgetCustomMax: maxEUR } : prev));
    return { min: minEUR, max: maxEUR };
  };

  const handleSelectBudget = (id: BudgetRangeId) => {
    setStepError('');
    setPrefs((prev) =>
      id === 'custom' ? { ...prev, budgetId: 'custom', budgetCustomMin: customMin, budgetCustomMax: customMax } : { ...prev, budgetId: id }
    );
  };

  const handleToggleUsage = (id: UsageType) => {
    setStepError('');
    setPrefs((prev) => ({
      ...prev,
      usages: prev.usages.includes(id) ? prev.usages.filter((u) => u !== id) : [...prev.usages, id]
    }));
  };

  const handleTogglePriority = (id: PriorityType) => {
    setStepError('');
    if (prefs.priorities.includes(id)) {
      setPriorityNotice('');
      setPrefs((prev) => ({ ...prev, priorities: prev.priorities.filter((p) => p !== id) }));
      return;
    }
    if (prefs.priorities.length >= MAX_PRIORITIES) {
      setPriorityNotice(
        isGreek ? 'Μπορείς να επιλέξεις έως 3. Αφαίρεσε μία προτεραιότητα για να προσθέσεις άλλη.' : 'You can choose up to 3. Unselect one to add another.'
      );
      return;
    }
    setPriorityNotice('');
    setPrefs((prev) => ({ ...prev, priorities: [...prev.priorities, id] }));
  };

  const handleSelectDynamicChoice = (choice: DynamicChoice) => {
    setStepError('');
    setPrefs((prev) => ({
      ...prev,
      // The English label is what the recommendation engine reads.
      dynamicAnswer: choice.label.en,
      lifestyle: Array.from(new Set([...prev.lifestyle, ...choice.mapsToLifestyle]))
    }));
  };

  const stepValidationError = (): string => {
    if (step === 2 && prefs.usages.length === 0) return isGreek ? 'Επίλεξε τουλάχιστον μία χρήση για να συνεχίσεις.' : 'Choose at least one use to continue.';
    if (step === 3 && prefs.priorities.length === 0) return isGreek ? 'Επίλεξε τουλάχιστον μία προτεραιότητα για να συνεχίσεις.' : 'Choose at least one priority to continue.';
    if (step === 4 && !prefs.dynamicAnswer && prefs.lifestyle.length === 0) return isGreek ? 'Επίλεξε μία απάντηση για να συνεχίσεις.' : 'Choose an answer to continue.';
    return '';
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let next = prefs;
    if (step === 1 && isCustomBudget) {
      const { min, max } = commitCustomBudget();
      next = { ...prefs, budgetCustomMin: min, budgetCustomMax: max };
    }
    const error = stepValidationError();
    if (error) {
      setStepError(error);
      return;
    }
    setStepError('');
    if (step < TOTAL_STEPS) setStep(step + 1);
    else onComplete(next);
  };

  const stepTitles = isGreek
    ? ['Προϋπολογισμός', 'Χρήση οχήματος', 'Προτεραιότητες', 'Τρόπος ζωής & Δακτύλιος']
    : ['Budget', 'Usage profile', 'Priorities', 'Lifestyle tailoring'];

  const headingClass = 'text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight focus:outline-none';
  const eyebrowClass = 'text-[13px] font-semibold tracking-normal text-[var(--color-accent-text)] mb-1';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="sr-only">{isGreek ? 'Βρες το αυτοκίνητό σου' : 'Find your car'}</h1>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-[13px] font-bold tracking-normal text-[var(--color-text-muted)] mb-2">
          <span>{isGreek ? `Ερώτηση ${step} από ${TOTAL_STEPS}` : `Question ${step} of ${TOTAL_STEPS}`}</span>
          <span>{stepTitles[step - 1]}</span>
        </div>
        <div className="w-full h-1 bg-[var(--color-surface-strong)] rounded-full overflow-hidden" aria-hidden="true">
          <div
            className="h-full w-full origin-left bg-[var(--color-accent)] transition-transform duration-300"
            style={{ transform: `scaleX(${step / TOTAL_STEPS})` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Step 1: Budget */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <fieldset>
              <legend className="mb-6">
                <span className={`block ${eyebrowClass}`}>{isGreek ? 'Βήμα 1 από 4 · Οικονομικές παράμετροι' : 'Step 1 of 4 · Financial parameters'}</span>
                <h2 ref={headingRef} tabIndex={-1} className={headingClass}>
                  {isGreek ? 'Ποιο είναι το budget σου;' : 'What’s your budget?'}
                </h2>
                <span className="block mt-1.5 text-[15px] font-normal text-[var(--color-text-muted)]">
                  {isGreek
                    ? `Επίλεξε ένα κατά προσέγγιση εύρος τιμής (από ${minBudgetLabel}) ή όρισε το δικό σου ποσό. Αν δεν είσαι σίγουρος, το CarCheck θα υπολογίσει το ιδανικό ποσό.`
                    : `Select an approximate purchase range (starting from ${minBudgetLabel}) or enter a custom amount. If unsure, CarCheck infers a sensible budget.`}
                </span>
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {budgetOptions.map((opt) => {
                  const isSelected = prefs.budgetId === opt.id;
                  return (
                    <label key={opt.id} className={choiceCardClass(isSelected, 'p-4')}>
                      <input type="radio" name="budget" value={opt.id} checked={isSelected} onChange={() => handleSelectBudget(opt.id)} className="sr-only" />
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-base text-[var(--color-text)]">{opt.label}</span>
                        <SelectedMark selected={isSelected} size="md" />
                      </span>
                      <span className="block text-[13px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">{opt.desc}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {isCustomBudget && (
              <fieldset className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-accent)]/50 animate-fadeIn">
                <legend className="sr-only">{isGreek ? 'Προσαρμοσμένο εύρος budget' : 'Custom budget range'}</legend>
                <p id="custom-budget-hint" className="text-[13px] font-bold tracking-normal text-[var(--color-accent-text)] mb-3">
                  {isGreek ? `Ορισμός εύρους budget (από ${minBudgetLabel})` : `Define your budget range (from ${minBudgetLabel})`}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="custom-budget-min" className="text-[13px] text-[var(--color-text-muted)] block mb-1">
                      {isGreek ? 'Ελάχιστο ποσό' : 'Minimum budget'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--color-text-muted)]" aria-hidden="true">{symbol}</span>
                      <input
                        id="custom-budget-min"
                        name="budgetMin"
                        type="number"
                        inputMode="numeric"
                        autoComplete="off"
                        min={convertFromEUR(MIN_BUDGET_EUR, currency)}
                        step={500}
                        value={minDraft}
                        aria-describedby="custom-budget-hint"
                        onChange={(e) => setMinDraft(e.target.value)}
                        onBlur={commitCustomBudget}
                        className={`${inputClass} pl-8 pr-3`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="custom-budget-max" className="text-[13px] text-[var(--color-text-muted)] block mb-1">
                      {isGreek ? 'Μέγιστο ποσό' : 'Maximum budget'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--color-text-muted)]" aria-hidden="true">{symbol}</span>
                      <input
                        id="custom-budget-max"
                        name="budgetMax"
                        type="number"
                        inputMode="numeric"
                        autoComplete="off"
                        min={convertFromEUR(customMin, currency)}
                        step={500}
                        value={maxDraft}
                        aria-describedby="custom-budget-hint"
                        onChange={(e) => setMaxDraft(e.target.value)}
                        onBlur={commitCustomBudget}
                        className={`${inputClass} pl-8 pr-3`}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>
            )}

            {/* Optional financing preference */}
            <fieldset className="mt-6 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <legend className="sr-only">{isGreek ? 'Τρόπος πληρωμής (προαιρετικό)' : 'Payment method (optional)'}</legend>
              <div className="flex items-center justify-between text-[13px] font-semibold text-[var(--color-text)] mb-3" aria-hidden="true">
                <span className="flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-[var(--color-accent-text)]" />
                  {isGreek ? 'Προαιρετικό: Τρόπος πληρωμής' : 'Optional: Purchase or financing preference'}
                </span>
                <span className="text-xs font-normal text-[var(--color-text-muted)]">{isGreek ? 'Μη υποχρεωτικό' : 'Not mandatory'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'any', label: isGreek ? 'Μετρητά ή χρηματοδότηση' : 'Cash or Financing' },
                  { id: 'cash', label: isGreek ? 'Αγορά μετρητοίς' : 'Cash Purchase' },
                  { id: 'financing', label: isGreek ? 'Χρηματοδότηση / Δάνειο' : 'Financing / Loan' }
                ].map((pMethod) => {
                  const isSelected = prefs.paymentMethod === pMethod.id;
                  return (
                    <label
                      key={pMethod.id}
                      className={`${choiceCardClass(isSelected, 'min-h-11 px-3 flex items-center justify-center text-center text-[13px] font-medium')} ${
                        isSelected ? '' : 'text-[var(--color-text-muted)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pMethod.id}
                        checked={isSelected}
                        onChange={() => setPrefs((prev) => ({ ...prev, paymentMethod: pMethod.id as PaymentMethod }))}
                        className="sr-only"
                      />
                      {pMethod.label}
                    </label>
                  );
                })}
              </div>

              {prefs.paymentMethod === 'financing' && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label htmlFor="monthly-payment-max" className="text-[13px] text-[var(--color-text-muted)]">
                    {isGreek ? 'Μέγιστη μηνιαία δόση' : 'Target monthly payment'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--color-text-muted)]" aria-hidden="true">{symbol}</span>
                    <input
                      id="monthly-payment-max"
                      name="monthlyPayment"
                      type="number"
                      inputMode="numeric"
                      autoComplete="off"
                      min={0}
                      placeholder={isGreek ? 'π.χ. 250' : 'e.g. 250'}
                      value={customMonthly}
                      aria-describedby="monthly-payment-unit"
                      onChange={(e) => {
                        setCustomMonthly(e.target.value);
                        const parsed = parseInt(e.target.value, 10);
                        setPrefs((prev) => ({ ...prev, monthlyPaymentMax: Number.isNaN(parsed) ? undefined : convertToEUR(parsed, currency) }));
                      }}
                      className={`${inputClass} w-44 pl-7 pr-16`}
                    />
                    <span id="monthly-payment-unit" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
                      {isGreek ? '/μήνα' : '/month'}
                    </span>
                  </div>
                </div>
              )}
            </fieldset>
          </div>
        )}

        {/* Step 2: Usage */}
        {step === 2 && (
          <fieldset className="space-y-6 animate-fadeIn" aria-describedby={stepError ? 'step-error' : undefined}>
            <legend className="mb-6">
              <span className={`block ${eyebrowClass}`}>{isGreek ? 'Βήμα 2 από 4 · Προφίλ χρήσης' : 'Step 2 of 4 · Usage profile'}</span>
              <h2 ref={headingRef} tabIndex={-1} className={headingClass}>
                {isGreek ? 'Για ποια χρήση προορίζεται κυρίως το αυτοκίνητο;' : 'What will you mainly use the car for?'}
              </h2>
              <span className="block mt-1.5 text-[15px] font-normal text-[var(--color-text-muted)]">
                {isGreek
                  ? 'Επίλεξε όσα ισχύουν. Το CarCheck υπολογίζει αυτόματα διαστάσεις, χώρους, κατανάλωση και οδική συμπεριφορά.'
                  : 'Select all that apply. CarCheck uses this to calculate cabin space, ground clearance, fuel efficiency, and driving dynamics automatically.'}
              </span>
            </legend>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {USAGE_OPTIONS.map((opt) => {
                const isSelected = prefs.usages.includes(opt.id);
                const Icon = opt.icon;
                return (
                  <label key={opt.id} className={choiceCardClass(isSelected, 'p-3.5 flex flex-col justify-between min-h-[90px]')}>
                    <input type="checkbox" name="usages" value={opt.id} checked={isSelected} onChange={() => handleToggleUsage(opt.id)} className="sr-only" />
                    <span className="flex items-center justify-between">
                      <Icon className="w-5 h-5 text-[var(--color-accent-text)]" />
                      <SelectedMark selected={isSelected} />
                    </span>
                    <span className="font-semibold text-[13px] sm:text-[15px] text-[var(--color-text)] mt-2">{opt[lang]}</span>
                  </label>
                );
              })}
            </div>

            <p className="text-[13px] text-[var(--color-text-muted)]" role="status">
              {isGreek
                ? `Επιλεγμένες: ${plural(prefs.usages.length, marketRegion, { one: 'χρήση', other: 'χρήσεις' })}`
                : `Selected: ${plural(prefs.usages.length, marketRegion, { one: 'purpose', other: 'purposes' })}`}
            </p>
          </fieldset>
        )}

        {/* Step 3: Priorities */}
        {step === 3 && (
          <fieldset className="space-y-6 animate-fadeIn" aria-describedby="priority-limit">
            <legend className="mb-6 w-full">
              <span className={`block ${eyebrowClass}`}>{isGreek ? 'Βήμα 3 από 4 · Κριτήρια αξιολόγησης' : 'Step 3 of 4 · Ranking criteria'}</span>
              <h2 ref={headingRef} tabIndex={-1} className={headingClass}>
                {isGreek ? 'Τι έχει μεγαλύτερη σημασία για εσένα;' : 'What matters most to you?'}
              </h2>
              <span id="priority-limit" className="block mt-1.5 text-[15px] font-normal text-[var(--color-text-muted)]">
                {isGreek
                  ? 'Επίλεξε έως και 3 προτεραιότητες. Ο αλγόριθμος θα δώσει ιδιαίτερο βάρος σε αυτές.'
                  : 'Choose up to 3 core priorities. Our engine weights these heavily so they truly govern the final choices.'}
              </span>
            </legend>

            <div role="status" aria-live="polite" className="flex flex-wrap items-center gap-2 text-[13px] font-semibold">
              <span className="px-3 py-1.5 rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]">
                {isGreek ? `${prefs.priorities.length} από 3 επιλεγμένες` : `${prefs.priorities.length} of 3 selected`}
              </span>
              {priorityNotice && <span className="text-[var(--color-warning)]">{priorityNotice}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRIORITY_OPTIONS.map((opt) => {
                const isSelected = prefs.priorities.includes(opt.id);
                const atLimit = !isSelected && prefs.priorities.length >= MAX_PRIORITIES;
                return (
                  <label key={opt.id} className={`${choiceCardClass(isSelected, 'p-3.5')} ${atLimit ? 'opacity-70' : ''}`}>
                    <input type="checkbox" name="priorities" value={opt.id} checked={isSelected} onChange={() => handleTogglePriority(opt.id)} className="sr-only" />
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[15px] text-[var(--color-text)]">{opt.label[lang]}</span>
                      <SelectedMark selected={isSelected} />
                    </span>
                    <span className="block text-[13px] text-[var(--color-text-muted)] mt-1 leading-normal">{opt.desc[lang]}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Step 4: Dynamic lifestyle question */}
        {step === 4 && (
          <fieldset className="space-y-6 animate-fadeIn">
            <legend className="mb-6">
              <span className={`block ${eyebrowClass}`}>{isGreek ? 'Βήμα 4 από 4 · Προσαρμογή στον τρόπο ζωής' : 'Step 4 of 4 · Lifestyle tailoring'}</span>
              <h2 ref={headingRef} tabIndex={-1} className={headingClass}>
                {dynamicQuestion.title[lang]}
              </h2>
              <span className="block mt-1.5 text-[15px] font-normal text-[var(--color-text-muted)]">{dynamicQuestion.subtitle[lang]}</span>
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dynamicQuestion.choices.map((choice) => {
                const isSelected = prefs.dynamicAnswer === choice.label.en;
                return (
                  <label key={choice.id} className={choiceCardClass(isSelected, 'p-4')}>
                    <input type="radio" name="lifestyle" value={choice.id} checked={isSelected} onChange={() => handleSelectDynamicChoice(choice)} className="sr-only" />
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[15px] text-[var(--color-text)]">{choice.label[lang]}</span>
                      <SelectedMark selected={isSelected} />
                    </span>
                    <span className="block text-[13px] text-[var(--color-text-muted)] mt-1.5 leading-normal">{choice.desc[lang]}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Navigation */}
        <div className="mt-10 pt-6 border-t border-[var(--color-border)]">
          <p id="step-error" role="alert" className={stepError ? 'mb-4 text-[15px] font-semibold text-[var(--color-danger)]' : ''}>
            {stepError}
          </p>
          <div className="flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setStepError('');
                  setStep(step - 1);
                }}
                className="min-h-11 inline-flex items-center gap-2 px-5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-[15px] font-semibold hover:bg-[var(--color-surface-raised)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isGreek ? 'Πίσω' : 'Back'}</span>
              </button>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="min-h-11 inline-flex items-center gap-2 px-7 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[15px] font-semibold transition-colors shadow-sm"
            >
              {step < TOTAL_STEPS ? (
                <>
                  <span>{isGreek ? 'Συνέχεια' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isGreek ? 'Εύρεση αυτοκινήτων' : 'Find Recommendations'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
