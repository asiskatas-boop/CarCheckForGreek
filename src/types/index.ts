export type Currency = 'EUR' | 'USD' | 'GBP';

export type MarketRegion = 'global' | 'greece';

export type BudgetRangeId =
  | '1.5k-5k'
  | '5k-10k'
  | 'under-10k'
  | '10k-20k'
  | '20k-30k'
  | '30k-40k'
  | '40k-60k'
  | '60k-plus'
  | 'custom'
  | 'not-sure';

export type PaymentMethod = 'cash' | 'financing' | 'any';

export type UsageType =
  | 'daily-commuting'
  | 'city-driving'
  | 'family-use'
  | 'long-road-trips'
  | 'weekend-driving'
  | 'business'
  | 'carrying-equipment'
  | 'outdoor-activities'
  | 'performance-fun'
  | 'first-car'
  | 'luxury-comfort';

export type PriorityType =
  | 'reliability'
  | 'low-running-costs'
  | 'fuel-economy'
  | 'performance'
  | 'comfort'
  | 'technology'
  | 'safety'
  | 'practicality'
  | 'luxury'
  | 'design'
  | 'resale-value'
  | 'environmental-impact';

export type LifestyleOption =
  | 'drive-alone'
  | 'couple'
  | 'small-family'
  | 'large-family'
  | 'frequent-passengers'
  | 'lots-of-luggage'
  | 'child-seats'
  | 'dog-owner'
  | 'mountains-snow'
  | 'easy-parking'
  | 'motorway-driving';

export type BodyStyle =
  | 'Hatchback'
  | 'Sedan'
  | 'Estate / Wagon'
  | 'Compact SUV'
  | 'Mid-size SUV'
  | 'Large SUV'
  | 'City car'
  | 'Coupe'
  | 'Crossover'
  | 'MPV';

export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Plug-in Hybrid' | 'Electric';

export type TransmissionType = 'Automatic' | 'Manual' | 'Any';

export interface UserPreferences {
  budgetId: BudgetRangeId;
  budgetCustomMin?: number;
  budgetCustomMax?: number;
  paymentMethod: PaymentMethod;
  monthlyPaymentMax?: number;
  currency: Currency;
  marketRegion?: MarketRegion;
  usages: UsageType[];
  priorities: PriorityType[]; // up to 3
  lifestyle: LifestyleOption[];
  dynamicAnswer?: string; // response to the dynamic 4th question
}

export interface InferredProfile {
  targetMinPrice: number;
  targetMaxPrice: number;
  preferredBodyStyles: BodyStyle[];
  preferredFuelTypes: FuelType[];
  preferredTransmission: TransmissionType;
  requiresAWD: boolean;
  minSeats: number;
  minLuggageLiters: number;
  highReliabilityNeeded: boolean;
  lowRunningCostsNeeded: boolean;
  highPerformanceNeeded: boolean;
  comfortPriority: boolean;
  techPriority: boolean;
  isCityCommuter: boolean;
  isLongDistanceDriver: boolean;
  summaryRationale: string;
}

export interface InspectionCheckItem {
  component: string;
  check: string;
  importance: 'Critical' | 'Important' | 'Advisory';
  tip: string;
}

export type DataSourceKind = 'authoritative' | 'commercial' | 'marketplace' | 'reference';

export interface DataProvenance {
  provider: string;
  kind: DataSourceKind;
  sourceRecordId?: string;
  sourceUrl?: string;
  market?: string;
  retrievedAt: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  methodology?: string;
}

