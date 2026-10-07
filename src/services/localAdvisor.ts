import type { BodyStyle, FuelType, MarketRegion, PriorityType, SmartFilterState, UserPreferences, Vehicle } from '../types';

export type AdvisorFilterOverrides = Partial<SmartFilterState> & {
  bodyStyle?: BodyStyle | BodyStyle[];
  fuelType?: FuelType | FuelType[];
  excludeFuelType?: FuelType;
  addPriority?: PriorityType;
  sportyFocus?: boolean;
};

export interface LocalAdvisorResult {
  advisorResponse: string;
  filterOverrides?: AdvisorFilterOverrides;
}

export function refineLocally(
  userMessage: string,
  marketRegion: MarketRegion = 'greece'
): LocalAdvisorResult {
  const isGreek = marketRegion === 'greece';
  const lower = userMessage.trim().toLocaleLowerCase(isGreek ? 'el-GR' : 'en-US');
  const filterOverrides: AdvisorFilterOverrides = {};
  let advisorResponse = isGreek
    ? 'Ενημέρωσα τις προτάσεις με βάση το αίτημά σου.'
    : 'I updated the recommendations based on your request.';

  if (lower.includes('φθην') || lower.includes('κάτω από') || lower.includes('cheaper') || lower.includes('under ') || lower.includes('less money')) {
    filterOverrides.maxPriceEUR = 18000;
    filterOverrides.addPriority = 'low-running-costs';
    advisorResponse = isGreek
      ? 'Δίνω μεγαλύτερο βάρος σε χαμηλότερη τιμή αγοράς και κόστος χρήσης.'
      : 'I am prioritizing a lower purchase price and lower running costs.';
  } else if (lower.includes('σπορ') || lower.includes('γρήγορ') || lower.includes('sport') || lower.includes('faster') || lower.includes('fun')) {
    filterOverrides.addPriority = 'performance';
    filterOverrides.sportyFocus = true;
    advisorResponse = isGreek
      ? 'Δίνω περισσότερο βάρος σε επιδόσεις και οδηγική αίσθηση.'
      : 'I am giving more weight to performance and driving feel.';
  }

  if (lower.includes('suv')) {
    filterOverrides.bodyStyle = ['Compact SUV', 'Mid-size SUV', 'Large SUV', 'Crossover'];
    advisorResponse = isGreek
      ? 'Κρατάω SUV και crossover με ψηλότερη θέση οδήγησης και πρακτικούς χώρους.'
      : 'I kept SUVs and crossovers with a higher seating position and practical space.';
  }

  const rejectsDiesel = (lower.includes('diesel') || lower.includes('ντίζελ')) &&
    (lower.includes("don't") || lower.includes('dont') || lower.includes(' no ') || lower.startsWith('no ') || lower.includes('δεν') || lower.includes('όχι'));
  if (rejectsDiesel) {
    filterOverrides.excludeFuelType = 'Diesel';
    advisorResponse = isGreek
      ? 'Αφαίρεσα τα diesel και κράτησα βενζίνη, υβριδικά και ηλεκτρικά.'
      : 'I removed diesel and kept petrol, hybrid and electric options.';
  } else if (lower.includes('electric') || lower.includes(' ev') || lower.startsWith('ev') || lower.includes('ηλεκτρ')) {
    filterOverrides.fuelType = ['Electric', 'Plug-in Hybrid'];
    advisorResponse = isGreek
      ? 'Εστιάζω σε ηλεκτρικά και plug-in hybrid.'
      : 'I am focusing on electric and plug-in hybrid cars.';
  }

  if (lower.includes('automatic') || lower.includes('αυτόματ') || lower.includes('αυτοματ')) {
    filterOverrides.transmissions = ['Automatic'];
    advisorResponse = isGreek
      ? 'Κρατάω μόνο αυτόματα κιβώτια.'
      : 'I kept automatic transmissions only.';
  }

  return { advisorResponse, filterOverrides };
}

export interface LocalComparisonResult {
  headline: string;
  tradeOffs: string[];
  verdict: string;
}

export function compareLocally(
  vehicles: Vehicle[],
  userPreferences: UserPreferences,
  marketRegion: MarketRegion = 'greece'
): LocalComparisonResult | null {
  if (vehicles.length < 2) return null;
  const isGreek = marketRegion === 'greece';
  const [a, b] = vehicles;
  const priorities = userPreferences.priorities.join(', ');

  return {
    headline: isGreek
      ? `Τα ${a.make} ${a.model} και ${b.make} ${b.model} έχουν διαφορετικό ισοζύγιο κόστους, αξιοπιστίας και πρακτικότητας.`
      : `The ${a.make} ${a.model} and ${b.make} ${b.model} trade cost, reliability and practicality differently.`,
    tradeOffs: isGreek
      ? [
          `${a.make} ${a.model}: αξιοπιστία ${a.reliabilityRating}/5, κατανάλωση ${a.fuelEconomy}, χώρος ${a.cargoCapacityLiters} L.`,
          `${b.make} ${b.model}: αξιοπιστία ${b.reliabilityRating}/5, κατανάλωση ${b.fuelEconomy}, χώρος ${b.cargoCapacityLiters} L.`
        ]
      : [
          `${a.make} ${a.model}: ${a.reliabilityRating}/5 reliability, ${a.fuelEconomy}, ${a.cargoCapacityLiters} L cargo.`,
          `${b.make} ${b.model}: ${b.reliabilityRating}/5 reliability, ${b.fuelEconomy}, ${b.cargoCapacityLiters} L cargo.`
        ],
    verdict: isGreek
      ? `Διάλεξε το μοντέλο που ταιριάζει καλύτερα στις προτεραιότητές σου${priorities ? ` (${priorities})` : ''} και έλεγξε το συγκεκριμένο μεταχειρισμένο πριν την αγορά.`
      : `Choose the model that best fits your priorities${priorities ? ` (${priorities})` : ''}, then inspect the specific used car before purchase.`
  };
}
