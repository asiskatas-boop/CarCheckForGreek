import React, { useState } from 'react';
import {
  Printer,
  Download,
  FileCode,
  FileText,
  X,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Euro,
  Car,
  Search,
  SlidersHorizontal,
  Bookmark,
  Scale
} from 'lucide-react';
import { VEHICLES } from '../data/vehicles';
import { MARKETPLACE_LISTINGS } from '../data/listings';
import { MarketRegion, Currency } from '../types';

interface ScreensExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketRegion: MarketRegion;
  currency: Currency;
}

export const ScreensExportModal: React.FC<ScreensExportModalProps> = ({
  isOpen,
  onClose,
  marketRegion,
  currency
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'discovery' | 'results' | 'dossier'>('all');
  const isGreek = marketRegion === 'greece';

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const exportData = {
      appName: 'CarCheck',
      version: '2.0.0-apple-design',
      marketRegion,
      exportedAt: new Date().toISOString(),
      summary: 'Complete vehicle discovery catalog with Greek market taxation and Car.gr benchmarks',
      vehiclesCount: VEHICLES.length,
      listingsCount: MARKETPLACE_LISTINGS.length,
      vehicles: VEHICLES.map((v) => ({
        id: v.id,
        make: v.make,
        model: v.model,
        generation: v.generation,
        bodyStyle: v.bodyStyle,
        fuelType: v.fuelType,
        typicalPriceMin: v.typicalPriceMin,
        typicalPriceMax: v.typicalPriceMax,
        goodBuyPrice: v.goodBuyPrice,
        reliabilityRating: v.reliabilityRating,
        runningCostLevel: v.runningCostLevel,
        greekRoadTaxEur: v.greekRoadTaxEur,
        athensRingExempt: v.athensRingExempt,
        carGrClassifiedCount: v.carGrClassifiedCount,
        carGrPriceBenchmark: v.carGrPriceBenchmark,
        carGrSearchUrl: v.carGrSearchUrl,
        defaultExplanation: v.defaultExplanation
      })),
      listings: MARKETPLACE_LISTINGS
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carcheck-screens-and-data-${marketRegion}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CarCheck — Complete Screen Portfolio & Vehicle Catalog</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; background: #f5f5f7; color: #1d1d1f; margin: 0; padding: 40px 20px; line-height: 1.5; }
    .container { max-width: 1080px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    h1 { font-size: 36px; font-weight: 700; margin-bottom: 8px; color: #1d1d1f; letter-spacing: -0.5px; }
    h2 { font-size: 24px; font-weight: 600; margin-top: 32px; border-bottom: 1px solid #e5e5ea; padding-bottom: 8px; color: #0066cc; }
    .badge { display: inline-block; background: #0066cc; color: white; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .card { background: #f5f5f7; border-radius: 16px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e5ea; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    img { width: 100%; height: 180px; object-fit: cover; border-radius: 12px; }
    .price { font-size: 18px; font-weight: bold; color: #0066cc; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">CarCheck 2.0 Portfolio Export</span>
    <h1>CarCheck — Intelligent Vehicle Discovery</h1>
    <p>Complete export of all screens, algorithms, Greek market parameters, and verified vehicle dossiers.</p>
    
    <h2>1. The 10 Core Application Screens</h2>
    <div class="card">
      <ol>
        <li><strong>Screen 01: Hero Landing & Guided Onboarding</strong> — 60-second value proposition with Greece market switch.</li>
        <li><strong>Screen 02: Budget & Financing</strong> — Presets starting from €1,500, custom slider input, cash vs monthly payment.</li>
        <li><strong>Screen 03: Primary Vehicle Usage</strong> — Daily commute, city driving, family, long road trips, first car.</li>
        <li><strong>Screen 04: Top Buyer Priorities</strong> — Weighted ranking for reliability, running costs, fuel economy, safety.</li>
        <li><strong>Screen 05: Dynamic Lifestyle Questions</strong> — Responsive branching for passenger capacity, parking constraints, and terrain.</li>
        <li><strong>Screen 06: Curated Recommendations</strong> — Match scoring (0-100), award categories, Car.gr classified counts.</li>
        <li><strong>Screen 07: Technical Dossier & KTEO Inspection</strong> — Specifications, Greek road tax, known issues, interactive checklist.</li>
        <li><strong>Screen 08: Side-by-Side Comparison</strong> — Direct comparison of specs, trunk capacity, and running costs.</li>
        <li><strong>Screen 09: Live Car.gr Classifieds</strong> — Real market listings in Greece with deal rating analysis.</li>
        <li><strong>Screen 10: Saved Garage & Shortlist</strong> — Bookmark shortlist with personal viewing notes.</li>
      </ol>
    </div>

    <h2>2. Vehicle Database & Greek Market Benchmarks (${VEHICLES.length} Models)</h2>
    <div class="grid">
      ${VEHICLES.map(
        (v) => `
        <div class="card">
          <img src="${v.imageUrl}" alt="${v.make} ${v.model}" />
          <h3>${v.make} ${v.model} (${v.years})</h3>
          <p class="price">Typical Market: €${v.typicalPriceMin.toLocaleString()} – €${v.typicalPriceMax.toLocaleString()}</p>
          <p><strong>Powertrain:</strong> ${v.engineSummary}</p>
          <p><strong>Economy:</strong> ${v.fuelEconomy} | <strong>Reliability:</strong> ${v.reliabilityRating}/5</p>
          ${v.carGrClassifiedCount ? `<p><strong>Car.gr:</strong> ${v.carGrClassifiedCount} (${v.carGrPriceBenchmark || ''})</p>` : ''}
          <p><em>"${v.defaultExplanation}"</em></p>
        </div>`
      ).join('')}
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carcheck-all-screens-portfolio-${marketRegion}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const screens = [
    {
      id: 'screen-01',
      number: '01',
      category: 'discovery',
      title: isGreek ? 'Αρχική Οθόνη & Σύμβουλος (Hero Landing)' : 'Hero Landing & Advisor Onboarding',
      subtitle: isGreek ? 'Η είσοδος στην εμπειρία CarCheck σε κάτω από 60 δευτερόλεπτα' : 'The intelligent car-buying advisor starting point',
      description: isGreek
        ? 'Αντικαθιστά τα περίπλοκα φίλτρα με 4 απλές ερωτήσεις. Περιλαμβάνει διακόπτη ελληνικής αγοράς (🇬🇷 Ελλάδα vs 🇪🇺 EU), άμεση πρόσβαση στις κατηγορίες και υπολογισμό προφίλ.'
        : 'Replaces complex technical filters with conversational intelligence. Highlights 60-second advice, Greek tax advantages, and instant discovery CTAs.',
      previewType: 'hero',
      highlights: [
        'Minimalist Apple-inspired typography & photography',
        'Greek market badge & Car.gr data integration banner',
        'Direct CTA to 60-second recommendation flow',
        'Quick stats bar: 20+ dossiers, 100% free road tax EV/hybrids'
      ]
    },
    {
      id: 'screen-02',
      number: '02',
      category: 'discovery',
      title: isGreek ? 'Ερώτηση 1 — Προϋπολογισμός (Budget)' : 'Question 1 — Budget Selection',
      subtitle: isGreek ? 'Επιλογές από 1.500€ έως 60.000€+ με προσαρμοσμένο slider' : 'Curated budget tiers from €1,500 with custom input',
      description: isGreek
        ? 'Περιλαμβάνει τις νέες βαθμίδες της ελληνικής αγοράς: €1.500–€5.000 (Sub-€3k heroes όπως Yaris Mk1, Punto FIRE, Micra), προσαρμοσμένο slider, επιλογή μετρητών ή χρηματοδότησης.'
        : 'Accommodates ultra-budget European buyers from €1,500 up to luxury €60,000+. Allows custom amount sliders and financing options.',
      previewType: 'budget',
      highlights: [
        'Preset buttons: €1.500–€5.000, €5k–€10k, €10k–€20k up to €60k+',
        'Interactive custom budget input slider from €1,500',
        '"Not sure" intelligent inference based on lifestyle answers',
        'Cash purchase vs Maximum monthly payment financing toggle'
      ]
    },
    {
      id: 'screen-03',
      number: '03',
      category: 'discovery',
      title: isGreek ? 'Ερώτηση 2 — Κύρια Χρήση (Main Usage)' : 'Question 2 — Main Car Usage',
      subtitle: isGreek ? 'Πολλαπλή επιλογή χρήσης για αυτόματο υπολογισμό μεγέθους & κινητήρα' : 'Multiple selections infer vehicle size, ground clearance & engine',
      description: isGreek
        ? 'Ο χρήστης επιλέγει: Καθημερινές μετακινήσεις, Οδήγηση στην πόλη, Οικογενειακή χρήση, Ταξίδια, Πρώτο αυτοκίνητο, Σπορ οδήγηση, Επαγγελματικό. Το σύστημα σταθμίζει αυτόματα τις ανάγκες.'
        : 'Translates human usage choices into engineering requirements: luggage volume, turning radius, sound deadening, and suspension comfort.',
      previewType: 'usage',
      highlights: [
        'Visual multi-select tiles with clear iconography',
        'Dedicated "First Car" and "City Driving" profiles',
        'Family and long-distance road trip weighting',
        'Automatic inference of transmission and body style'
      ]
    },
    {
      id: 'screen-04',
      number: '04',
      category: 'discovery',
      title: isGreek ? 'Ερώτηση 3 — Προτεραιότητες (Top Priorities)' : 'Question 3 — What Matters Most',
      subtitle: isGreek ? 'Έως 3 κύριες προτεραιότητες που καθορίζουν τη βαθμολογία' : 'Up to three non-equal priorities driving match algorithms',
      description: isGreek
        ? 'Επιλογές: Αξιοπιστία, Χαμηλό κόστος συντήρησης, Οικονομία καυσίμου, Ασφάλεια, Άνεση, Τεχνολογία, Επιδόσεις. Η αξιοπιστία έχει ισχυρότερη βαρύτητα.'
        : 'Applies strong algorithmic weighting. If reliability is chosen, ultra-dependable models like Toyota and Honda immediately leap ahead.',
      previewType: 'priorities',
      highlights: [
        'Strict 3-priority constraint prevents over-diluted recommendations',
        'Reliability, running costs, and safety given non-linear priority boost',
        'Real-world running cost classification (Very Low to High)',
        'Resale value and Greek tax bracket weighting'
      ]
    },
    {
      id: 'screen-05',
      number: '05',
      category: 'discovery',
      title: isGreek ? 'Ερώτηση 4 — Τρόπος Ζωής (Dynamic Lifestyle)' : 'Question 4 — Dynamic Lifestyle Branching',
      subtitle: isGreek ? 'Έξυπνη δυναμική ερώτηση προσαρμοσμένη στις προηγούμενες απαντήσεις' : 'Smart branching questions adapting to previous answers',
      description: isGreek
        ? 'Αν ο χρήστης επέλεξε Οικογένεια, ρωτά για αριθμό επιβατών και παιδικά καθίσματα. Αν επέλεξε Πόλη, ρωτά για στενό παρκάρισμα και Δακτύλιο. Αν επέλεξε Budget 1.500€, ρωτά για ρίσκο επισκευών.'
        : 'Context-sensitive question replacing rigid 50-field forms with an intelligent one-question deep dive.',
      previewType: 'lifestyle',
      highlights: [
        'Family branch: passenger counts and Isofix car seats',
        'City branch: tight parking spaces and Athens green ring pass',
        'Low budget branch: non-interference valves and timing chain preference',
        'Motorway branch: high-speed cruising and boot volume'
      ]
    },
    {
      id: 'screen-06',
      number: '06',
      category: 'results',
      title: isGreek ? 'Αποτελέσματα — Προσωποποιημένες Προτάσεις' : 'Recommendation Results & Match Engine',
      subtitle: isGreek ? '3–5 κορυφαία μοντέλα με σαφή, σύντομη αιτιολόγηση' : 'Curated 3–5 vehicles with concise 1-sentence explanations',
      description: isGreek
        ? 'Κάρτες οχημάτων με φωτογραφίες υψηλής ανάλυσης, Match Score (0–100%), κατηγορίες Best Overall / Best Value / Most Reliable, και άμεσο αριθμό αγγελιών Car.gr.'
        : 'Presents tailored results with award badges, pricing benchmarks, key indicators (reliability, costs, boot), and punchy 15-word reasons.',
      previewType: 'results',
      highlights: [
        'Concise "Why CarCheck recommends it" (1 sentence, 15 words max)',
        'Greek market badges: 0€ Τέλη Κυκλοφορίας, Ελεύθερος Δακτύλιος, cc tax',
        'Direct clickable link to live Car.gr classified search',
        'Smart filter drawer: quick make, fuel, and transmission filters'
      ]
    },
    {
      id: 'screen-07',
      number: '07',
      category: 'dossier',
      title: isGreek ? 'Τεχνικός Φάκελος & Έλεγχος ΚΤΕΟ (Vehicle Dossier)' : 'Vehicle Dossier & Inspection Checklist',
      subtitle: isGreek ? 'Πλήρεις τεχνικές προδιαγραφές και διαδραστικός οδηγός αγοράς' : 'Deep dive technical dossier and pre-purchase test drive guide',
      description: isGreek
        ? 'Αναλυτικές προδιαγραφές κινητήρων, συνιστώμενες χρονιές, χρονιές προς αποφυγή, γνωστές βλάβες, και διαδραστική λίστα ελέγχου ΚΤΕΟ / συνεργείου.'
        : 'Comprehensive pre-purchase inspection guide with interactive checklist items, known engine gremlins, and verified maintenance advice.',
      previewType: 'dossier',
      highlights: [
        'Four tabs: Overview & Specs, Inspection Checklist, Known Issues, Available Cars',
        'Car.gr Live Market Data strip with price benchmark & search button',
        'Recommended model years vs specific engine years to avoid',
        'Interactive check-off list for buyers during physical test drives'
      ]
    },
    {
      id: 'screen-08',
      number: '08',
      category: 'dossier',
      title: isGreek ? 'Σύγκριση Οχημάτων Δίπλα-Δίπλα (Comparison Matrix)' : 'Side-by-Side Vehicle Comparison Matrix',
      subtitle: isGreek ? 'Άμεση σύγκριση έως 3 αυτοκινήτων σε όλες τις παραμέτρους' : 'Direct multi-column comparison of specs, tax, and costs',
      description: isGreek
        ? 'Πίνακας σύγκρισης για τιμή αγοράς, Good Buy στόχο, ετήσια τέλη κυκλοφορίας Ελλάδας, κατανάλωση, πορτμπαγκάζ, αξιοπιστία και διαστάσεις.'
        : 'Enables objective decision making across competing models with highlighted winning values and side-by-side pricing bars.',
      previewType: 'compare',
      highlights: [
        'Compare up to 3 vehicles simultaneously',
        'Highlights Greek road tax differences (e.g. 0€ vs 135€/year)',
        'Boot capacity and real-world fuel economy comparison',
        'Instant remove and save-to-garage toggles'
      ]
    },
    {
      id: 'screen-09',
      number: '09',
      category: 'results',
      title: isGreek ? 'Αγορά & Πραγματικές Αγγελίες Car.gr' : 'Marketplace & Verified Car.gr Classifieds',
      subtitle: isGreek ? 'Ζωντανές αγγελίες με αυτόματο Deal Rating' : 'Classifieds with automated Deal Rating analysis',
      description: isGreek
        ? 'Πραγματικές αγγελίες μεταχειρισμένων στην Ελλάδα (Αθήνα, Θεσσαλονίκη κ.α.) με διαβάθμιση τιμής: Excellent Price, Good Price, Fair Price, και απευθείας σύνδεσμο Car.gr.'
        : 'Bridges advice with real marketplace transactions. Displays verified dealer and private listings with deal explanations.',
      previewType: 'marketplace',
      highlights: [
        'Deal Rating badge: Excellent Price, Good Price, Fair Price',
        'Car.gr classified ID and direct query search button',
        'Filtering by vehicle model, seller type, and price rating',
        'Location badges: Marousi, Peristeri, Glyfada, Thessaloniki'
      ]
    },
    {
      id: 'screen-10',
      number: '10',
      category: 'dossier',
      title: isGreek ? 'Το Γκαράζ Μου (Saved Garage & Shortlist)' : 'Saved Garage Shortlist & Inspection Notes',
      subtitle: isGreek ? 'Προσωπική λίστα υποψηφίων αυτοκινήτων με σημειώσεις' : 'Shortlist management with notes for viewings and mechanics',
      description: isGreek
        ? 'Αποθηκεύστε τα αγαπημένα σας μοντέλα και αγγελίες. Κρατήστε σημειώσεις για ραντεβού με πωλητές, τηλέφωνα και σημεία ελέγχου.'
        : 'Personal hub for storing shortlist candidates with custom notes for mechanics, viewing appointments, and negotiations.',
      previewType: 'garage',
      highlights: [
        'Persistent localStorage saved garage shortlist',
        'Integrated notes field for seller phone numbers & check results',
        'Quick jump back to detailed model dossier and checklist',
        'Total estimated budget calculator for shortlisted cars'
      ]
    }
  ];

  const filteredScreens = activeFilter === 'all'
    ? screens
    : screens.filter((s) => s.category === activeFilter);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-2 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="bg-white dark:bg-[#181818] w-full max-w-6xl rounded-3xl shadow-2xl border border-[#e5e5ea] dark:border-[#2d2d30] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-[#e5e5ea] dark:border-[#2d2d30] bg-[#fafafc] dark:bg-[#1f1f21] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff]">
                PORTFOLIO EXPORTER
              </span>
              <span className="text-xs text-[#86868b]">
                {marketRegion === 'greece' ? '🇬🇷 Ελληνική Έκδοση' : '🇪🇺 Global Edition'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white mt-1 tracking-[-0.28px]">
              {isGreek ? 'Χαρτοφυλάκιο & Εξαγωγή Οθονών CarCheck' : 'CarCheck Complete Screen Portfolio & Export'}
            </h2>
            <p className="text-xs text-[#86868b] mt-0.5">
              {isGreek
                ? 'Εξαγωγή όλων των 10 οθονών, ροών ερωτηματολογίου, καρτών οχημάτων και δεδομένων Car.gr.'
                : 'Export all 10 core screens, recommendation logic, vehicle dossiers, and Car.gr market data.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              title="Print all screens or save as PDF via browser print"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isGreek ? 'Εκτύπωση / Αποθήκευση PDF' : 'Print / Save to PDF'}</span>
            </button>

            <button
              onClick={handleExportHTML}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#272729] hover:bg-[#f5f5f7] dark:hover:bg-[#333336] text-[#1d1d1f] dark:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Download standalone HTML file with all screens"
            >
              <FileCode className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
              <span>{isGreek ? 'Εξαγωγή Offline HTML' : 'Export HTML Package'}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#272729] hover:bg-[#f5f5f7] dark:hover:bg-[#333336] text-[#1d1d1f] dark:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Download structured JSON dataset of vehicles & benchmarks"
            >
              <Download className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
              <span>{isGreek ? 'Δεδομένα JSON' : 'Export Data JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#272729] transition-colors cursor-pointer ml-1"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-[#e5e5ea] dark:border-[#2d2d30] bg-white dark:bg-[#181818] flex items-center justify-between text-xs overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: isGreek ? 'Όλες οι Οθόνες (10)' : 'All Screens (10)' },
              { id: 'discovery', label: isGreek ? 'Ροή Ερωτήσεων (5)' : 'Discovery Flow (5)' },
              { id: 'results', label: isGreek ? 'Προτάσεις & Αγγελίες (2)' : 'Recommendations (2)' },
              { id: 'dossier', label: isGreek ? 'Τεχνικοί Φάκελοι & Γκαράζ (3)' : 'Dossiers & Tools (3)' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeFilter === f.id
                    ? 'bg-[#0066cc] text-white font-semibold'
                    : 'bg-[#f5f5f7] dark:bg-[#272729] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-[#86868b] hidden md:inline">
            {filteredScreens.length} {isGreek ? 'οθόνες έτοιμες για εξαγωγή' : 'screens ready to export'}
          </span>
        </div>

        {/* Scrollable Screen Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-8 print:p-0 print:space-y-6">
          {filteredScreens.map((screen) => (
            <div
              key={screen.id}
              className="print-page border border-[#e5e5ea] dark:border-[#2d2d30] rounded-2xl bg-[#fafafc] dark:bg-[#202022] overflow-hidden p-5 sm:p-6 transition-all"
            >
              {/* Screen Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e5ea] dark:border-[#2d2d30]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0066cc] text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {screen.number}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white">
                      {screen.title}
                    </h3>
                    <p className="text-xs text-[#0066cc] dark:text-[#2997ff] font-medium">
                      {screen.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#86868b] bg-white dark:bg-[#272729] px-3 py-1 rounded-full border border-[#e5e5ea] dark:border-[#38383a] self-start sm:self-auto">
                  {screen.category}
                </span>
              </div>

              {/* Description & Business Logic */}
              <p className="text-xs text-[#86868b] mt-3 leading-relaxed">
                {screen.description}
              </p>

              {/* Highlights & Features Grid */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {screen.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-[#e5e5ea] dark:border-[#2d2d30] text-[#1d1d1f] dark:text-[#e5e5ea]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Visual Preview Snapshot Box */}
              <div className="mt-4 p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#e5e5ea] dark:border-[#2d2d30]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#86868b] mb-3 flex items-center justify-between">
                  <span>Visual Component Snapshot</span>
                  <span className="text-[10px] text-[#0066cc] dark:text-[#2997ff]">Screen {screen.number} Render</span>
                </div>

                {/* Simulated Screen Snapshot Miniatures */}
                {screen.previewType === 'hero' && (
                  <div className="rounded-xl bg-[#f5f5f7] dark:bg-[#242426] p-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff] mb-2">
                      INTELLIGENT ADVISOR
                    </span>
                    <h4 className="text-lg font-bold text-[#1d1d1f] dark:text-white">
                      “What car should I buy?”
                    </h4>
                    <p className="text-xs text-[#86868b] max-w-md mx-auto mt-1">
                      Answer 3–4 simple questions. CarCheck filters thousands of options into 3 sensible choices in 60 seconds.
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <div className="px-4 py-1.5 rounded-full bg-[#0066cc] text-white text-xs font-semibold">
                        Start 60s Discovery →
                      </div>
                      <div className="px-3 py-1.5 rounded-full border border-[#e5e5ea] dark:border-[#38383a] text-xs text-[#86868b]">
                        Browse 20 Models
                      </div>
                    </div>
                  </div>
                )}

                {screen.previewType === 'budget' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {['€1,500 – €5,000 (Greece Budget Hero)', '€5,000 – €10,000', '€10,000 – €20,000', 'Custom from €1,500'].map((b, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-center font-medium ${
                          i === 0
                            ? 'border-[#0066cc] bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff] font-bold'
                            : 'border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#242426] text-[#1d1d1f] dark:text-white'
                        }`}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                )}

                {screen.previewType === 'usage' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {['City driving', 'Daily commuting', 'Family use', 'Long road trips', 'First car', 'Performance / fun'].map((u, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          i < 2
                            ? 'border-[#0066cc] bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff] font-semibold'
                            : 'border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#242426] text-[#1d1d1f] dark:text-white'
                        }`}
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>{u}</span>
                      </div>
                    ))}
                  </div>
                )}

                {screen.previewType === 'priorities' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {['Reliability (High weight)', 'Low running costs', 'Fuel economy', 'Safety', 'Comfort', 'Technology'].map((p, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          i < 3
                            ? 'border-[#0066cc] bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff] font-bold'
                            : 'border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#242426] text-[#1d1d1f] dark:text-white'
                        }`}
                      >
                        <span>{p}</span>
                        {i < 3 && <CheckCircle2 className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />}
                      </div>
                    ))}
                  </div>
                )}

                {screen.previewType === 'lifestyle' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {['Drive mostly in Athens / tight alleys', 'Frequent mountain or winter snow', 'Have children / need 2+ child seats'].map((l, i) => (
                      <div key={i} className="p-3 rounded-xl border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#242426] text-[#1d1d1f] dark:text-white">
                        <div className="font-semibold">{l}</div>
                        <div className="text-[11px] text-[#86868b] mt-1">Infers chassis, ground clearance, and seat count</div>
                      </div>
                    ))}
                  </div>
                )}

                {screen.previewType === 'results' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {VEHICLES.slice(0, 3).map((v) => (
                      <div key={v.id} className="p-3 rounded-xl border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#242426]">
                        <img src={v.imageUrl} alt={v.model} className="w-full h-24 object-cover rounded-lg mb-2" />
                        <div className="font-bold text-xs text-[#1d1d1f] dark:text-white">{v.make} {v.model}</div>
                        <div className="text-[11px] text-[#0066cc] dark:text-[#2997ff] font-semibold mt-0.5">
                          €{v.typicalPriceMin.toLocaleString()} – €{v.typicalPriceMax.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-[#86868b] mt-1 line-clamp-2">"{v.defaultExplanation}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {screen.previewType === 'dossier' && (
                  <div className="p-3 rounded-xl border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#242426] text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-sm text-[#1d1d1f] dark:text-white">
                      <span>Toyota Yaris (Mk1 XP10) Technical Dossier</span>
                      <span className="text-[#0066cc] dark:text-[#2997ff]">2.340+ αγγελίες στο Car.gr</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-white dark:bg-[#181818]">Τέλη: 120€/έτος</div>
                      <div className="p-2 rounded bg-white dark:bg-[#181818]">Κυβικά: 998 cc (Τεκμήριο)</div>
                      <div className="p-2 rounded bg-white dark:bg-[#181818]">Κινητήρας: 1SZ-FE (Καδένα)</div>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-[#181818] text-[11px]">
                      <strong>KTEO Checklist Item:</strong> Check timing chain cold crank, A/C compressor pressure, and rear axle bushings.
                    </div>
                  </div>
                )}

                {screen.previewType === 'compare' && (
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-[#e5e5ea] dark:border-[#2d2d30] text-[#86868b]">
                          <th className="py-1">Specification</th>
                          <th className="py-1">Toyota Yaris Mk1</th>
                          <th className="py-1">Fiat Punto 1.2 FIRE</th>
                          <th className="py-1">Toyota Corolla Hybrid</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e5ea] dark:divide-[#2d2d30] text-[#1d1d1f] dark:text-white">
                        <tr>
                          <td className="py-1 text-[#86868b]">Price Range</td>
                          <td className="py-1 font-semibold">€1,500 – €3,200</td>
                          <td className="py-1 font-semibold">€1,500 – €2,900</td>
                          <td className="py-1 font-semibold">€18,500 – €24,500</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-[#86868b]">Greek Road Tax</td>
                          <td className="py-1">120€ / year</td>
                          <td className="py-1">135€ / year</td>
                          <td className="py-1 text-[#03904a] font-bold">0€ / year (Απαλλαγή)</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-[#86868b]">Car.gr Listings</td>
                          <td className="py-1 text-[#0066cc]">2.340+ αγγελίες</td>
                          <td className="py-1 text-[#0066cc]">1.450+ αγγελίες</td>
                          <td className="py-1 text-[#0066cc]">1.180+ αγγελίες</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {screen.previewType === 'marketplace' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {MARKETPLACE_LISTINGS.slice(0, 2).map((l) => (
                      <div key={l.id} className="p-3 rounded-xl border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#242426]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#0066cc] dark:text-[#2997ff]">{l.dealRating}</span>
                          <span className="text-[10px] text-[#86868b]">{l.publishedDate}</span>
                        </div>
                        <div className="font-bold text-xs text-[#1d1d1f] dark:text-white">{l.title}</div>
                        <div className="text-sm font-extrabold text-[#1d1d1f] dark:text-white mt-1">€{l.price.toLocaleString()}</div>
                        <div className="text-[11px] text-[#86868b]">{l.location} · {l.mileageKm.toLocaleString()} km</div>
                        {l.carGrClassifiedId && (
                          <div className="mt-1 text-[10px] text-[#0066cc] font-semibold">
                            Car.gr {l.carGrClassifiedId}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {screen.previewType === 'garage' && (
                  <div className="p-3 rounded-xl border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#242426] text-xs">
                    <div className="flex items-center justify-between font-bold text-[#1d1d1f] dark:text-white">
                      <span>Saved Shortlist (1 Car in Garage)</span>
                      <span className="text-[#0066cc]">Inspection Checklist Active</span>
                    </div>
                    <p className="text-[11px] text-[#86868b] mt-1">
                      Toyota Corolla Hybrid (2021) saved. Notes: "Called dealer in Kifisia. KTEO valid until 2027. Test drive scheduled Saturday."
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#e5e5ea] dark:border-[#2d2d30] bg-[#fafafc] dark:bg-[#1f1f21] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
          <div className="text-[#86868b]">
            CarCheck 2.0 · Designed with Apple Photography-First Aesthetics & Greek Market Precision
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white font-semibold transition-colors cursor-pointer"
            >
              {isGreek ? 'Εκτύπωση Όλων σε PDF' : 'Export / Print PDF'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#e5e5ea] dark:border-[#38383a] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
            >
              {isGreek ? 'Κλείσιμο' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
