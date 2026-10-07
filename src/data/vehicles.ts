import { Vehicle } from '../types';

export const VEHICLES: Vehicle[] = [
  {
    id: 'toyota-corolla-hybrid-e210',
    make: 'Toyota',
    model: 'Corolla Hybrid',
    generation: 'E210 (12th Gen)',
    years: '2019 – Present',
    recommendedYears: '2020 – 2023',
    yearsToAvoid: 'Early 2019 1.2 Turbo petrol (non-hybrid has higher depreciation)',
    bodyStyle: 'Hatchback',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineSummary: '1.8L 4-cylinder petrol + electric motor (122 hp) or 2.0L Hybrid Dynamic Force (184 hp)',
    recommendedPowertrain: '1.8L Hybrid (e-CVT) for maximum economy; 2.0L for motorway overtakes',
    avoidPowertrain: '1.2 Turbo petrol manual (lacks the bulletproof e-CVT and high resale)',
    horsepower: 122,
    acceleration0to100: 10.9,
    fuelEconomy: '4.4 L/100 km (64 mpg)',
    cargoCapacityLiters: 361,
    maxCargoCapacityLiters: 1052,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 18500,
    typicalPriceMax: 24500,
    goodBuyPrice: 20000,
    excellentBuyPrice: 18800,
    marketPriceType: 'used',
    engineDisplacementCc: 1798,
    greekRoadTaxEur: 0,
    athensRingExempt: true,
    greekMarketPopularity: 'Top #1 Hybrid in Greece · 0€ Τέλη Κυκλοφορίας · Ελεύθερος Δακτύλιος',
    carGrClassifiedCount: '1.180+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '18.500€ – 23.900€',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=toyota&model=corolla',
    reliabilityRating: 5,
    runningCostLevel: 'Very Low',
    comfortLevel: 4,
    safetyRating: 5,
    practicalityScore: 4,
    techScore: 4,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Exceptional real-world fuel economy in urban & mixed traffic',
      'Bulletproof planetary e-CVT powertrain with minimal wear items',
      'Extremely low maintenance costs and long brake-pad life via regen',
      'Toyota Relax warranty up to 10 years / 185,000 km with annual dealer service'
    ],
    cons: [
      'Hatchback rear legroom is tight for tall adults',
      'e-CVT drones under hard acceleration on steep motorway inclines',
      'Infotainment software looks dated compared to European peers'
    ],
    bestFor: ['Daily commuters', 'City drivers', 'Reliability-focused buyers', 'Low running cost seekers'],
    notIdealFor: ['Enthusiasts seeking aggressive sports dynamics', 'Tall families needing vast rear seat room'],
    knownIssues: [
      '12V auxiliary battery can discharge if left idle for several weeks',
      'Infotainment touchscreen occasionally disconnects wired Apple CarPlay',
      'Road noise noticeable on coarse motorway chip seal'
    ],
    inspectionChecklist: [
      {
        component: 'Hybrid Health Check',
        check: 'Verify annual Toyota Hybrid Health Check certificate for battery warranty coverage',
        importance: 'Critical',
        tip: 'Each passing test extends hybrid battery warranty for an additional 12 months.'
      },
      {
        component: '12V Battery Condition',
        check: 'Test the auxiliary 12V AGM battery voltage in the boot area',
        importance: 'Important',
        tip: 'A weak 12V battery causes erratic dashboard error codes even if traction battery is perfect.'
      },
      {
        component: 'Front Lower Arm Bushes',
        check: 'Listen for knocking over speed bumps on 80k+ km models',
        importance: 'Advisory',
        tip: 'Standard rubber bushing wear; affordable to replace.'
      }
    ],
    defaultExplanation:
      'Unbeatable 4.4L/100km urban hybrid economy with 0€ Greek road tax and bulletproof 10-year reliability.'
  },
  {
    id: 'skoda-octavia-combi-mk4',
    model: 'Octavia Combi',
    make: 'Škoda',
    generation: 'Mk4 (NX)',
    years: '2020 – Present',
    recommendedYears: '2021 – 2024',
    yearsToAvoid: 'Early 2020 builds with early MIB3 infotainment software bugs',
    bodyStyle: 'Estate / Wagon',
    fuelType: 'Petrol',
    transmission: 'Both available',
    engineSummary: '1.5 TSI e-TEC mild-hybrid (150 hp) or 2.0 TDI (150 hp) DSG',
    recommendedPowertrain: '1.5 TSI 150hp 6-speed manual or 7-speed DSG e-TEC',
    avoidPowertrain: '1.0 TSI 3-cylinder when heavily laden with family luggage',
    horsepower: 150,
    acceleration0to100: 8.5,
    fuelEconomy: '5.3 L/100 km (53 mpg)',
    cargoCapacityLiters: 640,
    maxCargoCapacityLiters: 1700,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 21000,
    typicalPriceMax: 29500,
    goodBuyPrice: 23500,
    excellentBuyPrice: 21800,
    marketPriceType: 'both',
    carGrClassifiedCount: '890+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '16.000€ – 24.500€',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=skoda&model=octavia',
    reliabilityRating: 4,
    runningCostLevel: 'Low',
    comfortLevel: 5,
    safetyRating: 5,
    practicalityScore: 5,
    techScore: 4,
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Massive 640-liter boot outperforms SUVs two classes larger',
      'Superb motorway poise, quiet acoustic glass, and ergonomic seating',
      'Clever lifestyle touches (umbrella in doors, luggage nets, ice scraper)',
      '1.5 TSI cylinder deactivation delivers diesel-like motorway economy'
    ],
    cons: [
      'Touch-slider AC controls take eyes off road',
      'Early 2020 software suffered lag and restart glitches',
      'DSG gearbox requires strict 60,000 km fluid intervals'
    ],
    bestFor: ['Families with kids/dogs', 'Long-distance motorway drivers', 'Outdoor lifestyle & sports gear'],
    notIdealFor: ['Tight inner-city street parkers looking for sub-4.4m cars'],
    knownIssues: [
      'MIB3 software reboot loops on firmware versions prior to 1896',
      'SOS emergency call module failure (repaired under recall)',
      'Steering wheel capacitive sensor intermittent heating error'
    ],
    inspectionChecklist: [
      {
        component: 'Infotainment Firmware Version',
        check: 'Go to Settings > System Info and confirm software version is 1896 or newer',
        importance: 'Critical',
        tip: 'Cures 95% of random screen crashes and wireless phone disconnects.'
      },
      {
        component: 'DSG Dual-Clutch Engagement',
        check: 'Test crawl in reverse and 1st gear on a slight slope for judder',
        importance: 'Important',
        tip: 'Shifts should be seamless with zero hesitation or metalling clunks.'
      },
      {
        component: 'Panoramic Sunroof Drains (if equipped)',
        check: 'Check front footwells for dampness after high-pressure wash',
        importance: 'Advisory',
        tip: 'Drain tubes can clog with pine needles or leaves.'
      }
    ],
    defaultExplanation:
      'Huge 640L boot and serene motorway cruising refinement with frugal 5.3L/100km fuel economy.'
  },
  {
    id: 'mazda-cx5-gen2',
    make: 'Mazda',
    model: 'CX-5',
    generation: 'KF (2nd Gen Facelift)',
    years: '2017 – Present',
    recommendedYears: '2019 – 2023',
    yearsToAvoid: '2.2 Skyactiv-D diesel without documented carbon cleaning history',
    bodyStyle: 'Compact SUV',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineSummary: '2.0L Skyactiv-G (165 hp) or 2.5L Skyactiv-G (194 hp) naturally aspirated 4-cyl',
    recommendedPowertrain: '2.0L or 2.5L Skyactiv-G Petrol with torque-converter 6-speed auto',
    avoidPowertrain: '2.2 Skyactiv-D Diesel for short city trips (DPF and oil dilution risk)',
    horsepower: 165,
    acceleration0to100: 9.8,
    fuelEconomy: '6.8 L/100 km (41 mpg)',
    cargoCapacityLiters: 506,
    maxCargoCapacityLiters: 1620,
    seats: 5,
    drivetrain: 'AWD',
    typicalPriceMin: 19500,
    typicalPriceMax: 27900,
    goodBuyPrice: 22000,
    excellentBuyPrice: 20200,
    marketPriceType: 'used',
    carGrClassifiedCount: '340+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '19.500€ – 26.500€',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=mazda&model=cx-5',
    reliabilityRating: 5,
    runningCostLevel: 'Medium',
    comfortLevel: 5,
    safetyRating: 5,
    practicalityScore: 4,
    techScore: 4,
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Near-German premium interior finish with physical rotary dial controls',
      'Simple naturally aspirated engine with no turbo lag and low long-term risk',
      'Smooth 6-speed torque-converter gearbox without fragile dual clutches',
      'Confidence-inspiring i-ACTIV AWD on snow, mud, and wet mountain passes'
    ],
    cons: [
      'Higher fuel consumption than European turbo or hybrid alternatives',
      'Modest 0-100 acceleration on the 2.0L engine',
      'Thin paint is prone to stone chips on motorway front bumpers'
    ],
    bestFor: ['Drivers wanting SUV seating position', 'Snow/mountain drivers', 'Premium interior lovers', 'Low repair hassle'],
    notIdealFor: ['High-mileage commuters chasing 4.0 L/100km fuel economy'],
    knownIssues: [
      'Paint chipping on Soul Red Crystal / Machine Grey metallic',
      'Power folding wing mirror motors can fail over winter frost',
      'Diesel versions suffer oil dilution; petrol versions are rock-solid'
    ],
    inspectionChecklist: [
      {
        component: 'Engine Oil Level & Odor',
        check: 'Pull dipstick to ensure oil level is between marks with no fuel odor',
        importance: 'Critical',
        tip: 'Essential on any diesel; safe on petrol Skyactiv-G models.'
      },
      {
        component: 'Power Folding Mirrors',
        check: 'Cycle the mirror folding switch 3 times to verify motor teeth are intact',
        importance: 'Advisory',
        tip: 'Replacement plastic gear or mirror assembly costs €150-€300.'
      },
      {
        component: 'Rear Brake Caliper Electronic Parking Motor',
        check: 'Ensure parking brake disengages smoothly without squeal',
        importance: 'Important',
        tip: 'Requires special service mode when changing rear brake pads.'
      }
    ],
    defaultExplanation:
      'Naturally aspirated Japanese reliability, secure AWD grip, and an upscale quiet cabin.'
  },
  {
    id: 'tesla-model-3-highland',
    make: 'Tesla',
    model: 'Model 3',
    generation: 'RWD / Long Range',
    years: '2020 – Present',
    recommendedYears: '2021 – 2024 (Heat pump models)',
    yearsToAvoid: '2019 early Fremont builds without heat pump or chrome delete',
    bodyStyle: 'Sedan',
    fuelType: 'Electric',
    transmission: 'Automatic',
    engineSummary: 'Single motor rear-wheel drive (283 hp) or Dual Motor AWD (434 hp)',
    recommendedPowertrain: 'LFP Single Motor RWD (can be charged to 100% daily with minimal degradation)',
    avoidPowertrain: 'Early pre-2021 resistive-heating cars in cold winter climates',
    horsepower: 283,
    acceleration0to100: 5.8,
    fuelEconomy: '14.4 kWh/100 km (Equivalent ~1.6 L/100km)',
    cargoCapacityLiters: 594,
    maxCargoCapacityLiters: 1140,
    seats: 5,
    drivetrain: 'RWD',
    typicalPriceMin: 24000,
    typicalPriceMax: 34000,
    goodBuyPrice: 26500,
    excellentBuyPrice: 24200,
    marketPriceType: 'used',
    carGrClassifiedCount: '280+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '25.000€ – 34.000€',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=tesla&model=model%203',
    reliabilityRating: 4,
    runningCostLevel: 'Very Low',
    comfortLevel: 4,
    safetyRating: 5,
    practicalityScore: 4,
    techScore: 5,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Incredible Supercharger charging infrastructure across all Europe',
      'Minimal running costs: no oil, spark plugs, belts, or transmission services',
      'Rapid instant electric torque and sports-car handling balance',
      'LFP battery chemistry allows safe 100% daily home charging'
    ],
    cons: [
      'Sedan trunk opening is narrower than a hatchback or estate',
      'No physical dashboard dials or instrument cluster behind steering wheel',
      'Firm ride quality on 19" or 20" wheels over broken city asphalt'
    ],
    bestFor: ['Tech enthusiasts', 'Home-charging commuters', 'Performance seekers on a budget', 'Zero-emission advocates'],
    notIdealFor: ['Apartment renters with zero public or home AC charging access', 'Heavy towing across wilderness'],
    knownIssues: [
      'Front upper control arm ball joints squeak over bumps (replaced under warranty)',
      'Rear boot lid seal alignment causing water drips when opened in heavy rain',
      'Cabin air filters develop musty smell if not replaced every 18 months'
    ],
    inspectionChecklist: [
      {
        component: 'Battery Health Degradation',
        check: 'Charge to 100% or use Service Mode / ScanMyTesla to measure usable kWh',
        importance: 'Critical',
        tip: 'LFP packs typically maintain >92% capacity even after 100,000 km.'
      },
      {
        component: 'Front Upper Control Arms',
        check: 'Turn steering wheel lock-to-lock and bounce front fender listening for creaks',
        importance: 'Important',
        tip: 'Known ball joint moisture ingress issue; improved sealed arms resolve permanently.'
      },
      {
        component: 'Glass Roof & Windscreen Chips',
        check: 'Inspect panoramic glass edges for hairline stone fractures',
        importance: 'Advisory',
        tip: 'Full roof glass replacement can cost €1,200+ if cracked.'
      }
    ],
    defaultExplanation:
      'Instant electric torque and ultra-low per-mile costs backed by Europe’s leading Supercharger network.'
  },
  {
    id: 'volkswagen-golf-mk8',
    make: 'Volkswagen',
    model: 'Golf',
    generation: 'Mk8',
    years: '2020 – Present',
    recommendedYears: '2021 – 2024',
    yearsToAvoid: '2020 initial run models with software version 1664 or earlier',
    bodyStyle: 'Hatchback',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineSummary: '1.5 eTSI Mild Hybrid (150 hp) DSG or 1.4 TSI eHybrid PHEV (204 hp)',
    recommendedPowertrain: '1.5 eTSI 150hp with 48V belt starter generator and 7-speed DSG',
    avoidPowertrain: 'Base 1.0 TSI without mild-hybrid assistance',
    horsepower: 150,
    acceleration0to100: 8.5,
    fuelEconomy: '5.2 L/100 km (54 mpg)',
    cargoCapacityLiters: 381,
    maxCargoCapacityLiters: 1237,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 18000,
    typicalPriceMax: 25500,
    goodBuyPrice: 20200,
    excellentBuyPrice: 18500,
    marketPriceType: 'both',
    carGrClassifiedCount: '2.100+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '17.500€ – 24.000€',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=volkswagen&model=golf',
    reliabilityRating: 4,
    runningCostLevel: 'Low',
    comfortLevel: 4,
    safetyRating: 5,
    practicalityScore: 4,
    techScore: 4,
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Supreme high-speed stability and calm ride composure on motorways',
      'Smooth 48V coasting engine shutoff saves fuel imperceptibly',
      'Classless image: looks at home anywhere from a supermarket to a boardroom',
      'Extensive parts availability and skilled independent mechanic support'
    ],
    cons: [
      'Unlit temperature and volume touch sliders on pre-facelift models',
      'Cost-cutting inside door pockets compared to older Golf Mk7',
      'DSG dry-clutch requires smooth throttle input in stop-start traffic'
    ],
    bestFor: ['All-rounders', 'Young professionals', 'Highway commuters', 'Balanced everyday drivers'],
    notIdealFor: ['Drivers who demand physical HVAC knobs and buttons'],
    knownIssues: [
      'Travel Assist steering wheel warning chimes without fault',
      'Wireless charging pad overheats smartphones quickly',
      'Rear brake discs corrode prematurely due to light regenerative braking'
    ],
    inspectionChecklist: [
      {
        component: 'Infotainment ECU Software Update',
        check: 'Ensure recall 91CD / 90S8 software updates have been performed by VW dealer',
        importance: 'Critical',
        tip: 'Prevents black screen crashes and random speed-limit false readings.'
      },
      {
        component: 'Rear Brake Rotor Surface',
        check: 'Visually check rear discs for rust banding on the inner friction face',
        importance: 'Advisory',
        tip: 'Firm periodic stops clean surface rust; replacement set is €180.'
      },
      {
        component: 'Water Pump / Thermostat Housing',
        check: 'Look underneath for pink coolant residue on bottom splash guard',
        importance: 'Important',
        tip: 'Classic EA211 evo inspection point on 70,000+ km vehicles.'
      }
    ],
    defaultExplanation:
      'Quiet motorway composure, 5.2L/100km mild-hybrid economy, and timeless hatchback practicality.'
  },
  {
    id: 'dacia-sandero-stepway-mk3',
    make: 'Dacia',
    model: 'Sandero Stepway',
    generation: 'Mk3',
    years: '2021 – Present',
    recommendedYears: '2021 – 2024',
    yearsToAvoid: 'None significant; avoid missing safety pack models if ADAS is a priority',
    bodyStyle: 'Crossover',
    fuelType: 'Petrol',
    transmission: 'Both available',
    engineSummary: 'TCe 90 1.0L Turbo (90 hp) or TCe 100 Bi-Fuel LPG (100 hp)',
    recommendedPowertrain: 'TCe 100 Bi-Fuel (Factory LPG cuts fuel expenses by up to 45%)',
    avoidPowertrain: 'SCe 65 naturally aspirated (lacks passing power on open roads)',
    horsepower: 90,
    acceleration0to100: 11.7,
    fuelEconomy: '5.6 L/100 km (50 mpg) / 6.8 L/100km LPG',
    cargoCapacityLiters: 328,
    maxCargoCapacityLiters: 1108,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 11000,
    typicalPriceMax: 15500,
    goodBuyPrice: 12500,
    excellentBuyPrice: 11200,
    marketPriceType: 'both',
    carGrClassifiedCount: '340+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '11.200€ – 15.000€',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=dacia&model=sandero',
    reliabilityRating: 4,
    runningCostLevel: 'Very Low',
    comfortLevel: 3,
    safetyRating: 3,
    practicalityScore: 4,
    techScore: 3,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Unbeatable price-to-utility ratio in modern European motoring',
      'Factory Bi-Fuel LPG tank offers 1,200+ km total combined range',
      'Raised Stepway ground clearance (201mm) handles potholes and gravel tracks',
      'Built on modern Renault CMF-B platform with wireless phone mirroring'
    ],
    cons: [
      'Euro NCAP 2-star rating due to lack of advanced active radar ADAS',
      'Cabin plastics are durable but hard and utilitarian',
      'More wind noise around side mirrors at 130 km/h'
    ],
    bestFor: ['Budget-conscious buyers', 'First-time buyers', 'Rural drivers on poor roads', 'LPG fuel cost savers'],
    notIdealFor: ['Premium luxury seekers', 'High-speed Autobahn cruisers'],
    knownIssues: [
      'Clutch pedal squeak linkage spring (easily lubricated with white lithium grease)',
      'Media Display Bluetooth sync occasionally requires phone unpairing',
      'LPG gas filter requires replacement every 30,000 km'
    ],
    inspectionChecklist: [
      {
        component: 'LPG System Inspection (Bi-Fuel)',
        check: 'Test automatic switchover between petrol and LPG at operating temperature',
        importance: 'Critical',
        tip: 'Transition should be imperceptible without engine hesitation or warning lamps.'
      },
      {
        component: 'Underside Exhaust Heat Shield',
        check: 'Verify heat shields are firmly clipped after gravel road use',
        importance: 'Advisory',
        tip: 'Prevents metallic rattles at idle.'
      },
      {
        component: 'Air Conditioning Performance',
        check: 'Verify AC blows ice-cold within 60 seconds on Max setting',
        importance: 'Important',
        tip: 'R1234yf refrigerant gas levels should be checked if cooling feels slow.'
      }
    ],
    defaultExplanation:
      'Raised crossover clearance with factory LPG fuel cutting driving expenses by almost half.'
  },
  {
    id: 'toyota-yaris-cross-hybrid',
    make: 'Toyota',
    model: 'Yaris Cross',
    generation: '1st Gen (XP210)',
    years: '2021 – Present',
    recommendedYears: '2021 – 2024',
    yearsToAvoid: 'None',
    bodyStyle: 'Crossover',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineSummary: '1.5L 3-cylinder Atkinson petrol + electric motor (116 hp / 130 hp)',
    recommendedPowertrain: '1.5 Hybrid FWD or AWD-i with independent rear electric motor',
    avoidPowertrain: 'Non-hybrid versions (rare in Europe and eliminate the fuel advantage)',
    horsepower: 116,
    acceleration0to100: 11.2,
    fuelEconomy: '4.5 L/100 km (63 mpg)',
    cargoCapacityLiters: 397,
    maxCargoCapacityLiters: 1097,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 21500,
    typicalPriceMax: 28500,
    goodBuyPrice: 23800,
    excellentBuyPrice: 22000,
    marketPriceType: 'both',
    carGrClassifiedCount: '460+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '21.000€ – 26.500€',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=toyota&model=yaris%20cross',
    reliabilityRating: 5,
    runningCostLevel: 'Very Low',
    comfortLevel: 4,
    safetyRating: 5,
    practicalityScore: 4,
    techScore: 4,
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Higher command seating position in a compact 4.18m city-friendly footprint',
      'Surprising 397-liter split-level boot with 40:20:40 folding rear bench',
      'Exceptional city efficiency routinely beating 4.2 L/100 km in real traffic',
      'Optional AWD-i provides reassuring winter traction on slippery ramps'
    ],
    cons: [
      '3-cylinder engine has a distinctive thrum when pushed hard',
      'Rear door opening angle is slightly narrow for bulky child car seats',
      'Door cards have hard scratchy plastics'
    ],
    bestFor: ['City drivers needing easy parking', 'Elderly or mobility-conscious drivers needing high entry', 'Couples', 'Low tax seekers'],
    notIdealFor: ['Frequent high-speed Autobahn touring with 4 large adults'],
    knownIssues: [
      '12V battery drain if parked for 4+ weeks with smart key in transmission range',
      'Rear wiper blade judder in light drizzle',
      'Infotainment boot time takes ~15 seconds on early 2021 firmware'
    ],
    inspectionChecklist: [
      {
        component: 'Hybrid Battery Filter Vent',
        check: 'Inspect air intake vent under rear passenger seat for pet hair/lint clogging',
        importance: 'Important',
        tip: 'Keeping the battery cooling fan clear prevents thermal throttling in summer.'
      },
      {
        component: 'AWD-i Rear Motor Connector (if AWD)',
        check: 'Inspect cable connector under rear suspension for corrosion integrity',
        importance: 'Advisory',
        tip: 'Sealed updated wiring harness fitted from factory.'
      },
      {
        component: 'Brake Disc Lip Wear',
        check: 'Check front disc thickness; regenerative braking extends life to 100k+ km',
        importance: 'Advisory',
        tip: 'Discs should look silver and smooth, not heavily grooved.'
      }
    ],
    defaultExplanation:
      'Elevated SUV command visibility and 4.2L/100km hybrid efficiency with easy compact parking.'
  },
  {
    id: 'bmw-3-series-touring-g21',
    make: 'BMW',
    model: '3 Series Touring',
    generation: 'G21',
    years: '2019 – Present',
    recommendedYears: '2020 – 2023',
    yearsToAvoid: 'Avoid pre-2019 F31 high-mileage diesels without timing chain proof',
    bodyStyle: 'Estate / Wagon',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engineSummary: '2.0L TwinPower Turbo Diesel (320d, 190 hp) or Petrol Plug-in Hybrid (330e, 292 hp)',
    recommendedPowertrain: '320d Mild Hybrid with ZF 8-speed auto (ideal for 25,000+ km/year)',
    avoidPowertrain: 'Base 318i petrol if regular mountain or fully-loaded driving is planned',
    horsepower: 190,
    acceleration0to100: 7.1,
    fuelEconomy: '5.0 L/100 km (56 mpg)',
    cargoCapacityLiters: 500,
    maxCargoCapacityLiters: 1510,
    seats: 5,
    drivetrain: 'RWD',
    typicalPriceMin: 27500,
    typicalPriceMax: 38500,
    goodBuyPrice: 30000,
    excellentBuyPrice: 28000,
    marketPriceType: 'used',
    reliabilityRating: 4,
    runningCostLevel: 'Medium',
    comfortLevel: 5,
    safetyRating: 5,
    practicalityScore: 4,
    techScore: 5,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Best-in-class 50:50 chassis balance and steering feedback',
      'Benchmark ZF 8-speed automatic gearbox is telepathically smooth',
      'Opening rear tailgate window allows loading shopping without opening boot',
      '320d mild-hybrid cruises at 140 km/h effortlessly returning under 5.2 L/100km'
    ],
    cons: [
      'Higher maintenance costs and dearer main dealer hourly rates',
      'M Sport suspension on 19" run-flat tires can feel stiff over potholes',
      'Options list complexity means used specs vary wildly'
    ],
    bestFor: ['Motorway commuters', 'Driving enthusiasts needing practical space', 'Business travelers', 'Design lovers'],
    notIdealFor: ['Tight budget owners unwilling to pay premium service bills'],
    knownIssues: [
      'EGR cooler recall on B47 diesel engines (confirm campaign completed)',
      'Front radar sensor alignment after minor bumper scrapes',
      'Run-flat tires wear outer shoulders quicker if alignment is neglected'
    ],
    inspectionChecklist: [
      {
        component: 'EGR Cooler & Valve Recall Status',
        check: 'Ask BMW dealer or check online VIN portal for EGR recall closure',
        importance: 'Critical',
        tip: 'BMW replaced cooler and intake manifolds free under safety campaign.'
      },
      {
        component: 'ZF 8HP Gearbox Smoothness',
        check: 'Verify crisp gear changes from 1st to 2nd and instant kickdown',
        importance: 'Important',
        tip: 'ZF recommends fluid change around 80,000-100,000 km despite lifetime claim.'
      },
      {
        component: 'Separate Tailgate Glass Latch',
        check: 'Press hidden button on rear wiper stalk to verify rear glass opens independently',
        importance: 'Advisory',
        tip: 'Microswitch can stick if road grime builds up; quick clean fixes it.'
      }
    ],
    defaultExplanation:
      'Dynamic rear-drive balance, 1,000km motorway range, and practical estate versatility.'
  },
  {
    id: 'hyundai-ioniq-5',
    make: 'Hyundai',
    model: 'Ioniq 5',
    generation: 'NE (E-GMP)',
    years: '2021 – Present',
    recommendedYears: '2022 – 2024',
    yearsToAvoid: 'Early 2021 builds without battery preconditioning software update',
    bodyStyle: 'Crossover',
    fuelType: 'Electric',
    transmission: 'Automatic',
    engineSummary: '72.6 kWh / 77.4 kWh battery (217 hp RWD or 305 hp AWD)',
    recommendedPowertrain: '77.4 kWh Long Range RWD (best blend of 480km range & efficiency)',
    avoidPowertrain: '58 kWh Standard Range if regular long motorway road trips are planned',
    horsepower: 217,
    acceleration0to100: 7.3,
    fuelEconomy: '17.2 kWh/100 km (Equivalent ~1.9 L/100km)',
    cargoCapacityLiters: 527,
    maxCargoCapacityLiters: 1587,
    seats: 5,
    drivetrain: 'RWD',
    typicalPriceMin: 28500,
    typicalPriceMax: 39900,
    goodBuyPrice: 31500,
    excellentBuyPrice: 29000,
    marketPriceType: 'used',
    reliabilityRating: 4,
    runningCostLevel: 'Low',
    comfortLevel: 5,
    safetyRating: 5,
    practicalityScore: 5,
    techScore: 5,
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Ultra-fast 800V charging: 10% to 80% in just 18 minutes on 350kW Ionity chargers',
      'Huge 3.0-meter wheelbase provides lounge-like rear executive legroom',
      'V2L (Vehicle-to-Load) enables powering household 230V appliances and camping gear',
      'Head-turning retro-futuristic pixel lighting and concept-car design'
    ],
    cons: [
      'Pre-facelift models lack a rear window wiper, reducing wet highway visibility',
      'Boxy aerodynamic shape increases consumption at 130+ km/h speeds',
      'Wide turning circle in multi-story underground carparks'
    ],
    bestFor: ['Tech-forward families', 'Fast-charging road trippers', 'Camping & outdoor enthusiasts', 'Comfort seekers'],
    notIdealFor: ['Drivers regularly parking in cramped subterranean parking bays'],
    knownIssues: [
      'ICCU (Integrated Charging Control Unit) fuse blowing on early batches (covered by recall)',
      '12V battery drain if bluelink third-party API apps poll continuously',
      'Lack of rear wiper on 2021-2023 models'
    ],
    inspectionChecklist: [
      {
        component: 'ICCU Software Recall Campaign',
        check: 'Confirm Hyundai dealer performed latest ICCU firmware update and fuse check',
        importance: 'Critical',
        tip: 'Prevents sudden charging stoppage or 12V failure.'
      },
      {
        component: 'Battery Pre-conditioning Feature',
        check: 'Check EV settings menu to verify winter battery pre-conditioning is enabled',
        importance: 'Important',
        tip: 'Ensures 220kW+ fast charging speeds even in sub-zero winter weather.'
      },
      {
        component: 'Sliding Center Console Mechanism',
        check: 'Slide Universal Island console back and forth to ensure smooth rail travel',
        importance: 'Advisory',
        tip: 'Unique E-GMP feature; ensure no coins or cables are jammed in track.'
      }
    ],
    defaultExplanation:
      'Ultra-fast 800V charging (10–80% in 18 min), futuristic styling, and executive lounge legroom.'
  },
  {
    id: 'volvo-xc60-recharge-t6',
    make: 'Volvo',
    model: 'XC60 Recharge',
    generation: '2nd Gen Facelift',
    years: '2018 – Present',
    recommendedYears: '2021 – 2024 (Extended Range 18.8 kWh battery models)',
    yearsToAvoid: 'Early 2018-2020 PHEV with smaller 11.6 kWh battery (limited 35 km EV range)',
    bodyStyle: 'Mid-size SUV',
    fuelType: 'Plug-in Hybrid',
    transmission: 'Automatic',
    engineSummary: '2.0L Turbo petrol + rear electric motor (350 hp combined, AWD)',
    recommendedPowertrain: 'Recharge T6 AWD Extended Range (78 km pure electric range)',
    avoidPowertrain: 'Early T8 Twin Engine non-extended range if pure electric commute is priority',
    horsepower: 350,
    acceleration0to100: 5.7,
    fuelEconomy: '1.2 – 2.8 L/100 km (Weighted PHEV) / 7.2 L/100km battery depleted',
    cargoCapacityLiters: 468,
    maxCargoCapacityLiters: 1395,
    seats: 5,
    drivetrain: 'AWD',
    typicalPriceMin: 34000,
    typicalPriceMax: 48000,
    goodBuyPrice: 38000,
    excellentBuyPrice: 35000,
    marketPriceType: 'used',
    reliabilityRating: 4,
    runningCostLevel: 'Medium',
    comfortLevel: 5,
    safetyRating: 5,
    practicalityScore: 4,
    techScore: 5,
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'World-class orthopedic seating ergonomics and Scandinavian minimalist interior',
      'Industry-leading safety structure and passive collision protection',
      'Extended Range battery delivers 65-75 km real-world zero-emission city driving',
      'Effortless 350 hp all-wheel-drive passing acceleration on highway ramps'
    ],
    cons: [
      'Battery pack takes up space in the center tunnel and slightly limits boot depth',
      'Android Automotive infotainment can require periodic soft reboots',
      'Heavy kerb weight (2,150 kg) accelerates tire wear'
    ],
    bestFor: ['Safety-conscious families', 'Executive commuters with home charging', 'Snow & mountain lifestyle', 'Luxury seekers'],
    notIdealFor: ['Buyers who never plan to plug into a home wallbox'],
    knownIssues: [
      'ERAD (Electric Rear Axle Drive) bearing noise on early pre-2020 units',
      'Air suspension compressor valve sticking in sub-zero winter salt (on air-ride cars)',
      'TCAM telematics module backup battery discharge causing GPS loss'
    ],
    inspectionChecklist: [
      {
        component: 'Hybrid Battery Capacity & SOH',
        check: 'Check full EV charge range display after overnight 100% plug-in',
        importance: 'Critical',
        tip: 'Extended Range model should indicate 68–78 km on dashboard when full.'
      },
      {
        component: 'Rear Electric Axle (ERAD) Sound',
        check: 'Drive at 40-70 km/h in Pure EV mode and listen for high-pitch whine from rear',
        importance: 'Important',
        tip: 'Should be silent; whining indicates clutch/bearing wear in rear motor unit.'
      },
      {
        component: 'Air Suspension Compressor (if optioned)',
        check: 'Cycle ride height between Off-Road and Dynamic mode listening for smooth operation',
        importance: 'Advisory',
        tip: 'Ensure compressor cycles off once target height is reached.'
      }
    ],
    defaultExplanation:
      'Orthopedic seating comfort, 75km pure electric city range, and peerless Scandinavian safety.'
  },
  {
    id: 'honda-civic-ehev-mk11',
    make: 'Honda',
    model: 'Civic e:HEV',
    generation: '11th Gen (FL4)',
    years: '2022 – Present',
    recommendedYears: '2022 – 2024',
    yearsToAvoid: 'None',
    bodyStyle: 'Hatchback',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineSummary: '2.0L Atkinson petrol + 2 electric motors (184 hp) direct-drive e-CVT',
    recommendedPowertrain: '2.0 e:HEV Sport / Advance',
    avoidPowertrain: 'None (only one powertrain offered in Europe, and it is brilliant)',
    horsepower: 184,
    acceleration0to100: 7.8,
    fuelEconomy: '4.7 L/100 km (60 mpg)',
    cargoCapacityLiters: 410,
    maxCargoCapacityLiters: 1220,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 26000,
    typicalPriceMax: 33500,
    goodBuyPrice: 28500,
    excellentBuyPrice: 26500,
    marketPriceType: 'both',
    reliabilityRating: 5,
    runningCostLevel: 'Low',
    comfortLevel: 5,
    safetyRating: 5,
    practicalityScore: 4,
    techScore: 4,
    imageUrl: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Outstanding chassis dynamics that feel sportier than Golf and Corolla',
      'Innovative hybrid drive operates mostly as pure electric with simulated gearshifts',
      'Generous 410-liter fastback boot with lightweight composite tailgate',
      'Flawless physical dashboard dials and honeycomb metal AC vent design'
    ],
    cons: [
      'Low slung seating position may be harder for elderly drivers to get into',
      'Road noise on 18" rims over concrete motorways',
      'Availability on European used market is still relatively scarce'
    ],
    bestFor: ['Drivers who love driving but need 4.7 L/100km economy', 'Tech and ergonomics purists', 'Reliability seekers'],
    notIdealFor: ['Drivers wanting an upright high-riding crossover seating view'],
    knownIssues: [
      'Steering rack stickiness sensation on certain 2022-2023 cars (remedied by Honda TSB)',
      'Wireless Apple CarPlay occasionally skips when driving past toll gates',
      'Clear coat on gloss-black exterior trim scratches easily if washed improperly'
    ],
    inspectionChecklist: [
      {
        component: 'Steering Gearbox Smoothness TSB',
        check: 'Make micro-steering adjustments around 70-100 km/h on straight motorway',
        importance: 'Critical',
        tip: 'Steering wheel should track smoothly with zero sticky notched resistance.'
      },
      {
        component: 'Composite Tailgate Gas Struts',
        check: 'Ensure lightweight tailgate raises completely without catching',
        importance: 'Advisory',
        tip: 'Honda used resin tailgate structure to shed weight.'
      },
      {
        component: 'Honda Sensing Camera Calibration',
        check: 'Test adaptive cruise and lane keep assist on a marked bypass road',
        importance: 'Important',
        tip: 'Radar and mono camera should detect lead cars and cyclists instantly.'
      }
    ],
    defaultExplanation:
      'Agile driver dynamics, 4.7L/100km hybrid economy, and an exceptionally intuitive tactile cabin.'
  },
  {
    id: 'ford-fiesta-mk8',
    make: 'Ford',
    model: 'Fiesta',
    generation: 'Mk8',
    years: '2017 – 2023',
    recommendedYears: '2018 – 2022',
    yearsToAvoid: 'Early pre-2016 Mk7 wet timing belt engines without belt change proof',
    bodyStyle: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Both available',
    engineSummary: '1.0L EcoBoost mHEV (125 hp) or 1.1 Ti-VCT (75 hp)',
    recommendedPowertrain: '1.0 EcoBoost Hybrid mHEV 125 hp 6-speed manual',
    avoidPowertrain: 'Powershift dry dual-clutch automatics (stick to manual or post-2020 7-speed wet clutch)',
    horsepower: 125,
    acceleration0to100: 9.4,
    fuelEconomy: '5.0 L/100 km (56 mpg)',
    cargoCapacityLiters: 292,
    maxCargoCapacityLiters: 1093,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 8500,
    typicalPriceMax: 14500,
    goodBuyPrice: 10500,
    excellentBuyPrice: 9200,
    marketPriceType: 'used',
    reliabilityRating: 4,
    runningCostLevel: 'Very Low',
    comfortLevel: 3,
    safetyRating: 5,
    practicalityScore: 3,
    techScore: 3,
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Joyous, nimble go-kart handling and sharp manual gearbox shift action',
      'Affordable replacement parts available at every workshop in Europe',
      '1.0 EcoBoost mHEV is punchy around town and economical on motorways',
      'Compact size slips into the tightest parallel parking spots with ease'
    ],
    cons: [
      'Compact boot (292 liters) struggles with double strollers or holiday suitcases',
      'Rear seat space is cramped for adults over 180cm',
      'Strict oil specification required for EcoBoost timing belt longevity'
    ],
    bestFor: ['First-time buyers', 'City dwellers', 'Enthusiastic daily commuters on a budget', 'Students & young drivers'],
    notIdealFor: ['Growing families needing pram and luggage storage'],
    knownIssues: [
      'EcoBoost wet belt degradation if incorrect non-Castrol Magnatec oil was used',
      'Coolant expansion tank degas pipe brittleness on high mileage models',
      'Stop-start battery sensor can trigger false warning lights'
    ],
    inspectionChecklist: [
      {
        component: 'Oil Filler Cap Wet Belt Inspection',
        check: 'Shine flashlight into oil filler neck to inspect exposed rubber teeth of timing belt',
        importance: 'Critical',
        tip: 'Look for fraying, cracks, or swollen rubber edges; rubber debris can block oil pickup.'
      },
      {
        component: 'Coolant Hose Connections',
        check: 'Inspect plastic T-junction hoses near turbo and radiator for white residue',
        importance: 'Important',
        tip: 'Preventative replacement costs €40 and prevents overheating.'
      },
      {
        component: 'Front Suspension Drop Links',
        check: 'Listen for light tapping noise over cobblestones or broken road edges',
        importance: 'Advisory',
        tip: 'Inexpensive wear item (€35 per link).'
      }
    ],
    defaultExplanation:
      'Playful go-kart handling, cheap spare parts, and punchy 125hp EcoBoost efficiency.'
  },
  {
    id: 'porsche-macan-gen1',
    make: 'Porsche',
    model: 'Macan',
    generation: 'Facelift (Type 95B.2 / 95B.3)',
    years: '2019 – 2024',
    recommendedYears: '2019 – 2023',
    yearsToAvoid: 'Early 2014-2016 Macan S with known timing cover oil leak unless resealed',
    bodyStyle: 'Compact SUV',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineSummary: '2.0L Turbo 4-cyl (245 hp / 265 hp) or 2.9L Twin-Turbo V6 (Macan S / GTS, 380 hp)',
    recommendedPowertrain: '2.0T for sensible running costs; 2.9T V6 Macan S for visceral Porsche performance',
    avoidPowertrain: 'Pre-2017 high-mileage diesel without transfer case replacement documentation',
    horsepower: 265,
    acceleration0to100: 6.4,
    fuelEconomy: '9.2 L/100 km (30 mpg)',
    cargoCapacityLiters: 488,
    maxCargoCapacityLiters: 1503,
    seats: 5,
    drivetrain: 'AWD',
    typicalPriceMin: 44000,
    typicalPriceMax: 68000,
    goodBuyPrice: 49000,
    excellentBuyPrice: 45000,
    marketPriceType: 'used',
    reliabilityRating: 4,
    runningCostLevel: 'High',
    comfortLevel: 5,
    safetyRating: 5,
    practicalityScore: 4,
    techScore: 5,
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Genuinely handles like a sports car rather than a tall SUV',
      'Supreme PDK dual-clutch transmission shifts faster than human thought',
      'Rock-solid Porsche build quality with peerless switchgear tactility',
      'Strong residual value retention compared to other luxury brand SUVs'
    ],
    cons: [
      'Premium Porsche servicing, brake discs, and Michelin N-rated tire prices',
      'Real-world fuel consumption averages 9.5-12 L/100km in city traffic',
      'Rear passenger legroom is cozy rather than cavernous'
    ],
    bestFor: ['Driving enthusiasts who need practical SUV utility', 'Luxury connoisseurs', 'Performance seekers'],
    notIdealFor: ['Budget-conscious buyers who want cheap annual maintenance'],
    knownIssues: [
      'Transfer case shudder under low-speed full lock turns (Porsche 7-year extended warranty applies)',
      'Front timing chain cover bolt shear oil seepage on older V6 blocks',
      'PDK mechatronic circuit board speed sensor on 120,000+ km examples'
    ],
    inspectionChecklist: [
      {
        component: 'Transfer Case Shudder Test',
        check: 'Perform slow figure-of-eight turns in an empty car park on dry asphalt',
        importance: 'Critical',
        tip: 'Any drivetrain binding or judder means transfer case fluid or unit needs Porsche warranty service.'
      },
      {
        component: 'PASM Air Suspension Leak Down',
        check: 'Leave vehicle parked overnight and check that no corner has settled lower',
        importance: 'Important',
        tip: 'Air bellows or valve block O-rings should hold 100% pressure.'
      },
      {
        component: 'Porsche Approved Warranty Eligibility',
        check: 'Verify vehicle has full service history to maintain 111-point Porsche warranty check',
        importance: 'Important',
        tip: 'Porsche Approved warranty provides comprehensive peace of mind up to 15 years old.'
      }
    ],
    defaultExplanation:
      'Genuine sports car steering clarity, razor-sharp PDK gearbox, and authentic Porsche engineering.'
  },
  {
    id: 'toyota-yaris-hybrid-mk3',
    make: 'Toyota',
    model: 'Yaris Hybrid',
    generation: 'XP130 (Facelift)',
    years: '2014 – 2020',
    recommendedYears: '2016 – 2019',
    yearsToAvoid: 'Pre-2014 non-hybrid 1.0 petrol with sluggish 68 hp on steep highway ramps',
    bodyStyle: 'City car',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineSummary: '1.5L Atkinson cycle petrol + 45 kW electric motor (100 hp total)',
    recommendedPowertrain: '1.5 Hybrid e-CVT',
    avoidPowertrain: '1.0 VVT-i 5-speed manual (rough 3-cylinder vibration)',
    horsepower: 100,
    acceleration0to100: 11.8,
    fuelEconomy: '3.7 – 4.2 L/100 km (70 mpg)',
    cargoCapacityLiters: 286,
    maxCargoCapacityLiters: 768,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 8500,
    typicalPriceMax: 12900,
    goodBuyPrice: 9800,
    excellentBuyPrice: 8900,
    marketPriceType: 'used',
    reliabilityRating: 5,
    runningCostLevel: 'Very Low',
    comfortLevel: 3,
    safetyRating: 4,
    practicalityScore: 4,
    techScore: 3,
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Unbelievably reliable with hundreds of thousands of trouble-free city km',
      'Sub-4.0 L/100 km real-world fuel consumption in stop-and-go gridlock',
      'Under 4 meters long: parks in spaces other cars can only dream of',
      'No starter motor, alternator, or friction clutch to ever wear out or replace'
    ],
    cons: [
      'Cabin insulation is thin at 120 km/h motorway speeds',
      'Ride is slightly bouncy on poor urban asphalt',
      'Early Touch 2 infotainment is slow'
    ],
    bestFor: ['First-time buyers', 'City commuters', 'Ultra-low running costs', 'Easy parallel parking'],
    notIdealFor: ['Frequent international long-distance highway road trips'],
    knownIssues: [
      'Rear exhaust heat shield rust at fixing bolt washers (easy oversized washer fix)',
      '12V battery drain if left idle for several weeks',
      'Rear drum brakes can collect dust and squeak on gentle stops'
    ],
    inspectionChecklist: [
      {
        component: 'Hybrid Inverter Coolant Level',
        check: 'Inspect dedicated hybrid inverter expansion tank on passenger side of engine bay',
        importance: 'Critical',
        tip: 'Pink Toyota Super Long Life Coolant must be between Min and Max lines.'
      },
      {
        component: 'Exhaust Heat Shield Washers',
        check: 'Reach under rear muffler to gently shake the aluminium heat shield',
        importance: 'Advisory',
        tip: 'Common €5 fix with stainless steel repair washer if corroded around studs.'
      },
      {
        component: 'Air Conditioning Evaporator Odor',
        check: 'Turn off AC cooling 2 minutes before destination to inspect for mustiness',
        importance: 'Advisory',
        tip: 'Clean cabin filter and ozone treatment freshens air instantly.'
      }
    ],
    defaultExplanation:
      'Sub-4.0L/100km city efficiency, indestructible hybrid durability, and effortless parallel parking.'
  },
  {
    id: 'skoda-kodiaq-mk1',
    make: 'Škoda',
    model: 'Kodiaq',
    generation: 'Mk1 Facelift',
    years: '2017 – 2023',
    recommendedYears: '2019 – 2023',
    yearsToAvoid: '2017 initial production run before suspension refinement update',
    bodyStyle: 'Large SUV',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engineSummary: '2.0 TDI (150 hp / 200 hp) DSG 4x4 or 2.0 TSI (190 hp)',
    recommendedPowertrain: '2.0 TDI 150 hp or 200 hp 4x4 DSG with 7-seat configuration',
    avoidPowertrain: '1.4 TSI 125 hp front-wheel-drive when full 7 passengers are seated',
    horsepower: 150,
    acceleration0to100: 9.6,
    fuelEconomy: '5.9 L/100 km (48 mpg)',
    cargoCapacityLiters: 650,
    maxCargoCapacityLiters: 2065,
    seats: 7,
    drivetrain: 'AWD',
    typicalPriceMin: 23500,
    typicalPriceMax: 34500,
    goodBuyPrice: 26000,
    excellentBuyPrice: 24200,
    marketPriceType: 'used',
    reliabilityRating: 4,
    runningCostLevel: 'Medium',
    comfortLevel: 5,
    safetyRating: 5,
    practicalityScore: 5,
    techScore: 4,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Full 7-seat versatility with cavernous 2,065-liter maximum cargo bay',
      'Electronic door-edge protective strips pop out automatically when parking',
      'Reassuring Haldex 4x4 system tows up to 2,500 kg effortlessly',
      'Remarkable long-distance seat comfort and panoramic glass roof option'
    ],
    cons: [
      'Large 4.7m footprint requires attention in tight multi-story parking ramps',
      'Third row is best suited for children or adults on short trips',
      'DSG gearbox fluid service is critical every 60,000 km'
    ],
    bestFor: ['Large families', 'Carrying lots of sporting gear', 'Towing caravans or horseboxes', 'Dogs and road trips'],
    notIdealFor: ['Single city dwellers with narrow garage entrances'],
    knownIssues: [
      'Water pump leak on 2.0 TDI engines around 100,000 km',
      'Door edge protector spring popping out if pushed incorrectly',
      'Virtual cockpit screen occasional flicker on older firmware'
    ],
    inspectionChecklist: [
      {
        component: 'Haldex AWD Pump & Oil Service',
        check: 'Verify Haldex 4x4 oil service history (recommended every 30,000–60,000 km)',
        importance: 'Critical',
        tip: 'Ensure technician cleaned the Haldex mesh filter screen, not just fluid drain.'
      },
      {
        component: 'Third-Row Seat Folding Operation',
        check: 'Pull boot release straps to test rapid fold-flat action of 6th and 7th seats',
        importance: 'Important',
        tip: 'Both seats should fold completely flat with one hand.'
      },
      {
        component: 'Water Pump & Timing Belt History',
        check: 'Inspect coolant level and history if vehicle is over 5 years or 120,000 km',
        importance: 'Important',
        tip: 'Replace water pump simultaneously with timing belt kit.'
      }
    ],
    defaultExplanation:
      'Spacious 7-seat family versatility, 2,000L luggage bay, and confident 4x4 road manners.'
  },
  {
    id: 'tesla-model-y-longrange',
    make: 'Tesla',
    model: 'Model Y',
    generation: 'Dual Motor AWD / RWD',
    years: '2021 – Present',
    recommendedYears: '2022 – 2024 (Berlin Gigafactory builds with upgraded suspension)',
    yearsToAvoid: 'Early 2021 Shanghai import units with firm original damping',
    bodyStyle: 'Mid-size SUV',
    fuelType: 'Electric',
    transmission: 'Automatic',
    engineSummary: 'Dual Motor All-Wheel Drive (384 hp combined, 75 kWh battery)',
    recommendedPowertrain: 'Long Range AWD (533 km WLTP range) or RWD (best value)',
    avoidPowertrain: 'Performance on 21" Uberturbine wheels if smooth pothole compliance is vital',
    horsepower: 384,
    acceleration0to100: 5.0,
    fuelEconomy: '16.9 kWh/100 km (Equivalent ~1.8 L/100km)',
    cargoCapacityLiters: 854,
    maxCargoCapacityLiters: 2158,
    seats: 5,
    drivetrain: 'AWD',
    typicalPriceMin: 33000,
    typicalPriceMax: 44000,
    goodBuyPrice: 36000,
    excellentBuyPrice: 33800,
    marketPriceType: 'both',
    reliabilityRating: 4,
    runningCostLevel: 'Very Low',
    comfortLevel: 4,
    safetyRating: 5,
    practicalityScore: 5,
    techScore: 5,
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Tremendous 854-liter boot plus a deep 117-liter front trunk (frunk)',
      'Unsurpassed active safety ratings from Euro NCAP with 98% adult protection',
      'Direct access to Europe’s most dependable Tesla Supercharger network',
      'Effortless 5.0s 0-100 km/h AWD passing acceleration and dog/camp climate modes'
    ],
    cons: [
      'Firm ride quality on broken road surfaces compared to air-sprung German SUVs',
      'No rear window sunblind or physical door handles for children',
      'Tesla Vision parking assist relies on cameras without ultrasonic radar sensors'
    ],
    bestFor: ['Tech-oriented families', 'High-mileage commuters', 'Electric road trips', 'Maximum luggage space'],
    notIdealFor: ['Drivers who prefer physical dashboard switches and tactile instrument dials'],
    knownIssues: [
      'Tailgate alignment rubs bumper paint on early builds',
      'Rear subframe suspension creak under hard acceleration (remedied under warranty)',
      'Camera condensation during damp winter mornings until heaters warm up'
    ],
    inspectionChecklist: [
      {
        component: 'Berlin Comfort Suspension Build Code',
        check: 'Check VIN 11th digit ("B" for Berlin Giga) or manufacture date post-late 2022',
        importance: 'Important',
        tip: 'Berlin-built models feature noticeably plusher, reworked frequency dampers.'
      },
      {
        component: 'Underside Battery Skid Plate',
        check: 'Inspect protective composite belly pans for curb gouges or deformation',
        importance: 'Critical',
        tip: 'Ensures battery pack casing has never suffered road debris impact.'
      },
      {
        component: 'HVAC Air Filter Mustiness',
        check: 'Run AC on high for 30 seconds; replace HEPA filters if damp scent persists',
        importance: 'Advisory',
        tip: 'Bioweapon Defense Mode HEPA filters should be renewed every 2 years.'
      }
    ],
    defaultExplanation:
      'Class-leading 854L cargo capacity, rapid 5.0s acceleration, and zero maintenance headaches.'
  },
  {
    id: 'toyota-yaris-mk1-xp10',
    make: 'Toyota',
    model: 'Yaris (Mk1)',
    generation: 'XP10',
    years: '1999 – 2005',
    recommendedYears: '2001 – 2005 (Facelift French / Japanese build)',
    yearsToAvoid: '1.4 D-4D diesel with high mileage unless turbo service is documented',
    bodyStyle: 'City car',
    fuelType: 'Petrol',
    transmission: 'Both available',
    engineSummary: '1.0L 1SZ-FE (68 hp) or 1.3L 2SZ-FE / 2NZ-FE VVT-i (86 hp) with timing chain',
    recommendedPowertrain: '1.0L for zero running costs in city traffic; 1.3L VVT-i for Greek highway trips',
    avoidPowertrain: 'Free-Tronic semi-automatic clutchless manual (expensive electro-hydraulic actuator failure)',
    horsepower: 68,
    acceleration0to100: 13.6,
    fuelEconomy: '5.4 L/100 km (52 mpg)',
    cargoCapacityLiters: 205,
    maxCargoCapacityLiters: 950,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 1500,
    typicalPriceMax: 3200,
    goodBuyPrice: 2300,
    excellentBuyPrice: 1800,
    marketPriceType: 'used',
    engineDisplacementCc: 998,
    greekRoadTaxEur: 120,
    athensRingExempt: false,
    greekMarketPopularity: 'Absolute #1 Greek Budget Legend · 998cc Low Tax (Τεκμήριο) · Indestructible Chain',
    carGrClassifiedCount: '2.340+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '2.200€ – 3.300€ στο Car.gr',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=toyota&model=yaris',
    reliabilityRating: 5,
    runningCostLevel: 'Very Low',
    comfortLevel: 3,
    safetyRating: 4,
    practicalityScore: 4,
    techScore: 2,
    imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Timing chain on 1.0 & 1.3 VVT-i engines means no expensive timing belt to change',
      'Bulletproof Japanese engineering — routinely surpasses 350,000 km in Greek city traffic',
      'Lowest possible Greek tax bracket (sub-1,000 cc has minimal annual τεκμήριο)',
      'Sliding rear seat bench expands boot or gives surprising rear legroom'
    ],
    cons: [
      'Cabin plastics are 2000s era hard plastic and sun-faded in Greece',
      'Central digital 3D speedometer instrument pod takes getting used to',
      'No modern Bluetooth audio without cheap 1-DIN head unit upgrade'
    ],
    bestFor: ['First car', 'Greek city commuting (Athens / Thessaloniki)', 'Students', 'Rock-bottom €1,500–€3,000 budget'],
    notIdealFor: ['Frequent international highway cruising at 140+ km/h'],
    knownIssues: [
      'MAF (Mass Air Flow) sensor gets dirty causing idle shudder (cleaned with €8 spray)',
      'Clearcoat peeling on roof/bonnet from strong Greek Mediterranean sun',
      'Power steering torque sensor fault on high mileage pre-facelifts'
    ],
    inspectionChecklist: [
      {
        component: 'Timing Chain Rattle on Cold Start',
        check: 'Start engine from stone cold and listen for metallic slap in first 2 seconds',
        importance: 'Critical',
        tip: 'Should be silent; oil changes every 10,000 km keep tensioners healthy forever.'
      },
      {
        component: 'Air Conditioning Cooling (Greek Summer Check)',
        check: 'Test AC compressor engagement and check for R134a refrigerant leak',
        importance: 'Important',
        tip: 'Essential in Greek summers; compressor is robust, recharge costs €40-€50.'
      },
      {
        component: 'Greek KTEO (ΚΤΕΟ) Certificate & Emissions Card',
        check: 'Verify valid KTEO inspection stamp and check for rear axle bushing advisories',
        importance: 'Important',
        tip: 'Check that chassis number matches Greek vehicle registration paper (άδεια κυκλοφορίας).'
      }
    ],
    defaultExplanation:
      'Indestructible timing-chain engine, lowest 120€ tax bracket, and sub-€3,000 bulletproof reliability.'
  },
  {
    id: 'fiat-punto-panda-12-fire',
    make: 'Fiat',
    model: 'Punto / Panda 1.2 FIRE',
    generation: 'Punto Classic (188) / Panda (169)',
    years: '2003 – 2011',
    recommendedYears: '2004 – 2009',
    yearsToAvoid: 'Dualogic semi-automatic gearbox (stick to the simple 5-speed manual)',
    bodyStyle: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Manual',
    engineSummary: '1.2L 8V FIRE naturally aspirated (60 hp) non-interference engine',
    recommendedPowertrain: '1.2 8-valve (60 hp) manual (non-interference valve design)',
    avoidPowertrain: '1.2 16V or Dualogic robotized gearbox if budget is strictly limited',
    horsepower: 60,
    acceleration0to100: 14.3,
    fuelEconomy: '5.6 L/100 km (50 mpg)',
    cargoCapacityLiters: 264,
    maxCargoCapacityLiters: 1080,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 1500,
    typicalPriceMax: 2900,
    goodBuyPrice: 2100,
    excellentBuyPrice: 1650,
    marketPriceType: 'used',
    engineDisplacementCc: 1242,
    greekRoadTaxEur: 135,
    athensRingExempt: false,
    greekMarketPopularity: 'Greek Island & City Favorite · 1.2 FIRE Non-Interference · Cheapest Repairs',
    carGrClassifiedCount: '1.450+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '1.200€ – 2.500€ στο Car.gr',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=fiat&model=punto',
    reliabilityRating: 4,
    runningCostLevel: 'Very Low',
    comfortLevel: 3,
    safetyRating: 3,
    practicalityScore: 4,
    techScore: 2,
    imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Non-interference FIRE engine: even if timing belt snaps, pistons never hit valves!',
      'Cheapest replacement parts in Europe: alternator, clutch, and brakes cost pennies',
      '"City" button makes steering finger-light for parking in tight Greek alleys',
      'Immense parts supply in Greece and every island mechanic knows it by heart'
    ],
    cons: [
      'Modest 60 hp struggles on steep mountain highway ascents with full AC on',
      'Cabin insulation is basic at 120 km/h speeds',
      'Electric power steering motor relay can fail on early units'
    ],
    bestFor: ['Ultra-tight €1,500 budget', 'Island & city drivers', 'First-time drivers', 'Lowest repair costs'],
    notIdealFor: ['High-speed cross-country Autobahn drivers'],
    knownIssues: [
      'Electric power steering "City" column motor relay solder joints (cheap reconditioned swap)',
      'Valve cover gasket light oil seep (€10 rubber gasket replacement)',
      'Front suspension wishbone rubber bushes wear over cobblestones'
    ],
    inspectionChecklist: [
      {
        component: 'City Steering Light & Function',
        check: 'Press "City" dashboard button and verify steering wheel spins with one pinky finger',
        importance: 'Critical',
        tip: 'Red steering wheel warning light should turn off after starting engine.'
      },
      {
        component: 'Cooling Radiator & Fan Switch',
        check: 'Let idle up to operating temperature to verify electric cooling fan turns on',
        importance: 'Important',
        tip: 'Crucial for Greek traffic jams; fan resistor switch is a €15 part.'
      },
      {
        component: 'Clutch Pedal Engagement Height',
        check: 'Check clutch bite point; should engage mid-pedal without slipping on hill start',
        importance: 'Important',
        tip: 'Complete clutch kit is very affordable (€75-€100 in Greece).'
      }
    ],
    defaultExplanation:
      'Non-interference FIRE engine with finger-light City steering and Europe’s lowest repair costs.'
  },
  {
    id: 'nissan-micra-k12',
    make: 'Nissan',
    model: 'Micra',
    generation: 'K12',
    years: '2003 – 2010',
    recommendedYears: '2005 – 2009 (Facelift with upgraded steering & headlights)',
    yearsToAvoid: 'Early 2003 builds with stretched timing chain sensor codes',
    bodyStyle: 'City car',
    fuelType: 'Petrol',
    transmission: 'Both available',
    engineSummary: '1.2L CR12DE 4-cylinder petrol (80 hp) with timing chain',
    recommendedPowertrain: '1.2L 80 hp 5-speed manual',
    avoidPowertrain: '1.5 dCi diesel unless documented injector maintenance exists',
    horsepower: 80,
    acceleration0to100: 13.9,
    fuelEconomy: '5.8 L/100 km (49 mpg)',
    cargoCapacityLiters: 251,
    maxCargoCapacityLiters: 984,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 1800,
    typicalPriceMax: 3600,
    goodBuyPrice: 2500,
    excellentBuyPrice: 2000,
    marketPriceType: 'used',
    engineDisplacementCc: 1240,
    greekRoadTaxEur: 135,
    athensRingExempt: false,
    greekMarketPopularity: 'Beloved Greek City Hatch · 1.240 cc Low Annual Tax · Tiny 4.4m Turning Circle',
    carGrClassifiedCount: '980+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '1.800€ – 3.200€ στο Car.gr',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=nissan&model=micra',
    reliabilityRating: 4,
    runningCostLevel: 'Very Low',
    comfortLevel: 3,
    safetyRating: 4,
    practicalityScore: 4,
    techScore: 2,
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Tiny 4.4-meter turning circle makes parallel parking effortless',
      'Punchy 1.2L 16-valve engine with 80 hp handles Greek ring roads with ease',
      'Clever storage: hidden compartment under front passenger seat cushion',
      'Timing chain means no scheduled timing belt replacement expense'
    ],
    cons: [
      'Bubbly curved styling divides opinion',
      'Plastic headlight lenses yellow under intense Greek UV sunlight (need 20€ polish)',
      'Rear boot lock microswitch can get sticky with sea salt spray'
    ],
    bestFor: ['Greek city commuters', 'New drivers', 'Easy parking in tight streets', 'Sub-€3,000 budget'],
    notIdealFor: ['Carrying large furniture or 4 tall passengers on long holidays'],
    knownIssues: [
      'Timing chain stretch on early 2003-2004 models (triggers P0340 cam sensor code)',
      'Headlight UV oxidation (easy 15-minute restoration polish kit)',
      'Boot latch switch corrosion from wet weather'
    ],
    inspectionChecklist: [
      {
        component: 'Engine Check Light & Cold Crank',
        check: 'Check that engine starts in under 2 seconds without extended cranking',
        importance: 'Critical',
        tip: 'Extended cranking points to stretched timing chain; healthy cars fire up instantly.'
      },
      {
        component: 'Rear Boot Latch Microswitch',
        check: 'Press electric rubber tailgate button to ensure boot clicks open on first tap',
        importance: 'Advisory',
        tip: 'Microswitch replacement costs €25.'
      },
      {
        component: 'Front Suspension Top Strut Mounts',
        check: 'Turn steering from lock to lock with engine on and listen for spring pinging',
        importance: 'Important',
        tip: 'Top strut bearings are common wear item over Greek potholes; €40 repair.'
      }
    ],
    defaultExplanation:
      'Tiny 4.4m turning radius, energetic 80hp chain engine, and low Greek city running costs.'
  },
  {
    id: 'hyundai-getz-11-13',
    make: 'Hyundai',
    model: 'Getz',
    generation: '1st Gen Facelift',
    years: '2002 – 2009',
    recommendedYears: '2005 – 2009 (Facelift Cross / 1.1 / 1.4)',
    yearsToAvoid: 'High mileage pre-facelift 1.3 with neglected timing belt service',
    bodyStyle: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Manual',
    engineSummary: '1.1L (66 hp) or 1.4L 16V (97 hp) 4-cylinder petrol',
    recommendedPowertrain: '1.1L for maximum Greek tax efficiency; 1.4L for punchy overtaking',
    avoidPowertrain: 'Rare 3-cylinder 1.5 CRDi diesel without Greek KTEO emissions papers',
    horsepower: 66,
    acceleration0to100: 15.2,
    fuelEconomy: '5.5 L/100 km (51 mpg)',
    cargoCapacityLiters: 254,
    maxCargoCapacityLiters: 977,
    seats: 5,
    drivetrain: 'FWD',
    typicalPriceMin: 1600,
    typicalPriceMax: 3400,
    goodBuyPrice: 2400,
    excellentBuyPrice: 1900,
    marketPriceType: 'used',
    engineDisplacementCc: 1086,
    greekRoadTaxEur: 120,
    athensRingExempt: false,
    greekMarketPopularity: 'Legendary Greek Workhorse · Robust A/C for Heatwaves · Low Tax Bracket',
    carGrClassifiedCount: '520+ αγγελίες στο Car.gr',
    carGrPriceBenchmark: '1.600€ – 2.800€ στο Car.gr',
    carGrSearchUrl: 'https://www.car.gr/classifieds/cars/?make=hyundai&model=getz',
    reliabilityRating: 5,
    runningCostLevel: 'Very Low',
    comfortLevel: 3,
    safetyRating: 4,
    practicalityScore: 4,
    techScore: 2,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    pros: [
      'Simple, over-engineered Korean mechanicals that virtually never leave you stranded',
      'Super-efficient ice-cold air conditioning system capable of beating 42°C Greek heat',
      'Low annual road tax (120€) and lowest Greek income presumption bracket (τεκμήριο)',
      'Solid rustproofing compared to other early-2000s subcompacts'
    ],
    cons: [
      'Styling is utilitarian and conservative',
      'Timing belt requires change every 60,000 km or 5 years',
      'Basic soundproofing at motorway speeds above 120 km/h'
    ],
    bestFor: ['Budget city commuting', 'Greek island rental return purchases', 'First-time buyers', 'Lowest ownership stress'],
    notIdealFor: ['Car buyers seeking badge prestige or sporty exhaust notes'],
    knownIssues: [
      'Exhaust rear silencer rust on cars parked near the Greek coastline',
      'Clutch release bearing chirp on high mileage units',
      'Worn front sway bar drop links'
    ],
    inspectionChecklist: [
      {
        component: 'Timing Belt Replacement Invoice',
        check: 'Inspect service records to ensure timing belt was renewed within last 5 years',
        importance: 'Critical',
        tip: 'Timing belt kit with water pump costs just €120 installed in Greece.'
      },
      {
        component: 'Air Conditioning Output Temperature',
        check: 'Insert thermometer in center air vent; must drop below 7°C on Max AC',
        importance: 'Important',
        tip: 'Getz AC systems are famous in Greece for being exceptionally powerful.'
      },
      {
        component: 'Underbody Coastal Salt Inspection',
        check: 'Inspect sills and subframe for surface corrosion if car lived on Greek islands',
        importance: 'Advisory',
        tip: 'Factory galvanized steel holds up well, but check underbody clips.'
      }
    ],
    defaultExplanation:
      'Indestructible Korean mechanicals, lowest tax bracket, and powerful A/C for Greek heatwaves.'
  }
];

export const GET_VEHICLE_BY_ID = (id: string): Vehicle | undefined => {
  return VEHICLES.find((v) => v.id === id);
};
