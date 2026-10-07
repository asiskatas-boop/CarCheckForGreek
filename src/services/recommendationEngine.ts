import { VEHICLES } from '../data/vehicles';
import {
  BodyStyle,
  FuelType,
  InferredProfile,
  ScoredRecommendation,
  UserPreferences,
  Vehicle
} from '../types';

export function inferUserProfile(prefs: UserPreferences): InferredProfile {
  let minPrice = 0;
  let maxPrice = 100000;

  switch (prefs.budgetId) {
    case '1.5k-5k':
      minPrice = 1500;
      maxPrice = 5000;
      break;
    case '5k-10k':
      minPrice = 5000;
      maxPrice = 10000;
      break;
    case 'under-10k':
      minPrice = 1500;
      maxPrice = 10000;
      break;
    case '10k-20k':
      minPrice = 10000;
      maxPrice = 20000;
      break;
    case '20k-30k':
      minPrice = 20000;
      maxPrice = 30000;
      break;
    case '30k-40k':
      minPrice = 30000;
      maxPrice = 40000;
      break;
    case '40k-60k':
      minPrice = 40000;
      maxPrice = 60000;
      break;
    case '60k-plus':
      minPrice = 60000;
      maxPrice = 120000;
      break;
    case 'custom':
      minPrice = prefs.budgetCustomMin ?? 1500;
      maxPrice = prefs.budgetCustomMax ?? 35000;
      break;
    case 'not-sure':
      if (prefs.usages.includes('first-car') || prefs.usages.includes('city-driving')) {
        minPrice = 2000;
        maxPrice = 12000;
      } else if (prefs.usages.includes('luxury-comfort') || prefs.priorities.includes('luxury')) {
        minPrice = 35000;
        maxPrice = 60000;
      } else if (prefs.usages.includes('family-use')) {
        minPrice = 18000;
        maxPrice = 35000;
      } else {
        minPrice = 10000;
        maxPrice = 25000;
      }
      break;
  }

  const isCityCommuter = prefs.usages.includes('city-driving') || prefs.lifestyle.includes('easy-parking');
  const isLongDistanceDriver =
    prefs.usages.includes('long-road-trips') ||
    prefs.lifestyle.includes('motorway-driving') ||
    prefs.usages.includes('business');

  const highReliabilityNeeded = prefs.priorities.includes('reliability');
  const lowRunningCostsNeeded =
    prefs.priorities.includes('low-running-costs') || prefs.priorities.includes('fuel-economy');
  const highPerformanceNeeded =
    prefs.priorities.includes('performance') || prefs.usages.includes('performance-fun');
  const comfortPriority = prefs.priorities.includes('comfort') || prefs.usages.includes('luxury-comfort');
  const techPriority = prefs.priorities.includes('technology');

  const requiresAWD =
    prefs.lifestyle.includes('mountains-snow') ||
    prefs.usages.includes('outdoor-activities') ||
    (prefs.dynamicAnswer?.toLowerCase().includes('awd') ?? false) ||
    (prefs.dynamicAnswer?.toLowerCase().includes('snow') ?? false);

  const minSeats =
    prefs.lifestyle.includes('large-family') ||
    (prefs.dynamicAnswer?.toLowerCase().includes('6') ?? false) ||
    (prefs.dynamicAnswer?.toLowerCase().includes('7') ?? false)
      ? 7
      : 5;

  const minLuggageLiters =
    prefs.lifestyle.includes('lots-of-luggage') ||
    prefs.lifestyle.includes('dog-owner') ||
    prefs.usages.includes('carrying-equipment') ||
    prefs.usages.includes('family-use')
      ? 450
      : 250;

  const preferredBodyStyles: BodyStyle[] = [];
  if (isCityCommuter) {
    preferredBodyStyles.push('City car', 'Hatchback', 'Crossover');
  }
  if (prefs.usages.includes('family-use') || prefs.lifestyle.includes('small-family') || prefs.lifestyle.includes('large-family')) {
    preferredBodyStyles.push('Estate / Wagon', 'Compact SUV', 'Mid-size SUV', 'Large SUV');
  }
  if (highPerformanceNeeded) {
    preferredBodyStyles.push('Sedan', 'Hatchback', 'Compact SUV');
  }

  const preferredFuelTypes: FuelType[] = [];
  if (prefs.priorities.includes('environmental-impact')) {
    preferredFuelTypes.push('Electric', 'Plug-in Hybrid', 'Hybrid');
  } else if (isCityCommuter) {
    preferredFuelTypes.push('Hybrid', 'Electric', 'Petrol');
  } else if (isLongDistanceDriver) {
    preferredFuelTypes.push('Diesel', 'Hybrid', 'Petrol');
  }

  return {
    targetMinPrice: minPrice,
    targetMaxPrice: maxPrice,
    preferredBodyStyles,
    preferredFuelTypes,
    preferredTransmission: isCityCommuter ? 'Automatic' : 'Any',
    requiresAWD,
    minSeats,
    minLuggageLiters,
    highReliabilityNeeded,
    lowRunningCostsNeeded,
    highPerformanceNeeded,
    comfortPriority,
    techPriority,
    isCityCommuter,
    isLongDistanceDriver,
    summaryRationale: `Profile tuned for ${prefs.usages.join(', ') || 'everyday driving'} with emphasis on ${prefs.priorities.join(', ') || 'value'}.`
  };
}

