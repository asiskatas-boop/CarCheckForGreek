// Run: node --test collector/test
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseAd, parseComment, scrub } = require('../src/parser.js');

const cases = [
  {
    text: 'Πωλείται Toyota Yaris 1.0 μοντέλο 2008, 149.000 χλμ, βενζίνη, χειροκίνητο. Τιμή 4.200€ Περιστέρι. Τηλ 6912345678',
    want: { make: 'Toyota', model: 'Yaris', year: 2008, km: 149000, price: 4200, fuel: 'Βενζίνη', gearbox: 'Χειροκίνητο', cc: 1000, region: 'Αττική' },
  },
  {
    text: 'VW GOLF 1.6 TDI 2014\n8.900 €\n180k km\nΘεσσαλονίκη\nΕλληνικής αντιπροσωπείας, βιβλίο σέρβις',
    want: { make: 'Volkswagen', model: 'Golf', year: 2014, km: 180000, price: 8900, fuel: 'Πετρέλαιο', cc: 1600, region: 'Θεσσαλονίκη', origin: 'Ελληνικό' },
  },
  {
    text: '€12,500\n2019 Hyundai i20\nΚαλαμάτα\n45 χιλ. χλμ',
    want: { make: 'Hyundai', model: 'i20', year: 2019, km: 45000, price: 12500, region: 'Πελοπόννησος' },
  },
  {
    text: 'Πουλάω το Yaris μου hybrid αυτόματο, έτος 2016, 98000χλμ, 11 χιλιάρικα συζητήσιμη',
    want: { make: 'Toyota', model: 'Yaris', year: 2016, km: 98000, price: 11000, fuel: 'Υβριδικό', gearbox: 'Αυτόματο' },
  },
  {
    text: 'Opel Corsa D 1200cc 80 ίππους 1η άδεια 2010 εισαγωγής από Γερμανία. 115.000 km. 5500 ευρώ',
    want: { make: 'Opel', model: 'Corsa', year: 2010, km: 115000, price: 5500, cc: 1200, hp: 80, origin: 'Εισαγωγής' },
  },
  {
    text: 'Mercedes A 180 CDI αυτόματο 2013 , 160.000 χλμ τελική τιμή 9.300 Ηράκλειο',
    want: { make: 'Mercedes-Benz', model: 'A-Class', year: 2013, km: 160000, price: 9300, fuel: 'Πετρέλαιο', gearbox: 'Αυτόματο', region: 'Κρήτη' },
  },
  {
    text: 'BMW 116i 2012 136.000χλμ βενζίνη 8.700€',
    want: { make: 'BMW', model: 'Σειρά 1', year: 2012, km: 136000, price: 8700, fuel: 'Βενζίνη' },
  },
  {
    text: 'Fiat Panda 1.2 lpg εργοστασιακό, μοντέλο \'12, 120.000 χιλιόμετρα, 4.000 €',
    want: { make: 'Fiat', model: 'Panda', year: 2012, km: 120000, price: 4000, fuel: 'Υγραέριο', cc: 1200 },
  },
];

for (const c of cases) {
  test(c.text.slice(0, 40), () => {
    const r = parseAd(c.text);
    assert.equal(r.isCarAd, true, 'isCarAd');
    for (const [k, v] of Object.entries(c.want)) assert.equal(r.fields[k], v, k);
  });
}

test('wanted post is not a sale', () => {
  assert.equal(parseAd('Ζητείται Toyota Yaris έως 5000€ με λίγα χιλιόμετρα').kind, 'wanted');
});

test('parts post is not a sale', () => {
  const r = parseAd('Πωλούνται ζάντες 15άρες για Golf 200€');
  assert.equal(r.kind, 'parts');
  assert.equal(r.isCarAd, false);
});

test('missing year flags review', () => {
  const r = parseAd('Ford Fiesta 1.25 5.500€ 140.000 km');
  assert.equal(r.isCarAd, true);
  assert.equal(r.needsReview, true);
  assert.deepEqual(r.missing, ['year']);
});

test('price is not read as year, year not as price', () => {
  const r = parseAd('Seat Ibiza 2009 2.000 € 210.000 km');
  assert.equal(r.fields.year, 2009);
  assert.equal(r.fields.price, 2000);
});

test('sold detection', () => {
  assert.equal(parseAd('ΠΟΥΛΗΘΗΚΕ Toyota Aygo 2010 4500€').sold, true);
  assert.equal(parseAd('Δεν πουλήθηκε ακόμα, Aygo 2010 4500€').sold, false);
});

test('seller comment: price drop and sold', () => {
  assert.equal(parseComment('Έπεσε στα 7.500€', true).newPrice, 7500);
  assert.equal(parseComment('Πουλήθηκε, ευχαριστώ όλους', true).sold, true);
});

test('buyer comment: offer', () => {
  assert.equal(parseComment('Δίνω 7000', false).offer, 7000);
  assert.equal(parseComment('πμ', false).offer, null);
});

test('scrub removes phones and emails', () => {
  const s = scrub('Τηλ 691 234 5678 ή 210-1234567 ή +30 6987654321, mail a.b@gmail.com');
  assert.ok(!/\d{6,}/.test(s.replace(/\s|-/g, '')), s);
  assert.ok(!s.includes('@'));
});

const kmCases = [
  ['Toyota Yaris 2010 5.000€ χιλιόμετρα: 120.000', 120000],
  ['Golf 2012 Km 145000 τιμή 7000', 145000],
  ['Corsa 2011 120.000 χιλ. 4.500€', 120000],
  ['Clio 2014 98χιλ 6.200 ευρώ', 98000],
  ['Polo 2013 οδόμετρο 🛣️ 110 χιλ, 6500€', 110000],
  ['Fiesta 2009 150k, 3.900€', 150000],
  ['i10 2015 Κm 80.000 τιμη 5.800', 80000],
  ['Micra 2008 125.000 κμ 2.900€', 125000],
  ['Aygo 2012 xlm 90000 4000e', 90000],
  ['Swift 2010, διανυθέντα - 132.000, 4.300€', 132000],
  ['Punto 2007 175.000 χλμ. 2.500€', 175000],
  ['Astra 2015 1.6 diesel 180.000+ km 7.900€', 180000],
  ['Πωλείται Yaris 2016, 8 χιλ. ευρώ, 99.000 χλμ', 99000],
];
for (const [text, km] of kmCases) {
  test('km: ' + text.slice(0, 30), () => assert.equal(parseAd(text).fields.km, km));
}

test('price is still found when km uses χιλ.', () => {
  const r = parseAd('Corsa 2011 120.000 χιλ. 4.500€');
  assert.equal(r.fields.price, 4500);
});

test('label/value layout (Facebook vehicle post)', () => {
  const text = 'Citroen C3\n9.500 €\n10 / 2020\nΧιλιόμετρα\n111.000 χλμ\nΚαύσιμο\nΠετρέλαιο\nΚυβικά\n1.499 cc\nΙπποδύναμη\n102 hp\nΠόρτες\n5\nΣασμάν\nΧειροκίνητη\nΔυνατότητα ανταλλαγής';
  const f = parseAd(text).fields;
  assert.equal(f.km, 111000);
  assert.equal(f.year, 2020);
  assert.equal(f.cc, 1499);
  assert.equal(f.hp, 102);
  assert.equal(f.fuel, 'Πετρέλαιο');
  assert.equal(f.gearbox, 'Χειροκίνητο');
  assert.equal(f.price, 9500);
});

test('label then value on next line, no unit', () => {
  assert.equal(parseAd('Clio 2015 6.000€\nΧιλιόμετρα\n135000').fields.km, 135000);
});
