import { LifestyleOption, MarketRegion } from '../types';

type Bilingual = { en: string; el: string };

export interface DynamicChoice {
  id: string;
  /** The English label is stored as `dynamicAnswer`; the recommendation engine matches on it. */
  label: Bilingual;
  desc: Bilingual;
  mapsToLifestyle: LifestyleOption[];
}

export interface DynamicQuestion {
  title: Bilingual;
  subtitle: Bilingual;
  choices: DynamicChoice[];
}

export type DynamicQuestionKind = 'family' | 'city' | 'performance' | 'outdoor' | 'general';

export const DYNAMIC_QUESTIONS: Record<DynamicQuestionKind, DynamicQuestion> = {
  family: {
    title: { en: 'How many people will usually be in the car?', el: 'Πόσα άτομα θα επιβαίνουν συνήθως στο αυτοκίνητο;' },
    subtitle: {
      en: 'We will calculate ideal rear seat room and boot volume for pushchairs.',
      el: 'Υπολογίζουμε τον ιδανικό χώρο στα πίσω καθίσματα και το πορτμπαγκάζ για καρότσι.'
    },
    choices: [
      {
        id: 'small-fam',
        label: { en: 'Small family (2–3 people)', el: 'Μικρή οικογένεια (2–3 άτομα)' },
        desc: { en: 'Need 1 child seat and everyday stroller space', el: 'Ένα παιδικό κάθισμα και χώρος για καρότσι' },
        mapsToLifestyle: ['small-family', 'child-seats']
      },
      {
        id: 'standard-fam',
        label: { en: 'Family of 4 with luggage', el: 'Τετραμελής οικογένεια με αποσκευές' },
        desc: { en: 'Two kids, school runs, holiday suitcases and weekly groceries', el: 'Δύο παιδιά, σχολείο, βαλίτσες διακοπών και ψώνια της εβδομάδας' },
        mapsToLifestyle: ['small-family', 'child-seats', 'lots-of-luggage']
      },
      {
        id: 'large-fam',
        label: { en: 'Large family (Need 6 or 7 seats)', el: 'Πολυμελής οικογένεια (6 ή 7 θέσεις)' },
        desc: { en: '3+ kids, carpooling, or extended family needing 3rd row seating', el: '3+ παιδιά, κοινές μετακινήσεις ή ευρύτερη οικογένεια με 3η σειρά θέσεων' },
        mapsToLifestyle: ['large-family', 'frequent-passengers']
      },
      {
        id: 'dog-fam',
        label: { en: 'Family with a dog', el: 'Οικογένεια με σκύλο' },
        desc: { en: 'Need dedicated boot space for a dog crate alongside gear', el: 'Χώρος στο πορτμπαγκάζ για κλουβί σκύλου μαζί με πράγματα' },
        mapsToLifestyle: ['small-family', 'dog-owner', 'lots-of-luggage']
      }
    ]
  },
  city: {
    title: {
      en: 'Is easy parking or a compact footprint your top priority?',
      el: 'Είναι το εύκολο παρκάρισμα και οι μαζεμένες διαστάσεις η απόλυτη προτεραιότητα;'
    },
    subtitle: {
      en: 'Urban environments require effortless maneuverability and visibility.',
      el: 'Στην πόλη μετράνε η ευελιξία και η καλή ορατότητα.'
    },
    choices: [
      {
        id: 'tight-parallel',
        label: { en: 'Strict compact size for tight street parking', el: 'Μικρές διαστάσεις για στενό παρκάρισμα στον δρόμο' },
        desc: { en: 'Sub-4.2 meter car that fits in spaces others drive past', el: 'Κάτω από 4,2 μέτρα, χωράει εκεί που άλλοι προσπερνούν' },
        mapsToLifestyle: ['easy-parking', 'drive-alone']
      },
      {
        id: 'underground-garages',
        label: { en: 'Underground garages & tight ramps', el: 'Υπόγεια γκαράζ και στενές ράμπες' },
        desc: { en: 'Need tight turning circle, cameras and parking sensors', el: 'Μικρή ακτίνα στροφής, κάμερες και αισθητήρες στάθμευσης' },
        mapsToLifestyle: ['easy-parking']
      },
      {
        id: 'high-crossover',
        label: { en: 'High seating position for urban visibility', el: 'Ψηλή θέση οδήγησης για ορατότητα στην πόλη' },
        desc: { en: 'Prefer a compact crossover view over low hatchback seating', el: 'Προτιμώ τη θέα ενός μικρού crossover από χαμηλό hatchback' },
        mapsToLifestyle: ['easy-parking', 'couple']
      },
      {
        id: 'flexible-urban',
        label: { en: 'Balanced: mainly city with occasional road trip', el: 'Ισορροπία: κυρίως πόλη με περιστασιακά ταξίδια' },
        desc: { en: 'Comfortable on motorways too without feeling bulky in town', el: 'Άνετο και στην εθνική χωρίς να είναι ογκώδες στην πόλη' },
        mapsToLifestyle: ['motorway-driving']
      }
    ]
  },
  performance: {
    title: { en: 'Do you care more about acceleration or handling?', el: 'Σε ενδιαφέρει περισσότερο η επιτάχυνση ή το κράτημα;' },
    subtitle: {
      en: 'Choose how you like your car to deliver excitement on the road.',
      el: 'Διάλεξε πώς θέλεις να σου δίνει συγκινήσεις το αυτοκίνητο.'
    },
    choices: [
      {
        id: 'instant-accel',
        label: { en: 'Rapid instant acceleration', el: 'Γρήγορη, άμεση επιτάχυνση' },
        desc: { en: 'Electric punch or strong turbo torque for rapid overtakes', el: 'Ηλεκτρική ώθηση ή δυνατή ροπή turbo για γρήγορες προσπεράσεις' },
        mapsToLifestyle: ['motorway-driving']
      },
      {
        id: 'chassis-handling',
        label: { en: 'Sharp chassis balance & cornering agility', el: 'Ισορροπημένο πλαίσιο και ευελιξία στις στροφές' },
        desc: { en: 'Go-kart handling feel on twisty B-roads', el: 'Αίσθηση καρτ σε επαρχιακούς δρόμους με στροφές' },
        mapsToLifestyle: ['drive-alone']
      },
      {
        id: 'rwd-balance',
        label: { en: 'Rear-wheel drive purity & steering feedback', el: 'Πισωκίνηση και καθαρή αίσθηση στο τιμόνι' },
        desc: { en: 'Traditional 50:50 sports saloon balance', el: 'Κλασική ισορροπία 50:50 σπορ σεντάν' },
        mapsToLifestyle: ['drive-alone', 'motorway-driving']
      },
      {
        id: 'all-weather-grip',
        label: { en: 'All-weather traction (AWD grip in wet/snow)', el: 'Πρόσφυση σε κάθε καιρό (τετρακίνηση σε βροχή/χιόνι)' },
        desc: { en: 'High performance usable in rain, sleet, or ice', el: 'Επιδόσεις που αξιοποιούνται και σε βροχή, χιονόνερο ή πάγο' },
        mapsToLifestyle: ['mountains-snow']
      }
    ]
  },
  outdoor: {
    title: { en: 'What kind of terrain or gear do you tackle?', el: 'Σε τι είδους διαδρομές κινείσαι συνήθως;' },
    subtitle: {
      en: 'Ensures adequate ground clearance, cargo capacity, and traction.',
      el: 'Εξασφαλίζει σωστή απόσταση από το έδαφος, χώρο φόρτωσης και πρόσφυση.'
    },
    choices: [
      {
        id: 'snow-mountains',
        label: { en: 'Snow, ski trips & mountain passes', el: 'Χιόνι, σκι και ορεινά περάσματα' },
        desc: { en: 'All-Wheel Drive (AWD) is essential for winter conditions', el: 'Η τετρακίνηση είναι απαραίτητη για χειμερινές συνθήκες' },
        mapsToLifestyle: ['mountains-snow', 'lots-of-luggage']
      },
      {
        id: 'bulky-sports',
        label: { en: 'Bicycles, surfboards or camping gear', el: 'Ποδήλατα, σανίδες ή εξοπλισμός κάμπινγκ' },
        desc: { en: 'Need roof rails, large load bay and rugged interior', el: 'Μπάρες οροφής, μεγάλος χώρος φόρτωσης και ανθεκτικό εσωτερικό' },
        mapsToLifestyle: ['lots-of-luggage']
      },
      {
        id: 'gravel-ground',
        label: { en: 'Rough gravel tracks / rural roads', el: 'Χωματόδρομοι και αγροτικοί δρόμοι' },
        desc: { en: 'Extra ground clearance (190mm+) to clear rocks & ruts', el: 'Αυξημένη απόσταση από το έδαφος (190 mm+) για πέτρες και λακκούβες' },
        mapsToLifestyle: ['lots-of-luggage']
      },
      {
        id: 'dog-trails',
        label: { en: 'Dog walks & wet gear', el: 'Βόλτες με σκύλο και βρεγμένα πράγματα' },
        desc: { en: 'Durable boot lining and practical hatchback or wagon tailgate', el: 'Ανθεκτική επένδυση πορτμπαγκάζ και πρακτική πόρτα hatchback ή βαν' },
        mapsToLifestyle: ['dog-owner']
      }
    ]
  },
  general: {
    title: { en: 'Tell us a little about your lifestyle.', el: 'Πες μας λίγα λόγια για τον τρόπο ζωής σου.' },
    subtitle: {
      en: 'This helps CarCheck dial in seating count, cargo volume, and drivetrain requirements.',
      el: 'Βοηθά το CarCheck να επιλέξει αριθμό θέσεων, όγκο πορτμπαγκάζ και τύπο κίνησης.'
    },
    choices: [
      {
        id: 'alone',
        label: { en: 'Mostly drive alone', el: 'Οδηγώ κυρίως μόνος/η' },
        desc: { en: 'Prioritize personal comfort, driving feel and low costs', el: 'Προτεραιότητα στην άνεση, την οδηγική αίσθηση και το χαμηλό κόστος' },
        mapsToLifestyle: ['drive-alone']
      },
      {
        id: 'couple',
        label: { en: 'Couple (2 people)', el: 'Ζευγάρι (2 άτομα)' },
        desc: { en: 'Balanced space for two with luggage for getaways', el: 'Άνετος χώρος για δύο με αποσκευές για αποδράσεις' },
        mapsToLifestyle: ['couple']
      },
      {
        id: 'small-fam',
        label: { en: 'Small family with children', el: 'Μικρή οικογένεια με παιδιά' },
        desc: { en: 'Safe rear seating with child seat ISOFIX points', el: 'Ασφαλή πίσω καθίσματα με σημεία ISOFIX' },
        mapsToLifestyle: ['small-family', 'child-seats']
      },
      {
        id: 'lots-of-luggage',
        label: { en: 'Frequently carry lots of luggage or gear', el: 'Μεταφέρω συχνά πολλές αποσκευές ή εξοπλισμό' },
        desc: { en: '500+ liter cargo capacity is essential', el: 'Απαραίτητο πορτμπαγκάζ 500+ λίτρων' },
        mapsToLifestyle: ['lots-of-luggage']
      },
      {
        id: 'dog',
        label: { en: 'Dog owner', el: 'Έχω σκύλο' },
        desc: { en: 'Easy-access tailgate for our four-legged family member', el: 'Εύκολη πρόσβαση στο πορτμπαγκάζ για το τετράποδο μέλος της οικογένειας' },
        mapsToLifestyle: ['dog-owner']
      },
      {
        id: 'mountains',
        label: { en: 'Drive in mountains or snow', el: 'Οδηγώ σε βουνό ή χιόνι' },
        desc: { en: 'Confidence on icy slopes and wet climbs', el: 'Σιγουριά σε παγωμένες πλαγιές και βρεγμένες ανηφόρες' },
        mapsToLifestyle: ['mountains-snow']
      },
      {
        id: 'parking',
        label: { en: 'Tight city parking is a daily challenge', el: 'Το στενό παρκάρισμα είναι καθημερινή πρόκληση' },
        desc: { en: 'Needs compact exterior dimensions and sensors', el: 'Χρειάζονται μικρές διαστάσεις και αισθητήρες' },
        mapsToLifestyle: ['easy-parking']
      },
      {
        id: 'motorway',
        label: { en: 'Regular high-speed motorway driving', el: 'Συχνή οδήγηση με υψηλές ταχύτητες στην εθνική' },
        desc: { en: 'Need relaxed cruising, adaptive cruise control and quiet cabin', el: 'Ξεκούραστο ταξίδι, προσαρμοζόμενο cruise control και ήσυχη καμπίνα' },
        mapsToLifestyle: ['motorway-driving']
      }
    ]
  }
};

/** Answers that presets set directly without going through the questionnaire. */
const EXTRA_ANSWERS: Bilingual[] = [
  { en: 'Zero road tax and Athens green ring circulation', el: '0€ τέλη και ελεύθερη κυκλοφορία στον Δακτύλιο' }
];

/** Display label for a stored (English) `dynamicAnswer`. */
export const dynamicAnswerLabel = (stored: string, region: MarketRegion): string => {
  if (region !== 'greece') return stored;
  for (const question of Object.values(DYNAMIC_QUESTIONS)) {
    const match = question.choices.find((choice) => choice.label.en === stored);
    if (match) return match.label.el;
  }
  return EXTRA_ANSWERS.find((answer) => answer.en === stored)?.el ?? stored;
};