export function scoreVehicle(vehicle: Vehicle, prefs: UserPreferences, profile: InferredProfile): ScoredRecommendation {
  let budgetScore = 80;
  const vPrice = vehicle.typicalPriceMin;

  if (vPrice <= profile.targetMaxPrice && vehicle.typicalPriceMax >= profile.targetMinPrice) {
    // Falls nicely within target range
    const distanceToMid = Math.abs(
      (vehicle.typicalPriceMin + vehicle.typicalPriceMax) / 2 -
      (profile.targetMinPrice + profile.targetMaxPrice) / 2
    );
    const rangeSpan = Math.max(profile.targetMaxPrice - profile.targetMinPrice, 5000);
    budgetScore = Math.max(80, Math.min(100, 100 - (distanceToMid / rangeSpan) * 20));
  } else if (vehicle.typicalPriceMax < profile.targetMinPrice) {
    // Under budget - excellent value, especially if low running costs or first car
    budgetScore = profile.lowRunningCostsNeeded ? 92 : 82;
  } else {
    // Exceeds max budget - sharp penalty so expensive cars don't crowd out low-budget users
    const overage = vehicle.typicalPriceMin - profile.targetMaxPrice;
    budgetScore = Math.max(15, 75 - (overage / 3500) * 30);
  }

  // 2. Lifestyle fit score
  let lifestyleScore = 75;
  if (profile.isCityCommuter) {
    if (vehicle.bodyStyle === 'City car') lifestyleScore += 20;
    else if (vehicle.bodyStyle === 'Hatchback' || vehicle.bodyStyle === 'Crossover') lifestyleScore += 15;
    else if (vehicle.bodyStyle === 'Large SUV') lifestyleScore -= 20;
  }

  if (profile.isLongDistanceDriver) {
    if (vehicle.comfortLevel >= 5) lifestyleScore += 15;
    if (vehicle.fuelType === 'Diesel' || vehicle.engineSummary.includes('e-TEC') || vehicle.id.includes('ioniq')) lifestyleScore += 10;
  }

  if (profile.requiresAWD) {
    if (vehicle.drivetrain === 'AWD') lifestyleScore += 20;
    else lifestyleScore -= 25;
  }

  if (profile.minSeats > 5) {
    if (vehicle.seats >= profile.minSeats) lifestyleScore += 25;
    else lifestyleScore -= 40;
  }

  if (vehicle.cargoCapacityLiters >= profile.minLuggageLiters) {
    lifestyleScore += 10;
  }

  // 3. Reliability score
  let reliabilityScore = vehicle.reliabilityRating * 20;
  if (profile.highReliabilityNeeded) {
    if (vehicle.reliabilityRating === 5) reliabilityScore = 100;
    else if (vehicle.reliabilityRating === 4) reliabilityScore = 80;
    else reliabilityScore = 60;
  }

  // 4. Running costs score
  let runningCostsScore = 70;
  switch (vehicle.runningCostLevel) {
    case 'Very Low':
      runningCostsScore = 100;
      break;
    case 'Low':
      runningCostsScore = 88;
      break;
    case 'Medium':
      runningCostsScore = 72;
      break;
    case 'High':
      runningCostsScore = 48;
      break;
    case 'Very High':
      runningCostsScore = 30;
      break;
  }

  // Greek Market adjustments (Road tax exemption, Athens ring, sub-1.4L cc tax)
  if (prefs.marketRegion === 'greece') {
    if (vehicle.greekRoadTaxEur === 0) {
      runningCostsScore = Math.min(100, runningCostsScore + 10);
    }
    if (vehicle.athensRingExempt && profile.isCityCommuter) {
      lifestyleScore = Math.min(100, lifestyleScore + 10);
    }
    if (vehicle.engineDisplacementCc && vehicle.engineDisplacementCc <= 1400) {
      runningCostsScore = Math.min(100, runningCostsScore + 8);
    }
  }

  // 5. Priorities score
  let prioritiesScore = 75;
  let matches = 0;
  for (const prio of prefs.priorities) {
    if (prio === 'reliability' && vehicle.reliabilityRating >= 4) matches++;
    if (prio === 'low-running-costs' && (vehicle.runningCostLevel === 'Very Low' || vehicle.runningCostLevel === 'Low')) matches++;
    if (prio === 'fuel-economy' && (vehicle.fuelType === 'Hybrid' || vehicle.fuelType === 'Electric' || vehicle.runningCostLevel === 'Very Low')) matches++;
    if (prio === 'performance' && vehicle.acceleration0to100 <= 7.5) matches++;
    if (prio === 'comfort' && vehicle.comfortLevel >= 4) matches++;
    if (prio === 'safety' && vehicle.safetyRating === 5) matches++;
    if (prio === 'practicality' && vehicle.practicalityScore >= 4) matches++;
    if (prio === 'technology' && vehicle.techScore >= 4) matches++;
    if (prio === 'luxury' && (vehicle.make === 'BMW' || vehicle.make === 'Porsche' || vehicle.make === 'Volvo')) matches++;
  }
  prioritiesScore = Math.min(100, 60 + matches * 14);

  // Composite weighting
  const weights = {
    budget: 0.28,
    lifestyle: 0.22,
    reliability: profile.highReliabilityNeeded ? 0.24 : 0.14,
    runningCosts: profile.lowRunningCostsNeeded ? 0.20 : 0.14,
    priorities: 0.22
  };

  const totalWeight = weights.budget + weights.lifestyle + weights.reliability + weights.runningCosts + weights.priorities;

  const rawComposite =
    (budgetScore * weights.budget +
      lifestyleScore * weights.lifestyle +
      reliabilityScore * weights.reliability +
      runningCostsScore * weights.runningCosts +
      prioritiesScore * weights.priorities) /
    totalWeight;

  const finalMatchScore = Math.min(98, Math.max(45, Math.round(rawComposite)));

  // Generate personalized rationale referencing answers
  const personalizedReason = buildPersonalizedReason(vehicle, prefs, profile);

  // Highlight key features tailored to user
  const highlightFeatures = buildHighlightFeatures(vehicle, prefs);

  return {
    vehicle,
    matchScore: finalMatchScore,
    personalizedReason,
    scoreBreakdown: {
      budgetScore: Math.round(budgetScore),
      lifestyleScore: Math.round(Math.min(100, Math.max(30, lifestyleScore))),
      reliabilityScore: Math.round(reliabilityScore),
      runningCostsScore: Math.round(runningCostsScore),
      prioritiesScore: Math.round(prioritiesScore)
    },
    highlightFeatures
  };
}

