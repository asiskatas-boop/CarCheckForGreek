import React, { useState } from 'react';
import {
  UserPreferences,
  BudgetRangeId,
  UsageType,
  PriorityType,
  LifestyleOption,
  Currency,
  PaymentMethod,
  MarketRegion
} from '../types';
import { CURRENCY_RATES, formatPrice } from '../services/currency';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  HelpCircle,
  Sliders,
  DollarSign,
  Car,
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

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  initialPreferences,
  onComplete,
  currency,
  marketRegion = 'global'
}) => {
  const isGreek = marketRegion === 'greece';
  const [step, setStep] = useState<number>(1);
  const [prefs, setPrefs] = useState<UserPreferences>(initialPreferences);
  const [showCustomBudget, setShowCustomBudget] = useState<boolean>(false);
  const [customMin, setCustomMin] = useState<number>(1500);
  const [customMax, setCustomMax] = useState<number>(15000);
  const [customMonthly, setCustomMonthly] = useState<string>('');

  const symbol = CURRENCY_RATES[currency].symbol;

  // Question 1 Budget Options
  const budgetOptions: { id: BudgetRangeId; label: string; desc: string }[] = [
    {
      id: '1.5k-5k',
      label: `${symbol}1,500 – ${symbol}5,000`,
      desc: isGreek
        ? 'Αξιόπιστα οικονομικά μοντέλα πόλης (Yaris Mk1, Punto FIRE, Micra K12, Getz) με ελάχιστα τέλη και φθηνά ανταλλακτικά'
        : 'Essential reliable runabouts (Toyota Yaris Mk1, Fiat Punto, Nissan Micra) with rock-bottom running costs'
    },
    {
      id: '5k-10k',
      label: `${symbol}5,000 – ${symbol}10,000`,
      desc: isGreek
        ? 'Δοκιμασμένα αυτοκίνητα πόλης & supermini με χαμηλή κατανάλωση (Yaris Mk2/3, Fiesta, Polo, C3)'
        : 'Solid everyday hatchbacks and small cars with low depreciation'
    },
    {
      id: '10k-20k',
      label: `${symbol}10,000 – ${symbol}20,000`,
      desc: isGreek
        ? 'Σύγχρονα υβριδικά (Yaris Hybrid, Auris) με 0€ τέλη κυκλοφορίας & ελεύθερο δακτύλιο'
        : 'Reliable modern hatchbacks, superminis & efficient self-charging hybrids'
    },
    {
      id: '20k-30k',
      label: `${symbol}20,000 – ${symbol}30,000`,
      desc: isGreek
        ? 'Crossover & οικογενειακά (Corolla Hybrid, Yaris Cross, Octavia, CX-5)'
        : 'Sweet spot: recent compact SUVs, estates & proven electric vehicles'
    },
    {
      id: '30k-40k',
      label: `${symbol}30,000 – ${symbol}40,000`,
      desc: isGreek
        ? 'Ηλεκτρικά (Tesla Model 3/Y, Ioniq 5), executive wagons & μεσαία SUV'
        : 'Long-range electric vehicles, premium wagons & family SUVs'
    },
    {
      id: '40k-60k',
      label: `${symbol}40,000 – ${symbol}60,000`,
      desc: isGreek
        ? 'Executive premium SUV & πολυτελή (Volvo XC60, BMW 3, Macan)'
        : 'Executive saloons, luxury crossovers & high performance'
    },
    {
      id: '60k-plus',
      label: `${symbol}60,000+`,
      desc: isGreek
        ? 'Κορυφαία πολυτέλεια, Porsche & σπορ επιδόσεις'
        : 'Top-tier luxury, sports performance & flagship engineering'
    },
    {
      id: 'not-sure',
      label: isGreek ? 'Δεν είμαι σίγουρος ακόμα' : 'Not sure yet',
      desc: isGreek
        ? 'Το CarCheck θα υπολογίσει ένα λογικό εύρος με βάση τις ανάγκες σου'
        : 'We will infer a sensible range from your lifestyle answers'
    }
  ];

  // Question 2 Usages
  const usageOptions: { id: UsageType; label: string; icon: React.ElementType }[] = [
    { id: 'daily-commuting', label: 'Daily commuting', icon: Route },
    { id: 'city-driving', label: 'City driving & parking', icon: Building2 },
    { id: 'family-use', label: 'Family & kids', icon: Users },
    { id: 'long-road-trips', label: 'Long road trips / Motorway', icon: Map },
    { id: 'weekend-driving', label: 'Weekend leisure', icon: TentTree },
    { id: 'business', label: 'Business & client travel', icon: Briefcase },
    { id: 'carrying-equipment', label: 'Carrying bulky equipment', icon: Package },
    { id: 'outdoor-activities', label: 'Outdoor adventures & sports', icon: Trees },
    { id: 'performance-fun', label: 'Performance & driving fun', icon: Gauge },
    { id: 'first-car', label: 'First car / New driver', icon: ShieldCheck },
    { id: 'luxury-comfort', label: 'Luxury & quiet comfort', icon: Gem }
  ];

  // Question 3 Priorities
  const priorityOptions: { id: PriorityType; label: string; desc: string }[] = [
    { id: 'reliability', label: 'Bulletproof Reliability', desc: 'Minimal breakdown risk & proven durability' },
    { id: 'low-running-costs', label: 'Low Running Costs', desc: 'Cheap parts, low insurance & low service bills' },
    { id: 'fuel-economy', label: 'Fuel / Energy Economy', desc: 'Maximum miles per gallon or kWh' },
    { id: 'performance', label: 'Sporty Performance', desc: 'Sharp handling, quick acceleration & responsiveness' },
    { id: 'comfort', label: 'Quiet Cabin & Composure', desc: 'Supple suspension, acoustic glass & comfortable seats' },
    { id: 'practicality', label: 'Maximum Practicality', desc: 'Big boot, versatile seats & storage solutions' },
    { id: 'safety', label: 'Top Crash Safety & ADAS', desc: '5-star crash ratings & advanced driver assistance' },
    { id: 'technology', label: 'Modern Infotainment & Tech', desc: 'Wireless CarPlay, great screens & smart connectivity' },
    { id: 'resale-value', label: 'High Resale Value', desc: 'Slow depreciation curve over 3–5 years' },
    { id: 'environmental-impact', label: 'Low Emissions / Green', desc: 'Zero tailpipe emissions or hybrid efficiency' },
    { id: 'luxury', label: 'Premium Brand Prestige', desc: 'High-end interior materials and prestige badge' },
    { id: 'design', label: 'Standout Exterior Design', desc: 'Eye-catching styling and road presence' }
  ];

  // Determine dynamic question 4 based on previous answers
  const isFamily = prefs.usages.includes('family-use');
  const isCity = prefs.usages.includes('city-driving') && !isFamily;
  const isPerformance = prefs.usages.includes('performance-fun') && !isFamily && !isCity;
  const isOutdoor = (prefs.usages.includes('outdoor-activities') || prefs.usages.includes('carrying-equipment')) && !isFamily;

  let dynamicTitle = 'Tell us a little about your lifestyle.';
  let dynamicSubtitle = 'This helps CarCheck dial in seating count, cargo volume, and drivetrain requirements.';

  interface DynamicChoice {
    id: string;
    label: string;
    desc: string;
    mapsToLifestyle?: LifestyleOption[];
  }

  let dynamicChoices: DynamicChoice[] = [];

  if (isFamily) {
    dynamicTitle = 'How many people will usually be in the car?';
    dynamicSubtitle = 'We will calculate ideal rear seat room and boot volume for pushchairs.';
    dynamicChoices = [
      {
        id: 'small-fam',
        label: 'Small family (2–3 people)',
        desc: 'Need 1 child seat and everyday stroller space',
        mapsToLifestyle: ['small-family', 'child-seats']
      },
      {
        id: 'standard-fam',
        label: 'Family of 4 with luggage',
        desc: 'Two kids, school runs, holiday suitcases and weekly groceries',
        mapsToLifestyle: ['small-family', 'child-seats', 'lots-of-luggage']
      },
      {
        id: 'large-fam',
        label: 'Large family (Need 6 or 7 seats)',
        desc: '3+ kids, carpooling, or extended family needing 3rd row seating',
        mapsToLifestyle: ['large-family', 'frequent-passengers']
      },
      {
        id: 'dog-fam',
        label: 'Family with a dog',
        desc: 'Need dedicated boot space for a dog crate alongside gear',
        mapsToLifestyle: ['small-family', 'dog-owner', 'lots-of-luggage']
      }
    ];
  } else if (isCity) {
    dynamicTitle = 'Is easy parking or a compact footprint your top priority?';
    dynamicSubtitle = 'Urban environments require effortless maneuverability and visibility.';
    dynamicChoices = [
      {
        id: 'tight-parallel',
        label: 'Strict compact size for tight street parking',
        desc: 'Sub-4.2 meter car that fits in spaces others drive past',
        mapsToLifestyle: ['easy-parking', 'drive-alone']
      },
      {
        id: 'underground-garages',
        label: 'Underground garages & tight ramps',
        desc: 'Need tight turning circle, cameras and parking sensors',
        mapsToLifestyle: ['easy-parking']
      },
      {
        id: 'high-crossover',
        label: 'High seating position for urban visibility',
        desc: 'Prefer a compact crossover view over low hatchback seating',
        mapsToLifestyle: ['easy-parking', 'couple']
      },
      {
        id: 'flexible-urban',
        label: 'Balanced: mainly city with occasional road trip',
        desc: 'Comfortable on motorways too without feeling bulky in town',
        mapsToLifestyle: ['motorway-driving']
      }
    ];
  } else if (isPerformance) {
    dynamicTitle = 'Do you care more about acceleration or handling?';
    dynamicSubtitle = 'Choose how you like your car to deliver excitement on the road.';
    dynamicChoices = [
      {
        id: 'instant-accel',
        label: 'Rapid instant acceleration',
        desc: 'Electric punch or strong turbo torque for rapid overtakes',
        mapsToLifestyle: ['motorway-driving']
      },
      {
        id: 'chassis-handling',
        label: 'Sharp chassis balance & cornering agility',
        desc: 'Go-kart handling feel on twisty B-roads',
        mapsToLifestyle: ['drive-alone']
      },
      {
        id: 'rwd-balance',
        label: 'Rear-wheel drive purity & steering feedback',
        desc: 'Traditional 50:50 sports saloon balance',
        mapsToLifestyle: ['drive-alone', 'motorway-driving']
      },
      {
        id: 'all-weather-grip',
        label: 'All-weather traction (AWD grip in wet/snow)',
        desc: 'High performance usable in rain, sleet, or ice',
        mapsToLifestyle: ['mountains-snow']
      }
    ];
  } else if (isOutdoor) {
    dynamicTitle = 'What kind of terrain or gear do you tackle?';
    dynamicSubtitle = 'Ensures adequate ground clearance, cargo capacity, and traction.';
    dynamicChoices = [
      {
        id: 'snow-mountains',
        label: 'Snow, ski trips & mountain passes',
        desc: 'All-Wheel Drive (AWD) is essential for winter conditions',
        mapsToLifestyle: ['mountains-snow', 'lots-of-luggage']
      },
      {
        id: 'bulky-sports',
        label: 'Bicycles, surfboards or camping gear',
        desc: 'Need roof rails, large load bay and rugged interior',
        mapsToLifestyle: ['lots-of-luggage']
      },
      {
        id: 'gravel-ground',
        label: 'Rough gravel tracks / rural roads',
        desc: 'Extra ground clearance (190mm+) to clear rocks & ruts',
        mapsToLifestyle: ['lots-of-luggage']
      },
      {
        id: 'dog-trails',
        label: 'Dog walks & wet gear',
        desc: 'Durable boot lining and practical hatchback or wagon tailgate',
        mapsToLifestyle: ['dog-owner']
      }
    ];
  } else {
    // General lifestyle
    dynamicChoices = [
      {
        id: 'alone',
        label: 'Mostly drive alone',
        desc: 'Prioritize personal comfort, driving feel and low costs',
        mapsToLifestyle: ['drive-alone']
      },
      {
        id: 'couple',
        label: 'Couple (2 people)',
        desc: 'Balanced space for two with luggage for getaways',
        mapsToLifestyle: ['couple']
      },
      {
        id: 'small-fam',
        label: 'Small family with children',
        desc: 'Safe rear seating with child seat ISOFIX points',
        mapsToLifestyle: ['small-family', 'child-seats']
      },
      {
        id: 'lots-of-luggage',
        label: 'Frequently carry lots of luggage or gear',
        desc: '500+ liter cargo capacity is essential',
        mapsToLifestyle: ['lots-of-luggage']
      },
      {
        id: 'dog',
        label: 'Dog owner',
        desc: 'Easy-access tailgate for our four-legged family member',
        mapsToLifestyle: ['dog-owner']
      },
      {
        id: 'mountains',
        label: 'Drive in mountains or snow',
        desc: 'Confidence on icy slopes and wet climbs',
        mapsToLifestyle: ['mountains-snow']
      },
      {
        id: 'parking',
        label: 'Tight city parking is a daily challenge',
        desc: 'Needs compact exterior dimensions and sensors',
        mapsToLifestyle: ['easy-parking']
      },
      {
        id: 'motorway',
        label: 'Regular high-speed motorway driving',
        desc: 'Need relaxed cruising, adaptive cruise control and quiet cabin',
        mapsToLifestyle: ['motorway-driving']
      }
    ];
  }

  // Handlers
  const handleSelectBudget = (id: BudgetRangeId) => {
    if (id === 'custom') {
      setShowCustomBudget(true);
      setPrefs({
        ...prefs,
        budgetId: 'custom',
        budgetCustomMin: customMin,
        budgetCustomMax: customMax
      });
    } else {
      setShowCustomBudget(false);
      setPrefs({
        ...prefs,
        budgetId: id
      });
    }
  };

  const handleToggleUsage = (id: UsageType) => {
    const exists = prefs.usages.includes(id);
    const updated = exists ? prefs.usages.filter((u) => u !== id) : [...prefs.usages, id];
    setPrefs({ ...prefs, usages: updated });
  };

  const handleTogglePriority = (id: PriorityType) => {
    const exists = prefs.priorities.includes(id);
    if (exists) {
      setPrefs({
        ...prefs,
        priorities: prefs.priorities.filter((p) => p !== id)
      });
    } else {
      if (prefs.priorities.length >= 3) {
        // limit to 3
        return;
      }
      setPrefs({
        ...prefs,
        priorities: [...prefs.priorities, id]
      });
    }
  };

  const handleSelectDynamicChoice = (choice: DynamicChoice) => {
    const mappedLifestyle = choice.mapsToLifestyle || [];
    setPrefs({
      ...prefs,
      dynamicAnswer: choice.label,
      lifestyle: Array.from(new Set([...prefs.lifestyle, ...mappedLifestyle]))
    });
  };

  const canProceedStep1 = true;
  const canProceedStep2 = prefs.usages.length > 0;
  const canProceedStep3 = prefs.priorities.length > 0;
  const canProceedStep4 = Boolean(prefs.dynamicAnswer) || prefs.lifestyle.length > 0;

  const handleFinish = () => {
    onComplete(prefs);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-[13px] font-bold tracking-normal text-[var(--color-text-muted)] mb-2">
          <span>{isGreek ? `Ερώτηση ${step} από 4` : `Question ${step} of 4`}</span>
          <span>
            {step === 1
              ? isGreek ? 'Προϋπολογισμός (από 1.500€)' : 'Budget (from €1,500)'
              : step === 2
              ? isGreek ? 'Χρήση Οχήματος' : 'Usage Profile'
              : step === 3
              ? isGreek ? 'Προτεραιότητες' : 'Priorities'
              : isGreek ? 'Τρόπος Ζωής & Δακτύλιος' : 'Lifestyle Tailoring'}
          </span>
        </div>
        <div className="w-full h-1 bg-[var(--color-surface-strong)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] rounded-xl transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Budget */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <div className="text-[13px] font-semibold tracking-normal text-[var(--color-accent-text)] mb-1">
              {isGreek ? 'Βήμα 1 από 4 · Οικονομικές Παράμετροι' : 'Step 1 of 4 · Financial Parameters'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
              {isGreek ? 'Ποιο είναι το budget σου;' : 'What’s your budget?'}
            </h2>
            <p className="mt-1.5 text-[15px] text-[var(--color-text-muted)]">
              {isGreek
                ? 'Επίλεξε ένα κατά προσέγγιση εύρος τιμής (από 1.500€) ή όρισε το δικό σου ποσό. Αν δεν είσαι σίγουρος, το CarCheck θα υπολογίσει το ιδανικό ποσό.'
                : 'Select an approximate purchase range (starting from €1,500) or enter a custom amount. If unsure, CarCheck infers a sensible budget.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {budgetOptions.map((opt) => {
              const isSelected = prefs.budgetId === opt.id && !showCustomBudget;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectBudget(opt.id)}
                  aria-pressed={isSelected}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-text)] shadow-xs'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] text-[var(--color-text)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-base text-[var(--color-text)]">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
                    {opt.desc}
                  </p>
                </button>
              );
            })}

            {/* Custom Budget Card */}
            <button
              type="button"
              onClick={() => handleSelectBudget('custom')}
              aria-pressed={showCustomBudget || prefs.budgetId === 'custom'}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                showCustomBudget || prefs.budgetId === 'custom'
                  ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-text)] shadow-xs'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] text-[var(--color-text)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base text-[var(--color-text)]">
                  {isGreek ? 'Προσαρμοσμένο Ποσό (από 1.500€)' : 'Custom Amount (from €1,500)'}
                </span>
                {(showCustomBudget || prefs.budgetId === 'custom') && (
                  <div className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
                {isGreek
                  ? 'Όρισε ακριβές ελάχιστο και μέγιστο ποσό αγοράς'
                  : 'Define exact minimum and maximum purchase targets'}
              </p>
            </button>
          </div>

          {/* Custom Budget Inputs (Shown when custom is selected) */}
          {(showCustomBudget || prefs.budgetId === 'custom') && (
            <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-accent)]/50 animate-fadeIn">
              <div className="text-[13px] font-bold tracking-normal text-[var(--color-accent-text)] mb-3">
                {isGreek ? 'Ορισμός Εύρους Budget (από 1.500€)' : 'Define Budget Target Range (From €1,500)'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="custom-budget-min" className="text-[13px] text-[var(--color-text-muted)] block mb-1">
                    {isGreek ? 'Ελάχιστο Ποσό' : 'Minimum Budget'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--color-text-muted)]">
                      {symbol}
                    </span>
                    <input
                      id="custom-budget-min"
                      type="number"
                      inputMode="numeric"
                      min={1500}
                      step={500}
                      value={customMin}
                      onChange={(e) => {
                        const val = Math.max(1500, parseInt(e.target.value, 10) || 1500);
                        setCustomMin(val);
                        setPrefs({ ...prefs, budgetId: 'custom', budgetCustomMin: val, budgetCustomMax: customMax });
                      }}
                      className="w-full min-h-11 pl-8 pr-3 py-2 text-[15px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="custom-budget-max" className="text-[13px] text-[var(--color-text-muted)] block mb-1">
                    {isGreek ? 'Μέγιστο Ποσό' : 'Maximum Budget'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--color-text-muted)]">
                      {symbol}
                    </span>
                    <input
                      id="custom-budget-max"
                      type="number"
                      inputMode="numeric"
                      min={customMin}
                      step={500}
                      value={customMax}
                      onChange={(e) => {
                        const val = Math.max(customMin, parseInt(e.target.value, 10) || customMin);
                        setCustomMax(val);
                        setPrefs({ ...prefs, budgetId: 'custom', budgetCustomMin: customMin, budgetCustomMax: val });
                      }}
                      className="w-full min-h-11 pl-8 pr-3 py-2 text-[15px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Optional Financing details (non-mandatory) */}
          <div className="mt-6 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between text-[13px] font-semibold text-[var(--color-text)] mb-3">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[var(--color-accent-text)]" />
                {isGreek ? 'Προαιρετικό: Τρόπος Πληρωμής' : 'Optional: Purchase or Financing Preference'}
              </span>
              <span className="text-xs font-normal text-[var(--color-text-muted)]">
                {isGreek ? 'Μη υποχρεωτικό' : 'Not mandatory'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'any', label: isGreek ? 'Μετρητά ή Χρηματοδότηση' : 'Cash or Financing' },
                { id: 'cash', label: isGreek ? 'Αγορά Μετρητοίς' : 'Cash Purchase' },
                { id: 'financing', label: isGreek ? 'Χρηματοδότηση / Δάνεια' : 'Financing / Loan' }
              ].map((pMethod) => (
                <button
                  key={pMethod.id}
                  type="button"
                  aria-pressed={prefs.paymentMethod === pMethod.id}
                  onClick={() =>
                    setPrefs({
                      ...prefs,
                      paymentMethod: pMethod.id as PaymentMethod
                    })
                  }
                  className={`min-h-11 px-3 rounded-xl text-[13px] font-medium border text-center transition-colors cursor-pointer ${
                    prefs.paymentMethod === pMethod.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-text)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {pMethod.label}
                </button>
              ))}
            </div>

            {prefs.paymentMethod === 'financing' && (
              <div className="mt-3 flex items-center gap-3">
                <label htmlFor="monthly-payment-max" className="text-[13px] text-[var(--color-text-muted)]">
                  {isGreek ? 'Μέγιστη μηνιαία δόση:' : 'Target monthly payment:'}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-[var(--color-text-muted)]">
                    {symbol}
                  </span>
                  <input
                    id="monthly-payment-max"
                    type="number"
                    inputMode="numeric"
                    placeholder="π.χ. 250"
                    value={customMonthly}
                    onChange={(e) => {
                      setCustomMonthly(e.target.value);
                      const parsed = parseInt(e.target.value, 10);
                      setPrefs({ ...prefs, monthlyPaymentMax: isNaN(parsed) ? undefined : parsed });
                    }}
                    className="w-36 min-h-11 pl-6 pr-2 py-2 text-[15px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[var(--color-text-muted)]">
                    /μήνα
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: What will you use the car for? */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <div className="text-[13px] font-semibold tracking-normal text-[var(--color-accent-text)] mb-1">
              {isGreek ? 'Βήμα 2 από 4 · Προφίλ Χρήσης' : 'Step 2 of 4 · Usage profile'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
              {isGreek ? 'Για ποια χρήση προορίζεται κυρίως το αυτοκίνητο;' : 'What will you mainly use the car for?'}
            </h2>
            <p className="mt-1.5 text-[15px] text-[var(--color-text-muted)]">
              {isGreek
                ? 'Επίλεξε όσα ισχύουν. Το CarCheck υπολογίζει αυτόματα διαστάσεις, χώρους, κατανάλωση και οδική συμπεριφορά.'
                : 'Select all that apply. CarCheck uses this to calculate cabin space, ground clearance, fuel efficiency, and driving dynamics automatically.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {usageOptions.map((opt) => {
              const isSelected = prefs.usages.includes(opt.id);
              const localizedLabel = isGreek
                ? opt.id === 'daily-commuting' ? 'Καθημερινή μετακίνηση'
                : opt.id === 'city-driving' ? 'Κίνηση & παρκάρισμα στην πόλη'
                : opt.id === 'family-use' ? 'Οικογένεια & παιδιά'
                : opt.id === 'long-road-trips' ? 'Ταξίδια στην εθνική'
                : opt.id === 'weekend-driving' ? 'Σαββατοκύριακο & εκδρομές'
                : opt.id === 'business' ? 'Επαγγελματικά ταξίδια'
                : opt.id === 'carrying-equipment' ? 'Μεταφορά εξοπλισμού'
                : opt.id === 'outdoor-activities' ? 'Outdoor & βουνό'
                : opt.id === 'performance-fun' ? 'Σπορ οδήγηση & επιδόσεις'
                : opt.id === 'first-car' ? 'Πρώτο αυτοκίνητο / Νέος οδηγός'
                : 'Πολυτέλεια & ήσυχη καμπίνα'
                : opt.label;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleToggleUsage(opt.id)}
                  aria-pressed={isSelected}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                    isSelected
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-text)] shadow-xs'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] text-[var(--color-text)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {React.createElement(opt.icon, { className: 'w-5 h-5 text-[var(--color-accent-text)]', 'aria-hidden': true })}
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-[13px] sm:text-[15px] text-[var(--color-text)] mt-2">
                    {localizedLabel}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[13px] text-[var(--color-text-muted)] flex items-center gap-1.5">
            <span>
              {isGreek
                ? `Επιλεγμένα: ${prefs.usages.length} χρήσεις`
                : `Selected: ${prefs.usages.length} purpose${prefs.usages.length === 1 ? '' : 's'}`}
            </span>
          </div>
        </div>
      )}

      {/* Step 3: What matters most? */}
      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <div className="text-[13px] font-semibold tracking-normal text-[var(--color-accent-text)] mb-1">
                {isGreek ? 'Βήμα 3 από 4 · Κριτήρια Αξιολόγησης' : 'Step 3 of 4 · Ranking criteria'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
                {isGreek ? 'Τι έχει μεγαλύτερη σημασία για εσένα;' : 'What matters most to you?'}
              </h2>
              <p className="mt-1.5 text-[15px] text-[var(--color-text-muted)]">
                {isGreek
                  ? 'Επίλεξε έως και 3 προτεραιότητες. Ο αλγόριθμος θα δώσει ιδιαίτερο βάρος στην αξιοπιστία ή το χαμηλό κόστος.'
                  : 'Choose up to 3 core priorities. Our engine weights these heavily so reliability or fuel bills truly govern the final choices.'}
              </p>
            </div>

            <div role="status" aria-live="polite" className="self-start sm:self-auto text-[13px] font-semibold px-3 py-1.5 rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]">
              {isGreek ? `${prefs.priorities.length} από 3 επιλεγμένα` : `${prefs.priorities.length} of 3 selected`}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {priorityOptions.map((opt) => {
              const isSelected = prefs.priorities.includes(opt.id);
              const isDisabled = !isSelected && prefs.priorities.length >= 3;

              const localizedLabel = isGreek
                ? opt.id === 'reliability' ? 'Αδιαπραγμάτευτη Αξιοπιστία'
                : opt.id === 'low-running-costs' ? 'Χαμηλό Κόστος Συντήρησης (Ανταλλακτικά)'
                : opt.id === 'fuel-economy' ? 'Οικονομία Καυσίμου / Ρεύματος'
                : opt.id === 'performance' ? 'Σπορ Επιδόσεις & Οδική Συμπεριφορά'
                : opt.id === 'comfort' ? 'Άνεση & Ηχομόνωση Καμπίνας'
                : opt.id === 'practicality' ? 'Μέγιστη Πρακτικότητα & Χώροι'
                : opt.id === 'safety' ? 'Κορυφαία Ασφάλεια Crash Test & ADAS'
                : opt.id === 'technology' ? 'Σύγχρονη Τεχνολογία & Οθόνες'
                : opt.id === 'resale-value' ? 'Υψηλή Μεταπωλητική Αξία'
                : opt.id === 'environmental-impact' ? '0€ Τέλη / Ελεύθερος Δακτύλιος'
                : opt.id === 'luxury' ? 'Premium Κύρος Κατασκευαστή'
                : 'Εντυπωσιακός Σχεδιασμός'
                : opt.label;

              const localizedDesc = isGreek
                ? opt.id === 'reliability' ? 'Ελάχιστη πιθανότητα βλαβών και αντοχή στο χρόνο'
                : opt.id === 'low-running-costs' ? 'Φθηνά σέρβις, χαμηλά ασφάλιστρα & προσιτά ανταλλακτικά'
                : opt.id === 'fuel-economy' ? 'Ελάχιστα λίτρα ανά 100 χλμ ή χαμηλή κατανάλωση kWh'
                : opt.id === 'performance' ? 'Άμεση επιτάχυνση, κοφτερό τιμόνι & δυναμική οδήγηση'
                : opt.id === 'comfort' ? 'Απορροφητική ανάρτηση & ξεκούραστα καθίσματα'
                : opt.id === 'practicality' ? 'Μεγάλο πορτμπαγκάζ και έξυπνες θήκες'
                : opt.id === 'safety' ? '5 αστέρια Euro NCAP & ηλεκτρονικά συστήματα υποβοήθησης'
                : opt.id === 'technology' ? 'Apple CarPlay / Android Auto και ευκρινείς οθόνες'
                : opt.id === 'resale-value' ? 'Αργή πτώση αξίας στην αγορά μεταχειρισμένων'
                : opt.id === 'environmental-impact' ? 'Απαλλαγή από τέλη και ελεύθερη είσοδος στο κέντρο'
                : opt.id === 'luxury' ? 'Υλικά υψηλής ποιότητας και κορυφαία αίσθηση'
                : 'Ξεχωριστή εμφάνιση και δυναμικές γραμμές'
                : opt.desc;

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleTogglePriority(opt.id)}
                  aria-pressed={isSelected}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                  } ${
                    isSelected
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-text)] shadow-xs'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] text-[var(--color-text)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[15px] text-[var(--color-text)]">
                      {localizedLabel}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-[13px] text-[var(--color-text-muted)] mt-1 leading-normal">
                    {localizedDesc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Dynamic Lifestyle Question */}
      {step === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <div className="text-[13px] font-semibold tracking-normal text-[var(--color-accent-text)] mb-1">
              {isGreek ? 'Βήμα 4 από 4 · Προσαρμογή στον Τρόπο Ζωής' : 'Step 4 of 4 · Dynamic lifestyle tailoring'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
              {isGreek
                ? isFamily ? 'Πόσα άτομα θα επιβαίνουν συνήθως στο αυτοκίνητο;'
                  : isCity ? 'Είναι το εύκολο παρκάρισμα και οι μαζεμένες διαστάσεις η απόλυτη προτεραιότητα;'
                  : isPerformance ? 'Σε ενδιαφέρει περισσότερο η επιτάχυνση ή το κράτημα;'
                  : isOutdoor ? 'Σε τι είδους διαδρομές κινείσαι συνήθως;'
                  : 'Πες μας λίγα λόγια για τον τρόπο ζωής σου.'
                : dynamicTitle}
            </h2>
            <p className="mt-1.5 text-[15px] text-[var(--color-text-muted)]">
              {isGreek
                ? 'Αυτή η λεπτομέρεια βοηθά το CarCheck να επιλέξει τον κατάλληλο αριθμό θέσεων, όγκο πορτμπαγκάζ και τύπο κίνησης.'
                : dynamicSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dynamicChoices.map((choice) => {
              const isSelected = prefs.dynamicAnswer === choice.label;

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleSelectDynamicChoice(choice)}
                  aria-pressed={isSelected}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-raised)] text-[var(--color-text)] shadow-xs'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] text-[var(--color-text)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[15px] text-[var(--color-text)]">
                      {choice.label}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5 leading-normal">
                    {choice.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-10 flex items-center justify-between pt-6 border-t border-[var(--color-border)]">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-[14px] font-semibold hover:bg-[var(--color-surface-raised)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isGreek ? 'Πίσω' : 'Back'}</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            disabled={
              (step === 1 && !canProceedStep1) ||
              (step === 2 && !canProceedStep2) ||
              (step === 3 && !canProceedStep3)
            }
            onClick={() => setStep(step + 1)}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <span>{isGreek ? 'Συνέχεια' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canProceedStep4}
            onClick={handleFinish}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{isGreek ? 'Εύρεση αυτοκινήτων' : 'Find recommendations'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