export interface VehicleProvenance {
  specifications?: DataProvenance;
  pricing?: DataProvenance;
  taxation?: DataProvenance;
  emissions?: DataProvenance;
  safety?: DataProvenance;
  recalls?: DataProvenance;
  image?: DataProvenance;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  generation: string;
  years: string;
  recommendedYears: string;
  yearsToAvoid?: string;
  bodyStyle: BodyStyle;
  fuelType: FuelType;
  transmission: 'Automatic' | 'Manual' | 'Both available';
  engineSummary: string;
  recommendedPowertrain: string;
  avoidPowertrain?: string;
  horsepower: number;
  acceleration0to100: number; // in seconds
  fuelEconomy: string; // e.g., "4.3 L/100km (65 mpg)" or "15.2 kWh/100km"
  cargoCapacityLiters: number;
  maxCargoCapacityLiters?: number;
  seats: number;
  drivetrain: 'FWD' | 'RWD' | 'AWD';
  typicalPriceMin: number;
  typicalPriceMax: number;
  goodBuyPrice: number;
  excellentBuyPrice: number;
  marketPriceType: 'used' | 'new' | 'both';
  reliabilityRating: 1 | 2 | 3 | 4 | 5; // out of 5
  runningCostLevel: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  comfortLevel: 1 | 2 | 3 | 4 | 5;
  safetyRating: 1 | 2 | 3 | 4 | 5;
  practicalityScore: 1 | 2 | 3 | 4 | 5;
  techScore: 1 | 2 | 3 | 4 | 5;
  engineDisplacementCc?: number; // e.g. 998, 1329, 1498 (Crucial for Greek cc tax & tekmiria)
  greekRoadTaxEur?: number; // Annual Greek road tax (Τέλη κυκλοφορίας, e.g. 0€ for EV/hybrid)
  athensRingExempt?: boolean; // Ελεύθερη είσοδος στο Δακτύλιο Αθηνών (Athens Green Ring)
  greekMarketPopularity?: string; // e.g. "Best-seller in Greece", "Zero road tax hero"
  carGrClassifiedCount?: string; // e.g. "2.300+ αγγελίες στο Car.gr"
  carGrPriceBenchmark?: string; // e.g. "2.200€ – 3.300€ στο Car.gr"
  carGrSearchUrl?: string; // direct search link
  imageUrl: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  notIdealFor: string[];
  knownIssues: string[];
  inspectionChecklist: InspectionCheckItem[];
  defaultExplanation: string;
  provenance?: VehicleProvenance;
}

export type RecommendationCategory =
  | 'Best Overall'
  | 'Best Value'
  | 'Most Reliable'
  | 'Alternative Choice'
  | 'Electric Highlight'
  | 'Practical Champion';

export interface ScoredRecommendation {
  vehicle: Vehicle;
  matchScore: number; // 0 - 100
  category?: RecommendationCategory;
  personalizedReason: string;
  scoreBreakdown: {
    budgetScore: number;
    lifestyleScore: number;
    reliabilityScore: number;
    runningCostsScore: number;
    prioritiesScore: number;
  };
  highlightFeatures: string[];
}

export interface MarketplaceListing {
  id: string;
  vehicleId: string;
  title: string;
  price: number;
  currency: Currency;
  year: number;
  mileageKm: number;
  engine: string;
  transmission: 'Automatic' | 'Manual';
  location: string;
  sellerType: 'Verified Dealer' | 'Private Seller';
  sellerName: string;
  dealRating: 'Excellent Price' | 'Good Price' | 'Fair Price' | 'Above Market';
  dealExplanation: string;
  keyEquipment: string[];
  imageUrl: string;
  listingUrl?: string;
  carGrClassifiedId?: string; // Real Car.gr classified ID e.g. "#33481920"
  carGrDirectUrl?: string;
  publishedDate: string;
  provenance?: DataProvenance;
}

export interface SavedGarageItem {
  id: string;
  vehicleId: string;
  savedAt: string;
  notes: string;
  isFavorite: boolean;
  listingId?: string;
}

export interface SmartFilterState {
  minPrice?: number;
  maxPrice?: number;
  maxPriceEUR?: number;
  makes: string[];
  bodyStyles: BodyStyle[];
  fuelTypes: FuelType[];
  transmissions: string[];
  minYear?: number;
  maxMileageKm?: number;
  minSeats?: number;
  searchQuery: string;
}