function buildPersonalizedReason(vehicle: Vehicle, prefs: UserPreferences, profile: InferredProfile): string {
  const isGreek = prefs.marketRegion === 'greece';

  if (isGreek) {
    switch (vehicle.id) {
      case 'toyota-yaris-mk1-xp10':
        return 'Αθάνατος κινητήρας με καδένα, ελάχιστο τεκμήριο, 120€ τέλη και θρυλική αξιοπιστία κάτω από 3.000€.';
      case 'fiat-punto-panda-12-fire':
        return 'Κινητήρας FIRE χωρίς ζημιά σε ιμάντα, πανάλαφρο τιμόνι City και τα φθηνότερα ανταλλακτικά στην Ελλάδα.';
      case 'nissan-micra-k12':
        return 'Κύκλος στροφής 4.4m, ζωηρό μοτέρ 80hp με καδένα και μηδενικό άγχος στο παρκάρισμα.';
      case 'hyundai-getz-11-13':
        return 'Αθάνατα κορεάτικα μηχανικά, πανίσχυρο A/C για καύσωνες και ελάχιστα έξοδα συντήρησης.';
      case 'toyota-corolla-hybrid-e210':
        return 'Κορυφαία υβριδική οικονομία 4.4L/100km με 0€ τέλη, ελεύθερο Δακτύλιο και 10ετή εγγύηση Toyota Relax.';
      case 'skoda-octavia-combi-mk4':
        return 'Τεράστιο πορτμπαγκάζ 640L, κορυφαία άνεση ταξιδιού και χαμηλή κατανάλωση 5.3L/100km.';
      case 'toyota-yaris-cross-hybrid':
        return 'Υπερυψωμένη θέση οδήγησης, εύκολο παρκάρισμα στην πόλη και κατανάλωση μόλις 4.2L/100km.';
      case 'tesla-model-3-highland':
        return 'Άμεση ηλεκτρική επιτάχυνση, ελάχιστο κόστος κίνησης και απροβλημάτιστο δίκτυο Supercharger.';
      case 'dacia-sandero-stepway-mk3':
        return 'Αυξημένη απόσταση από το έδαφος και εργοστασιακό υγραέριο LPG που μειώνει το κόστος καυσίμου στο μισό.';
      case 'toyota-yaris-hybrid-mk3':
        return 'Αθάνατο υβριδικό σύνολο πόλης, κατανάλωση κάτω από 4.0L/100km και 0€ τέλη κυκλοφορίας.';
      case 'volkswagen-golf-mk8':
        return 'Υποδειγματικό πάτημα στον αυτοκινητόδρομο, ήπια υβριδική κατανάλωση 5.2L και διαχρονική πρακτικότητα.';
      case 'mazda-cx5-gen2':
        return 'Ατμοσφαιρική ιαπωνική αξιοπιστία, ασφαλής τετρακίνηση AWD και ποιοτικότατη αθόρυβη καμπίνα.';
      case 'bmw-3-series-touring-g21':
        return 'Κορυφαία οδική συμπεριφορά, αυτονομία 1.000km σε ταξίδι και πρακτικότητα premium touring.';
      case 'hyundai-ioniq-5':
        return 'Αστραπιαία φόρτιση 800V (18 λεπτά), πρωτοποριακό design και απίστευτοι χώροι επιβατών.';
      case 'volvo-xc60-recharge-t6':
        return 'Κορυφαία ασφάλεια Volvo, 75km αμιγώς ηλεκτρική αυτονομία στην πόλη και απαράμιλλη άνεση.';
      case 'honda-civic-ehev-mk11':
        return 'Σπορ οδηγική αίσθηση, υβριδική οικονομία 4.7L και κορυφαία εργονομία καμπίνας.';
      case 'skoda-kodiaq-mk1':
        return 'Πλήρης 7θέσια διάταξη, τεράστιο πορτμπαγκάζ 2.000L και άνετο ταξίδι με χαμηλή κατανάλωση.';
      case 'tesla-model-y-longrange':
        return 'Κορυφαίος χώρος αποσκευών 854L, ταχύτατη επιτάχυνση και ελάχιστα έξοδα συντήρησης.';
      default:
        return vehicle.greekRoadTaxEur === 0
          ? `Μηδενικά τέλη (0€), ελεύθερος Δακτύλιος και οικονομία ${vehicle.fuelEconomy.split('(')[0].trim()}.`
          : `Αξιοπιστία ${vehicle.reliabilityRating}/5, χαμηλή κατανάλωση ${vehicle.fuelEconomy.split('(')[0].trim()} και υψηλή μεταπώληση.`;
    }
  }

  // Global / English concise reasons (under 18 words)
  switch (vehicle.id) {
    case 'toyota-yaris-mk1-xp10':
      return 'Indestructible timing-chain engine, lowest tax bracket, and sub-€3,000 bulletproof reliability.';
    case 'fiat-punto-panda-12-fire':
      return 'Non-interference FIRE engine with finger-light City steering and Europe’s lowest repair costs.';
    case 'nissan-micra-k12':
      return 'Tiny 4.4m turning radius, energetic 80hp chain engine, and stress-free urban parking.';
    case 'hyundai-getz-11-13':
      return 'Indestructible Korean mechanicals, lowest tax bracket, and powerful A/C for summer heatwaves.';
    case 'toyota-corolla-hybrid-e210':
      return 'Benchmark 4.4L/100km hybrid economy with zero road tax and 10-year bulletproof durability.';
    case 'skoda-octavia-combi-mk4':
      return 'Massive 640L boot and serene motorway cruising poise with frugal 5.3L/100km fuel consumption.';
    case 'toyota-yaris-cross-hybrid':
      return 'Command SUV seating in a compact footprint with frugal 4.2L/100km urban hybrid economy.';
    case 'tesla-model-3-highland':
      return 'Instant electric acceleration, 14.4 kWh/100km efficiency, and seamless European Supercharger access.';
    case 'dacia-sandero-stepway-mk3':
      return 'Raised crossover clearance with factory Bi-Fuel LPG halving your monthly fuel budget.';
    case 'toyota-yaris-hybrid-mk3':
      return 'Sub-4.0L/100km city efficiency, bulletproof hybrid durability, and effortless parallel parking.';
    case 'volkswagen-golf-mk8':
      return 'Calm motorway composure, 5.2L/100km mild-hybrid economy, and timeless hatchback practicality.';
    case 'mazda-cx5-gen2':
      return 'Naturally aspirated Japanese durability, secure AWD grip, and an upscale quiet cabin.';
    case 'bmw-3-series-touring-g21':
      return 'Dynamic rear-drive balance, 1,000km motorway cruising range, and practical estate versatility.';
    case 'hyundai-ioniq-5':
      return 'Ultra-fast 800V charging (10–80% in 18 min), futuristic styling, and lounge-like interior space.';
    case 'volvo-xc60-recharge-t6':
      return 'Orthopedic seating comfort, 75km pure EV city range, and peerless Scandinavian safety.';
    case 'honda-civic-ehev-mk11':
      return 'Agile driver dynamics combined with 4.7L/100km hybrid economy and intuitive tactile controls.';
    case 'skoda-kodiaq-mk1':
      return 'Spacious 7-seat family versatility, 2,000L luggage bay, and confident 4x4 road manners.';
    case 'tesla-model-y-longrange':
      return 'Class-leading 854L cargo capacity, rapid 5.0s acceleration, and zero maintenance headaches.';
    default:
      return `${vehicle.fuelEconomy.split('(')[0].trim()} efficiency with ${vehicle.reliabilityRating}/5 reliability and low ownership costs.`;
  }
}

