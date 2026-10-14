/*
 * ChekCAReto ad parser.
 * Pulls price, km, year, make/model and other fields out of Greek car-ad text
 * with plain rules (no AI). Runs in the extension and in Node tests.
 */
(function (root) {
  'use strict';

  const THIS_YEAR = new Date().getFullYear();

  // ---------- text helpers ----------

  // Lowercase, drop Greek accents, final sigma -> sigma, unify spaces.
  function norm(s) {
    return String(s || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/ς/g, 'σ')
      .replace(/[   ]/g, ' ')
      .replace(/[’‘´`]/g, "'");
  }

  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Word boundary that also works for Greek letters.
  function wordRe(word) {
    return new RegExp('(^|[^a-zα-ω0-9])' + escapeRe(word) + '(?=$|[^a-zα-ω0-9])');
  }

  // "8.500" / "8,500" / "8 500" / "8500" -> 8500
  function toInt(raw) {
    const digits = String(raw).replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : NaN;
  }

  // "8,5" / "8.5" -> 8.5
  function toFloat(raw) {
    return parseFloat(String(raw).replace(',', '.'));
  }

  // ---------- privacy ----------

  // Remove phone numbers and e-mails before anything is stored.
  function scrub(text) {
    return String(text || '')
      .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]')
      .replace(/(?:\+|00)?\s?30[\s.-]?(?=[2-9])/g, '')
      .replace(/(?<!\d)(?:69\d|2\d{2})(?:[\s.-]?\d){7}(?!\d)/g, '[τηλ]');
  }

  // ---------- dictionaries ----------

  // make -> { names: aliases as written in ads, models: [[display, ...aliases]] }
  const MAKES = {
    'Toyota': { names: ['toyota', 'τογιοτα', 'τοιοτα'], models: [['Yaris Cross', 'yaris cross'], ['Yaris', 'yaris', 'γιαρισ'], ['Corolla', 'corolla', 'κορολα'], ['Auris', 'auris'], ['Aygo X', 'aygo x'], ['Aygo', 'aygo'], ['C-HR', 'c-hr', 'chr'], ['RAV4', 'rav4', 'rav 4', 'rav-4'], ['Prius', 'prius'], ['Hilux', 'hilux'], ['Avensis', 'avensis'], ['Starlet', 'starlet'], ['Celica', 'celica'], ['Land Cruiser', 'land cruiser'], ['Verso', 'verso']] },
    'Volkswagen': { names: ['volkswagen', 'vw', 'φολκσβαγκεν', 'βολκσβαγκεν'], models: [['Golf', 'golf', 'γκολφ'], ['Polo', 'polo', 'πολο'], ['Passat', 'passat'], ['Up', 'up!', 'up'], ['T-Roc', 't-roc', 'troc'], ['T-Cross', 't-cross', 'tcross'], ['Tiguan', 'tiguan'], ['Touran', 'touran'], ['Caddy', 'caddy'], ['Transporter', 'transporter'], ['Lupo', 'lupo'], ['Fox', 'fox'], ['Bora', 'bora'], ['Jetta', 'jetta'], ['Scirocco', 'scirocco'], ['Beetle', 'beetle', 'σκαθαρι'], ['Arteon', 'arteon'], ['ID.3', 'id.3', 'id3'], ['Taigo', 'taigo']] },
    'Opel': { names: ['opel', 'οπελ'], models: [['Corsa', 'corsa', 'κορσα'], ['Astra', 'astra', 'αστρα'], ['Meriva', 'meriva'], ['Zafira', 'zafira'], ['Insignia', 'insignia'], ['Mokka', 'mokka'], ['Crossland', 'crossland'], ['Grandland', 'grandland'], ['Agila', 'agila'], ['Vectra', 'vectra'], ['Adam', 'adam'], ['Tigra', 'tigra'], ['Combo', 'combo']] },
    'Peugeot': { names: ['peugeot', 'πεζο', 'πεζω'], models: [['2008', '2008'], ['3008', '3008'], ['5008', '5008'], ['106', '106'], ['107', '107'], ['108', '108'], ['206', '206'], ['207', '207'], ['208', '208'], ['306', '306'], ['307', '307'], ['308', '308'], ['407', '407'], ['508', '508'], ['Partner', 'partner'], ['Rifter', 'rifter']] },
    'Citroen': { names: ['citroen', 'citroën', 'σιτροεν'], models: [['C3 Aircross', 'c3 aircross'], ['C4 Cactus', 'c4 cactus'], ['C1', 'c1'], ['C2', 'c2'], ['C3', 'c3'], ['C4', 'c4'], ['C5', 'c5'], ['Saxo', 'saxo'], ['Xsara', 'xsara'], ['Berlingo', 'berlingo'], ['DS3', 'ds3']] },
    'Renault': { names: ['renault', 'ρενο', 'ρενω'], models: [['Clio', 'clio', 'κλιο'], ['Megane', 'megane', 'μεγκαν'], ['Captur', 'captur'], ['Twingo', 'twingo'], ['Kadjar', 'kadjar'], ['Scenic', 'scenic'], ['Kangoo', 'kangoo'], ['Laguna', 'laguna'], ['Zoe', 'zoe'], ['Austral', 'austral'], ['Arkana', 'arkana'], ['Modus', 'modus']] },
    'Fiat': { names: ['fiat', 'φιατ'], models: [['Grande Punto', 'grande punto'], ['Punto', 'punto', 'πουντο'], ['Panda', 'panda', 'παντα'], ['500X', '500x'], ['500L', '500l'], ['500', '500', 'cinquecento'], ['Tipo', 'tipo'], ['Doblo', 'doblo'], ['Bravo', 'bravo'], ['Seicento', 'seicento'], ['Stilo', 'stilo'], ['Qubo', 'qubo'], ['Fiorino', 'fiorino']] },
    'Ford': { names: ['ford', 'φορντ'], models: [['Fiesta', 'fiesta', 'φιεστα'], ['Focus', 'focus', 'φοκουσ'], ['Ka+', 'ka+'], ['Ka', 'ka'], ['Kuga', 'kuga'], ['Puma', 'puma'], ['EcoSport', 'ecosport'], ['Mondeo', 'mondeo'], ['C-Max', 'c-max', 'cmax'], ['S-Max', 's-max'], ['B-Max', 'b-max'], ['Ranger', 'ranger'], ['Transit', 'transit'], ['Fusion', 'fusion']] },
    'Nissan': { names: ['nissan', 'νισαν'], models: [['Micra', 'micra', 'μικρα'], ['Note', 'note'], ['Qashqai', 'qashqai', 'κασκαι'], ['Juke', 'juke'], ['X-Trail', 'x-trail', 'xtrail'], ['Almera', 'almera'], ['Navara', 'navara'], ['Leaf', 'leaf'], ['Pulsar', 'pulsar'], ['Primera', 'primera']] },
    'Hyundai': { names: ['hyundai', 'χιουνται', 'χιουνταϊ'], models: [['i10', 'i10', 'i 10'], ['i20', 'i20', 'i 20'], ['i30', 'i30', 'i 30'], ['Tucson', 'tucson'], ['Kona', 'kona'], ['Getz', 'getz'], ['Atos', 'atos'], ['Accent', 'accent'], ['ix35', 'ix35'], ['ix20', 'ix20'], ['Santa Fe', 'santa fe'], ['Bayon', 'bayon'], ['Elantra', 'elantra']] },
    'Kia': { names: ['kia', 'κια'], models: [['Picanto', 'picanto'], ['Rio', 'rio'], ['Ceed', 'ceed', "cee'd"], ['XCeed', 'xceed'], ['Sportage', 'sportage'], ['Stonic', 'stonic'], ['Niro', 'niro'], ['Venga', 'venga'], ['Soul', 'soul'], ['Sorento', 'sorento']] },
    'Mazda': { names: ['mazda', 'μαζντα'], models: [['CX-30', 'cx-30', 'cx30'], ['CX-3', 'cx-3', 'cx3'], ['CX-5', 'cx-5', 'cx5'], ['MX-5', 'mx-5', 'mx5'], ['Mazda2', 'mazda 2', 'mazda2'], ['Mazda3', 'mazda 3', 'mazda3'], ['Mazda6', 'mazda 6', 'mazda6'], ['Demio', 'demio']] },
    'Honda': { names: ['honda', 'χοντα'], models: [['Jazz', 'jazz'], ['Civic', 'civic'], ['CR-V', 'cr-v', 'crv'], ['HR-V', 'hr-v', 'hrv'], ['Accord', 'accord'], ['Insight', 'insight']] },
    'Suzuki': { names: ['suzuki', 'σουζουκι'], models: [['Grand Vitara', 'grand vitara'], ['Vitara', 'vitara'], ['Swift', 'swift', 'σουιφτ'], ['Ignis', 'ignis'], ['SX4 S-Cross', 's-cross', 'sx4 s-cross'], ['SX4', 'sx4'], ['Alto', 'alto'], ['Celerio', 'celerio'], ['Jimny', 'jimny'], ['Baleno', 'baleno'], ['Splash', 'splash'], ['Wagon R', 'wagon r', 'wagon r+']] },
    'Seat': { names: ['seat', 'σεατ'], models: [['Ibiza', 'ibiza', 'ιμπιζα'], ['Leon', 'leon'], ['Arona', 'arona'], ['Ateca', 'ateca'], ['Toledo', 'toledo'], ['Altea', 'altea'], ['Cordoba', 'cordoba'], ['Mii', 'mii'], ['Tarraco', 'tarraco']] },
    'Skoda': { names: ['skoda', 'σκοντα'], models: [['Fabia', 'fabia'], ['Octavia', 'octavia', 'οκταβια'], ['Superb', 'superb'], ['Kamiq', 'kamiq'], ['Karoq', 'karoq'], ['Kodiaq', 'kodiaq'], ['Rapid', 'rapid'], ['Scala', 'scala'], ['Citigo', 'citigo'], ['Roomster', 'roomster'], ['Yeti', 'yeti']] },
    'Audi': { names: ['audi', 'αουντι'], models: [['A1', 'a1'], ['A3', 'a3'], ['A4', 'a4'], ['A5', 'a5'], ['A6', 'a6'], ['Q2', 'q2'], ['Q3', 'q3'], ['Q5', 'q5'], ['Q7', 'q7'], ['TT', 'tt']] },
    'BMW': { names: ['bmw', 'μπεμβε', 'μπεεμβε'], models: [['X1', 'x1'], ['X3', 'x3'], ['X5', 'x5'], ['i3', 'i3'], ['Σειρά 1', 'σειρα 1', '1 series', '114', '116', '118', '120', '123', '125'], ['Σειρά 3', 'σειρα 3', '3 series', '316', '318', '320', '325', '330'], ['Σειρά 5', 'σειρα 5', '5 series', '520', '525', '530']] },
    'Mercedes-Benz': { names: ['mercedes-benz', 'mercedes', 'μερσεντεσ', 'μερσεδεσ', 'benz'], models: [['A-Class', 'a-class', 'a class', 'a 140', 'a140', 'a 150', 'a150', 'a 160', 'a160', 'a 170', 'a170', 'a 180', 'a180', 'a 200', 'a200'], ['B-Class', 'b-class', 'b class', 'b 180', 'b180', 'b 200', 'b200'], ['C-Class', 'c-class', 'c class', 'c 180', 'c180', 'c 200', 'c200', 'c 220', 'c220'], ['E-Class', 'e-class', 'e class', 'e 200', 'e200', 'e 220', 'e220'], ['CLA', 'cla'], ['GLA', 'gla'], ['GLC', 'glc'], ['ML', 'ml'], ['Sprinter', 'sprinter'], ['Vito', 'vito']] },
    'Mini': { names: ['mini cooper', 'mini'], models: [['Countryman', 'countryman'], ['Clubman', 'clubman'], ['Cooper', 'cooper'], ['One', 'one']] },
    'Smart': { names: ['smart'], models: [['Fortwo', 'fortwo', 'for two'], ['Forfour', 'forfour', 'for four']] },
    'Dacia': { names: ['dacia', 'ντασια', 'ντακια'], models: [['Sandero', 'sandero'], ['Duster', 'duster'], ['Logan', 'logan'], ['Jogger', 'jogger'], ['Spring', 'spring']] },
    'Volvo': { names: ['volvo', 'βολβο'], models: [['XC40', 'xc40'], ['XC60', 'xc60'], ['XC90', 'xc90'], ['V40', 'v40'], ['S40', 's40'], ['V60', 'v60'], ['C30', 'c30']] },
    'Mitsubishi': { names: ['mitsubishi', 'μιτσουμπισι'], models: [['Space Star', 'space star'], ['Colt', 'colt'], ['Lancer', 'lancer'], ['ASX', 'asx'], ['Outlander', 'outlander'], ['L200', 'l200'], ['Pajero', 'pajero']] },
    'Chevrolet': { names: ['chevrolet', 'σεβρολετ'], models: [['Spark', 'spark'], ['Aveo', 'aveo'], ['Kalos', 'kalos'], ['Cruze', 'cruze'], ['Matiz', 'matiz']] },
    'Daewoo': { names: ['daewoo'], models: [['Matiz', 'matiz']] },
    'Alfa Romeo': { names: ['alfa romeo', 'alfa'], models: [['Giulietta', 'giulietta'], ['MiTo', 'mito'], ['147', '147'], ['156', '156'], ['159', '159'], ['Stelvio', 'stelvio'], ['Giulia', 'giulia']] },
    'Lancia': { names: ['lancia'], models: [['Ypsilon', 'ypsilon'], ['Musa', 'musa'], ['Delta', 'delta']] },
    'Jeep': { names: ['jeep'], models: [['Renegade', 'renegade'], ['Compass', 'compass'], ['Wrangler', 'wrangler'], ['Cherokee', 'cherokee']] },
    'Daihatsu': { names: ['daihatsu', 'νταιχατσου'], models: [['Terios', 'terios'], ['Sirion', 'sirion'], ['Cuore', 'cuore'], ['Charade', 'charade']] },
    'Subaru': { names: ['subaru', 'σουμπαρου'], models: [['Impreza', 'impreza'], ['Forester', 'forester'], ['XV', 'xv'], ['Legacy', 'legacy'], ['Outback', 'outback']] },
    'Land Rover': { names: ['land rover', 'range rover'], models: [['Evoque', 'evoque'], ['Discovery', 'discovery'], ['Defender', 'defender'], ['Freelander', 'freelander']] },
    'Porsche': { names: ['porsche'], models: [['Cayenne', 'cayenne'], ['Macan', 'macan'], ['911', '911'], ['Boxster', 'boxster'], ['Panamera', 'panamera']] },
    'Tesla': { names: ['tesla'], models: [['Model 3', 'model 3'], ['Model Y', 'model y'], ['Model S', 'model s']] },
    'MG': { names: ['mg'], models: [['ZS', 'zs'], ['MG4', 'mg4'], ['HS', 'hs']] },
    'BYD': { names: ['byd'], models: [['Dolphin', 'dolphin'], ['Atto 3', 'atto 3'], ['Seal', 'seal']] },
    'Cupra': { names: ['cupra'], models: [['Formentor', 'formentor'], ['Born', 'born'], ['Leon', 'leon']] },
    'DS': { names: ['ds automobiles'], models: [['DS3', 'ds3'], ['DS4', 'ds4'], ['DS7', 'ds7']] },
  };

  // Prepare normalized lookups once.
  const MAKE_LIST = Object.keys(MAKES).map((make) => ({
    make,
    names: MAKES[make].names.map((n) => ({ n, re: wordRe(norm(n)) })),
    models: MAKES[make].models.map(([display, ...aliases]) => ({
      display,
      aliases: aliases.map((a) => ({ a: norm(a), re: wordRe(norm(a)) })),
    })),
  }));

  // Models distinctive enough to imply the make on their own ("πουλάω Yaris").
  const MODEL_ONLY = new Map();
  for (const m of MAKE_LIST) {
    for (const model of m.models) {
      for (const al of model.aliases) {
        if (/^[a-zα-ω][a-zα-ω-]{3,}$/.test(al.a) && !['note', 'one', 'fox', 'leon', 'rio', 'soul', 'spring', 'delta', 'seal', 'born', 'smart', 'cooper', 'compass', 'discovery', 'insight', 'accent', 'fusion', 'splash', 'swift', 'rapid', 'superb', 'jazz', 'transit', 'combo', 'adam', 'partner', 'ranger', 'puma', 'panda', 'spark', 'alto'].includes(al.a)) {
          if (MODEL_ONLY.has(al.a)) MODEL_ONLY.set(al.a, null); // ambiguous across makes
          else MODEL_ONLY.set(al.a, { make: m.make, model: model.display, re: al.re });
        }
      }
    }
  }

  const FUEL = [
    ['Plug-in υβριδικό', /plug-?in|phev|επαναφορτιζ/],
    ['Υβριδικό', /hybrid|υβριδ|hev\b/],
    ['Ηλεκτρικό', /ηλεκτρικ|\bev\b|electric|100% ηλεκτρ/],
    ['Υγραέριο', /υγραεριο|\blpg\b|γκαζι/],
    ['Φυσικό αέριο', /φυσικο αεριο|\bcng\b/],
    ['Πετρέλαιο', /πετρελαι|diesel|ντιζελ|\btdi\b|\bhdi\b|\bdci\b|\bcrdi\b|\bcdti\b|\bcdi\b|\bd-?4d\b|multijet|\bjtd|bluehdi|\btdci\b|i-?dtec/],
    ['Βενζίνη', /βενζιν|petrol|benzin|\btsi\b|\btfsi\b|\bvvt-?i\b|\bvti\b|\bmpi\b|\bgdi\b|\btce\b|puretech|ecoboost|\bthp\b|vtec/],
  ];

  const GEARBOX = [
    ['Αυτόματο', /αυτοματ|automatic|\bauto\b|\bdsg\b|\bcvt\b|tiptronic|steptronic|\bedc\b|\bdct\b|ημιαυτοματ|robot/],
    ['Χειροκίνητο', /χειροκινητ|μηχανικ[οη] κιβωτ|manual|\bμηχανικο\b|5αρι|6αρι|5 ταχυτητ|6 ταχυτητ/],
  ];

  // normalized place -> [display, region]
  const PLACES = {};
  function addPlaces(region, list) {
    for (const p of list) PLACES[norm(p)] = [p, region];
  }
  addPlaces('Αττική', ['Αθήνα', 'Πειραιάς', 'Πειραιά', 'Γλυφάδα', 'Μαρούσι', 'Περιστέρι', 'Κηφισιά', 'Χαλάνδρι', 'Αιγάλεω', 'Νέα Σμύρνη', 'Καλλιθέα', 'Ζωγράφου', 'Αχαρνές', 'Μέγαρα', 'Ελευσίνα', 'Ασπρόπυργος', 'Κορωπί', 'Μαρκόπουλο', 'Παλλήνη', 'Αγία Παρασκευή', 'Ίλιον', 'Πετρούπολη', 'Νίκαια', 'Κερατσίνι', 'Παλαιό Φάληρο', 'Άλιμος', 'Βούλα', 'Βάρη', 'Ραφήνα', 'Μελίσσια', 'Νέα Ιωνία', 'Γαλάτσι', 'Χολαργός', 'Παπάγου', 'Αγίοι Ανάργυροι', 'Αγιοι Αναργυροι', 'Περαμα', 'Πέραμα', 'Σαλαμίνα', 'Λαύριο', 'Αρτέμιδα', 'Αττική', 'Δάφνη', 'Βύρωνας', 'Ηλιούπολη', 'Αργυρούπολη', 'Κυψέλη', 'Πατήσια', 'Αμπελόκηποι', 'Κολωνός', 'Μενίδι', 'Νέα Μάκρη', 'Μαραθώνας', 'Γέρακας', 'Σπάτα']);
  addPlaces('Θεσσαλονίκη', ['Θεσσαλονίκη', 'Θεσ/νίκη', 'Καλαμαριά', 'Εύοσμος', 'Σταυρούπολη', 'Πυλαία', 'Θέρμη', 'Νεάπολη', 'Συκιές', 'Πολίχνη', 'Περαία', 'Ωραιόκαστρο', 'Σίνδος', 'Χαλκηδόνα', 'Λαγκαδάς', 'Επανομή']);
  addPlaces('Αχαΐα', ['Πάτρα', 'Αίγιο']);
  addPlaces('Κρήτη', ['Ηράκλειο', 'Χανιά', 'Ρέθυμνο', 'Άγιος Νικόλαος', 'Ιεράπετρα', 'Σητεία', 'Κρήτη']);
  addPlaces('Θεσσαλία', ['Λάρισα', 'Βόλος', 'Τρίκαλα', 'Καρδίτσα']);
  addPlaces('Ήπειρος', ['Ιωάννινα', 'Γιάννενα', 'Πρέβεζα', 'Άρτα', 'Ηγουμενίτσα']);
  addPlaces('Πελοπόννησος', ['Καλαμάτα', 'Κόρινθος', 'Τρίπολη', 'Ναύπλιο', 'Άργος', 'Σπάρτη', 'Πύργος', 'Λουτράκι']);
  addPlaces('Μακεδονία', ['Σέρρες', 'Κοζάνη', 'Καβάλα', 'Δράμα', 'Κατερίνη', 'Βέροια', 'Έδεσσα', 'Γιαννιτσά', 'Κιλκίς', 'Πτολεμαΐδα', 'Φλώρινα', 'Καστοριά', 'Γρεβενά', 'Χαλκιδική', 'Πολύγυρος', 'Νάουσα']);
  addPlaces('Θράκη', ['Ξάνθη', 'Κομοτηνή', 'Αλεξανδρούπολη', 'Ορεστιάδα']);
  addPlaces('Στερεά Ελλάδα', ['Λαμία', 'Χαλκίδα', 'Λιβαδειά', 'Θήβα', 'Άμφισσα', 'Καρπενήσι']);
  addPlaces('Δυτική Ελλάδα', ['Αγρίνιο', 'Μεσολόγγι', 'Ναύπακτος']);
  addPlaces('Νησιά', ['Ρόδος', 'Κέρκυρα', 'Λευκάδα', 'Ζάκυνθος', 'Κεφαλονιά', 'Αργοστόλι', 'Μυτιλήνη', 'Χίος', 'Σάμος', 'Σύρος', 'Νάξος', 'Κως', 'Πάρος', 'Σαντορίνη']);
  const PLACE_RES = Object.keys(PLACES)
    .sort((a, b) => b.length - a.length)
    .map((k) => ({ k, re: wordRe(k) }));

  // ---------- field extractors ----------

  const NUM = '(?<![\\d.,])(\\d{1,3}(?:[., ]\\d{3})+|\\d+(?:[.,]\\d+)?)';
  const EURO = '(?:€|ευρω|ευρο|eur\\b|euro|e\\b)';
  // km written every way people do: km, kms, klm, χλμ, χλμ., χιλιόμετρα,
  // Greek-kappa "κm"/"κμ", Greeklish "xlm"/"xiliometra", "χιλ." on its own.
  const KM_UNIT = '(?:kms?\\b|klm|κm|κμ(?![α-ωa-z])|χλμ|χ\\.?λ\\.?μ\\.?|χιλιομετρ[α-ω]*|χιλμ|xlm|xiliometr[a-z]*|kilometr[a-z]*|χμ(?![α-ωa-z]))';
  const KM_KEY = '(?:χιλιομετρ[α-ω]*|διανυθεντ[α-ω]*|οδομετρ[α-ω]*|κοντερ[α-ω]*|οδηγημεν[α-ω]*|οδηγηθηκε|χλμ|κm|κμ|kms?|klm|xlm|mileage|kilometers|driven)';

  function kmValue(raw, mult) {
    let v = /^\d+[.,]\d{1,2}$/.test(raw) ? toFloat(raw) : toInt(raw);
    if (mult || v < 1000) v = Math.round(v * 1000);
    return v >= 1000 && v <= 900000 ? v : null;
  }

  function findKm(t) {
    const out = [];
    let m;
    // "120.000 km", "120k km", "120 χιλ. χλμ", "120 χιλιάδες χλμ", "120.000 χιλιόμετρα"
    const re = new RegExp(NUM + '[ \\t]*\\+?[ \\t]*(k|χιλ\\.?|χιλιαδεσ|χιλιαδων|t)?[ \\t]*' + KM_UNIT, 'g');
    while ((m = re.exec(t))) {
      // "2012 Km 145000": the year sits right before the unit, not the km.
      if (!m[2] && /^(19[89]\d|20[0-3]\d)$/.test(m[1])) continue;
      const v = kmValue(m[1], m[2]);
      if (v) out.push({ v, i: m.index, w: 3 });
    }
    // "χιλιόμετρα: 120.000", "Km 120000", "οδόμετρο 🛣️ 120 χιλ", "διανυθέντα - 98.000"
    const re2 = new RegExp(KM_KEY + '[^\\d]{0,14}?' + NUM + '\\s*(k|χιλ\\.?|χιλιαδεσ)?', 'g');
    while ((m = re2.exec(t))) {
      const after = t.slice(m.index + m[0].length, m.index + m[0].length + 8);
      if (/^\s*(€|ευρ|eur)/.test(after)) continue;
      const v = kmValue(m[1], m[2]);
      if (v) out.push({ v, i: m.index, w: 2 });
    }
    // "120.000 χιλ." / "120χιλ" with no unit (not money): thousands of km
    const re3 = new RegExp(NUM + '[ \\t]*(χιλ\\.?|χιλιαδεσ)(?![α-ω])(?!\\s*(?:€|ευρ|eur|\\.?\\s*ευρ))', 'g');
    while ((m = re3.exec(t))) {
      const n = /^\d+[.,]\d{1,2}$/.test(m[1]) ? toFloat(m[1]) : toInt(m[1]);
      if (n < 1000 && n <= 60) continue; // "8 χιλ." is more likely a price
      const v = kmValue(m[1], n < 1000);
      if (v) out.push({ v, i: m.index, w: 1 });
    }
    // "150k" alone (not money): km
    const re4 = /(?:^|[^\d.,])(\d{2,3})\s*k(?![a-zα-ω])(?!\s*(?:€|ευρ|eur))/g;
    while ((m = re4.exec(t))) {
      const n = parseInt(m[1], 10);
      if (n >= 60 && n <= 600) out.push({ v: n * 1000, i: m.index, w: 0 });
    }
    if (!out.length) return null;
    out.sort((x, y) => y.w - x.w || x.i - y.i);
    return out[0].v;
  }

  function priceCandidates(t) {
    const out = [];
    let m;
    // "8.500€", "8500 ευρώ", "8,5 χιλιάρικα", "8.5k€"
    const a = new RegExp(NUM + '\\s*(k|χιλ\\.?|χιλιαρικα|χιλιαδεσ)?\\s*' + EURO, 'g');
    while ((m = a.exec(t))) {
      let v = /^\d+[.,]\d{1,2}$/.test(m[1]) ? toFloat(m[1]) : toInt(m[1]);
      if (m[2] && v < 1000) v = Math.round(v * 1000);
      out.push({ v, i: m.index, strong: true });
    }
    // "€8.500", "eur 8500"
    const b = new RegExp('(?:€|eur)\\s*' + NUM, 'g');
    while ((m = b.exec(t))) out.push({ v: toInt(m[1]), i: m.index, strong: true });
    // "τιμή: 8500", "τιμη 8.500", "ζητούμενη 8500"
    const c = new RegExp('(?:τιμη|ζητουμενη|πωλειται\\s+(?:προσ|στα|μονο)|τελικη|δινεται\\s+(?:στα|προσ))\\s*[:\\-]?\\s*' + NUM + '\\s*(k|χιλ\\.?|χιλιαρικα)?', 'g');
    while ((m = c.exec(t))) {
      let v = /^\d+[.,]\d{1,2}$/.test(m[1]) ? toFloat(m[1]) : toInt(m[1]);
      if ((m[2] || v < 100) && v < 1000) v = Math.round(v * 1000);
      out.push({ v, i: m.index, strong: true });
    }
    // "8 χιλιάρικα" without euro sign
    const d = /(\d+(?:[.,]\d)?)\s*χιλιαρικα/g;
    while ((m = d.exec(t))) out.push({ v: Math.round(toFloat(m[1]) * 1000), i: m.index, strong: true });
    return out.filter((p) => p.v >= 300 && p.v <= 400000);
  }

  function findPrice(t) {
    const c = priceCandidates(t);
    return c.length ? c[0].v : null;
  }

  function findYear(t) {
    // Keyword-anchored first: "μοντέλο 2016", "έτος: 2016", "1η άδεια 2016", "μοντέλο '16"
    const kw = /(?:μοντελο|ετοσ|ετουσ|χρονολογια|ταξινομηση[α-ω]*|κυκλοφορια[α-ω]*|1η\s*αδεια|πρωτη\s*αδεια|αδεια|model|year|mod\.?)\s*[:\-]?\s*(?:του\s*)?('?\d{2}\b|\d{4})/g;
    let m;
    while ((m = kw.exec(t))) {
      let y = m[1].replace("'", '');
      y = y.length === 2 ? (parseInt(y, 10) > (THIS_YEAR % 100) + 1 ? 1900 : 2000) + parseInt(y, 10) : parseInt(y, 10);
      if (y >= 1980 && y <= THIS_YEAR + 1) return y;
    }
    // Month/year like "10 / 2020" or "03/2016" (first registration).
    m = /(?:^|[^\d])(?:0?[1-9]|1[0-2])\s*\/\s*((?:19[89]|20[0-3])\d)(?!\d)/.exec(t);
    if (m) {
      const y = parseInt(m[1], 10);
      if (y <= THIS_YEAR + 1) return y;
    }
    // Bare 4-digit year not used as money, km or cc.
    const bare = /(^|[^\d.,])((?:19[89]\d|20[0-3]\d))(?![\d.,]*[ \t]*(?:€|ευρω|ευρο|eur|km|χλμ|cc|κ\.?εκ|κυβικ|χιλ))(?!\d)/g;
    while ((m = bare.exec(t))) {
      const y = parseInt(m[2], 10);
      if (y >= 1980 && y <= THIS_YEAR + 1) return y;
    }
    // "'16" or "16'" right after a model name is too ambiguous without a keyword: skip.
    return null;
  }

  function findCc(t) {
    let m = /(?:^|[^\d.,])(\d[.,]?\d{3}|\d{3})\s*(?:cc|κ\.?εκ\.?|κυβικ[α-ω]*)/.exec(t) || /κυβικ[α-ω]*[^\d]{0,6}(\d[.,]?\d{3})/.exec(t);
    if (m) {
      const v = toInt(m[1]);
      if (v >= 600 && v <= 6500) return v;
    }
    m = /(?:^|[^\d.,])([0-6][.,]\d)\s*(?:l\b|lt\b|λιτρ[α-ω]*|tsi|tdi|tfsi|vvt-?i|vti|hdi|dci|crdi|cdti|cdi|ecoboost|mpi|gdi|jtd|multijet|t?jet|tce|puretech|thp|d-?4d|vtec|i-?dtec|bluehdi|skyactiv|hybrid|turbo|16v|8v|benzin|diesel|tdci|βενζιν|πετρελ|υβριδ)/.exec(t);
    if (m) return Math.round(toFloat(m[1]) * 1000);
    // Bare "1.0" / "1.4" next to the model name, when it is not money or km.
    m = /(?:^|[\s(])([0-5][.,]\d)(?=[\s,)]|$)(?!\s*(?:k\b|χιλ|€|ευρω|ευρο|km|χλμ|εκατ))/.exec(t);
    if (m) {
      const v = Math.round(toFloat(m[1]) * 1000);
      if (v >= 600) return v;
    }
    return null;
  }

  function findHp(t) {
    const m = /(?:^|[^\d])(\d{2,3})\s*(?:hp|ps|bhp|cv|ιππ[α-ω]*|αλογα)(?![a-zα-ω])/.exec(t);
    if (m) {
      const v = parseInt(m[1], 10);
      if (v >= 40 && v <= 800) return v;
    }
    return null;
  }

  function findOne(t, table) {
    for (const [label, re] of table) if (re.test(t)) return label;
    return null;
  }

  function findOrigin(t) {
    if (/ελληνικ[α-ω]*\s*(?:αντιπροσωπ|αδει|πινακ)|ελληνικο\b|ελληνικησ\s*αντιπροσωπειασ|απο\s*αντιπροσωπεια|πρωτο\s*χερι\s*ελλαδ/.test(t)) return 'Ελληνικό';
    if (/εισαγωγ[α-ω]*|απο\s*(?:γερμανια|ιταλια|ολλανδια|βελγιο|γαλλια|ελβετια|αυστρια|σουηδια)|γερμανικησ\s*προελευσ|χωρισ\s*πινακιδ|ξενεσ\s*πινακιδ/.test(t)) return 'Εισαγωγής';
    return null;
  }

  function findPlace(t) {
    for (const { k, re } of PLACE_RES) {
      if (re.test(t)) {
        const [display, region] = PLACES[k];
        return { place: display, region };
      }
    }
    return null;
  }

  function findMakeModel(t) {
    let best = null;
    for (const m of MAKE_LIST) {
      const nameHit = m.names.find((n) => n.re.test(t));
      if (!nameHit) continue;
      const idx = t.search(nameHit.re);
      let model = null;
      for (const mod of m.models) {
        if (mod.aliases.some((al) => al.re.test(t))) {
          model = mod.display;
          break;
        }
      }
      // BMW codes like 116i, 320d, 520d -> series
      if (!model && m.make === 'BMW') {
        const code = /(?:^|[^\d])([1-7])\d{2}(?:i|d|ci|cd|td|tds|xd|xi|e)?(?=$|[^a-zα-ω0-9])/.exec(t);
        if (code) model = 'Σειρά ' + code[1];
      }
      // Earliest make mention wins (titles come first).
      if (!best || idx < best.idx) best = { make: m.make, model, idx };
    }
    if (best) {
      // "mazda 3" etc: the make alias itself may contain the model; already handled by aliases.
      return { make: best.make, model: best.model };
    }
    for (const [alias, hit] of MODEL_ONLY) {
      if (hit && hit.re.test(t)) return { make: hit.make, model: hit.model };
    }
    return { make: null, model: null };
  }

  function findKind(t) {
    const head = t.slice(0, 120);
    if (/(^|[^a-zα-ω])(ζητειται|ζητειτε|ζητω|ζηταω|ψαχνω|αναζητω|αγοραζω|θελω να αγορασω)/.test(head)) return 'wanted';
    if (/ανταλλακτικ|ζαντεσ|ζαντα\b|ελαστικ|λαστιχα|σασμαν|καθισματα|φαναρια|προφυλακτηρ|ηχοσυστημ|ραδιοcd|οθονη android|για ανταλλακτικα/.test(t) && !/\d\s*(?:km|χλμ)/.test(t)) return 'parts';
    if (/ενοικιαση|ενοικιαζεται|rent a car|leasing/.test(head)) return 'rental';
    return 'sale';
  }

  function isSold(t) {
    if (/δεν\s+(?:εχει\s+)?(?:πουληθηκε|πωληθηκε)/.test(t)) return false;
    return /πουληθηκε|πωληθηκε|(^|[^a-z])sold([^a-z]|$)|δοθηκε|εφυγε\b|κλεισαμε|κλεισε\b|ποθηκε/.test(t);
  }

  // ---------- main entry ----------

  /**
   * Parse a car ad. Returns the fields we could find (null when unknown).
   * `text` is the raw post / listing text.
   */
  function parseAd(text) {
    const t = norm(text);
    const { make, model } = findMakeModel(t);
    const place = findPlace(t);
    const fields = {
      make,
      model,
      year: findYear(t),
      km: findKm(t),
      price: findPrice(t),
      fuel: findOne(t, FUEL),
      gearbox: findOne(t, GEARBOX),
      cc: findCc(t),
      hp: findHp(t),
      place: place ? place.place : null,
      region: place ? place.region : null,
      origin: findOrigin(t),
    };
    const kind = findKind(t);
    const sold = isSold(t);
    const missing = ['make', 'year', 'km', 'price'].filter((k) => fields[k] == null);
    const isCarAd = kind === 'sale' && fields.price != null && (fields.make != null || fields.km != null || fields.year != null);
    return { fields, kind, sold, isCarAd, needsReview: isCarAd && missing.length > 0, missing };
  }

  /**
   * Read a comment for useful signals. `bySeller` = written by the post author.
   * Returns { sold, newPrice, offer } with nulls when nothing found.
   */
  function parseComment(text, bySeller) {
    const t = norm(text);
    const prices = priceCandidates(t).map((p) => p.v);
    // Bare numbers like "7500" or "7.500" in short comments ("δίνω 7500", "7.500 τελική;")
    if (!prices.length) {
      const m = /(?:^|[^\d])(\d{1,3}[.,]\d{3}|\d{4,6})(?![\d.,]*\s*(?:km|χλμ|cc))/.exec(t);
      if (m && t.length < 80) {
        const v = toInt(m[1]);
        if (v >= 300 && v <= 400000) prices.push(v);
      }
    }
    if (bySeller) {
      return {
        sold: isSold(t),
        newPrice: prices.length ? prices[prices.length - 1] : null,
        offer: null,
      };
    }
    const offerish = /δινω|δινουμε|προσφερω|προσφορα|τελικη|τελικα|τελευταια|κατω απο|πεφτει|πεφτει|αφηνεισ|συζητησιμη|για\s+\d/.test(t) || t.length < 40;
    return { sold: false, newPrice: null, offer: offerish && prices.length ? prices[0] : null };
  }

  const api = { parseAd, parseComment, scrub, norm, MAKES };
  root.CCParser = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