function formatBudgetLabel(id: string): string {
  switch (id) {
    case '1.5k-5k': return '€1,500–€5,000';
    case '5k-10k': return '€5,000–€10,000';
    case 'under-10k': return 'sub-€10k';
    case '10k-20k': return '€10k–€20k';
    case '20k-30k': return '€20k–€30k';
    case '30k-40k': return '€30k–€40k';
    case '40k-60k': return '€40k–€60k';
    case '60k-plus': return '€60k+';
    default: return 'specified';
  }
}

function formatPriorities(priorities: string[]): string {
  if (priorities.length === 0) return 'overall balance';
  return priorities.map((p) => p.replace(/-/g, ' ')).join(' & ');
}

function formatUsages(usages: string[]): string {
  if (usages.length === 0) return 'everyday driving';
  return usages.slice(0, 2).map((u) => u.replace(/-/g, ' ')).join(' and ');
}

function buildHighlightFeatures(vehicle: Vehicle, prefs: UserPreferences): string[] {
  const highlights: string[] = [];

  highlights.push(`${vehicle.fuelEconomy}`);
  highlights.push(`${vehicle.cargoCapacityLiters}L Boot`);
  highlights.push(`${vehicle.horsepower} hp · ${vehicle.drivetrain}`);

  if (vehicle.fuelType === 'Hybrid' || vehicle.fuelType === 'Electric') {
    highlights.push(vehicle.fuelType === 'Electric' ? 'Zero Local Emissions' : 'Self-Charging e-CVT');
  } else if (vehicle.reliabilityRating === 5) {
    highlights.push('Top Reliability Class');
  }

  return highlights.slice(0, 4);
}

export function recommendVehicles(prefs: UserPreferences): ScoredRecommendation[] {
  const profile = inferUserProfile(prefs);

  const scored = VEHICLES.map((vehicle) => scoreVehicle(vehicle, prefs, profile));

  // Sort descending by match score
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // Take top 4 or 5
  const topList = scored.slice(0, 5);

  // Assign distinct editorial categories to prevent repetition
  if (topList.length > 0) {
    topList[0].category = 'Best Overall';
  }

  // Find best value (lowest typical price with score >= 75)
  const valuePick = topList.slice(1).find((item) => item.vehicle.runningCostLevel === 'Very Low' || item.vehicle.typicalPriceMin <= profile.targetMinPrice * 0.9);
  if (valuePick) {
    valuePick.category = 'Best Value';
  }

  // Find most reliable if not already best overall
  const reliablePick = topList.slice(1).find((item) => item !== valuePick && item.vehicle.reliabilityRating === 5);
  if (reliablePick) {
    reliablePick.category = 'Most Reliable';
  }

  // Find alternative choice (e.g. different fuel type or body style)
  const bestBody = topList[0]?.vehicle.bodyStyle;
  const altPick = topList.slice(1).find(
    (item) => item !== valuePick && item !== reliablePick && item.vehicle.bodyStyle !== bestBody
  );
  if (altPick) {
    altPick.category = 'Alternative Choice';
  } else if (topList[topList.length - 1] && !topList[topList.length - 1].category) {
    topList[topList.length - 1].category = 'Alternative Choice';
  }

  return topList;
}
